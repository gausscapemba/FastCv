import { useResume } from '@/app/context/ResumeContext';

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
  };
}

export default useResumeData;
