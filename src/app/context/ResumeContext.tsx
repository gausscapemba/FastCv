import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import type {
  ResumeData,
  ResumeSettings,
  PersonalData,
  Experience,
  Education,
  ReadyTemplateId,
} from '@/app/types/resume';
import { loadStoredResume, saveStoredResume } from '@/app/utils/resumeStorage';
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
  updateCertifications: (items: string[]) => void;
  updateProjects: (items: string[]) => void;
  updateCourses: (items: string[]) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
  importResume: (data: ResumeData, settings: ResumeSettings) => void;
  loadDemoData: () => void;
  loadReadyTemplate: (templateId: ReadyTemplateId) => void;
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
  certifications: [],
  projects: [],
  courses: [],
};

const defaultSettings: ResumeSettings = {
  template: 'europass',
  primaryColor: '#174A3B',
  atsMode: false,
  showSections: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    languages: true,
    certifications: true,
    projects: true,
    courses: true,
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
    profession: 'Designer de Produto e Estratega de UX',
    email: 'ana.mateus@gmail.com',
    phone: '+244 923 456 789',
    address: 'Luanda, Angola',
    linkedin: 'https://linkedin.com/in/anaisabelmateus',
    website: 'https://anaisabel.design',
  },
  summary:
    'Designer de produto com 7 anos de experiência em UX, pesquisa, design de sistemas e liderança de equipas multidisciplinares. Especializada em transformar problemas complexos em experiências simples, intuitivas e com alto impacto para utilizadores e negócios em Angola e na região.',
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
        'Liderança de produto digital para clientes B2B e B2C, priorização de roadmap, criação de design systems e melhoria contínua da experiência do utilizador. Aumentei a taxa de conversão em 28% e reduzi o tempo de onboarding em 35%, com impacto directo em negócios locais e regionais.',
    },
  ],
  education: [
    {
      id: 'demo-edu-1',
      degree: 'Licenciatura em Design Gráfico',
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
  certifications: ['Google UX Design Certificate'],
  projects: ['Redesign de plataforma B2B — pesquisa, prototipagem e testes com utilizadores.'],
  courses: ['Product Strategy e Design de Serviços — 2021'],
};

const readyResumeTemplates: Record<ReadyTemplateId, ResumeData> = {
  'first-job': {
    personalData: { fullName: 'Mário Manuel Silva', profession: 'Assistente Administrativo', email: 'mario.silva@email.com', phone: '+244 900 000 001', address: 'Luanda, Angola', linkedin: '', website: '' },
    summary: 'Recém-licenciado em Gestão, organizado e atento ao detalhe. Procuro uma oportunidade para apoiar rotinas administrativas, atendimento e organização documental, contribuindo com responsabilidade e vontade de aprender.',
    experiences: [],
    education: [{ id: 'first-job-edu-1', degree: 'Licenciatura em Gestão', institution: 'Universidade Agostinho Neto', location: 'Luanda, Angola', startDate: '2021-09', endDate: '2025-07', current: false, description: 'Projecto final sobre organização e melhoria de processos administrativos.' }],
    skills: ['Microsoft Office', 'Organização documental', 'Atendimento ao público', 'Comunicação', 'Trabalho em equipa'],
    languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Intermédio' }],
    certifications: ['Microsoft Excel — fundamentos'],
    projects: ['Voluntariado na organização de actividades académicas e gestão de inscrições.'],
    courses: [],
  },
  professional: {
    personalData: { fullName: 'Carla Domingos', profession: 'Gestora de Projectos', email: 'carla.domingos@email.com', phone: '+244 900 000 002', address: 'Luanda, Angola', linkedin: 'https://linkedin.com/in/carla-domingos', website: '' },
    summary: 'Gestora de projectos com mais de 8 anos de experiência em operações, planeamento e coordenação de equipas. Foco em cumprimento de prazos, controlo de custos e comunicação clara com clientes e parceiros.',
    experiences: [
      { id: 'professional-exp-1', title: 'Gestora de Projectos', company: 'Kwanza Consultoria', location: 'Luanda, Angola', startDate: '2021-02', endDate: '', current: true, description: 'Coordeno projectos de consultoria desde o planeamento à entrega, acompanho orçamento e cronograma e facilito o alinhamento entre equipas. Implementei rotinas de acompanhamento que aumentaram a previsibilidade das entregas.' },
      { id: 'professional-exp-2', title: 'Coordenadora de Operações', company: 'Soluções Empresariais', location: 'Luanda, Angola', startDate: '2017-06', endDate: '2021-01', current: false, description: 'Organizei processos operacionais, relatórios de desempenho e comunicação com fornecedores e clientes empresariais.' },
    ],
    education: [{ id: 'professional-edu-1', degree: 'Licenciatura em Gestão de Empresas', institution: 'Universidade Católica de Angola', location: 'Luanda, Angola', startDate: '2012-09', endDate: '2016-07', current: false, description: '' }],
    skills: ['Gestão de projectos', 'Planeamento', 'Gestão de orçamento', 'Microsoft Excel', 'Negociação'],
    languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Avançado' }],
    certifications: ['Fundamentos de Gestão de Projectos'],
    projects: [],
    courses: [],
  },
  creative: demoResumeData,
  'photo-side': {
    ...demoResumeData,
    personalData: { ...demoResumeData.personalData },
  },
  'photo-centered': {
    ...demoResumeData,
    personalData: { ...demoResumeData.personalData },
  },
  functional: {
    personalData: { fullName: 'Paulo Manuel', profession: 'Analista de Operações', email: 'paulo.manuel@email.com', phone: '+244 900 000 006', address: 'Luanda, Angola', linkedin: '', website: '' },
    summary: 'Analista orientado a resultados, com experiência na melhoria de processos, análise de dados e coordenação de equipas operacionais.',
    experiences: [{ id: 'functional-exp-1', title: 'Analista de Operações', company: 'Kwanza Serviços', location: 'Luanda, Angola', startDate: '2021-04', endDate: '', current: true, description: 'Redesenhei fluxos de trabalho, acompanhei indicadores de desempenho e apoiei equipas na implementação de melhorias operacionais.' }],
    education: [{ id: 'functional-edu-1', degree: 'Licenciatura em Gestão', institution: 'Universidade Agostinho Neto', location: 'Luanda, Angola', startDate: '2016-09', endDate: '2020-07', current: false, description: '' }],
    skills: ['Análise de dados', 'Melhoria de processos', 'Excel avançado', 'Gestão de projectos', 'Liderança de equipas'],
    languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Avançado' }],
    certifications: ['Lean Six Sigma — fundamentos'],
    projects: ['Automatização de relatórios operacionais e redução do tempo de preparação.'],
    courses: [],
  },
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [storedResume] = useState(() => loadStoredResume());
  const [resumeData, setResumeData] = useState<ResumeData>(storedResume?.data ?? defaultResumeData);
  const [settings, setSettings] = useState<ResumeSettings>(
    storedResume ? { ...defaultSettings, ...storedResume.settings } : defaultSettings,
  );

  useEffect(() => {
    saveStoredResume(resumeData, settings);
  }, [resumeData, settings]);

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
  const updateCertifications = useCallback((items: string[]) => setResumeData((prev) => ({ ...prev, certifications: items })), []);
  const updateProjects = useCallback((items: string[]) => setResumeData((prev) => ({ ...prev, projects: items })), []);
  const updateCourses = useCallback((items: string[]) => setResumeData((prev) => ({ ...prev, courses: items })), []);

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

  const loadReadyTemplate = useCallback((templateId: ReadyTemplateId) => {
    const templateStyles: Record<ReadyTemplateId, ResumeSettings['template']> = {
      'first-job': 'europass',
      professional: 'classic',
      creative: 'modern',
      'photo-side': 'classic',
      'photo-centered': 'modern',
      functional: 'functional',
    };
    setResumeData(readyResumeTemplates[templateId]);
    setSettings({
      ...defaultSettings,
      template: templateStyles[templateId],
      layout: templateId,
      photoLayout: templateId === 'photo-side' ? 'side' : templateId === 'photo-centered' ? 'center' : undefined,
    });
  }, []);

  const resetResumeData = useCallback(() => {
    setResumeData(defaultResumeData);
    setSettings(defaultSettings);
  }, []);

  const importResume = useCallback((data: ResumeData, importedSettings: ResumeSettings) => {
    setResumeData(data);
    setSettings({ ...defaultSettings, ...importedSettings });
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
    updateCertifications,
    updateProjects,
    updateCourses,
    updateSettings,
    loadDemoData,
    loadReadyTemplate,
    resetResumeData,
    importResume,
  }), [resumeData, settings, updatePersonalData, updateSummary, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, updateSkills, updateLanguages, updateCertifications, updateProjects, updateCourses, updateSettings, loadDemoData, loadReadyTemplate, resetResumeData, importResume]);

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