// ResumeWizard.tsx
import React, { useState, useRef } from 'react';
import { useResume } from '@/app/context/ResumeContext';

import { Stepper, Step } from '@/app/components/Stepper';
import { ResumePreview } from '@/app/components/ResumePreview';

import { PersonalDataForm } from '@/app/components/forms/PersonalDataForm';
import { SummaryForm } from '@/app/components/forms/SummaryForm';
import { ExperienceForm } from '@/app/components/forms/ExperienceForm';
import { EducationForm } from '@/app/components/forms/EducationForm';
import { SkillsForm } from '@/app/components/forms/SkillsForm';
import { LanguagesForm } from '@/app/components/forms/LanguagesForm';
import { CustomizationForm } from '@/app/components/forms/CustomizationForm';

import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';

import { ArrowLeft, ArrowRight, Download } from 'lucide-react';

// Lazy-load heavy libraries to reduce initial bundle size

const steps: Step[] = [
  { id: 0, title: 'Dados Pessoais', description: 'Informações básicas' },
  { id: 1, title: 'Resumo', description: 'Resumo profissional' },
  { id: 2, title: 'Experiência', description: 'Histórico profissional' },
  { id: 3, title: 'Formação', description: 'Educação e certificados' },
  { id: 4, title: 'Competências', description: 'Habilidades' },
  { id: 5, title: 'Idiomas', description: 'Idiomas que domina' },
];

interface ResumeWizardProps {
  onBack: () => void;
  initialMode?: 'empty' | 'demo';
}

