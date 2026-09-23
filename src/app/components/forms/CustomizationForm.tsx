import React from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Card } from '@/app/components/ui/card';

const colors = [
  { name: 'Azul', value: '#2563eb' },
  { name: 'Verde', value: '#059669' },
  { name: 'Roxo', value: '#7c3aed' },
  { name: 'Vermelho', value: '#dc2626' },
  { name: 'Laranja', value: '#ea580c' },
  { name: 'Cinza', value: '#475569' },
];

const templates = [
  {
    id: 'europass',
    name: 'Europass',
    description: 'Estrutura padronizada, organizada e adequada para candidaturas na Europa e instituições formais.',
  },
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Visual sóbrio, linear e discreto, ideal para bancos, administração pública e empresas tradicionais.',
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Layout contemporâneo com mais destaque visual, indicado para tecnologia, design, marketing e áreas criativas.',
  },
];

export function CustomizationForm() {
  const { settings, updateSettings } = useResumeData();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Personalização</h3>
        <p className="text-gray-600">Customize a aparência do seu currículo</p>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-medium">Como escolher?</p>
        <p className="mt-1 leading-relaxed">
          Escolha Europass para candidaturas formais e internacionais, Clássico
          para ambientes conservadores ou Moderno para destacar criatividade e
          inovação. A escolha altera o layout do PDF exportado.
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <Label>Selecione o Template</Label>
        <RadioGroup
          value={settings.template}
          onValueChange={(value) =>
            updateSettings({ template: value as 'europass' | 'classic' | 'modern' })
          }
        >
          <div className="grid grid-cols-1 gap-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all ${
                  settings.template === template.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'hover:border-gray-400'
                }`}
                onClick={() =>
                  updateSettings({ template: template.id as 'europass' | 'classic' | 'modern' })
                }
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={template.id} id={template.id} />
                  <div className="min-w-0">
                    <Label htmlFor={template.id} className="cursor-pointer">
                      {template.name}
                    </Label>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{template.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <Label>Cor Principal</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSettings({ primaryColor: color.value })}
              className={`
                h-12 rounded-lg transition-all
                ${
                  settings.primaryColor === color.value
                    ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                    : 'hover:scale-105'
                }
              `}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Sections Visibility */}
      <div className="space-y-4">
        <Label>Seções Visíveis</Label>
        <div className="space-y-3">
          {Object.entries(settings.showSections).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <Label htmlFor={key} className="cursor-pointer capitalize">
                {key === 'summary' && 'Resumo Profissional'}
                {key === 'experience' && 'Experiência'}
                {key === 'education' && 'Formação'}
                {key === 'skills' && 'Competências'}
                {key === 'languages' && 'Idiomas'}
              </Label>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) =>
                  updateSettings({
                    showSections: {
                      ...settings.showSections,
                      [key]: checked,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
