import type { ResumeData, ResumeSettings } from '@/app/types/resume';

export type ResumeVersion = {
  id: string;
  name: string;
  createdAt: string;
  data: ResumeData;
  settings: ResumeSettings;
};

const STORAGE_KEY = 'fastcv.versions.v1';

export function loadResumeVersions(): ResumeVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter(isResumeVersion) : [];
  } catch {
    return [];
  }
}

export function saveResumeVersions(versions: ResumeVersion[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
  } catch {
    // The editor remains usable if browser storage is unavailable.
  }
}

function isResumeVersion(value: unknown): value is ResumeVersion {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ResumeVersion>;
  return typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && typeof candidate.createdAt === 'string'
    && Boolean(candidate.data)
    && Boolean(candidate.settings);
}
