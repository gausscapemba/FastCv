import type { ResumeData } from '@/app/types/resume';

export type ResumeReviewIssue = {
  id: string;
  severity: 'error' | 'warning' | 'tip';
  message: string;
  action: string;
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function reviewResume(data: ResumeData): ResumeReviewIssue[] {
  const issues: ResumeReviewIssue[] = [];
  const { personalData } = data;

  if (!personalData.fullName.trim()) {
    issues.push({ id: 'name', severity: 'error', message: 'O nome completo está vazio.', action: 'Preencha o nome usado profissionalmente.' });
  }
  if (!personalData.email.trim()) {
    issues.push({ id: 'email-empty', severity: 'error', message: 'O email está vazio.', action: 'Adicione um email profissional.' });
  } else if (!isValidEmail(personalData.email)) {
    issues.push({ id: 'email-invalid', severity: 'error', message: 'O formato do email parece inválido.', action: 'Confirme o endereço antes de exportar.' });
  }
  if (!personalData.phone.trim()) {
    issues.push({ id: 'phone', severity: 'warning', message: 'Não foi indicado um telefone.', action: 'Adicione um contacto se for adequado à candidatura.' });
  }
  if (!data.summary.trim()) {
    issues.push({ id: 'summary', severity: 'warning', message: 'O resumo profissional está vazio.', action: 'Explique especialidade, experiência e valor em 2 a 4 linhas.' });
  } else if (data.summary.trim().length < 80) {
    issues.push({ id: 'summary-short', severity: 'tip', message: 'O resumo profissional parece muito curto.', action: 'Inclua especialidade, contexto e uma realização relevante.' });
  }
  if (data.experiences.length === 0 && data.projects.length === 0) {
    issues.push({ id: 'evidence', severity: 'warning', message: 'Não há experiência nem projectos registados.', action: 'Adicione evidências práticas, académicas ou profissionais.' });
  }
  data.experiences.forEach((experience) => {
    if (experience.description.trim().length < 40) {
      issues.push({ id: `experience-${experience.id}`, severity: 'tip', message: `A descrição de "${experience.title || 'uma experiência'}" é curta.`, action: 'Descreva acção, contexto e resultado, de preferência com números.' });
    }
    if (!experience.current && experience.endDate && experience.startDate > experience.endDate) {
      issues.push({ id: `experience-date-${experience.id}`, severity: 'error', message: `As datas de "${experience.title || 'uma experiência'}" parecem invertidas.`, action: 'Confirme o mês de início e de término.' });
    }
  });
  if (data.skills.length < 3) {
    issues.push({ id: 'skills', severity: 'tip', message: 'Há poucas competências listadas.', action: 'Inclua competências relevantes para a função, sem criar uma lista genérica.' });
  }
  if (data.personalData.linkedin && !/^https?:\/\//i.test(data.personalData.linkedin)) {
    issues.push({ id: 'linkedin-url', severity: 'warning', message: 'O LinkedIn não começa por http:// ou https://.', action: 'Use o endereço completo para tornar o link utilizável.' });
  }
  if (data.personalData.website && !/^https?:\/\//i.test(data.personalData.website)) {
    issues.push({ id: 'website-url', severity: 'warning', message: 'O portfólio não começa por http:// ou https://.', action: 'Use o endereço completo para tornar o link utilizável.' });
  }

  return issues;
}
