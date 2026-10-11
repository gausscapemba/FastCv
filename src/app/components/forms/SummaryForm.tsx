import React from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

export function SummaryForm() {
  const { resumeData, updateSummary } = useResumeData();
  const { summary } = resumeData;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Resumo Profissional</h3>
        <p className="text-gray-600">Conte um pouco sobre si, o que sabe fazer e o próximo passo que procura.</p>
      </div>

      <div>
        <Label htmlFor="summary">Resumo</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Ex.: Tenho formação em... e interesse em..."
          className="mt-1 min-h-[200px]"
        />
        <p className="text-sm text-gray-500 mt-2">
          Se ainda não tem experiência formal, pode começar pela formação, por projectos ou por aquilo que gostaria de aprender.
        </p>
      </div>
    </div>
  );
}
