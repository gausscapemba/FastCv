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
        <p className="text-gray-600">Descreva brevemente a sua experiência e os seus objectivos</p>
      </div>

      <div>
        <Label htmlFor="summary">Resumo</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Profissional com X anos de experiência em..."
          className="mt-1 min-h-[200px]"
        />
        <p className="text-sm text-gray-500 mt-2">
          Dica: Foque em suas principais conquistas e habilidades relevantes
        </p>
      </div>
    </div>
  );
}
