# Identidade visual do CVRápido

Este documento define a linguagem visual da aplicação para desktop e mobile.
Serve de referência para novas páginas e componentes; a interface não deve
parecer um conjunto de cartões genéricos nem uma landing page de produto
montada a partir de padrões sem relação com currículos.

## Ideia da marca

**CVRápido** ajuda uma pessoa a organizar a sua história profissional e a
transformá-la num documento pronto para usar. A identidade deve sugerir clareza,
confiança, ritmo e cuidado editorial — não automação impessoal.

O elemento de marca é uma folha/currículo com uma linha de percurso ascendente.
O desenho da marca é próprio da aplicação e não deve ser substituído por um
ícone de biblioteca. A marca pode aparecer junto ao wordmark **CVRápido**;
outros ícones da interface usam a biblioteca definida abaixo.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| Floresta | `#174A3B` | Marca, acções principais e títulos destacados |
| Folha | `#27634F` | Estados activos, links e acções secundárias |
| Lima | `#D8F279` | Acento pontual, realces e pequenos indicadores |
| Papel | `#F7F5EF` | Fundo principal da aplicação |
| Tinta | `#17231E` | Texto principal em fundo claro |
| Pedra | `#626A64` | Texto secundário |
| Linha | `#DDDCD3` | Divisores e limites subtis |
| Branco | `#FFFFFF` | Superfícies de leitura e documentos |
| Barro | `#C96E50` | Acento raro para estados editoriais, nunca para a acção primária |

Usar o verde como sinal da marca, não como fundo de todos os elementos. Lima e
barro são acentos pequenos; não competir com a cor dos currículos apresentados.
Texto e controlos devem manter contraste suficiente com o fundo.

## Tipografia

### Famílias

- **Manrope Variable** (`@fontsource-variable/manrope`): corpo, navegação,
  botões, formulários, cartões e interface.
- **DM Serif Display** (`@fontsource/dm-serif-display`): títulos editoriais de
  destaque, principalmente o título principal da página inicial.
- Fallbacks: `Arial`, `sans-serif` para Manrope; `Georgia`, `serif` para DM
  Serif Display.

Os ficheiros são servidos localmente pelo build, sem depender de um pedido a um
serviço de fontes externo. O CV exportado é um documento à parte: a tipografia
de marketing não altera automaticamente os modelos nem a fonte do PDF.

### Escala recomendada

| Elemento | Desktop | Mobile | Peso / entrelinha |
|---|---:|---:|---|
| Título principal (`h1`) | 56–68 px | 38–44 px | DM Serif Display, 1.04–1.12 |
| Título de secção (`h2`) | 32–40 px | 26–32 px | Manrope 650–700, 1.15–1.25 |
| Título de cartão (`h3`) | 18–22 px | 17–20 px | Manrope 600–700, 1.25–1.35 |
| Corpo de destaque | 18–20 px | 16–18 px | Manrope 400–500, 1.55–1.7 |
| Corpo padrão | 15–16 px | 15–16 px | Manrope 400, 1.5–1.65 |
| Rótulo / metadado | 12–14 px | 12–14 px | Manrope 500–600, 1.35–1.5 |

Não aplicar maiúsculas, tracking largo ou fonte serifada a parágrafos longos.
Títulos longos devem manter uma largura confortável e quebrar naturalmente;
não forçar uma quebra fixa apenas para imitar outro ecrã.

## Orientação, alinhamento e justificação

- O texto corrido fica **alinhado à esquerda** (`text-align: left`), inclusive
  em cartões. Não usar alinhamento justificado: os espaços irregulares
  prejudicam leitura em colunas estreitas e em ecrãs pequenos.
- O título principal e a sua descrição ficam alinhados à esquerda em desktop.
  Em mobile podem ser centrados quando isso melhorar o equilíbrio do hero; os
  botões e o bloco de benefícios acompanham a mesma orientação nesse breakpoint.
- Cabeçalhos de secção podem ser centrados quando introduzem uma sequência
  numerada. O conteúdo dos passos permanece alinhado à esquerda.
- Navegação e rótulos curtos seguem a direcção natural do idioma, sem
  justificação.
- Currículos de pré-visualização mantêm a composição original de cada modelo;
  a landing page não deve impor alinhamento global ao documento em miniatura.

Preferir larguras de linha controladas (cerca de 55–70 caracteres para parágrafos
de leitura) a justificar o texto para preencher a coluna.

## Grelha e espaçamento

Usar a escala base de 4 px do Tailwind:

| Token de composição | Valor | Uso típico |
|---|---:|---|
| `space-1` | 4 px | Ajuste óptico entre ícone e rótulo |
| `space-2` | 8 px | Elementos do mesmo controlo |
| `space-3` | 12 px | Grupos compactos |
| `space-4` | 16 px | Ritmo base entre campos e conteúdo |
| `space-6` | 24 px | Separação entre blocos relacionados |
| `space-8` | 32 px | Respiro interno de cartões |
| `space-12` | 48 px | Distância entre secções próximas |
| `space-16` | 64 px | Separação principal entre secções |
| `space-20` | 80 px | Respiro vertical de destaque em desktop |

