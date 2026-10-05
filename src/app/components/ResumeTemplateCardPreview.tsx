import React from 'react';

type PreviewLayout = 'simple' | 'classic' | 'creative' | 'photo-side' | 'photo-center' | 'functional';

const portraitUrl = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&h=300&q=80';

const profiles = {
  simple: { name: 'Mário Manuel Silva', role: 'Assistente Administrativo', city: 'Luanda, Angola', email: 'mario.silva@email.com', section: 'Formação', detail: 'Licenciatura em Gestão' },
  classic: { name: 'Carla Domingos', role: 'Gestora de Projectos', city: 'Luanda, Angola', email: 'carla.domingos@email.com', section: 'Experiência', detail: 'Gestora de Projectos · Kwanza Consultoria' },
  creative: { name: 'Ana Isabel Mateus', role: 'Designer de Produto', city: 'Luanda, Angola', email: 'ana.mateus@email.com', section: 'Projectos', detail: 'Redesign de plataforma B2B' },
  'photo-side': { name: 'Ana Isabel Mateus', role: 'Designer de Produto', city: 'Luanda, Angola', email: 'ana.mateus@email.com', section: 'Experiência', detail: 'Senior Product Designer · NovaFlow' },
  'photo-center': { name: 'Joana Manuel', role: 'Especialista de Comunicação', city: 'Luanda, Angola', email: 'joana.manuel@email.com', section: 'Experiência', detail: 'Gestora de Comunicação · Horizonte' },
  functional: { name: 'Paulo Manuel', role: 'Analista de Operações', city: 'Luanda, Angola', email: 'paulo.manuel@email.com', section: 'Experiência', detail: 'Analista de Operações · Kwanza Serviços' },
} satisfies Record<PreviewLayout, { name: string; role: string; city: string; email: string; section: string; detail: string }>;

const palette: Record<PreviewLayout, string> = {
  simple: '#16804b',
  classic: '#344256',
  creative: '#0e766e',
  'photo-side': '#195b45',
  'photo-center': '#167d91',
  functional: '#315b6d',
};

function TextLine({ width = '100%', color = '#cbd5e1' }: { width?: string; color?: string }) {
  return <span className="block h-[3px] rounded-sm" style={{ width, backgroundColor: color }} />;
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-3">
      <h3 className="mb-1 border-b pb-1 text-[6px] font-bold uppercase" style={{ color, borderColor: `${color}55` }}>{title}</h3>
      {children}
    </section>
  );
}

