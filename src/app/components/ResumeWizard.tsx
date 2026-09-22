// ResumeWizard.tsx
import React, { useState } from 'react';
import { useResume } from '@/app/context/ResumeContext';
import { generatePdfBlob } from '@/app/utils/resumePdf';

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
  const { resumeData, settings, loadDemoData, resetResumeData } = useResume();

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

  /** ---------------- EXPORTAR PDF ---------------- */
  const handleExportPDF = async () => {
    const blob = await generatePdfBlob(resumeData, settings);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalData.fullName || 'Meu_CV'}_cv.pdf`;
    link.click();
    URL.revokeObjectURL(url);
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
        <ResumePreview data={resumeData} settings={settings} />
      </div>
    </div>
  );
}
