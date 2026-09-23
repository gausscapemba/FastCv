const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function toMonthInputValue(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (match) return value;
  const yearOnly = value.match(/^\d{4}$/);
  if (yearOnly) return `${value}-01`;

  const normalized = value.trim().toLowerCase();
  const monthIndex = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    .findIndex((month) => normalized.startsWith(month));
  const year = value.match(/\d{4}/)?.[0];
  return monthIndex >= 0 && year ? `${year}-${String(monthIndex + 1).padStart(2, '0')}` : '';
}

export function formatResumeDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value;
  const month = Number(match[2]);
  return monthNames[month - 1] ? `${monthNames[month - 1]} de ${match[1]}` : value;
}
