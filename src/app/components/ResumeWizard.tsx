// ResumeWizard.tsx
import React, { useCallback, useState } from 'react';
import { useResume } from '@/app/context/ResumeContext';
import { generatePdfBlob } from '@/app/utils/resumePdf';

import { Stepper, Step } from '@/app/components/Stepper';
import { ResumePreview } from '@/app/components/ResumePreview';
import { BrandMark } from '@/app/components/BrandMark';

import { PersonalDataForm } from '@/app/components/forms/PersonalDataForm';
import { SummaryForm } from '@/app/components/forms/SummaryForm';
import { ExperienceForm } from '@/app/components/forms/ExperienceForm';
import { EducationForm } from '@/app/components/forms/EducationForm';
import { SkillsForm } from '@/app/components/forms/SkillsForm';
import { LanguagesForm } from '@/app/components/forms/LanguagesForm';
import { AdditionalSectionsForm } from '@/app/components/forms/AdditionalSectionsForm';
import { CustomizationForm } from '@/app/components/forms/CustomizationForm';

import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';

import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import type { ReadyTemplateId, ResumeStartMode } from '@/app/types/resume';

const steps: Step[] = [
  { id: 0, title: 'Dados Pessoais', description: 'Informações básicas' },
  { id: 1, title: 'Resumo', description: 'Resumo profissional' },
  { id: 2, title: 'Experiência', description: 'Histórico profissional' },
  { id: 3, title: 'Formação', description: 'Educação académica' },
  { id: 4, title: 'Competências', description: 'Habilidades' },
  { id: 5, title: 'Idiomas', description: 'Idiomas que domina' },
  { id: 6, title: 'Complementos', description: 'Certificações e projectos' },
];

interface ResumeWizardProps {
  onBack: () => void;
  initialMode?: ResumeStartMode;
}

export function ResumeWizard({ onBack, initialMode = 'empty' }: ResumeWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCustomization, setShowCustomization] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { resumeData, settings, loadDemoData, loadReadyTemplate, resetResumeData } = useResume();
  React.useEffect(() => {
    if (initialMode === 'demo') {
      loadDemoData();
    } else if (initialMode.startsWith('template-')) {
      loadReadyTemplate(initialMode.replace('template-', '') as ReadyTemplateId);
    } else {
      resetResumeData();
    }
  }, [initialMode, loadDemoData, loadReadyTemplate, resetResumeData]);

  /** ---------------- VALIDAÇÃO ---------------- */
  const validateCurrentStep = useCallback((): boolean => {
    const errors: string[] = [];
    if (currentStep === 0) {
      if (!resumeData.personalData.fullName.trim()) errors.push('Nome completo é obrigatório');
      if (!resumeData.personalData.email.trim()) errors.push('Email é obrigatório');
    }
    if (currentStep === 1 && !resumeData.summary.trim()) errors.push('Resumo profissional é obrigatório');
    setValidationErrors(errors);
    return errors.length === 0;
  }, [currentStep, resumeData]);

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
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 1000);
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
      case 6: return <AdditionalSectionsForm />;
      default: return null;
    }
  };

  /** ---------------- JSX ---------------- */
  return (
    <div className="brand-body min-h-screen bg-[#F7F5EF] text-[#17231E]">
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-[#DDDCD3] bg-[#F7F5EF]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
          <button
            type="button"
            aria-label="Ir para o início"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onBack();
            }}
            className="ml-2 flex items-center gap-2 text-lg font-bold text-[#174A3B] sm:ml-4 sm:text-xl md:ml-8"
          >
            <BrandMark className="h-8 w-8" />CVRápido
          </button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-6 sm:py-8">
        {!showCustomization && <Stepper steps={steps} currentStep={currentStep} />}
        {(initialMode === 'demo' || initialMode.startsWith('template-')) && currentStep === 0 && !showCustomization && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Modelo de demonstração:</strong> estes dados são fictícios.
            Edite os campos directamente e substitua-os pelos seus dados antes de exportar.
          </div>
        )}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <ul className="list-disc list-inside text-sm text-red-700">
              {validationErrors.map((err, i) => (<li key={i}>{err}</li>))}
            </ul>
          </div>
        )}

        {showCustomization && (
          <div className="mb-4 flex justify-end gap-2 xl:hidden">
            <Button variant="outline" size="sm" onClick={() => resetResumeData()}>Limpar</Button>
            <Button size="sm" onClick={handleExportPDF} className="bg-[#174A3B] hover:bg-[#27634F]">
              <Download className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] gap-5 xl:gap-6">
          <div className="min-w-0">
            <ScrollArea className="h-auto max-h-none xl:h-[calc(100vh-250px)] pr-0 xl:pr-3">{renderForm()}</ScrollArea>
            <div className="flex gap-2 pt-4 border-t sm:justify-end">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 min-h-8 rounded-md border-[#DDDCD3] bg-white text-[#35443B] shadow-sm hover:bg-[#F0EFE8] px-3 py-1.5 sm:flex-none sm:min-h-9"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:mr-1" />
                <span className="text-[11px] sm:text-xs">Voltar</span>
              </Button>

              <Button
                onClick={handleNext}
                className="flex-1 min-h-8 rounded-md bg-[#174A3B] hover:bg-[#27634F] shadow-sm px-3 py-1.5 sm:flex-none sm:min-h-9"
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
              {showCustomization && (
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-gray-500">Pré-visualização do CV</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => resetResumeData()}>Limpar</Button>
                    <Button size="sm" onClick={handleExportPDF} className="bg-[#174A3B] hover:bg-[#27634F]">
                      <Download className="mr-1.5 h-4 w-4" /> PDF
                    </Button>
                  </div>
                </div>
              )}
              {!showCustomization && (
                <div className="mb-2 flex items-center justify-between px-1 text-xs">
                  <span className="font-medium text-[#626A64]">Pré-visualização do CV</span>
                  <span className="rounded-full bg-[#D8F279] px-2.5 py-1 font-bold text-[#174A3B]">A editar: {steps[currentStep].title}</span>
                </div>
              )}
              <div className="mx-auto w-[360px] overflow-hidden rounded-md border border-gray-200 bg-gray-100 p-1 shadow-sm">
                <div className="h-[510px] w-full overflow-hidden bg-white">
                  <div style={{ width: '800px', transform: 'scale(0.45)', transformOrigin: 'top left' }}>
                    <ResumePreview data={resumeData} settings={settings} editingStep={showCustomization ? undefined : currentStep} />
                  </div>
                </div>
              </div>
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
