# CVRápido

Gerador de currículos em React + Vite com preview em tempo real e exportação em PDF pesquisável.

O exemplo incluído usa dados de demonstração de Luanda, Angola. Substitua todos
os dados antes de exportar um CV para uso real.

## Visão geral

O projeto permite:
- criar um CV em etapas guiadas
- começar com um CV vazio, um exemplo demonstrativo ou um de seis modelos prontos
- preencher dados pessoais, resumo, experiência, formação, competências, idiomas, certificações, projectos e cursos complementares
- visualizar o currículo em tempo real
- personalizar o modelo, a cor principal e as secções visíveis
- activar um modo ATS simplificado e rever alertas locais de completude antes da exportação
- analisar lexicalmente uma descrição de vaga e guardar versões específicas para candidaturas
- guardar automaticamente os dados no navegador e criar/importar backups JSON
- exportar o resultado em PDF

A análise e a revisão são auxiliares: não atribuem uma pontuação ATS nem garantem
a aceitação do currículo por plataformas de recrutamento.

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
      ResumeTemplateCardPreview.tsx
      forms/
      ui/
    context/
      ResumeContext.tsx
    hooks/
      useResumeData.ts
    types/
      resume.ts
    utils/
      jobMatch.ts
      resumeReview.ts
      resumeStorage.ts
      resumeVersions.ts
      resumePdf.tsx
```

## Fluxo de uso

1. Acesse a landing page.
2. Escolha entre:
   - criar um CV em branco
   - carregar um exemplo demonstrativo
   - começar com um dos seis modelos prontos
3. Preencha as etapas do wizard.
4. Personalize o modelo, a cor e as secções visíveis; reveja os alertas.
5. Exporte em PDF.

Na área de análise, importe um backup JSON ou use o CV completo guardado neste
navegador. A comparação com uma vaga é lexical, corre localmente e não altera
automaticamente o currículo.

Em ecrãs pequenos, o preview é ocultado para dar prioridade ao formulário.
Em laptops, o wizard mantém o preview ao lado das etapas.
O PDF é gerado com texto real, permitindo pesquisa, seleção e extração por
ferramentas de recrutamento. Isso não representa uma garantia de aceitação por
qualquer ATS; a interpretação depende da plataforma e do anúncio.

O currículo e as versões ficam guardados no `localStorage` do navegador. O
projecto não implementa sincronização nem um backend para guardar os dados. Faça
um backup JSON antes de limpar os dados do navegador; o ficheiro contém dados
pessoais e não é protegido por palavra-passe.

## Investigação sobre currículos

A síntese das fontes académicas, técnicas e profissionais usadas para orientar
o produto está em
[docs/pesquisa-curriculos-angola-internacional.md](./docs/pesquisa-curriculos-angola-internacional.md).

Também está disponível a análise comparativa individual das plataformas de criação de CV:
[docs/analise-comparativa-plataformas-cv-2026-09.md](./docs/analise-comparativa-plataformas-cv-2026-09.md).

A documentação actualizada do produto, manual de uso, casos de uso, arquitectura
e informações técnicas está disponível em
[docs/documentacao-projecto.md](./docs/documentacao-projecto.md).

Para aprender React a partir de experiência com Vue, consulte o
[guia de estudos React para Vue](./docs/guia-estudos-react-para-vue.md), que
usa os componentes reais deste projecto como exemplos. Está disponível também
em [PDF para leitura offline](./docs/guia-estudos-react-para-vue.pdf).

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
# CVRápido
