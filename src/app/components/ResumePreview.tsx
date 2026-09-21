// ResumePreview.tsx
import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';
import { normalizeColor } from './ResumePreview.utils';

interface ResumePreviewProps {
  data: ResumeData;
  settings: ResumeSettings;
}

function ContactItem({ icon: Icon, children, color }: { icon: any; children: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" style={{ color }} />
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className="text-2xl font-semibold mb-3" style={{ color }}>
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
  const { personalData, summary, experiences, education, skills, languages } = data;
  const { primaryColor, showSections } = settings;

  const safeColor = normalizeColor(primaryColor);

  return (
    <div
      ref={ref}
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      style={{ width: '100%', maxWidth: '21cm', minHeight: '29.7cm', backgroundColor: '#fff' }}
    >
      <div className="p-8 md:p-10 xl:p-12">
        <div className="border-b-4 pb-6 mb-6" style={{ borderColor: safeColor }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{personalData.fullName || 'Seu Nome'}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">{personalData.profession || 'Sua Profissão'}</p>

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
              <ContactItem icon={Linkedin} color={safeColor}>{personalData.linkedin}</ContactItem>
            )}
            {personalData.website && (
              <ContactItem icon={Globe} color={safeColor}>{personalData.website}</ContactItem>
            )}
          </div>
        </div>

        {showSections.summary && summary && (
          <div className="mb-6">
            <SectionTitle color={safeColor}>Resumo Profissional</SectionTitle>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {showSections.experience && experiences.length > 0 && (
          <div className="mb-6">
            <SectionTitle color={safeColor}>Experiência Profissional</SectionTitle>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: safeColor }}>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">{exp.location} • {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {showSections.education && education.length > 0 && (
          <div className="mb-6">
            <SectionTitle color={safeColor}>Formação Acadêmica</SectionTitle>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: safeColor }}>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600 mb-2">{edu.location} • {edu.startDate} - {edu.current ? 'Presente' : edu.endDate}</p>
                  {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {showSections.skills && skills.length > 0 && (
          <div className="mb-6">
            <SectionTitle color={safeColor}>Competências</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SkillBadge key={index} label={skill} color={safeColor} />
              ))}
            </div>
          </div>
        )}

        {showSections.languages && languages.length > 0 && (
          <div className="mb-6">
            <SectionTitle color={safeColor}>Idiomas</SectionTitle>
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
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
