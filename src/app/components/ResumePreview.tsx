// ResumePreview.tsx
import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';
import { normalizeColor } from './ResumePreview.utils';
import { formatResumeDate } from '@/app/utils/resumeDate';

interface ResumePreviewProps {
  data: ResumeData;
  settings: ResumeSettings;
  editingStep?: number;
}

function ContactItem({ icon: Icon, children, color }: { icon: LucideIcon; children: React.ReactNode; color: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</span>
    </div>
  );
}

function SectionTitle({ children, color, template }: { children: React.ReactNode; color: string; template: ResumeSettings['template'] }) {
  const isModern = template === 'modern';
  const isClassic = template === 'classic';
  return (
  <h2
    className={`text-2xl font-semibold mb-3 ${isClassic ? 'border-b pb-1' : ''} ${isModern ? 'tracking-tight' : ''}`}
    style={{ color, borderColor: isClassic ? `${color}55` : undefined }}
  >
    {children}
  </h2>
);
}

function SkillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-sm text-white" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
}

function PreviewFocus({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div className={active ? 'relative z-10 rounded-sm bg-[#D8F279]/20 p-2 ring-4 ring-[#D8F279] shadow-[0_0_0_2px_#174A3B]' : undefined} data-preview-focus={active || undefined}>
      {active && <span className="absolute -right-1 -top-3 z-10 rounded-sm bg-[#174A3B] px-2 py-1 text-xs font-bold text-white">A editar</span>}
      {children}
    </div>
  );
}

function CompactSection({ title, color, children, active = false }: { title: string; color: string; children: React.ReactNode; active?: boolean }) {
  const inverse = color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff';
  return <PreviewFocus active={active}>
    <section className="mb-6 min-w-0 [overflow-wrap:anywhere]">
      <h2 className="mb-3 border-b pb-1 text-lg font-semibold leading-snug" style={{ color, borderColor: inverse ? 'rgba(255,255,255,0.45)' : `${color}66` }}>{title}</h2>{children}
    </section>
  </PreviewFocus>;
}

function ResumeDetails({ data, settings, color, sections, editingStep }: { data: ResumeData; settings: ResumeSettings; color: string; sections: Array<'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects' | 'courses'>; editingStep?: number }) {
  const visible = settings.showSections;
  return <>
    {sections.map((section) => {
      if (!visible[section]) return null;
      if (section === 'summary' && data.summary) return <CompactSection key={section} title="Perfil profissional" color={color} active={editingStep === 1}><p className="leading-relaxed text-gray-700">{data.summary}</p></CompactSection>;
      if (section === 'experience' && data.experiences.length) return <CompactSection key={section} title="Experiência profissional" color={color} active={editingStep === 2}><div className="space-y-4">{data.experiences.map((item) => <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: color }}><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="font-medium text-gray-700">{item.company}</p><p className="mb-2 text-sm text-gray-500">{item.location} · {formatResumeDate(item.startDate)} - {item.current ? 'Presente' : formatResumeDate(item.endDate)}</p>{item.description && <p className="leading-relaxed text-gray-700">{item.description}</p>}</div>)}</div></CompactSection>;
      if (section === 'education' && data.education.length) return <CompactSection key={section} title="Formação" color={color} active={editingStep === 3}><div className="space-y-3">{data.education.map((item) => <div key={item.id}><h3 className="font-semibold text-gray-900">{item.degree}</h3><p className="text-gray-700">{item.institution}</p><p className="text-sm text-gray-500">{item.location} · {formatResumeDate(item.startDate)} - {item.current ? 'Presente' : formatResumeDate(item.endDate)}</p></div>)}</div></CompactSection>;
      if (section === 'skills' && data.skills.length) return <CompactSection key={section} title={settings.template === 'functional' ? 'Competências principais' : 'Competências'} color={color} active={editingStep === 4}>{color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff' ? <ul className="space-y-2 text-sm text-white">{data.skills.map((skill) => <li key={skill} className="flex min-w-0 items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" /><span className="min-w-0 [overflow-wrap:anywhere]">{skill}</span></li>)}</ul> : <div className="flex flex-wrap gap-2">{data.skills.map((skill) => <SkillBadge key={skill} label={skill} color={color} />)}</div>}</CompactSection>;
      if (section === 'languages' && data.languages.length) return <CompactSection key={section} title="Idiomas" color={color} active={editingStep === 5}><ul className={`space-y-1 text-sm ${color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff' ? 'text-white' : 'text-gray-700'}`}>{data.languages.map((item) => <li key={item.language}><strong>{item.language}</strong> · {item.level}</li>)}</ul></CompactSection>;
      const extraSections = { certifications: ['Certificações', data.certifications], projects: ['Projectos relevantes', data.projects], courses: ['Cursos e formação complementar', data.courses] } as const;
      if (section in extraSections) {
        const [title, items] = extraSections[section as keyof typeof extraSections];
        if (items.length) return <CompactSection key={section} title={title} color={color} active={editingStep === 6}><ul className={`list-disc space-y-1 pl-5 text-sm ${color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff' ? 'text-white' : 'text-gray-700'}`}>{items.map((item) => <li key={item}>{item}</li>)}</ul></CompactSection>;
      }
      return null;
    })}
  </>;
}

