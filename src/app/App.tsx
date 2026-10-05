import React, { useState } from 'react';
import { ResumeProvider } from '@/app/context/ResumeContext';
import { LandingPage } from '@/app/components/LandingPage';
import { ResumeWizard } from '@/app/components/ResumeWizard';
import { ResumeAnalysisForm } from '@/app/components/forms/ResumeAnalysisForm';
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
        <div className="min-h-screen bg-gray-50">
          <header className="sticky top-0 z-10 border-b bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <button type="button" onClick={() => setActiveService('home')} className="font-bold text-lg text-green-700">CVRápido</button>
              <span className="text-sm font-medium text-gray-600">Serviço de análise</span>
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
