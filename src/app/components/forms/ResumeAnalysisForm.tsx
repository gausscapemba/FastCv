import { useRef, useState } from 'react';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { analyzeJobMatchText, type JobMatchResult } from '@/app/utils/jobMatch';
import { reviewResume } from '@/app/utils/resumeReview';
import { loadResumeVersions, saveResumeVersions } from '@/app/utils/resumeVersions';
import { loadStoredResume, parseResumeBackup } from '@/app/utils/resumeStorage';
import { getStoredResumeText, readResumeDocument, resumeDataToText } from '@/app/utils/resumeDocument';
import type { DocumentReadProgress } from '@/app/utils/resumeDocument';
import { AlertTriangle, Briefcase, FileText, Lightbulb, ShieldCheck } from 'lucide-react';

export function ResumeAnalysisForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedResume, setLoadedResume] = useState<{ data: ResumeData; settings: ResumeSettings } | null>(() => {
    const stored = loadStoredResume();
    return stored && isCompletedResume(stored.data) ? stored : null;
  });
  const [resumeText, setResumeText] = useState(getStoredResumeText);
  const [loadedFileName, setLoadedFileName] = useState('');
  const [importError, setImportError] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [readProgress, setReadProgress] = useState<DocumentReadProgress | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatch, setJobMatch] = useState<JobMatchResult | null>(null);

  const importResumeFile = async (file?: File) => {
    if (!file) return;
    setImportError('');
    setLoadedResume(null);
    setResumeText('');
    setLoadedFileName('');
    setJobMatch(null);

    try {
      if (file.name.toLocaleLowerCase().endsWith('.json')) {
        const imported = parseResumeBackup(await file.text());
        if (!isCompletedResume(imported.data)) {
          throw new Error('Este CV ainda não parece concluído. Verifique os dados pessoais e inclua resumo, experiência, formação ou competências.');
        }
        setLoadedResume(imported);
        setResumeText(resumeDataToText(imported.data));
      } else {
        setIsReading(true);
        const text = await readResumeDocument(file, setReadProgress);
        setResumeText(text);
      }
      setLoadedFileName(file.name);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Não foi possível ler este ficheiro. Experimente um PDF, DOCX ou uma imagem nítida.');
    } finally {
      setIsReading(false);
      setReadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveJobVersion = () => {
    if (!loadedResume || !resumeText) return;
    const versions = loadResumeVersions();
    saveResumeVersions([{
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: 'Versão adaptada à vaga',
      createdAt: new Date().toISOString(),
      data: loadedResume.data,
      settings: loadedResume.settings,
    }, ...versions]);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="mb-2 text-2xl font-semibold">Analisar um CV pronto</h1>
        <p className="text-gray-600">Carregue um CV normal para extrair o texto e compará-lo com uma vaga. O ficheiro é processado no seu dispositivo.</p>
      </header>

      <section className="space-y-4 rounded-lg border bg-white p-4">
        <div>
          <h2 className="font-semibold">1. Carregar CV</h2>
          <p className="mt-1 text-sm text-gray-600">Escolha PDF, Word (DOCX) ou uma imagem do currículo. PDFs digitalizados e imagens são lidos com OCR em português e inglês.</p>
          {resumeText && !loadedFileName && <p className="mt-1 text-sm text-[#174A3B]">O CV guardado neste dispositivo está carregado.</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" disabled={isReading} onClick={() => fileInputRef.current?.click()}>
            {isReading ? 'A ler CV…' : 'Escolher ficheiro'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg,.webp,.bmp,.tif,.tiff,.json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,application/json"
            className="hidden"
            onChange={(event) => void importResumeFile(event.target.files?.[0])}
          />
          {loadedFileName && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#174A3B]"><FileText size={16} />{loadedFileName}</span>}
        </div>
        {readProgress && (
          <div role="status" aria-live="polite" className="space-y-2 text-sm text-[#626A64]">
            <p>{readProgress.message}</p>
            {readProgress.progress !== null && <progress className="h-2 w-full accent-[#174A3B]" max={1} value={readProgress.progress} />}
          </div>
        )}
        {importError && <p role="alert" className="text-sm text-red-700">{importError}</p>}
      </section>

      {resumeText && (
        <section className="space-y-3 rounded-lg border bg-white p-4">
          <div>
            <h2 className="font-semibold">2. Texto extraído do CV</h2>
            <p className="mt-1 text-sm text-gray-600">Confira e corrija o texto reconhecido antes de comparar. A qualidade do OCR pode variar com a imagem.</p>
          </div>
          {loadedResume ? (
            reviewResume(loadedResume.data).length === 0 ? (
              <Alert className="border-[#D8E7C6] bg-[#F0F4E5] text-[#174A3B]"><ShieldCheck /><AlertTitle>Sem alertas encontrados</AlertTitle><AlertDescription>Ainda assim, reveja o conteúdo antes de enviar.</AlertDescription></Alert>
            ) : (
              <div className="space-y-2">{reviewResume(loadedResume.data).map((issue) => {
                const Icon = issue.severity === 'tip' ? Lightbulb : AlertTriangle;
                return <Alert key={issue.id} variant={issue.severity === 'error' ? 'destructive' : 'default'} className="text-gray-800"><Icon /><AlertTitle>{issue.message}</AlertTitle><AlertDescription>{issue.action}</AlertDescription></Alert>;
              })}</div>
            )
          ) : null}
          <Textarea value={resumeText} onChange={(event) => setResumeText(event.target.value)} rows={10} aria-label="Texto extraído do currículo" />
        </section>
      )}

      <section className={`space-y-4 rounded-lg border bg-white p-4 ${!resumeText ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-3">
          <Briefcase className="mt-0.5 h-5 w-5 text-[#174A3B]" />
          <div>
            <h2 className="font-semibold">3. Comparar com uma vaga</h2>
            <p className="mt-1 text-sm text-gray-600">Compare termos da descrição com o texto do CV. A análise é local e não altera o documento.</p>
          </div>
        </div>
        <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Cole aqui a descrição da vaga..." rows={6} disabled={!resumeText} />
        <Button type="button" variant="outline" size="sm" onClick={() => resumeText && setJobMatch(analyzeJobMatchText(resumeText, jobDescription))} disabled={!resumeText || !jobDescription.trim()}>
          Analisar correspondência
        </Button>
        {jobMatch && (
          <div className="space-y-2 text-sm">
            {jobMatch.experienceRequirement && (
              <div className="rounded-md border border-[#D8E7C6] bg-[#F0F4E5] p-3 text-[#26372E]">
                {jobMatch.experienceRequirement.statedYears === null ? (
                  <p>
                    A vaga menciona {formatYears(jobMatch.experienceRequirement.requiredYears)} de experiência.
                    Não encontrámos um total de anos declarado no CV — isso não significa que lhe falte essa experiência.
                    Se já a tem, indique os cargos e períodos trabalhados para ajudar a mostrar o seu percurso.
                  </p>
                ) : jobMatch.experienceRequirement.statedYears < jobMatch.experienceRequirement.requiredYears ? (
                  <p>
                    A vaga menciona {formatYears(jobMatch.experienceRequirement.requiredYears)} e o CV refere
                    {' '}{formatYears(jobMatch.experienceRequirement.statedYears)}. Há uma diferença entre o que a vaga pede
                    e o que está escrito no CV; isto não permite concluir toda a sua experiência. Se trabalhou noutros
                    períodos, inclua-os para dar mais contexto.
                  </p>
                ) : (
                  <p>
                    O CV menciona {formatYears(jobMatch.experienceRequirement.statedYears)} de experiência
                    e a vaga pede {formatYears(jobMatch.experienceRequirement.requiredYears)}. Confirme se os períodos
                    e actividades estão claros no documento.
                  </p>
                )}
              </div>
            )}
            {jobMatch.matched.length > 0 ? (
              <p className="text-[#174A3B]"><strong>Já mencionados no seu CV:</strong> {jobMatch.matched.join(', ')}</p>
            ) : (
              <p><strong>Ainda não encontrámos termos em comum.</strong> Reveja se a descrição da vaga e o texto extraído do CV estão correctos.</p>
            )}
            {jobMatch.missing.length > 0 && (
              <div>
                <p><strong>Palavras da vaga que não encontrámos no texto:</strong> {jobMatch.missing.join(', ')}.</p>
                <p className="mt-1 text-gray-600">
                  Se alguma descreve algo que já fez, acrescente um exemplo concreto ao CV. Se ainda está a desenvolver
                  essa competência, pode ser um próximo passo. Uma palavra ausente não prova que lhe falte experiência.
                </p>
              </div>
            )}
            {loadedResume && <Button type="button" size="sm" variant="outline" onClick={saveJobVersion}>Guardar cópia desta candidatura</Button>}
            <p className="text-xs text-gray-500">Esta comparação simples procura palavras em comum. Não compreende todo o contexto, não é uma pontuação ATS nem prevê decisões de contratação.</p>
            {!loadedResume && <p className="text-xs text-gray-500">Para um CV externo, reveja o texto acima e guarde o documento original com as alterações que decidir fazer.</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function isCompletedResume(data: ResumeData) {
  const hasPersonalData = Boolean(data.personalData.fullName.trim() && data.personalData.email.trim());
  const hasCareerContent = Boolean(data.summary.trim() || data.experiences.length || data.education.length || data.skills.length);
  return hasPersonalData && hasCareerContent;
}

function formatYears(value: number) {
  const formatted = new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 1 }).format(value);
  return `${formatted} ${value === 1 ? 'ano' : 'anos'}`;
}