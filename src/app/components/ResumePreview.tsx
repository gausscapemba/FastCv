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
}

function ContactItem({ icon: Icon, children, color }: { icon: LucideIcon; children: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" style={{ color }} />
      <span>{children}</span>
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

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, settings }, ref) => {
  const { personalData, summary, experiences, education, skills, languages, certifications, projects, courses } = data;
  const { primaryColor, showSections } = settings;

  const safeColor = normalizeColor(primaryColor);
  const isModern = settings.template === 'modern' && !settings.atsMode;
  const isClassic = settings.template === 'classic';

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
        <div
          className={`pb-6 mb-6 ${isClassic ? 'border-b' : 'border-b-4'} ${isModern ? 'rounded-xl px-6 pt-6 -mx-2' : ''}`}
          style={{ borderColor: safeColor, backgroundColor: isModern ? `${safeColor}12` : undefined }}
        >
          <h1
            className={`text-3xl md:text-4xl font-bold mb-2 ${isModern ? 'tracking-tight' : ''}`}
            style={{ color: isModern ? safeColor : '#111827' }}
          >
            {personalData.fullName || 'Seu Nome'}
          </h1>
          <p className={`text-lg md:text-xl mb-4 ${isClassic ? 'uppercase tracking-wide' : ''} text-gray-600`}>
            {personalData.profession || 'Sua Profissão'}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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

        {showSections.summary && summary && (
          <div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Resumo Profissional</SectionTitle>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {showSections.experience && experiences.length > 0 && (
          <div className="mb-6">
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
          </div>
        )}

        {showSections.education && education.length > 0 && (
          <div className="mb-6">
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
          </div>
        )}

        {showSections.skills && skills.length > 0 && (
          <div className="mb-6">
            <SectionTitle color={safeColor} template={settings.template}>Competências</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SkillBadge key={index} label={skill} color={safeColor} />
              ))}
            </div>
          </div>
        )}

        {showSections.languages && languages.length > 0 && (
          <div className="mb-6">
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
          </div>
        )}
        {showSections.certifications && certifications.length > 0 && (
          <div className="mb-6"><SectionTitle color={safeColor} template={settings.template}>Certificações</SectionTitle><ul className="list-disc space-y-1 pl-5 text-gray-700">{certifications.map((item) => <li key={item}>{item}</li>)}</ul></div>
        )}
        {showSections.projects && projects.length > 0 && (
          <div className="mb-6"><SectionTitle color={safeColor} template={settings.template}>Projectos relevantes</SectionTitle><ul className="list-disc space-y-1 pl-5 text-gray-700">{projects.map((item) => <li key={item}>{item}</li>)}</ul></div>
        )}
        {showSections.courses && courses.length > 0 && (
          <div className="mb-6"><SectionTitle color={safeColor} template={settings.template}>Cursos e formação complementar</SectionTitle><ul className="list-disc space-y-1 pl-5 text-gray-700">{courses.map((item) => <li key={item}>{item}</li>)}</ul></div>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