export function ResumeWizard({ onBack, initialMode = 'empty' }: ResumeWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCustomization, setShowCustomization] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // imagem gerada

  const { resumeData, settings, loadDemoData, resetResumeData } = useResume();
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialMode === 'demo') {
      loadDemoData();
    } else {
      resetResumeData();
    }
  }, [initialMode]);

  /** ---------------- VALIDAÇÃO ---------------- */
  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];
    if (currentStep === 0) {
      if (!resumeData.personalData.fullName.trim()) errors.push('Nome completo é obrigatório');
      if (!resumeData.personalData.email.trim()) errors.push('Email é obrigatório');
    }
    if (currentStep === 1 && !resumeData.summary.trim()) errors.push('Resumo profissional é obrigatório');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  /** ---------------- NAVEGAÇÃO ---------------- */
  const handleNext = async () => {
    if (!validateCurrentStep()) return;
    setValidationErrors([]);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCustomization(true);
      await handleConcluir(); // gera a imagem de forma invisível
    }
  };

  const handleBack = () => {
    if (showCustomization) {
      setShowCustomization(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  /** ---------------- GERAR IMAGEM ---------------- */
  const handleConcluir = async () => {
    if (!pdfPreviewRef.current) return;

    try {
      // load html2canvas on demand
      const html2canvasModule = await import('html2canvas');
      // The module shape can vary (default export or the function itself). Cast via unknown
      // to the expected function signature to satisfy TypeScript safely.
      const html2canvas = (html2canvasModule && (html2canvasModule.default ?? html2canvasModule)) as unknown as (
        el: HTMLElement,
        options?: any
      ) => Promise<HTMLCanvasElement>;

      const element = pdfPreviewRef.current;

      // Clonar elemento para html2canvas
      const clone = element.cloneNode(true) as HTMLElement;
      // Render off-screen so user doesn't see the snapshot being created
      clone.style.position = 'fixed';
      clone.style.top = '-10000px';
      clone.style.left = '-10000px';
      clone.style.opacity = '1';
      clone.style.pointerEvents = 'none';
      clone.style.width = element.offsetWidth + 'px';
      clone.style.minHeight = element.offsetHeight + 'px';
      document.body.appendChild(clone);

      // Corrige cores não suportadas
      const fixColors = (el: HTMLElement) => {
        const style = getComputedStyle(el);
        ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
          const value = style.getPropertyValue(prop);
          if (value.includes('oklch') || value.includes('lab')) {
            el.style.setProperty(prop, '#000000'); // cor visível e segura
          }
        });
        el.childNodes.forEach(child => {
          if (child instanceof HTMLElement) fixColors(child);
        });
      };
      fixColors(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#fff',
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      setGeneratedImage(imgData); // salva a imagem em memória
      // **Sem alert** - usuário não percebe
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    }
  };

  /** ---------------- EXPORTAR PDF ---------------- */
  const handleExportPDF = async () => {
    if (!generatedImage) return;

    // load jspdf on demand
    const jsPDFModule = await import('jspdf');
    const JsPDFRaw = jsPDFModule?.default ?? jsPDFModule?.jsPDF ?? jsPDFModule;
    // Cast via unknown to a constructor signature to satisfy TypeScript safely
    type JsPDFConstructor = new (orientation?: string, unit?: string, format?: string) => any;
    const JsPDF = JsPDFRaw as unknown as JsPDFConstructor;
    const pdf = new JsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const img = new Image();
    img.src = generatedImage;
    img.onload = () => {
      const pdfHeight = (img.height * pdfWidth) / img.width;

      if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        let heightLeft = pdfHeight;
        let position = 0;

        while (heightLeft > 0) {
          pdf.addImage(img, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
          position -= pdf.internal.pageSize.getHeight();
          if (heightLeft > 0) pdf.addPage();
        }
      }

      pdf.save(`${resumeData.personalData.fullName || 'Meu_CV'}_cv.pdf`);
    };
  };

  /** ---------------- RENDER FORM ---------------- */
  const renderForm = () => {
    if (showCustomization) return <CustomizationForm />;
    switch (currentStep) {
      case 0: return <PersonalDataForm />;
      case 1: return <SummaryForm />;
      case 2: return <ExperienceForm />;
      case 3: return <EducationForm />;
      case 4: return <SkillsForm />;
      case 5: return <LanguagesForm />;
      default: return null;
    }
  };

  /** ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
          <button
            type="button"
            aria-label="Ir para o início"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onBack();
            }}
            className="font-bold text-lg sm:text-xl text-green-600 ml-2 sm:ml-4 md:ml-8"
          >
            CVRápido
          </button>
          {showCustomization && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => resetResumeData()} className="hidden sm:inline-flex">
                Limpar
              </Button>
              <Button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
                <Download className="h-4 w-4 mr-1 sm:mr-2" /> Exportar PDF
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-6 sm:py-8">
        {!showCustomization && <Stepper steps={steps} currentStep={currentStep} />}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <ul className="list-disc list-inside text-sm text-red-700">
              {validationErrors.map((err, i) => (<li key={i}>{err}</li>))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,680px)] gap-5 xl:gap-6">
          <div className="min-w-0">
            <ScrollArea className="h-auto max-h-none xl:h-[calc(100vh-250px)] pr-0 xl:pr-3">{renderForm()}</ScrollArea>
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 min-h-8 rounded-md border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 px-2 py-1.5 sm:min-h-9"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:mr-1" />
                <span className="text-[11px] sm:text-xs">Voltar</span>
              </Button>

              <Button
                onClick={handleNext}
                className="flex-1 min-h-8 rounded-md bg-green-600 hover:bg-green-700 shadow-sm px-2 py-1.5 sm:min-h-9"
              >
                <span className="text-[11px] sm:text-xs">
                  {showCustomization ? 'Concluído' : currentStep === steps.length - 1 ? 'Personalizar' : 'Próximo'}
                </span>
                {!showCustomization && <ArrowRight className="h-3.5 w-3.5 sm:ml-1" />}
              </Button>
            </div>
          </div>

          {/* PREVIEW VISUAL */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="flex justify-center">
                  <div className="w-full max-w-[680px]">
                    <ResumePreview data={resumeData} settings={settings} />
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW OCULTO PARA GERAR IMAGEM */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '21cm',
          minHeight: '29.7cm',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <ResumePreview ref={pdfPreviewRef} data={resumeData} settings={settings} />
      </div>
    </div>
  );
}