- Container principal: máximo de 1200–1280 px, centrado; 20–24 px de margem
  lateral em mobile e 32–48 px em desktop largo.
- Grelha: 12 colunas conceptuais em desktop; uma coluna em mobile; gutters de
  16–24 px.
- Secções: 56–80 px de distância vertical em desktop e 40–56 px em mobile.
- Superfícies: raio de 8–12 px em controlos; 16–24 px em painéis principais.
  Evitar arredondar tudo por igual.
- Divisores finos e fundos subtis devem estruturar as áreas antes de adicionar
  sombras. Usar sombras apenas para indicar elevação real, como o papel em
  pré-visualização.

## Ícones

- Biblioteca para a página inicial e novos elementos desta identidade:
  **Phosphor Icons for React**, pacote `@phosphor-icons/react`. Os componentes
  existentes noutras áreas ainda podem usar Lucide; não misturar as duas
  famílias numa mesma página ou num mesmo grupo visual.
- Usar a mesma família, normalmente `weight="regular"` para navegação e
  `weight="duotone"` para realces; não misturar bibliotecas no mesmo fluxo.
- Tamanhos padrão: 16 px em texto auxiliar, 20 px em botões/navegação, 24 px em
  realces.
- Ícones acompanham um rótulo ou contexto acessível. Um ícone sem texto precisa
  de `aria-label` no controlo que o contém.
- Não usar ícones como decoração repetitiva nem para substituir títulos e
  texto. A marca gráfica do CVRápido é própria, não é um ícone genérico.

## Componentes da página inicial

### Cabeçalho

Wordmark e marca própria à esquerda; links essenciais e uma única acção de
criação à direita. Altura compacta, fundo de papel/branco e divisor subtil.
Em mobile, manter o wordmark e as navegações prioritárias sem provocar scroll
horizontal.

### Hero

Composição editorial assimétrica: mensagem e acção principal numa coluna;
pré-visualização de uma página de CV na outra. A folha de CV é o elemento
visual principal e específico do produto. Evitar dashboards, ilustrações
abstratas, métricas não verificadas, badges decorativos em excesso ou pilhas de
cartões sem conteúdo.

Em mobile, empilhar primeiro mensagem e acções, depois a folha de CV. Reduzir o
título fluido e a pré-visualização sem cortar texto, cobrir botões ou aumentar a
largura do viewport.

### Como funciona

Apresentar três passos em sequência com numeração e divisor/linha de percurso,
em vez de repetir o mesmo cartão com ícone para cada passo. No mobile, a
sequência pode empilhar e preservar claramente a ordem.

### Modelos

Mostrar as pré-visualizações dos modelos numa grelha responsiva; os nomes
internos permanecem disponíveis em rótulos acessíveis, sem texto visível sobre
a folha se o desenho estiver a privilegiar a pré-visualização. Manter a acção
de selecção evidente. A grelha é três colunas em ecrãs largos, duas em tablet e
uma em mobile estreito.

### Serviços

Dar prioridade a uma tarefa principal por ecrã. Na página inicial, criação e
modelos são o caminho principal; não repetir a acção de criação em vários
blocos nem listar todas as funcionalidades de uma vez. Serviços secundários
devem surgir quando forem relevantes para a tarefa, não como uma chamada
adicional no fim da página inicial.

## Responsividade e acessibilidade

- Breakpoints Tailwind usados pela aplicação: `sm` 640 px, `md` 768 px,
  `lg` 1024 px e `xl` 1280 px.
- Mobile-first: estilos base para uma coluna; activar colunas e maior respiro
  apenas quando houver largura real para o conteúdo.
- Validar pelo menos a 375 px, 768 px, 1024 px e 1440 px. Não pode existir
  scroll horizontal acidental.
- Botões e alvos tácteis devem ter pelo menos 44 × 44 px sempre que possível.
- Preservar foco de teclado visível, ordem de tabulação lógica, `aria-label`
  para controlos sem texto e nomes semânticos para secções.
- Não depender apenas da cor para comunicar estado.
- Respeitar preferência de movimento reduzido ao adicionar animações.

## Implementação

- Fontes carregadas localmente em `src/styles/fonts.css`.
- Página inicial em `src/app/components/LandingPage.tsx`.
- As páginas internas mantêm o fundo Papel, superfícies brancas, acções
  Floresta e os mesmos tokens e tipografia da página inicial. Cabeçalhos usam
  a mesma marca gráfica.
- A cor predefinida e as opções de personalização do currículo usam tons da
  marca sem uniformizar as pré-visualizações: cada modelo mantém a sua própria
  apresentação e continua configurável.
- Pré-visualização dos cartões de modelos em
  `src/app/components/ResumeTemplateCardPreview.tsx`.
- Dependências de fontes e ícones em `package.json`.

Ao alterar o sistema visual, rever desktop e mobile no navegador e executar
`npm run build`. Mudanças de identidade devem também actualizar este documento.
