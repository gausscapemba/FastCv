import type { ResumeData } from '@/app/types/resume';

export type JobMatchResult = {
  keywords: string[];
  matched: string[];
  missing: string[];
  experienceRequirement: { requiredYears: number; statedYears: number | null } | null;
};

const STOP_WORDS = new Set(
  'a ao aos as da das de do dos e em para por com sem um uma os no na nos nas que seu sua seus suas sobre como mais muito é'.split(' '),
);

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function analyzeJobMatch(data: ResumeData, description: string): JobMatchResult {
  const resumeText = [
    data.personalData.profession,
    data.summary,
    ...data.skills,
    ...data.experiences.flatMap((item) => [item.title, item.company, item.description]),
    ...data.projects,
    ...data.certifications,
    ...data.courses,
  ].join(' ');
  return analyzeJobMatchText(resumeText, description);
}

export function analyzeJobMatchText(resumeText: string, description: string): JobMatchResult {
  const source = normalize(description);
  const experienceRequirement = findExperienceYears(description);
  const statedYears = findExperienceYears(resumeText);
  const keywords = Array.from(new Set(
    source.match(/[a-z][a-z0-9+#.-]{2,}/g)?.filter((word) => !STOP_WORDS.has(word) && !['anos', 'ano', 'years', 'year', 'experiencia', 'experience'].includes(word)) || [],
  )).slice(0, 30);
  const normalizedResume = normalize(resumeText);
  const matched = keywords.filter((keyword) => normalizedResume.includes(keyword));
  return {
    keywords,
    matched,
    missing: keywords.filter((keyword) => !matched.includes(keyword)),
    experienceRequirement: experienceRequirement === null
      ? null
      : { requiredYears: experienceRequirement, statedYears },
  };
}

function findExperienceYears(text: string) {
  const matches = Array.from(
    text.matchAll(/(\d+(?:[.,]\d+)?)\s*\+?\s*(?:anos?|years?)(?:\s+(?:de|of))?\s+(?:de\s+)?(?:experi[eê]ncia|experience)/gi),
    (match) => Number(match[1].replace(',', '.')),
  ).filter(Number.isFinite);
  return matches.length ? Math.max(...matches) : null;
}
