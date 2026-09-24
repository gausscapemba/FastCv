import React from 'react';
import { Zap, Palette, Download, Clock, ShieldCheck, Briefcase, Save } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LandingPageProps {
  onStart: (mode?: 'empty' | 'demo') => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
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

          {/* Features */}
          <div className="grid gap-8 pt-16 sm:grid-cols-2 lg:grid-cols-4">
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
                Escolha cores e modelos que combinam consigo
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

          <div className="mt-16 rounded-2xl border border-green-100 bg-white/80 p-6 text-left shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Mais do que um gerador de CV</h2>
              <p className="mt-2 text-gray-600">Crie, reveja e adapte o seu currículo sem sair da aplicação.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                <div><h3 className="font-semibold">Modo ATS</h3><p className="text-sm text-gray-600">Estrutura simples e texto pesquisável.</p></div>
              </div>
              <div className="flex gap-3">
                <Zap className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                <div><h3 className="font-semibold">Revisão automática</h3><p className="text-sm text-gray-600">Avisos sobre campos, datas e links.</p></div>
              </div>
              <div className="flex gap-3">
                <Briefcase className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                <div><h3 className="font-semibold">Adaptação à vaga</h3><p className="text-sm text-gray-600">Compare o CV com uma descrição de vaga.</p></div>
              </div>
              <div className="flex gap-3">
                <Save className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                <div><h3 className="font-semibold">Versões e backups</h3><p className="text-sm text-gray-600">Guarde versões e exporte backups JSON.</p></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}