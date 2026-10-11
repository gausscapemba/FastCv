import React, { useState } from 'react';
import { ResumeProvider } from '@/app/context/ResumeContext';
import { LandingPage } from '@/app/components/LandingPage';
import { ResumeWizard } from '@/app/components/ResumeWizard';
import { ResumeAnalysisForm } from '@/app/components/forms/ResumeAnalysisForm';
import { BrandMark } from '@/app/components/BrandMark';
import type { ResumeStartMode } from '@/app/types/resume';

export default function App() {
  const [activeService, setActiveService] = useState<'home' | 'create' | 'analysis'>('home');
  const [startMode, setStartMode] = useState<ResumeStartMode>('empty');

  return (
    <ResumeProvider>
      {activeService === 'home' ? (
        <LandingPage onStart={(mode = 'empty') => {
          if (mode === 'analysis') {
            setActiveService('analysis');
            return;
          }
          setStartMode(mode);
          setActiveService('create');
        }} />
      ) : activeService === 'analysis' ? (
        <div className="brand-body min-h-screen bg-[#F7F5EF] text-[#17231E]">
          <header className="sticky top-0 z-10 border-b border-[#DDDCD3] bg-[#F7F5EF]/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <button type="button" onClick={() => setActiveService('home')} className="flex items-center gap-2 font-bold text-lg text-[#174A3B]">
                <BrandMark className="h-8 w-8" />CVRápido
              </button>
              <span className="text-sm font-medium text-[#626A64]">Serviço de análise</span>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <ResumeAnalysisForm />
          </main>
        </div>
      ) : (
        <ResumeWizard
          initialMode={startMode}
          onBack={() => setActiveService('home')}
        />
      )}
    </ResumeProvider>
  );
}
