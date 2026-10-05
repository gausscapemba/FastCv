import React from 'react';
import { Zap, Palette, Download, Clock, ShieldCheck, Briefcase, Save, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { ResumeStartMode } from '@/app/types/resume';
import { ResumeTemplateCardPreview } from '@/app/components/ResumeTemplateCardPreview';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Iniciar"
              onClick={() => {
                onStart();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-bold text-xl text-green-600 ml-4 md:ml-8"
            >
              CVRápido
            </button>
          </div>
          <nav aria-label="Navegação principal" className="flex items-center gap-4 text-sm font-medium text-gray-700 sm:gap-6">
            <a href="#ready-templates" className="hover:text-green-700">Modelos</a>
            <a href="#services" className="hover:text-green-700">Serviços</a>
            <button type="button" onClick={() => onStart('empty')} className="hidden rounded-md bg-green-700 px-3 py-2 text-white hover:bg-green-800 sm:inline-flex">Criar CV</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Crie o seu CV profissional
            <br />
            <span className="text-green-600">em minutos</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramenta rápida e intuitiva para criar currículos profissionais
            com pré-visualização em tempo real. O seu CV pronto quando precisar!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onStart('empty')}
              className="h-14 px-8 text-lg bg-green-600 hover:bg-green-700"
            >
              Criar meu CV agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onStart('demo')}
              className="h-14 px-8 text-lg"
            >
              Usar exemplo
            </Button>
          </div>

          <section id="ready-templates" className="scroll-mt-24 pt-16 text-left">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Comece com um modelo pronto</h2>
                <p className="mt-1 text-gray-600">Escolha um currículo de exemplo e substitua os dados fictícios pelos seus.</p>
              </div>
              <p className="text-sm text-gray-500">Todos os dados são fictícios e editáveis</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {readyTemplates.map((template) => (
                <button key={template.mode} type="button" onClick={() => onStart(template.mode)} className="group overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600">
                  <div className="flex h-[280px] items-start justify-center overflow-hidden bg-gray-100 px-6 pt-4 sm:h-[320px]">
                    <div className="h-[480px] w-[340px] shrink-0 origin-top scale-[0.72] overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-black/5 sm:scale-[0.82]">
                      <ResumeTemplateCardPreview layout={template.layout} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-green-700">Usar modelo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="services" className="scroll-mt-24 pt-16">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="text-2xl font-bold text-gray-900">Serviços</h2><p className="mt-1 text-gray-600">Crie o currículo ou trabalhe sobre um CV já concluído.</p></div>
            </div>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <button type="button" onClick={() => onStart('empty')} className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-white p-5 text-left shadow-sm transition hover:border-green-500 hover:shadow-md">
                <span><strong className="block text-gray-900">Criar um CV</strong><span className="mt-1 block text-sm text-gray-600">Comece em branco ou escolha um modelo pronto.</span></span><FileText className="h-6 w-6 shrink-0 text-green-700" />
              </button>
              <button type="button" onClick={() => onStart('analysis')} className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-green-500 hover:shadow-md">
                <span><strong className="block text-gray-900">Analisar um CV pronto</strong><span className="mt-1 block text-sm text-gray-600">Importe um CV concluído e compare-o com uma vaga.</span></span><Briefcase className="h-6 w-6 shrink-0 text-green-700" />
              </button>
            </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-green-600" />
              </div>

              <h3 className="font-semibold">Ultra Rápido</h3>
              <p className="text-sm text-gray-600">
                Crie o seu CV em poucos minutos com o nosso formulário intuitivo
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Preview Instantâneo</h3>
              <p className="text-sm text-gray-600">
                Visualize as alterações em tempo real enquanto preenche
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Personalizável</h3>
              <p className="text-sm text-gray-600">
                  Escolha entre modelos prontos e ajuste as cores
                </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Download Imediato</h3>
              <p className="text-sm text-gray-600">
                Descarregue o seu CV em PDF profissional instantaneamente
              </p>
            </div>
          </div>
          </section>

          <div className="mt-16 rounded-2xl border border-green-100 bg-white/80 p-6 text-left shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Mais do que um gerador de CV</h2>
              <p className="mt-2 text-gray-600">Crie, reveja e adapte o seu currículo sem sair da aplicação.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <div><h3 className="font-semibold">Modo ATS</h3><p className="text-sm text-gray-600">Estrutura simples e texto pesquisável.</p></div>
              </div>
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div><h3 className="font-semibold">Revisão de CV pronto</h3><p className="text-sm text-gray-600">Verificações de consistência como serviço separado.</p></div>
              </div>
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <div><h3 className="font-semibold">Adaptação à vaga</h3><p className="text-sm text-gray-600">Compare o CV com uma descrição de vaga.</p></div>
              </div>
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Save className="h-6 w-6 text-green-600" />
                </div>
                <div><h3 className="font-semibold">Versões e backups</h3><p className="text-sm text-gray-600">Guarde versões e exporte backups JSON.</p></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}