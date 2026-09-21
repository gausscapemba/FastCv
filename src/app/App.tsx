import React, { useState } from 'react';
import { ResumeProvider } from '@/app/context/ResumeContext';
import { LandingPage } from '@/app/components/LandingPage';
import { ResumeWizard } from '@/app/components/ResumeWizard';

export default function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [startMode, setStartMode] = useState<'empty' | 'demo'>('empty');

  return (
    <ResumeProvider>
      {!showWizard ? (
        <LandingPage onStart={(mode = 'empty') => {
          setStartMode(mode);
          setShowWizard(true);
        }} />
      ) : (
        <ResumeWizard
          initialMode={startMode}
          onBack={() => setShowWizard(false)}
        />
      )}
    </ResumeProvider>
  );
}
