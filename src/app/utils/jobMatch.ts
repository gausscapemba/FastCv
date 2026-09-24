import type { ResumeData } from '@/app/types/resume';

export type JobMatchResult = {
  keywords: string[];
  matched: string[];
  missing: string[];
};

const STOP_WORDS = new Set(
  'a ao aos as da das de do dos e em para por com sem um uma os no na nos nas que seu sua seus suas sobre como mais muito é'.split(' '),
);

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function analyzeJobMatch(data: ResumeData, description: string): JobMatchResult {
  const source = normalize(description);
  const keywords = Array.from(new Set(
    source.match(/[a-z][a-z0-9+#.-]{2,}/g)?.filter((word) => !STOP_WORDS.has(word)) || [],
  )).slice(0, 30);
  const resumeText = normalize([
    data.personalData.profession,
    data.summary,
    ...data.skills,
    ...data.experiences.flatMap((item) => [item.title, item.company, item.description]),
    ...data.projects,
    ...data.certifications,
    ...data.courses,
  ].join(' '));
  const matched = keywords.filter((keyword) => resumeText.includes(keyword));
  return { keywords, matched, missing: keywords.filter((keyword) => !matched.includes(keyword)) };
}
