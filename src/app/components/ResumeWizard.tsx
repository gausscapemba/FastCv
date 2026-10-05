// ResumeWizard.tsx
import React, { useCallback, useState } from 'react';
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
import { AdditionalSectionsForm } from '@/app/components/forms/AdditionalSectionsForm';
import { CustomizationForm } from '@/app/components/forms/CustomizationForm';

import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';

import { ArrowLeft, ArrowRight, Download, UserRound, AlignLeft, BriefcaseBusiness, GraduationCap, Wrench, Languages, ListChecks, Palette } from 'lucide-react';
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
  const isDirectMode = initialMode.startsWith('template-');

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
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-6 sm:py-8">
        {!isDirectMode && !showCustomization && <Stepper steps={steps} currentStep={currentStep} />}
        {(initialMode === 'demo' || isDirectMode) && (isDirectMode || currentStep === 0) && !showCustomization && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Modelo de demonstração:</strong> estes dados são fictícios.
            Edite os campos directamente e substitua-os pelos seus dados antes de exportar.
          </div>
        )}
        {isDirectMode && (
          <nav aria-label="Navegação do currículo" className="sticky top-[57px] z-[9] mb-6 -mx-4 overflow-x-auto border-y bg-white px-4 shadow-sm sm:top-[65px] sm:mx-0 sm:rounded-md sm:border">
            <div className="mx-auto flex w-max min-w-full items-center gap-1 py-2 sm:justify-center">
              {[
                { id: 'personal-data', label: 'Dados', Icon: UserRound },
                { id: 'summary', label: 'Resumo', Icon: AlignLeft },
                { id: 'experience', label: 'Experiência', Icon: BriefcaseBusiness },
                { id: 'education', label: 'Formação', Icon: GraduationCap },
                { id: 'skills', label: 'Competências', Icon: Wrench },
                { id: 'languages', label: 'Idiomas', Icon: Languages },
                { id: 'extras', label: 'Complementos', Icon: ListChecks },
                { id: 'customization', label: 'Aparência', Icon: Palette },
              ].map(({ id, label, Icon }) => (
                <a key={id} href={`#${id}`} className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-gray-600 hover:bg-green-50 hover:text-green-800 sm:text-sm">
                  <Icon className="h-4 w-4" />{label}
                </a>
              ))}
            </div>
          </nav>
        )}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <ul className="list-disc list-inside text-sm text-red-700">
              {validationErrors.map((err, i) => (<li key={i}>{err}</li>))}
            </ul>
          </div>
        )}

        {(showCustomization || isDirectMode) && (
          <div className="mb-4 flex justify-end gap-2 xl:hidden">
            <Button variant="outline" size="sm" onClick={() => resetResumeData()}>Limpar</Button>
            <Button size="sm" onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] gap-5 xl:gap-6">
          <div className="min-w-0">
            {isDirectMode ? (
              <div className="space-y-8">
                <section id="personal-data" className="scroll-mt-36"><PersonalDataForm /></section>
                <section id="summary" className="scroll-mt-36"><SummaryForm /></section>
                <section id="experience" className="scroll-mt-36"><ExperienceForm /></section>
                <section id="education" className="scroll-mt-36"><EducationForm /></section>
                <section id="skills" className="scroll-mt-36"><SkillsForm /></section>
                <section id="languages" className="scroll-mt-36"><LanguagesForm /></section>
                <section id="extras" className="scroll-mt-36"><AdditionalSectionsForm /></section>
                <section id="customization" className="scroll-mt-36"><CustomizationForm /></section>
              </div>
            ) : (
              <>
                <ScrollArea className="h-auto max-h-none xl:h-[calc(100vh-250px)] pr-0 xl:pr-3">{renderForm()}</ScrollArea>
                <div className="flex gap-2 pt-4 border-t sm:justify-end">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 min-h-8 rounded-md border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 px-3 py-1.5 sm:flex-none sm:min-h-9"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:mr-1" />
                <span className="text-[11px] sm:text-xs">Voltar</span>
              </Button>

              <Button
                onClick={handleNext}
                className="flex-1 min-h-8 rounded-md bg-green-600 hover:bg-green-700 shadow-sm px-3 py-1.5 sm:flex-none sm:min-h-9"
              >
                <span className="text-[11px] sm:text-xs">
                  {showCustomization ? 'Concluído' : currentStep === steps.length - 1 ? 'Personalizar' : 'Próximo'}
                </span>
                {!showCustomization && <ArrowRight className="h-3.5 w-3.5 sm:ml-1" />}
              </Button>
                </div>
              </>
            )}
          </div>

          {/* PREVIEW VISUAL */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              {(showCustomization || isDirectMode) && (
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-gray-500">Pré-visualização do CV</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => resetResumeData()}>Limpar</Button>
                    <Button size="sm" onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
                      <Download className="mr-1.5 h-4 w-4" /> PDF
                    </Button>
                  </div>
                </div>
              )}
              <div className="mx-auto w-[360px] overflow-hidden rounded-md border border-gray-200 bg-gray-100 p-1 shadow-sm">
                <div className="h-[510px] w-full overflow-hidden bg-white">
                  <div style={{ width: '800px', transform: 'scale(0.45)', transformOrigin: 'top left' }}>
                    <ResumePreview data={resumeData} settings={settings} />
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