function PhotoSidebarLayout({ data, settings, color, editingStep, creative = false }: { data: ResumeData; settings: ResumeSettings; color: string; editingStep?: number; creative?: boolean }) {
  const { personalData } = data;
  const sidebarSections = creative ? ['skills', 'languages', 'certifications'] as const : ['skills', 'languages', 'certifications', 'courses'] as const;
  const mainSections = creative ? ['experience', 'education', 'projects'] as const : ['experience', 'education', 'projects'] as const;
  return <div className="grid min-h-[29.7cm] grid-cols-[minmax(0,34fr)_minmax(0,66fr)] bg-white">
    <aside className="min-w-0 p-7 text-white [overflow-wrap:anywhere]" style={{ backgroundColor: color }}>
      <PreviewFocus active={editingStep === 0}>
        {!creative && (personalData.photo ? <img src={personalData.photo} alt="Fotografia de perfil" className="mx-auto mb-7 aspect-square w-36 rounded-full border-4 border-white/80 object-cover" /> : <div className="mx-auto mb-7 flex aspect-square w-36 items-center justify-center rounded-full border-2 border-dashed border-white/70 text-sm">Fotografia</div>)}
        <div className="mb-7"><h2 className="mb-3 border-b border-white/50 pb-1 text-lg font-semibold">Contactos</h2><div className="space-y-3 break-words text-sm">{personalData.email && <ContactItem icon={Mail} color="#fff">{personalData.email}</ContactItem>}{personalData.phone && <ContactItem icon={Phone} color="#fff">{personalData.phone}</ContactItem>}{personalData.address && <ContactItem icon={MapPin} color="#fff">{personalData.address}</ContactItem>}{personalData.linkedin && <ContactItem icon={Linkedin} color="#fff">{personalData.linkedin}</ContactItem>}{personalData.website && <ContactItem icon={Globe} color="#fff">{personalData.website}</ContactItem>}</div></div>
      </PreviewFocus>
      <ResumeDetails data={data} settings={settings} color="#fff" sections={[...sidebarSections]} editingStep={editingStep} />
    </aside>
    <main className="min-w-0 p-9 [overflow-wrap:anywhere]">
      <PreviewFocus active={editingStep === 0}><header className="mb-8 border-b-2 pb-5" style={{ borderColor: color }}><h1 className="mb-2 text-3xl font-bold text-gray-900">{personalData.fullName || 'Seu Nome'}</h1><p className="text-lg font-medium" style={{ color }}>{personalData.profession || 'Sua profissão'}</p></header></PreviewFocus>
      {settings.showSections.summary && data.summary && <CompactSection title="Perfil profissional" color={color} active={editingStep === 1}><p className="leading-relaxed text-gray-700">{data.summary}</p></CompactSection>}
      <ResumeDetails data={data} settings={settings} color={color} sections={[...mainSections]} editingStep={editingStep} />
    </main>
  </div>;
}

