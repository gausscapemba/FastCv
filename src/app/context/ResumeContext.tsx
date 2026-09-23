import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type {
  ResumeData,
  ResumeSettings,
  PersonalData,
  Experience,
  Education,
} from '@/app/types/resume';
interface ResumeContextType {
  resumeData: ResumeData;
  settings: ResumeSettings;
  updatePersonalData: (data: Partial<PersonalData>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  updateLanguages: (languages: Array<{ language: string; level: string }>) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
  loadDemoData: () => void;
  resetResumeData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const defaultResumeData: ResumeData = {
  personalData: {
    fullName: '',
    profession: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
};

const defaultSettings: ResumeSettings = {
  template: 'europass',
  primaryColor: '#16a34a',
  showSections: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    languages: true,
  },
};

function createResumeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const demoResumeData: ResumeData = {
  personalData: {
    fullName: 'Ana Isabel Mateus',
    profession: 'Product Designer e UX Strategist',
    email: 'ana.mateus@angola.com',
    phone: '+244 923 456 789',
    address: 'Luanda, Angola',
    linkedin: 'linkedin.com/in/anaisabelmateus',
    website: 'anaisabel.design',
  },
  summary:
    'Designer de produto com 7 anos de experiência em UX, pesquisa, design de sistemas e liderança de squads multidisciplinares. Especializada em transformar problemas complexos em experiências simples, intuitivas e com alto impacto para usuários e negócios em Angola e na região.',
  experiences: [
    {
      id: 'demo-exp-1',
      title: 'Senior Product Designer',
      company: 'NovaFlow Angola',
      location: 'Luanda, Angola',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description:
        'Liderança de produto digital para clientes B2B e B2C, priorização de roadmap, criação de design systems e melhoria contínua da experiência do usuário. Aumentei a taxa de conversão em 28% e reduzi o tempo de onboarding em 35%, com impacto direto em negócios locais e regionais.',
    },
  ],
  education: [
    {
      id: 'demo-edu-1',
      degree: 'Bacharelado em Design Gráfico',
      institution: 'Universidade Agostinho Neto',
      location: 'Luanda, Angola',
      startDate: '2014-01',
      endDate: '2018-12',
      current: false,
      description: 'Ênfase em branding, interfaces digitais e pesquisa visual aplicada para contextos locais e globais.',
    },
  ],
  skills: ['UX Research', 'Design Systems', 'Figma', 'Product Strategy', 'User Flows'],
  languages: [
    { language: 'Inglês', level: 'Fluente' },
    { language: 'Português', level: 'Nativo' },
    { language: 'Espanhol', level: 'Avançado' },
  ],
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [settings, setSettings] = useState<ResumeSettings>(defaultSettings);

  const updatePersonalData = useCallback((data: Partial<PersonalData>) => {
    setResumeData((prev) => ({
      ...prev,
      personalData: { ...prev.personalData, ...data },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResumeData((prev) => ({ ...prev, summary }));
  }, []);

  const addExperience = useCallback((exp: Omit<Experience, 'id'>) => {
    const newExp = { ...exp, id: createResumeId() };
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
  }, []);

  const updateExperience = useCallback((id: string, exp: Partial<Experience>) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) =>
        e.id === id ? { ...e, ...exp } : e
      ),
    }));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

  const addEducation = useCallback((edu: Omit<Education, 'id'>) => {
    const newEdu = { ...edu, id: createResumeId() };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  }, []);

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((e) =>
        e.id === id ? { ...e, ...edu } : e
      ),
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setResumeData((prev) => ({ ...prev, skills }));
  }, []);

  const updateLanguages = useCallback((languages: Array<{ language: string; level: string }>) => {
    setResumeData((prev) => ({ ...prev, languages }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ResumeSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      showSections: newSettings.showSections
        ? { ...prev.showSections, ...newSettings.showSections }
        : prev.showSections,
    }));
  }, []);

  const loadDemoData = useCallback(() => {
    setResumeData(demoResumeData);
    setSettings(defaultSettings);
  }, []);

  const resetResumeData = useCallback(() => {
    setResumeData(defaultResumeData);
    setSettings(defaultSettings);
  }, []);

  const value = useMemo(() => ({
    resumeData,
    settings,
    updatePersonalData,
    updateSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    updateLanguages,
    updateSettings,
    loadDemoData,
    resetResumeData,
  }), [resumeData, settings, updatePersonalData, updateSummary, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, updateSkills, updateLanguages, updateSettings, loadDemoData, resetResumeData]);

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
}

// Re-export types for backward compatibility with imports from other files
export * from '@/app/types/resume';