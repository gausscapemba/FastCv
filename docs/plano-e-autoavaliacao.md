# Plano de implementação e autoavaliação

## Princípios

- Manter o processamento local enquanto não houver necessidade de contas ou sincronização.
- Não prometer aprovação por ATS; apresentar apenas verificações de legibilidade e estrutura.
- Separar conteúdo do CV, preferências visuais e armazenamento.
- Validar dados importados antes de os colocar no estado da aplicação.
- Não introduzir dependências ou backend sem uma necessidade funcional concreta.

## Fase 1 — implementada

- [x] Persistência local do CV e das preferências.
- [x] Revisão automática com avisos accionáveis.
- [x] Modo ATS explícito.
- [x] Exportação e importação de backup JSON.
- [x] Documentação das limitações da revisão.

## Fase 2 — implementada

- [x] Guardar, restaurar e remover versões nomeadas do CV.
- [x] Analisar termos de uma descrição de vaga localmente.
- [x] Guardar uma cópia para uma candidatura específica.
- [ ] Importação de texto/PDF com revisão manual.
- [ ] Exportação DOCX, se a qualidade do resultado puder ser validada.

## Autoavaliação

Antes de cada entrega, confirmar:

1. O build e o type-check terminam sem erros.
2. O CV exemplar continua completo.
3. Dados inválidos não substituem o CV actual.
4. A exportação mantém texto real e todas as secções activadas.
5. A interface explica limites, privacidade e ATS sem afirmações absolutas.
