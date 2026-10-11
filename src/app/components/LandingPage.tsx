import React from 'react';
import {
  ArrowRight,
  FileText,
} from '@phosphor-icons/react';
import { Button } from '@/app/components/ui/button';
import type { ResumeStartMode } from '@/app/types/resume';
import { ResumeTemplateCardPreview } from '@/app/components/ResumeTemplateCardPreview';
import { BrandMark } from '@/app/components/BrandMark';

interface LandingPageProps {
  onStart: (mode?: ResumeStartMode) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const readyTemplates: Array<{ mode: ResumeStartMode; name: string; layout: 'simple' | 'classic' | 'creative' | 'photo-side' | 'photo-center' | 'functional' }> = [
    { mode: 'template-first-job', name: 'CV essencial', layout: 'simple' },
    { mode: 'template-professional', name: 'Experiência profissional', layout: 'classic' },
    { mode: 'template-creative', name: 'Tecnologia e criatividade', layout: 'creative' },
    { mode: 'template-photo-side', name: 'Foto lateral', layout: 'photo-side' },
    { mode: 'template-photo-centered', name: 'Foto central', layout: 'photo-center' },
    { mode: 'template-functional', name: 'CV funcional', layout: 'functional' },
  ];
  return (
    <div className="brand-body min-h-screen bg-[#F7F5EF] text-[#17231E]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#DDDCD3] bg-[#F7F5EF]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Iniciar"
              onClick={() => {
                onStart();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 rounded-sm text-left text-[#174A3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27634F]"
            >
              <BrandMark className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="text-lg font-extrabold tracking-[-0.06em] sm:text-xl">CV<span className="font-medium">Rápido</span></span>
            </button>
          </div>
          <nav aria-label="Navegação principal" className="flex items-center gap-2 text-sm font-semibold text-[#35443B] sm:gap-7">
            <a href="#how-it-works-heading" className="hidden transition-colors hover:text-[#174A3B] sm:inline">Como funciona</a>
            <a href="#ready-templates" className="transition-colors hover:text-[#174A3B]">Modelos</a>
            <button type="button" onClick={() => onStart('empty')} className="whitespace-nowrap rounded-full bg-[#174A3B] px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#27634F] sm:px-5">Criar CV <ArrowRight className="ml-1 hidden sm:inline-block" size={16} weight="bold" /></button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-6 sm:pt-14">
        <section className="grid items-center gap-10 lg:min-h-[540px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="py-5 text-center lg:py-12 lg:text-left">
            <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#27634F] sm:text-sm">
              <span className="h-px w-7 bg-[#C96E50]" />
              Um passo de cada vez
            </span>
            <h1 className="brand-display mx-auto max-w-[650px] text-[clamp(2.65rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.04em] text-[#17231E] lg:mx-0">
              O seu percurso merece ser <span className="inline-block text-[#27634F] underline decoration-[#D8F279] decoration-[7px] underline-offset-[-3px]">bem apresentado.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[520px] text-base leading-7 text-[#626A64] sm:text-lg sm:leading-8 lg:mx-0">
              Não precisa de ter tudo preparado. Vamos organizar a sua experiência, formação e competências num currículo claro, um passo de cada vez.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                onClick={() => onStart('empty')}
                className="h-12 rounded-full bg-[#174A3B] px-7 text-base font-bold text-white shadow-[0_5px_0_#0F352A] transition hover:translate-y-0.5 hover:bg-[#27634F] hover:shadow-[0_3px_0_#0F352A]"
              >
                Começar o meu CV
                <ArrowRight className="ml-2" size={18} weight="bold" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onStart('demo')}
                className="h-12 rounded-full border-[#C9CDC4] bg-transparent px-6 text-base font-semibold text-[#26372E] hover:border-[#174A3B] hover:bg-white"
              >
                Ver um exemplo
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#626A64] sm:text-sm lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C96E50]" />Sem conta</span>
              <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C96E50]" />Dados no seu dispositivo</span>
              <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#C96E50]" />PDF pronto a guardar</span>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[350px] w-full max-w-[540px] items-center justify-center overflow-hidden rounded-t-[45%] rounded-b-[2rem] bg-[#E5E9DD] px-5 pb-7 pt-10 sm:min-h-[420px] sm:px-8 sm:pt-12 lg:min-h-[490px]">
            <span aria-hidden="true" className="absolute right-8 top-8 h-16 w-16 rounded-full border border-[#174A3B]/20 sm:right-12 sm:top-10 sm:h-24 sm:w-24" />
            <span aria-hidden="true" className="absolute bottom-10 left-7 h-2 w-2 rounded-full bg-[#C96E50] sm:left-12" />
            <div className="relative h-[310px] w-[230px] rotate-[-3deg] overflow-hidden bg-white shadow-[12px_18px_35px_rgba(23,35,30,0.18)] ring-1 ring-black/5 transition-transform duration-500 hover:rotate-0 sm:h-[375px] sm:w-[278px] lg:h-[405px] lg:w-[300px]">
              <div className="absolute inset-0 origin-top-left scale-[0.676] sm:scale-[0.818] lg:scale-[0.882]">
                <div className="h-[480px] w-[340px]">
                  <ResumeTemplateCardPreview layout="classic" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-7 right-3 flex max-w-[195px] items-center gap-2.5 border border-[#DDDCD3] bg-[#F7F5EF] px-3 py-2.5 text-xs font-semibold text-[#26372E] shadow-[4px_5px_0_#174A3B] sm:bottom-10 sm:right-5 sm:max-w-none sm:px-4 sm:text-sm">
              <span className="flex h-8 w-8 items-center justify-center bg-[#D8F279] text-[#174A3B]"><FileText size={18} weight="duotone" /></span>
              Feito para contar a sua história
            </div>
          </div>
        </section>

        <section aria-labelledby="how-it-works-heading" className="pt-16">
          <div className="mb-8 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#27634F]">O caminho é seu</p>
            <h2 id="how-it-works-heading" className="brand-display mt-2 text-3xl leading-tight text-[#17231E] sm:text-4xl">Da experiência ao próximo passo.</h2>
            <p className="mt-3 text-sm leading-6 text-[#626A64] sm:text-base">Um processo simples, sem perder de vista o que torna a sua história profissional única.</p>
          </div>
          <ol className="grid border-y border-[#C9CDC4] md:grid-cols-3">
            {[
              { number: '01', title: 'Reúna a sua história', description: 'Formação, projectos, trabalho e competências: cada percurso conta.' },
              { number: '02', title: 'Dê-lhe forma', description: 'Escolha a apresentação e ajuste cor e secções.' },
              { number: '03', title: 'Leve consigo', description: 'Reveja e descarregue o currículo em PDF.' },
            ].map(({ number, title, description }, index) => (
              <li key={number} className={`grid grid-cols-[48px_1fr] gap-x-4 py-5 sm:grid-cols-[56px_1fr] sm:py-7 md:px-5 lg:px-8 ${index < 2 ? 'border-b border-[#C9CDC4] md:border-b-0 md:border-r' : ''} ${index > 0 ? 'md:pl-8' : 'md:pl-0'}`}>
                <span className="brand-display row-span-2 text-3xl leading-none text-[#C96E50] sm:text-4xl">{number}</span>
                <h3 className="text-base font-bold text-[#17231E] sm:text-lg">{title}</h3>
                <p className="mt-1 max-w-sm text-sm leading-6 text-[#626A64]">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="ready-templates" className="scroll-mt-24 pt-16 text-left sm:pt-20">
          <div className="mb-7 flex flex-col gap-3 border-b border-[#C9CDC4] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#27634F]">Feitos para diferentes percursos</p>
              <h2 className="brand-display mt-2 text-3xl leading-tight text-[#17231E] sm:text-4xl">Encontre a forma certa.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#626A64] sm:text-base">Escolha uma base, personalize com a sua experiência e transforme-a no seu currículo.</p>
            </div>
            <p className="text-xs font-medium text-[#626A64] sm:max-w-[190px] sm:text-right">Os exemplos são fictícios. Todos os dados podem ser editados.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {readyTemplates.map((template, index) => (
              <button key={template.mode} type="button" aria-label={`Usar modelo ${template.name}`} onClick={() => onStart(template.mode)} className="group block w-full overflow-hidden border border-[#DDDCD3] bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-[#27634F]/50 hover:shadow-[0_12px_30px_rgba(23,35,30,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27634F]">
                <div className={`relative flex h-[280px] items-start justify-center overflow-hidden px-5 pt-5 sm:h-[310px] ${index % 3 === 1 ? 'bg-[#EAEDE5]' : index % 3 === 2 ? 'bg-[#F0E9DE]' : 'bg-[#E8ECE5]'}`}>
                  <span className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.16em] text-[#626A64]">CVR · 0{index + 1}</span>
                  <div className="mt-2 h-[480px] w-[340px] shrink-0 origin-top scale-[0.68] overflow-hidden bg-white shadow-[0_8px_20px_rgba(23,35,30,0.12)] ring-1 ring-black/5 sm:scale-[0.74]">
                      <ResumeTemplateCardPreview layout={template.layout} />
                  </div>
                </div>
                <div className="flex min-h-12 items-center justify-center px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#174A3B]">
                    Usar o modelo <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" size={17} weight="bold" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}