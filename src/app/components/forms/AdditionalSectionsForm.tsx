import { useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

type SectionKey = 'certifications' | 'projects' | 'courses';

export function AdditionalSectionsForm() {
  const { resumeData, updateCertifications, updateProjects, updateCourses } = useResumeData();
  const [drafts, setDrafts] = useState<Record<SectionKey, string>>({
    certifications: '', projects: '', courses: '',
  });
  const sections: Array<{ key: SectionKey; title: string; placeholder: string; values: string[]; update: (items: string[]) => void }> = [
    { key: 'certifications', title: 'Certificações', placeholder: 'Ex.: Google UX Design Certificate', values: resumeData.certifications, update: updateCertifications },
    { key: 'projects', title: 'Projectos relevantes', placeholder: 'Ex.: Redesign de plataforma B2B — resultado e ferramentas', values: resumeData.projects, update: updateProjects },
    { key: 'courses', title: 'Cursos e formação complementar', placeholder: 'Ex.: Product Strategy — instituição e ano', values: resumeData.courses, update: updateCourses },
  ];

  const addItem = (section: typeof sections[number]) => {
    const value = drafts[section.key].trim();
    if (!value) return;
    section.update([...section.values, value]);
    setDrafts((prev) => ({ ...prev, [section.key]: '' }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Certificações e Projectos</h3>
        <p className="text-gray-600">Adicione informação complementar relevante para a candidatura.</p>
      </div>
      {sections.map((section) => (
        <section key={section.key} className="space-y-3">
          <Label htmlFor={section.key}>{section.title}</Label>
          <div className="flex gap-2">
            <Input
              id={section.key}
              value={drafts[section.key]}
              placeholder={section.placeholder}
              onChange={(event) => setDrafts((prev) => ({ ...prev, [section.key]: event.target.value }))}
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addItem(section); } }}
            />
            <Button type="button" variant="outline" onClick={() => addItem(section)}>Adicionar</Button>
          </div>
          {section.values.length > 0 && (
            <ul className="space-y-2">
              {section.values.map((item, index) => (
                <li key={`${section.key}-${item}-${index}`} className="flex items-start justify-between gap-3 rounded-md border bg-white px-3 py-2 text-sm">
                  <span>{item}</span>
                  <button type="button" className="text-red-600 hover:underline" onClick={() => section.update(section.values.filter((_, itemIndex) => itemIndex !== index))}>Remover</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
