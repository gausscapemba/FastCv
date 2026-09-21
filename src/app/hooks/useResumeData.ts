import { useResume } from '@/app/context/ResumeContext';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';

export function useResumeData() {
  const ctx = useResume();

  const {
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
  } = ctx;

  return {
    resumeData: resumeData as ResumeData,
    settings: settings as ResumeSettings,
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
  };
}

export default useResumeData;