function CenteredPhotoLayout({ data, settings, color, editingStep }: { data: ResumeData; settings: ResumeSettings; color: string; editingStep?: number }) {
  const { personalData } = data;
  return <div className="min-h-[29.7cm] bg-white p-10">
    <PreviewFocus active={editingStep === 0}><header className="mb-8 border-b-4 px-6 pb-6 text-center" style={{ borderColor: color }}>
      {personalData.photo ? <img src={personalData.photo} alt="Fotografia de perfil" className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md" /> : <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed text-sm text-gray-500" style={{ borderColor: color }}>Fotografia</div>}
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{personalData.fullName || 'Seu Nome'}</h1><p className="mb-4 text-lg font-medium" style={{ color }}>{personalData.profession || 'Sua profissão'}</p>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-600">{personalData.email && <ContactItem icon={Mail} color={color}>{personalData.email}</ContactItem>}{personalData.phone && <ContactItem icon={Phone} color={color}>{personalData.phone}</ContactItem>}{personalData.address && <ContactItem icon={MapPin} color={color}>{personalData.address}</ContactItem>}{personalData.linkedin && <ContactItem icon={Linkedin} color={color}>{personalData.linkedin}</ContactItem>}{personalData.website && <ContactItem icon={Globe} color={color}>{personalData.website}</ContactItem>}</div>
    </header></PreviewFocus>
    {settings.showSections.summary && data.summary && <CompactSection title="Perfil profissional" color={color} active={editingStep === 1}><p className="leading-relaxed text-gray-700">{data.summary}</p></CompactSection>}
    <div className="grid grid-cols-[1.6fr_1fr] gap-8"><main><ResumeDetails data={data} settings={settings} color={color} sections={['experience', 'projects', 'courses']} editingStep={editingStep} /></main><aside className="border-l pl-6" style={{ borderColor: `${color}55` }}><ResumeDetails data={data} settings={settings} color={color} sections={['education', 'skills', 'languages', 'certifications']} editingStep={editingStep} /></aside></div>
  </div>;
}

