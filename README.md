# CVRápido

Gerador de currículos em React + Vite com preview em tempo real e exportação em PDF.

## Visão geral

O projeto permite:
- criar um CV em etapas guiadas
- preencher dados pessoais, resumo, experiência, formação, competências e idiomas
- visualizar o currículo em tempo real
- personalizar template e cores
- exportar o resultado em PDF

## Requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento

```bash
npm run dev -- --host 0.0.0.0
```

A app ficará disponível em:
- http://localhost:5173/

### Build de produção

```bash
npm run build
```

## Estrutura principal

```text
src/
  app/
    App.tsx
    components/
      LandingPage.tsx
      ResumeWizard.tsx
      ResumePreview.tsx
      forms/
    context/
      ResumeContext.tsx
    hooks/
      useResumeData.ts
    types/
      resume.ts
    utils/
      resumePdf.tsx
```

## Fluxo de uso

1. Acesse a landing page.
2. Escolha entre:
   - criar um CV em branco
   - usar um exemplo pronto
3. Preencha as etapas do wizard.
4. Personalize o template e as cores.
5. Exporte em PDF.

## Melhorias recentes

- adição de exemplo de CV pré-carregado
- botão para limpar o currículo e recomeçar
- melhora na responsividade do preview
- documentação de uso e configuração

## Resolução de problemas comuns

### O projeto não inicia

Confirme se as dependências do React foram instaladas corretamente:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Se o problema persistir, remova a pasta `node_modules` e reinstale:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Observações

Este projeto foi criado para facilitar a geração de currículos profissionais de forma rápida e visual, com foco em UX e simplicidade de uso.
