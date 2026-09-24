import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { reviewResume } from '@/app/utils/resumeReview';
import { createResumeBackup, parseResumeBackup } from '@/app/utils/resumeStorage';
import { analyzeJobMatch, type JobMatchResult } from '@/app/utils/jobMatch';
import { loadResumeVersions, saveResumeVersions, type ResumeVersion } from '@/app/utils/resumeVersions';
import { Download, Upload, ShieldCheck, AlertTriangle, Lightbulb, Briefcase, Copy, Trash2 } from 'lucide-react';

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
  const { resumeData, settings, updateSettings, importResume } = useResumeData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviewIssues = reviewResume(resumeData);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [versionName, setVersionName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatch, setJobMatch] = useState<JobMatchResult | null>(null);

  useEffect(() => {
    setVersions(loadResumeVersions());
  }, []);

  const exportBackup = () => {
    const blob = new Blob([createResumeBackup(resumeData, settings)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalData.fullName || 'meu-cv'}-backup.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file: File) => {
    const content = await file.text();
    const imported = parseResumeBackup(content);
    importResume(imported.data, imported.settings);
  };

  const createVersion = () => {
    const name = versionName.trim();
    if (!name) return;
    const next = [{
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      data: resumeData,
      settings,
    }, ...versions];
    setVersions(next);
    saveResumeVersions(next);
    setVersionName('');
  };

  const removeVersion = (id: string) => {
    const next = versions.filter((version) => version.id !== id);
    setVersions(next);
    saveResumeVersions(next);
  };

  const restoreVersion = (version: ResumeVersion) => {
    importResume(version.data, version.settings);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Personalização</h3>
        <p className="text-gray-600">Personalize a aparência do seu currículo</p>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-medium">Como escolher?</p>
        <p className="mt-1 leading-relaxed">
          Escolha Europass para candidaturas formais e internacionais, Clássico
          para ambientes conservadores ou Moderno para destacar criatividade e
          inovação. A escolha altera o layout do PDF exportado.
        </p>
        <p className="mt-2 text-xs text-blue-800">
          Todos os modelos exportam texto pesquisável. Nenhum modelo garante
          aceitação por um ATS específico.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-green-700" />
          <div>
            <h4 className="font-semibold">Modo ATS</h4>
            <p className="mt-1 text-sm text-gray-600">
              Usa uma apresentação mais simples, com texto real e menos elementos decorativos.
              Isto melhora a legibilidade, mas não garante aceitação por nenhum ATS.
            </p>
          </div>
          <Switch
            className="ml-auto"
            checked={settings.atsMode}
            onCheckedChange={(checked) => updateSettings({ atsMode: checked })}
            aria-label="Activar modo ATS"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border bg-white p-4">
        <div>
          <h4 className="font-semibold">Revisão do CV</h4>
          <p className="mt-1 text-sm text-gray-600">
            Verificações locais de completude e consistência. Não é uma pontuação ATS.
          </p>
        </div>
        {reviewIssues.length === 0 ? (
          <Alert className="border-green-200 bg-green-50 text-green-900">
            <ShieldCheck />
            <AlertTitle>Sem alertas encontrados</AlertTitle>
            <AlertDescription>Ainda assim, reveja o conteúdo antes de enviar.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {reviewIssues.map((issue) => {
              const Icon = issue.severity === 'error' ? AlertTriangle : issue.severity === 'tip' ? Lightbulb : AlertTriangle;
              return (
                <Alert key={issue.id} variant={issue.severity === 'error' ? 'destructive' : 'default'} className="text-gray-800">
                  <Icon />
                  <AlertTitle>{issue.message}</AlertTitle>
                  <AlertDescription>{issue.action}</AlertDescription>
                </Alert>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={exportBackup}>
          <Download /> Exportar backup JSON
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload /> Importar backup JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              await importBackup(file);
            } catch (error) {
              window.alert(error instanceof Error ? error.message : 'Não foi possível importar o backup.');
            } finally {
              event.target.value = '';
            }
          }}
        />
      </div>

      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex items-start gap-3">
          <Copy className="mt-0.5 h-5 w-5 text-green-700" />
          <div>
            <h4 className="font-semibold">Versões do CV</h4>
            <p className="mt-1 text-sm text-gray-600">Guarde cópias para candidaturas diferentes sem perder o CV principal.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={versionName} onChange={(event) => setVersionName(event.target.value)} placeholder="Ex.: Candidatura — Product Designer" />
          <Button type="button" size="sm" onClick={createVersion} disabled={!versionName.trim()}>Guardar versão</Button>
        </div>
        {versions.length > 0 && (
          <ul className="space-y-2">
            {versions.map((version) => (
              <li key={version.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                <button type="button" className="text-left font-medium hover:underline" onClick={() => restoreVersion(version)}>{version.name}</button>
                <button type="button" aria-label={`Remover ${version.name}`} className="text-red-600 hover:underline" onClick={() => removeVersion(version.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex items-start gap-3">
          <Briefcase className="mt-0.5 h-5 w-5 text-green-700" />
          <div>
            <h4 className="font-semibold">Adaptar a uma vaga</h4>
            <p className="mt-1 text-sm text-gray-600">Cole a descrição da vaga para identificar termos relevantes. O conteúdo não é alterado automaticamente.</p>
          </div>
        </div>
        <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Cole aqui a descrição da vaga..." rows={6} />
        <Button type="button" variant="outline" size="sm" onClick={() => setJobMatch(analyzeJobMatch(resumeData, jobDescription))} disabled={!jobDescription.trim()}>
          Analisar correspondência
        </Button>
        {jobMatch && (
          <div className="space-y-2 text-sm">
            <p><strong>{jobMatch.matched.length}</strong> de <strong>{jobMatch.keywords.length}</strong> termos encontrados no CV.</p>
            {jobMatch.missing.length > 0 && <p className="text-amber-800"><strong>Reveja, se forem verdadeiros:</strong> {jobMatch.missing.join(', ')}</p>}
            {jobMatch.matched.length > 0 && <p className="text-green-800"><strong>Já aparecem:</strong> {jobMatch.matched.join(', ')}</p>}
            <Button type="button" size="sm" variant="outline" onClick={() => {
              setVersionName('Versão adaptada à vaga');
              const next = [{
                id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
                name: 'Versão adaptada à vaga',
                createdAt: new Date().toISOString(),
                data: resumeData,
                settings,
              }, ...versions];
              setVersions(next);
              saveResumeVersions(next);
            }}>
              Guardar cópia desta candidatura
            </Button>
            <p className="text-xs text-gray-500">A análise é local e lexical; não é uma pontuação ATS nem substitui a revisão humana.</p>
          </div>
        )}
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
                {key === 'certifications' && 'Certificações'}
                {key === 'projects' && 'Projectos'}
                {key === 'courses' && 'Cursos e formação complementar'}
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
