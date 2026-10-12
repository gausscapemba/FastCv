import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { Unzip, UnzipInflate, UnzipPassThrough } from 'fflate';
import type { ResumeData } from '@/app/types/resume';
import { loadStoredResume } from '@/app/utils/resumeStorage';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_PDF_PAGES = 10;

export type DocumentReadProgress = {
  message: string;
  progress: number | null;
};

export function resumeDataToText(data: ResumeData) {
  return [
    data.personalData.fullName,
    data.personalData.profession,
    data.personalData.email,
    data.personalData.phone,
    data.personalData.address,
    data.personalData.linkedin,
    data.personalData.website,
    data.summary,
    ...data.experiences.flatMap((item) => [item.title, item.company, item.location, item.description]),
    ...data.education.flatMap((item) => [item.degree, item.institution, item.location, item.description]),
    ...data.skills,
    ...data.languages.flatMap((item) => [item.language, item.level]),
    ...data.certifications,
    ...data.projects,
    ...data.courses,
  ].filter(Boolean).join('\n');
}

export function getStoredResumeText() {
  const stored = loadStoredResume();
  return stored ? resumeDataToText(stored.data) : '';
}

export async function readResumeDocument(
  file: File,
  onProgress: (progress: DocumentReadProgress) => void,
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('O ficheiro excede o limite de 15 MB. Reduza o tamanho e tente novamente.');
  }

  const extension = file.name.split('.').pop()?.toLocaleLowerCase();
  if (extension === 'pdf') return readPdf(file, onProgress);
  if (extension === 'docx') {
    onProgress({ message: 'A ler o documento Word…', progress: null });
    const xml = await extractDocxDocumentXml(new Uint8Array(await file.arrayBuffer()));
    const parsed = new DOMParser().parseFromString(xml, 'application/xml');
    if (parsed.querySelector('parsererror')) throw new Error('Não foi possível interpretar o documento Word.');
    const text = Array.from(parsed.getElementsByTagNameNS('*', 'p'))
      .map((paragraph) => Array.from(paragraph.getElementsByTagNameNS('*', 't')).map((item) => item.textContent ?? '').join(''))
      .filter(Boolean)
      .join('\n');
    return requireExtractedText(text);
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tif', 'tiff'].includes(extension ?? '')) {
    onProgress({ message: 'A preparar o reconhecimento do texto…', progress: null });
    const worker = await createOcrWorker(onProgress);
    try {
      const result = await worker.recognize(file);
      return requireExtractedText(result.data.text);
    } finally {
      await worker.terminate();
    }
  }

  throw new Error('Formato não suportado. Escolha um PDF, DOCX ou uma imagem (JPG, PNG, WEBP ou TIFF).');
}

function extractDocxDocumentXml(data: Uint8Array) {
  const maxDocumentXmlSize = 20 * 1024 * 1024;
  return new Promise<string>((resolve, reject) => {
    let foundDocumentXml = false;
    const unzip = new Unzip((file) => {
      if (file.name !== 'word/document.xml') return;
      foundDocumentXml = true;
      if (file.originalSize !== undefined && file.originalSize > maxDocumentXmlSize) {
        reject(new Error('O conteúdo expandido do documento Word excede o limite permitido.'));
        return;
      }
      const chunks: Uint8Array[] = [];
      let totalSize = 0;
      file.ondata = (error, chunk, final) => {
        if (error) {
          reject(new Error('Não foi possível descomprimir o documento Word.'));
          return;
        }
        totalSize += chunk.length;
        if (totalSize > maxDocumentXmlSize) {
          void file.terminate();
          reject(new Error('O conteúdo expandido do documento Word excede o limite permitido.'));
          return;
        }
        chunks.push(chunk);
        if (final) {
          const contents = new Uint8Array(totalSize);
          let offset = 0;
          for (const part of chunks) {
            contents.set(part, offset);
            offset += part.length;
          }
          resolve(new TextDecoder().decode(contents));
        }
      };
      file.start();
    });
    unzip.register(UnzipInflate);
    unzip.register(UnzipPassThrough);
    try {
      unzip.push(data, true);
      if (!foundDocumentXml) reject(new Error('O documento Word não contém texto reconhecível.'));
    } catch {
      reject(new Error('O ficheiro não parece ser um documento Word DOCX válido.'));
    }
  });
}

async function readPdf(file: File, onProgress: (progress: DocumentReadProgress) => void) {
  onProgress({ message: 'A ler o PDF…', progress: null });
  const loadingTask = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdfDocument = await loadingTask.promise;
  if (pdfDocument.numPages > MAX_PDF_PAGES) {
    await loadingTask.destroy();
    throw new Error(`Este PDF tem ${pdfDocument.numPages} páginas. Por agora, o limite é ${MAX_PDF_PAGES} páginas por currículo.`);
  }

  const pageTexts: string[] = [];
  const pagesNeedingOcr: number[] = [];
  try {
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      const page = await pdfDocument.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ('str' in item && typeof item.str === 'string' ? item.str : ''))
        .filter(Boolean)
        .join(' ');
      pageTexts.push(text);
      if (text.trim().length < 40) pagesNeedingOcr.push(pageNumber);
      page.cleanup();
      onProgress({
        message: pagesNeedingOcr.includes(pageNumber) ? 'A verificar páginas digitalizadas…' : `A ler página ${pageNumber} de ${pdfDocument.numPages}…`,
        progress: pageNumber / pdfDocument.numPages,
      });
    }

    if (!pagesNeedingOcr.length) return requireExtractedText(pageTexts.join('\n\n'));

    const worker = await createOcrWorker(onProgress);
    try {
      for (const pageNumber of pagesNeedingOcr) {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.6 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Não foi possível preparar uma página do PDF para OCR.');
        await page.render({ canvasContext: context, viewport }).promise;
        const result = await worker.recognize(canvas);
        pageTexts[pageNumber - 1] = [pageTexts[pageNumber - 1], result.data.text].filter(Boolean).join('\n');
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
        onProgress({
          message: `A reconhecer texto na página ${pageNumber} de ${pdfDocument.numPages}…`,
          progress: (pageNumber - 1 + 0.9) / pdfDocument.numPages,
        });
      }
    } finally {
      await worker.terminate();
    }
    return requireExtractedText(pageTexts.join('\n\n'));
  } finally {
    await loadingTask.destroy();
  }
}

async function createOcrWorker(onProgress: (progress: DocumentReadProgress) => void) {
  const { createWorker } = await import('tesseract.js');
  return createWorker('por+eng', undefined, {
    logger: ({ status, progress }) => {
      onProgress({
        message: status === 'recognizing text' ? 'A reconhecer texto…' : 'A preparar o OCR em português e inglês…',
        progress: status === 'recognizing text' ? progress : null,
      });
    },
  });
}

function requireExtractedText(text: string) {
  const cleaned = text.replace(/\u0000/g, '').trim();
  if (cleaned.length < 30) {
    throw new Error('Não foi possível reconhecer texto suficiente neste ficheiro. Experimente um PDF pesquisável ou uma imagem mais nítida.');
  }
  return cleaned;
}
