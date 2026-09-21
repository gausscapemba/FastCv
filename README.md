# CVRápido

Gerador de currículos em React + Vite com preview em tempo real e exportação em PDF.

O exemplo incluído usa dados de demonstração de Luanda, Angola. Substitua todos
os dados antes de exportar um CV para uso real.

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
- Git (opcional, para versionamento)

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

O build é gerado na pasta `dist/`.

## Versionamento e GitHub

Para preparar este projeto num repositório Git:

```bash
git init
git branch -M main
git remote add origin https://github.com/gausscapemba/FastCv.git
git add .
git commit -m "Initial project upload"
git push -u origin main
```

O GitHub não aceita a password normal em operações HTTPS. Antes do `push`,
autentique-se com o GitHub CLI:

```bash
gh auth login
```

Escolha `GitHub.com`, `HTTPS` e autenticação pelo browser. Em alternativa,
use um Personal Access Token com permissão de escrita no repositório.

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

Em ecrãs pequenos, o preview é ocultado para dar prioridade ao formulário.
Em laptops, o wizard mantém o preview ao lado das etapas.

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

Se o problema persistir no Windows PowerShell, remova as dependências e
reinstale:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Se aparecer `Cannot find type definition file for 'vite/client'`, confirme
que as dependências foram instaladas novamente e reinicie o TypeScript Server
no VS Code (`TypeScript: Restart TS Server`).

### O `git push` falha por autenticação

Verifique o utilizador autenticado e confirme que ele tem acesso de escrita a
`gausscapemba/FastCv`. A branch principal deste projeto é `main`.

## Observações

Este projeto foi criado para facilitar a geração de currículos profissionais de forma rápida e visual, com foco em UX e simplicidade de uso.
