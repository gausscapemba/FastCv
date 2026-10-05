export interface PersonalData {
  fullName: string;
  profession: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  photo?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ResumeData {
  personalData: PersonalData;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Array<{ language: string; level: string }>;
  certifications: string[];
  projects: string[];
  courses: string[];
}

export interface ResumeSettings {
  template: 'europass' | 'classic' | 'modern' | 'functional';
  layout?: ReadyTemplateId;
  photoLayout?: 'side' | 'center';
  primaryColor: string;
  atsMode: boolean;
  showSections: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    certifications: boolean;
    projects: boolean;
    courses: boolean;
  };
}

export type ReadyTemplateId = 'first-job' | 'professional' | 'creative' | 'photo-side' | 'photo-centered' | 'functional';
export type ResumeStartMode = 'empty' | 'demo' | 'analysis' | `template-${ReadyTemplateId}`;

export type Language = { language: string; level: string };
