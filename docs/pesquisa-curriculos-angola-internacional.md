# Síntese de investigação: elaboração de currículos

**Data:** 23 de setembro de 2026  
**Âmbito:** boas práticas de currículo, triagem digital, recrutamento e adaptação para Angola e candidaturas internacionais.

## Critério de filtragem

Foram privilegiados artigos académicos, estudos experimentais, frameworks de órgãos públicos e orientações de entidades profissionais de Recursos Humanos. Foram excluídas afirmações de blogs comerciais sem método, amostra ou fonte verificável. Depoimentos isolados de recrutadores foram tratados como contexto, não como evidência universal.

## Conclusão principal

Não existe um formato universal de CV nem uma pontuação ATS padronizada. A interpretação depende do anúncio, do sistema usado, do recrutador, da profissão, do país e da qualidade dos dados. O produto deve gerar documentos simples, pesquisáveis e adaptáveis, sem prometer aprovação automática ou contratação.

## Evidência selecionada

### Viés na triagem humana

Bertrand e Mullainathan publicaram um experimento de campo com currículos fictícios enviados a anúncios reais em Boston e Chicago. Nomes percebidos como brancos receberam aproximadamente 50% mais convites para entrevista do que nomes percebidos como afro-americanos, mantendo o conteúdo comparável.

**Aplicação:** o CVRápido não apresenta a triagem como neutra. Dados pessoais desnecessários devem ser opcionais, e o produto não deve inferir raça, género, idade, nacionalidade ou personalidade.

Fonte: [American Economic Association](https://www.aeaweb.org/articles?id=10.1257/0002828042002561)

### Risco de viés algorítmico

Raghavan, Barocas, Kleinberg e Levy analisaram sistemas de contratação algorítmica e mostraram que o viés pode surgir dos dados, do objetivo do modelo e da sua validação.

**Aplicação:** qualquer futuro “match score” deve significar apenas cobertura de requisitos declarados, mostrar a origem dos termos e permitir revisão humana. Nunca deve ser apresentado como probabilidade de contratação.

Fontes: [arXiv](https://arxiv.org/abs/1906.09208) · [ACM](https://doi.org/10.1145/3351095.3372828)

### Informação biográfica e resultados

Brown e Campion estudaram a perceção e o uso de informação biográfica por recrutadores durante a triagem.

**Aplicação:** experiências devem ser estruturadas com cargo, organização, período, contexto, ferramentas e resultados verificáveis, em vez de apenas listas de responsabilidades vagas.

Fonte: [Journal of Applied Psychology](https://doi.org/10.1037/0021-9010.79.6.897)

### Transparência e risco

O [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) recomenda avaliar validade, transparência, privacidade, segurança e equidade em sistemas com IA.

**Aplicação:** o produto deve explicar limitações, não recolher dados desnecessários e permitir revisão antes de qualquer sugestão ser incluída no CV.

### Recrutamento começa pelos critérios da função

O [CIPD](https://www.cipd.org/en/knowledge/factsheets/recruitment-factsheet/) recomenda definir a função, competências e critérios de seleção antes da triagem.

**Aplicação:** futuras sugestões devem partir do anúncio e dos critérios da vaga, não de palavras-chave genéricas.

### Limitação da evidência de NLP

Kadam et al. descrevem um portal técnico de triagem com NLP para extrair competências, educação e experiência. É uma demonstração de viabilidade técnica, não prova de validade universal nem de redução de discriminação.

Fonte: [Kadam et al.](https://doi.org/10.1007/978-981-16-6460-1_1)

## Afirmações excluídas

Não foi encontrada evidência suficiente para afirmar que todos os ATS rejeitam colunas, que um CV deve ter exatamente uma página, que uma fonte garante aprovação, que palavras-chave ocultas funcionam, que existe uma percentagem ATS universal ou que PDF é sempre pior/melhor que DOCX.

## Angola e mercado internacional

A investigação experimental encontrada sobre discriminação é principalmente norte-americana e não deve ser generalizada automaticamente para Angola. Não foi localizada uma pesquisa angolana pública e robusta que meça a adoção de ATS pelos empregadores, nem uma pesquisa representativa sobre fotografia, referências, BI ou Europass.

Contexto verificável:

- [INEFOP](https://www.inefop.gov.ao/) — emprego e formação profissional em Angola.
- [Jobartis](https://www.jobartis.com/) — plataforma privada de emprego em Angola.
- [Banco Mundial — Angola](https://data.worldbank.org/country/angola) — contexto macroeconómico, não regras de CV.

## Aplicação no produto

1. Manter português como idioma principal, com possibilidade futura de inglês e francês.
2. Suportar graus, instituições, cursos profissionais, certificações e equivalências.
3. Manter contactos, referências e morada como campos opcionais.
4. Oferecer perfis local e internacional sem declarar que um é universalmente superior.
5. Usar templates lineares, títulos textuais, ordem cronológica inversa e texto pesquisável.
6. Aceitar métricas fornecidas pelo utilizador, sem inventar resultados.
7. Tornar fotografia, idade, estado civil, BI e outros dados sensíveis opcionais e desaconselhados por padrão.
8. Manter PDF pesquisável e avaliar DOCX numa fase posterior.

## Alterações aplicadas

- PDF gerado com texto real através de `@react-pdf/renderer`.
- Preview e PDF respeitam template, cor e secções.
- Exportação deixou de ser uma captura rasterizada.
- Exemplos usam contexto de Luanda e contacto angolano.
- Experiência e formação usam mês e ano estruturados.
- README e personalização deixam explícito que texto pesquisável não garante aceitação por ATS.

## Próximas melhorias recomendadas

1. Revisão de qualidade para campos vazios, datas incoerentes, links e ordem cronológica, sem pontuação de contratação.
2. Exportação DOCX.
3. Importação de anúncio com correspondências explícitas, distinguindo termos do anúncio de competências declaradas.
4. Avisos de privacidade antes de incluir dados sensíveis.
5. Testes de ordem de leitura com extratores de texto e leitores de ecrã.

## Limitações

Esta síntese não é aconselhamento jurídico, promessa de empregabilidade ou descrição estatística do mercado angolano. A ausência de estudos locais acessíveis é uma lacuna de investigação, não prova de que determinada prática não exista.
