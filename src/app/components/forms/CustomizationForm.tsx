import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { createResumeBackup, parseResumeBackup } from '@/app/utils/resumeStorage';
import { loadResumeVersions, saveResumeVersions, type ResumeVersion } from '@/app/utils/resumeVersions';
import { Download, Upload, ShieldCheck, Copy, Trash2, ChevronDown } from 'lucide-react';

const colors = [
  { name: 'Floresta', value: '#174A3B' },
  { name: 'Folha', value: '#27634F' },
  { name: 'Barro', value: '#C96E50' },
  { name: 'Tinta', value: '#17231E' },
  { name: 'Azul', value: '#2563EB' },
  { name: 'Pedra', value: '#626A64' },
];

export function CustomizationForm() {
  const { resumeData, settings, updateSettings, importResume } = useResumeData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [versionName, setVersionName] = useState('');

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
                    ? 'ring-2 ring-offset-2 ring-[#174A3B] scale-110'
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

      <details className="group rounded-lg border border-[#DDDCD3] bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold text-[#174A3B] marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27634F]">
          <span>
            Opções avançadas
            <span className="mt-1 block text-sm font-normal text-[#626A64]">Modo ATS, backups e versões do CV</span>
          </span>
          <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-4 border-t border-[#DDDCD3] p-4">
          <div className="flex items-start gap-3 rounded-lg border border-[#DDDCD3] p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-[#174A3B]" />
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

          <div className="space-y-4 rounded-lg border border-[#DDDCD3] p-4">
            <div className="flex items-start gap-3">
              <Copy className="mt-0.5 h-5 w-5 text-[#174A3B]" />
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
        </div>
      </details>
    </div>
  );
}