function FunctionalLayout({ data, settings, color, editingStep }: { data: ResumeData; settings: ResumeSettings; color: string; editingStep?: number }) {
  const { personalData } = data;
  return <div className="min-h-[29.7cm] bg-white p-10">
    <PreviewFocus active={editingStep === 0}><header className="mb-7 border-b-2 pb-5" style={{ borderColor: color }}><h1 className="text-3xl font-bold text-gray-900">{personalData.fullName || 'Seu Nome'}</h1><p className="mt-2 text-lg font-medium" style={{ color }}>{personalData.profession || 'Sua profissão'}</p><p className="mt-2 text-sm text-gray-600">{[personalData.email, personalData.phone, personalData.address, personalData.linkedin, personalData.website].filter(Boolean).join(' · ')}</p></header></PreviewFocus>
    <ResumeDetails data={data} settings={{ ...settings, template: 'functional' }} color={color} sections={['skills', 'summary', 'experience', 'projects', 'education', 'certifications', 'languages', 'courses']} editingStep={editingStep} />
  </div>;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, settings, editingStep }, ref) => {
  const { personalData, summary, experiences, education, skills, languages, certifications, projects, courses } = data;
  const { primaryColor, showSections } = settings;

  const safeColor = normalizeColor(primaryColor);
  const isModern = settings.template === 'modern' && !settings.atsMode;
  const isClassic = settings.template === 'classic';

  if (settings.layout === 'photo-centered' || (!settings.layout && settings.photoLayout === 'center')) {
    return <div ref={ref} className="overflow-hidden rounded-lg bg-white shadow-lg" style={{ width: '100%', maxWidth: '21cm', minHeight: '29.7cm' }}><CenteredPhotoLayout data={data} settings={settings} color={safeColor} editingStep={editingStep} /></div>;
  }
  if (settings.layout === 'photo-side' || (!settings.layout && settings.photoLayout === 'side')) {
    return <div ref={ref} className="overflow-hidden rounded-lg bg-white shadow-lg" style={{ width: '100%', maxWidth: '21cm', minHeight: '29.7cm' }}><PhotoSidebarLayout data={data} settings={settings} color={safeColor} editingStep={editingStep} /></div>;
  }
  if (settings.layout === 'creative' || (!settings.layout && settings.template === 'modern')) {
    return <div ref={ref} className="overflow-hidden rounded-lg bg-white shadow-lg" style={{ width: '100%', maxWidth: '21cm', minHeight: '29.7cm' }}><PhotoSidebarLayout data={data} settings={settings} color={safeColor} editingStep={editingStep} creative /></div>;
  }
  if (settings.layout === 'functional' || settings.template === 'functional') {
    return <div ref={ref} className="overflow-hidden rounded-lg bg-white shadow-lg" style={{ width: '100%', maxWidth: '21cm', minHeight: '29.7cm' }}><FunctionalLayout data={data} settings={settings} color={safeColor} editingStep={editingStep} /></div>;
  }
  if (settings.layout === 'first-job') {
    return <div ref={ref} className="min-h-[29.7cm] overflow-hidden rounded-lg bg-white p-10 shadow-lg">
      <PreviewFocus active={editingStep === 0}><header className="mb-7 border-b-2 pb-5" style={{ borderColor: safeColor }}><h1 className="text-3xl font-bold text-gray-900">{personalData.fullName || 'Seu Nome'}</h1><p className="mt-2 text-lg text-gray-600">{personalData.profession || 'Sua profissão'}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">{personalData.email && <ContactItem icon={Mail} color={safeColor}>{personalData.email}</ContactItem>}{personalData.phone && <ContactItem icon={Phone} color={safeColor}>{personalData.phone}</ContactItem>}{personalData.address && <ContactItem icon={MapPin} color={safeColor}>{personalData.address}</ContactItem>}</div></header></PreviewFocus>
      {showSections.summary && summary && <CompactSection title="Objectivo profissional" color={safeColor} active={editingStep === 1}><p className="leading-relaxed text-gray-700">{summary}</p></CompactSection>}
      <div className="grid grid-cols-[1.2fr_1fr] gap-8"><main><ResumeDetails data={data} settings={settings} color={safeColor} sections={['education', 'skills', 'projects', 'courses']} editingStep={editingStep} /></main><aside className="border-l pl-6" style={{ borderColor: `${safeColor}55` }}><ResumeDetails data={data} settings={settings} color={safeColor} sections={['experience', 'languages', 'certifications']} editingStep={editingStep} /></aside></div>
    </div>;
  }

  return (
    <div
      ref={ref}
      className={`bg-white shadow-lg rounded-lg overflow-hidden ${isModern ? 'ring-1' : ''}`}
      style={{
        width: '100%',
        maxWidth: '21cm',
        minHeight: '29.7cm',
        backgroundColor: '#fff',
        borderColor: isModern ? safeColor : undefined,
      }}
    >
      <div className="p-8 md:p-10 xl:p-12">
        <PreviewFocus active={editingStep === 0}><div
          className={`pb-6 mb-6 ${isClassic ? 'border-b pb-1' : 'border-b-4'} ${isModern ? 'rounded-xl px-6 pt-6 -mx-2' : ''}`}
          style={{ borderColor: safeColor, backgroundColor: isModern ? `${safeColor}12` : undefined }}
        >
          {settings.photoLayout === 'center' && personalData.photo && (
            <img src={personalData.photo} alt="Fotografia de perfil" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" />
          )}
          <div className={settings.photoLayout === 'side' && personalData.photo ? 'flex items-start gap-5' : ''}>
            {settings.photoLayout === 'side' && personalData.photo && (
              <img src={personalData.photo} alt="Fotografia de perfil" className="h-24 w-20 shrink-0 rounded-md object-cover" />
            )}
            <div className={`min-w-0 flex-1 ${settings.photoLayout === 'center' ? 'text-center' : ''}`}>
              <h1
                className={`text-3xl md:text-4xl font-bold mb-2 ${isModern ? 'tracking-tight' : ''}`}
                style={{ color: isModern ? safeColor : '#111827' }}
              >
                {personalData.fullName || 'Seu Nome'}
              </h1>
              <p className={`text-lg md:text-xl mb-4 ${isClassic ? 'uppercase tracking-wide' : ''} text-gray-600`}>
                {personalData.profession || 'Sua Profissão'}
              </p>

          <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${settings.photoLayout === 'center' ? 'justify-center' : ''}`}>
            {personalData.email && (
              <ContactItem icon={Mail} color={safeColor}>{personalData.email}</ContactItem>
            )}
            {personalData.phone && (
              <ContactItem icon={Phone} color={safeColor}>{personalData.phone}</ContactItem>
            )}
            {personalData.address && (
              <ContactItem icon={MapPin} color={safeColor}>{personalData.address}</ContactItem>
            )}
            {personalData.linkedin && (
              <ContactItem icon={Linkedin} color={safeColor}>
                <a href={personalData.linkedin} target="_blank" rel="noreferrer">{personalData.linkedin}</a>
              </ContactItem>
            )}
            {personalData.website && (
              <ContactItem icon={Globe} color={safeColor}>
                <a href={personalData.website} target="_blank" rel="noreferrer">{personalData.website}</a>
              </ContactItem>
            )}
          </div>
            </div>
          </div>
        </div></PreviewFocus>

        {showSections.summary && summary && (
          <PreviewFocus active={editingStep === 1}><div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Resumo Profissional</SectionTitle>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div></PreviewFocus>
        )}

        {showSections.experience && experiences.length > 0 && (
          <PreviewFocus active={editingStep === 2}><div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Experiência Profissional</SectionTitle>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: safeColor }}>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">{exp.location} • {formatResumeDate(exp.startDate)} - {exp.current ? 'Presente' : formatResumeDate(exp.endDate)}</p>
                  {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div></PreviewFocus>
        )}

        {showSections.education && education.length > 0 && (
          <PreviewFocus active={editingStep === 3}><div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Formação Acadêmica</SectionTitle>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: safeColor }}>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600 mb-2">{edu.location} • {formatResumeDate(edu.startDate)} - {edu.current ? 'Presente' : formatResumeDate(edu.endDate)}</p>
                  {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div></PreviewFocus>
        )}

        {showSections.skills && skills.length > 0 && (
          <PreviewFocus active={editingStep === 4}><div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Competências</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SkillBadge key={index} label={skill} color={safeColor} />
              ))}
            </div>
          </div></PreviewFocus>
        )}

        {showSections.languages && languages.length > 0 && (
          <PreviewFocus active={editingStep === 5}><div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Idiomas</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <span className="text-gray-600">-</span>
                  <span className="text-gray-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </div></PreviewFocus>
        )}
        {showSections.certifications && certifications.length > 0 && (
          <PreviewFocus active={editingStep === 6}><div className="mb-6"><SectionTitle color={safeColor} template={settings.template}>Certificações</SectionTitle><ul className="list-disc space-y-1 pl-5 text-gray-700">{certifications.map((item) => <li key={item}>{item}</li>)}</ul></div></PreviewFocus>
        )}
        {showSections.projects && projects.length > 0 && (
          <PreviewFocus active={editingStep === 6}><div className="mb-6"><SectionTitle color={safeColor} template={settings.template}>Projectos relevantes</SectionTitle><ul className="list-disc space-y-1 pl-5 text-gray-700">{projects.map((item) => <li key={item}>{item}</li>)}</ul></div></PreviewFocus>
        )}
        {showSections.courses && courses.length > 0 && (
          <PreviewFocus active={editingStep === 6}><div className="mb-6"><SectionTitle color={safeColor} template={settings.template}>Cursos e formação complementar</SectionTitle><ul className="list-disc space-y-1 pl-5 text-gray-700">{courses.map((item) => <li key={item}>{item}</li>)}</ul></div></PreviewFocus>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
