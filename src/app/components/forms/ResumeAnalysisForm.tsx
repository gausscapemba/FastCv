import { useRef, useState } from 'react';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { analyzeJobMatch, type JobMatchResult } from '@/app/utils/jobMatch';
import { reviewResume } from '@/app/utils/resumeReview';
import { loadResumeVersions, saveResumeVersions } from '@/app/utils/resumeVersions';
import { loadStoredResume, parseResumeBackup } from '@/app/utils/resumeStorage';
import { AlertTriangle, Briefcase, Lightbulb, ShieldCheck } from 'lucide-react';

export function ResumeAnalysisForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedResume, setLoadedResume] = useState<{ data: ResumeData; settings: ResumeSettings } | null>(() => {
    const stored = loadStoredResume();
    return stored && isCompletedResume(stored.data) ? stored : null;
  });
  const [importError, setImportError] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatch, setJobMatch] = useState<JobMatchResult | null>(null);

  const importCompletedResume = async (file?: File) => {
    if (!file) return;
    try {
      const imported = parseResumeBackup(await file.text());
      if (!isCompletedResume(imported.data)) {
        setImportError('Este CV ainda não parece concluído. Verifique os dados pessoais e inclua resumo, experiência, formação ou competências.');
        return;
      }
      setLoadedResume(imported);
      setImportError('');
      setJobMatch(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Não foi possível ler o CV. Importe um backup JSON do FastCV.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveJobVersion = () => {
    if (!loadedResume) return;
    const versions = loadResumeVersions();
    saveResumeVersions([{
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: 'Versão adaptada à vaga',
      createdAt: new Date().toISOString(),
      data: loadedResume.data,
      settings: loadedResume.settings,
    }, ...versions]);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="mb-2 text-2xl font-semibold">Analisar um CV pronto</h1>
        <p className="text-gray-600">Carregue o currículo concluído que pretende rever ou adaptar a uma vaga.</p>
      </header>

      <section className="space-y-4 rounded-lg border bg-white p-4">
        <div><h2 className="font-semibold">1. Carregar CV concluído</h2><p className="mt-1 text-sm text-gray-600">Importe o backup JSON exportado pelo FastCV. O seu CV principal guardado neste dispositivo é carregado automaticamente quando estiver completo.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Importar CV concluído</Button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void importCompletedResume(event.target.files?.[0])} />
          {loadedResume && <span className="text-sm font-medium text-green-800">Carregado: {loadedResume.data.personalData.fullName}</span>}
        </div>
        {importError && <p role="alert" className="text-sm text-red-700">{importError}</p>}
      </section>

      {loadedResume && (
        <section className="space-y-3 rounded-lg border bg-white p-4">
          <div><h2 className="font-semibold">2. Revisão do CV</h2><p className="mt-1 text-sm text-gray-600">Verificações locais de completude e consistência. Não é uma pontuação ATS.</p></div>
          {reviewResume(loadedResume.data).length === 0 ? (
            <Alert className="border-green-200 bg-green-50 text-green-900"><ShieldCheck /><AlertTitle>Sem alertas encontrados</AlertTitle><AlertDescription>Ainda assim, reveja o conteúdo antes de enviar.</AlertDescription></Alert>
          ) : (
            <div className="space-y-2">{reviewResume(loadedResume.data).map((issue) => {
              const Icon = issue.severity === 'tip' ? Lightbulb : AlertTriangle;
              return <Alert key={issue.id} variant={issue.severity === 'error' ? 'destructive' : 'default'} className="text-gray-800"><Icon /><AlertTitle>{issue.message}</AlertTitle><AlertDescription>{issue.action}</AlertDescription></Alert>;
            })}</div>
          )}
        </section>
      )}

      <section className={`space-y-4 rounded-lg border bg-white p-4 ${!loadedResume ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-3">
          <Briefcase className="mt-0.5 h-5 w-5 text-green-700" />
          <div>
            <h2 className="font-semibold">3. Comparar com uma vaga</h2>
            <p className="mt-1 text-sm text-gray-600">Compare termos da descrição com o CV carregado. O conteúdo não é alterado automaticamente.</p>
          </div>
        </div>
        <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Cole aqui a descrição da vaga..." rows={6} disabled={!loadedResume} />
        <Button type="button" variant="outline" size="sm" onClick={() => loadedResume && setJobMatch(analyzeJobMatch(loadedResume.data, jobDescription))} disabled={!loadedResume || !jobDescription.trim()}>
          Analisar correspondência
        </Button>
        {jobMatch && (
          <div className="space-y-2 text-sm">
            <p><strong>{jobMatch.matched.length}</strong> de <strong>{jobMatch.keywords.length}</strong> termos encontrados no CV.</p>
            {jobMatch.missing.length > 0 && <p className="text-amber-800"><strong>Reveja, se forem verdadeiros:</strong> {jobMatch.missing.join(', ')}</p>}
            {jobMatch.matched.length > 0 && <p className="text-green-800"><strong>Já aparecem:</strong> {jobMatch.matched.join(', ')}</p>}
            <Button type="button" size="sm" variant="outline" onClick={saveJobVersion}>Guardar cópia desta candidatura</Button>
            <p className="text-xs text-gray-500">A análise é local e lexical; não é uma pontuação ATS nem substitui a revisão humana.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function isCompletedResume(data: ResumeData) {
  const hasPersonalData = Boolean(data.personalData.fullName.trim() && data.personalData.email.trim());
  const hasCareerContent = Boolean(data.summary.trim() || data.experiences.length || data.education.length || data.skills.length);
  return hasPersonalData && hasCareerContent;
}