export function ResumeTemplateCardPreview({ layout }: { layout: PreviewLayout }) {
  const profile = profiles[layout];
  const color = palette[layout];
  const hasPhoto = layout === 'photo-side' || layout === 'photo-center';

  if (layout === 'functional') {
    return (
      <article aria-label="Pré-visualização do modelo CV funcional" className="h-full w-full bg-white px-5 py-5 text-left text-gray-700">
        <header className="mb-3 border-b-2 pb-2" style={{ borderColor: color }}>
          <h2 className="text-[13px] font-bold leading-tight text-gray-900">{profile.name}</h2>
          <p className="mt-1 text-[7px] font-medium" style={{ color }}>{profile.role}</p>
          <p className="mt-1 text-[5px] text-gray-500">{profile.email} · {profile.city}</p>
        </header>
        <Section title="Competências principais" color={color}><p className="text-[6px] leading-[1.8]">Análise de dados · Melhoria de processos<br />Excel avançado · Gestão de projectos<br />Liderança de equipas</p></Section>
        <Section title="Experiência relevante" color={color}><p className="text-[6px] font-semibold">{profile.detail}</p><p className="mb-1 text-[5px] text-gray-500">Luanda · 2021 — Presente</p><TextLine /><TextLine width="88%" /></Section>
        <Section title="Formação" color={color}><p className="text-[6px] font-semibold">Licenciatura em Gestão</p><p className="text-[5px]">Universidade Agostinho Neto · 2020</p></Section>
      </article>
    );
  }

  if (layout === 'photo-side' || layout === 'creative') {
    return (
      <article aria-label={`Pré-visualização do modelo ${layout}`} className="flex h-full w-full bg-white text-left text-gray-700">
        <aside className="w-[34%] shrink-0 px-3 py-4 text-white" style={{ backgroundColor: color }}>
          {layout === 'photo-side' ? <img src={portraitUrl} alt="Retrato fictício de mulher negra no CV" className="mx-auto mb-3 aspect-square w-[82%] rounded-full border-2 border-white/80 object-cover" /> : <div className="mb-4 h-7" />}
          <p className="mb-1 text-[6px] font-bold uppercase">Contactos</p>
          <TextLine color="#ffffff" />
          <p className="my-1 break-all text-[5px]">{profile.email}</p>
          <TextLine width="84%" color="#ffffffaa" />
          <p className="my-1 text-[5px]">{profile.city}</p>
          <div className="mb-2 mt-3 border-t border-white/50 pt-2"><p className="mb-1 text-[6px] font-bold uppercase">Competências</p><TextLine color="#ffffff" /><p className="my-1 text-[5px]">Organização · Liderança</p><TextLine width="75%" color="#ffffffaa" /></div>
          <div className="mt-3 border-t border-white/50 pt-2"><p className="mb-1 text-[6px] font-bold uppercase">Idiomas</p><p className="text-[5px]">Português · Inglês</p></div>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-5">
          <header className="mb-3 border-b-2 pb-2" style={{ borderColor: color }}>
            <h2 className="text-[13px] font-bold leading-tight text-gray-900">{profile.name}</h2>
            <p className="mt-1 text-[7px] font-medium" style={{ color }}>{profile.role}</p>
          </header>
          <Section title="Perfil profissional" color={color}><p className="text-[5px] leading-relaxed">Profissional dedicada, com experiência em coordenação, comunicação e entrega de resultados.</p></Section>
          <Section title="Experiência" color={color}><p className="text-[6px] font-semibold">{profile.detail}</p><p className="mb-1 text-[5px] text-gray-500">Luanda · 2021 — Presente</p><TextLine /><TextLine width="88%" /></Section>
          <Section title="Formação" color={color}><p className="text-[6px] font-semibold">Licenciatura</p><p className="text-[5px]">Universidade Agostinho Neto · 2018</p></Section>
        </div>
      </article>
    );
  }

  if (layout === 'photo-center') {
    return (
      <article aria-label="Pré-visualização do modelo Foto central" className="h-full w-full bg-white px-5 py-3 text-center text-gray-700">
        <header className="mb-3 border-b-2 pb-2" style={{ borderColor: color }}>
          <img src={portraitUrl} alt="Retrato fictício de mulher negra no CV" className="mx-auto mb-1 h-12 w-12 rounded-full object-cover ring-2 ring-white shadow" />
          <h2 className="text-[12px] font-bold leading-tight text-gray-900">{profile.name}</h2>
          <p className="mt-1 text-[7px] font-medium" style={{ color }}>{profile.role}</p>
          <p className="mt-1 text-[5px] text-gray-500">{profile.email} · {profile.city}</p>
        </header>
        <Section title="Perfil profissional" color={color}><p className="text-[5px] leading-relaxed">Especialista em comunicação e gestão de projectos, focada em impacto e colaboração.</p></Section>
        <div className="grid grid-cols-[1.5fr_1fr] gap-3 text-left">
          <div><Section title="Experiência" color={color}><p className="text-[6px] font-semibold">{profile.detail}</p><p className="text-[5px] text-gray-500">2022 — Presente</p><TextLine /><TextLine width="86%" /></Section><Section title="Formação" color={color}><p className="text-[6px] font-semibold">Licenciatura em Comunicação</p><p className="text-[5px]">Luanda · 2020</p></Section></div>
          <aside className="border-l pl-2" style={{ borderColor: `${color}55` }}><Section title="Competências" color={color}><p className="text-[5px] leading-[1.8]">Comunicação<br />Planeamento<br />Liderança<br />Escrita</p></Section><Section title="Idiomas" color={color}><p className="text-[5px] leading-[1.8]">Português<br />Inglês</p></Section></aside>
        </div>
      </article>
    );
  }

  return (
    <article aria-label={`Pré-visualização do modelo ${layout}`} className="h-full w-full bg-white px-5 py-6 text-left text-gray-700">
      <header className="mb-3 border-b-2 pb-2" style={{ borderColor: color }}>
        <h2 className="text-[13px] font-bold leading-tight text-gray-900">{profile.name}</h2>
        <p className="mt-1 text-[7px] font-medium" style={{ color }}>{profile.role}</p>
        <p className="mt-1 text-[5px] text-gray-500">{profile.email} · {profile.city}</p>
      </header>
      <Section title={layout === 'simple' ? 'Objectivo profissional' : 'Resumo profissional'} color={color}><p className="text-[5px] leading-relaxed">Profissional organizado, com forte capacidade de comunicação e atenção ao detalhe.</p></Section>
      <Section title={profile.section} color={color}><p className="text-[6px] font-semibold">{profile.detail}</p><p className="mb-1 text-[5px] text-gray-500">Luanda · 2021 — Presente</p><TextLine /><TextLine width="90%" /><TextLine width="82%" /></Section>
      <Section title="Formação" color={color}><p className="text-[6px] font-semibold">Licenciatura em Gestão</p><p className="text-[5px]">Universidade Agostinho Neto · 2020</p></Section>
      <Section title="Competências" color={color}><p className="text-[5px]">Organização · Comunicação · Microsoft Office</p></Section>
    </article>
  );
}
