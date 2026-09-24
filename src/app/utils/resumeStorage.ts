import type { ResumeData, ResumeSettings } from '@/app/types/resume';

const STORAGE_KEY = 'fastcv.resume.v1';

type StoredResume = { data: ResumeData; settings: ResumeSettings };

export function loadStoredResume(): StoredResume | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredResume(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredResume(data: ResumeData, settings: ResumeSettings) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, settings }));
  } catch {
    // Storage can be disabled or full; the editor remains usable for this session.
  }
}

export function createResumeBackup(data: ResumeData, settings: ResumeSettings) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data, settings }, null, 2);
}

export function parseResumeBackup(raw: string): StoredResume {
  const parsed: unknown = JSON.parse(raw);
  const candidate = isStoredResume(parsed) ? parsed : isBackup(parsed) ? { data: parsed.data, settings: parsed.settings } : null;
  if (!candidate) throw new Error('O ficheiro não contém um backup válido do CV.');
  return candidate;
}

function isBackup(value: unknown): value is { data: ResumeData; settings: ResumeSettings } {
  return isRecord(value) && 'data' in value && 'settings' in value && isResumeData(value.data) && isResumeSettings(value.settings);
}

function isStoredResume(value: unknown): value is StoredResume {
  return isBackup(value);
}

function isResumeData(value: unknown): value is ResumeData {
  return isRecord(value)
    && isRecord(value.personalData)
    && typeof value.summary === 'string'
    && Array.isArray(value.experiences)
    && Array.isArray(value.education)
    && Array.isArray(value.skills)
    && Array.isArray(value.languages)
    && Array.isArray(value.certifications)
    && Array.isArray(value.projects)
    && Array.isArray(value.courses);
}

function isResumeSettings(value: unknown): value is ResumeSettings {
  return isRecord(value)
    && (value.template === 'europass' || value.template === 'classic' || value.template === 'modern')
    && typeof value.primaryColor === 'string'
    && typeof value.atsMode === 'boolean'
    && isRecord(value.showSections);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
