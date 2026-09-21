// Utils for ResumePreview

export function normalizeColor(color: string | undefined | null) {
  if (!color) return '#000000';

  // If it's already a hex value or rgb/rgba, return as-is
  const trimmed = color.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) {
    return trimmed;
  }

  // Attempt to use canvas when available (client-side). Fallback to provided string.
  try {
    if (typeof document !== 'undefined') {
      const ctx = document.createElement('canvas').getContext('2d');
      if (ctx) {
        ctx.fillStyle = trimmed;
        return ctx.fillStyle;
      }
    }
  } catch (e) {
    // ignore and fallback
  }

  return trimmed || '#000000';
}
