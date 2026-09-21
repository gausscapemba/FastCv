import React from 'react';
import { Zap, Palette, Download, Clock } from 'lucide-react';
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
            Crie seu CV profissional
            <br />
            <span className="text-green-600">em minutos</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramenta rápida e intuitiva para criar currículos profissionais
            com preview em tempo real. Seu CV pronto quando você precisar!
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
          <div className="grid md:grid-cols-4 gap-8 pt-16">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Ultra Rápido</h3>
              <p className="text-sm text-gray-600">
                Crie seu CV em poucos minutos com nosso formulário intuitivo
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
                Escolha cores e templates que combinam com você
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Download Imediato</h3>
              <p className="text-sm text-gray-600">
                Baixe seu CV em PDF profissional instantaneamente
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}