# MIND FORGE OMEGA ∞ — A Forja do Intelecto

Jogo web estático para prática de raciocínio lógico, atenção, memória, matemática, criatividade, pensamento crítico, interpretação, ciência, estratégia e estudo bíblico contextual. Feito com HTML5, CSS3 e JavaScript nativo, sem dependências obrigatórias, servidor próprio ou APIs externas.

> **Importante:** XP, níveis e estatísticas são indicadores internos de participação e desempenho nas atividades desta aplicação. Não são medidas científicas de inteligência, QI, diagnóstico ou avaliação clínica.

## O que está implementado

- Painel inicial, navegação responsiva e 12 laboratórios cognitivos com 269 desafios iniciais, além da Biblioteca OBMEP integrada como 13º módulo, com 56 páginas de questões originais.
- 124 conjuntos de alternativas revisados editorialmente, com respostas reescritas em alguns itens para reduzir pistas de comprimento; opções objetivas embaralhadas em cada sessão sem alterar o gabarito.
- Atenção e memória com variantes procedurais e diferentes famílias de tarefa, além de seleção adaptativa que evita questões recentemente vistas e intercala mecânicas quando o banco permite.
- Questões de múltipla escolha, resposta numérica, contagem de símbolos, memória de sequência e reflexões abertas com checklist de autoavaliação.
- Nove níveis internos de dificuldade, XP, recompensas e recomendações heurísticas baseadas no histórico recente.
- Sessões adaptativas, treino livre, desafio surpresa, revisão e campanha de cinco etapas interdisciplinares.
- Feedback explicativo após a tentativa, pistas progressivas, referências bíblicas em questões pertinentes e registro de erros.
- Fila de revisão com agendamento local simples, itens dominados e possibilidade de praticar um item isolado.
- Painel de evolução por módulo, histórico, métricas de tentativa/confiança/uso de pistas e conquistas.
- Persistência via `localStorage`, exportação e importação de backup JSON com validação de estrutura.
- Preferências de acessibilidade, suporte a teclado, foco visível, responsividade e respeito à preferência de movimento reduzido.
- Autotestes de integridade de módulos e questões no navegador e testes de núcleo executáveis com Node.js.

As atividades abertas são registradas para reflexão e autoavaliação; a aplicação não finge julgar automaticamente a qualidade de respostas discursivas. O motor adaptativo é uma heurística de jogo documentada no código, não um método psicométrico validado.

## Estrutura

```text
mind-forge-omega/
├── index.html
├── styles/
│   ├── main.css
│   └── responsive.css
├── data/
│   └── obmep/
│       ├── questions.json
│       └── questions.js
├── assets/obmep/
│   ├── 56 páginas originais de questões em JPG
│   └── originals/ (14 PDFs originais, missões 1–8 e 10–15)
├── styles/
│   └── learning-tools.css
├── scripts/
│   ├── app.js
│   ├── core/
│   │   ├── storage.js
│   │   ├── progression.js
│   │   ├── adaptive-engine.js
│   │   ├── review-system.js
│   │   └── module-registry.js
│   ├── modules/
│   │   ├── logic.js
│   │   ├── attention.js
│   │   ├── memory.js
│   │   ├── creativity.js
│   │   ├── mathematics.js
│   │   ├── critical-thinking.js
│   │   ├── bible.js
│   │   ├── science.js
│   │   ├── language.js
│   │   ├── strategy.js
│   │   ├── interdisciplinary.js
│   │   └── metacognition.js
│   ├── games/
│   │   ├── sudoku-engine.js
│   │   └── stockfish-loader.js
│   ├── extensions/
│   │   └── learning-hub.js
│   └── tests/
│       └── self-tests.js
├── tools/
│   ├── export-question-bank.cjs
│   ├── audit_questions.py
│   ├── audit_obmep_catalog.py
│   ├── audit_static_assets.py
│   └── run-tests.cjs
├── .github/workflows/
│   └── quality-check.yml
├── tests/
│   └── test-plan.md
├── .nojekyll
├── LICENSE
└── .gitignore
```

## Executar localmente

1. Extraia o arquivo ZIP.
2. Abra um terminal na pasta `mind-forge-omega`.
3. Execute um servidor estático local:

   ```bash
   python -m http.server 8000
   ```

4. Abra `http://localhost:8000` em um navegador moderno.

Não é necessário instalar pacotes para executar o jogo. Servir a pasta por HTTP é recomendado para que o comportamento do armazenamento local seja mais previsível que a abertura direta por `file://`. Python neste comando é só um servidor local simples; não é dependência de execução do jogo publicado.

## Executar o autoteste

Abra `http://localhost:8000/?test=1`. A página mostra um painel com a quantidade de módulos e questões, IDs duplicados, estrutura de questões inválidas e conferência das sequências geradas de atenção e memória.

Também é possível abrir o console do navegador e executar:

```javascript
MindForge.Tests.run()
```

O retorno contém `ok`, `failures`, `moduleCount` e `questionCount`.


## Qualidade do banco e testes automatizados

O repositório inclui ferramentas independentes para detectar falhas estruturais antes da publicação:

- `tools/export-question-bank.cjs` carrega os módulos e exporta o banco efetivo, incluindo as revisões editoriais de alternativas.
- `tools/audit_questions.py` verifica IDs duplicados, tipos e níveis inválidos, alternativas objetivas repetidas ou incompletas, coerência de respostas de memória, perguntas repetidas e indícios de desequilíbrio nas alternativas. O módulo OBMEP é excluído da comparação de similaridade de `prompt` porque seus prompts são rótulos curtos de página, não o texto integral da questão; seus IDs, imagens e PDFs são validados separadamente. É uma auditoria estrutural/heurística, não um avaliador automático definitivo de qualidade pedagógica.
- `tools/audit_obmep_catalog.py` confirma a cobertura das missões fornecidas, as imagens e a presença dos PDFs originais.
- `tools/audit_static_assets.py` verifica as referências locais de script/estilo no HTML de entrada, IDs HTML duplicados e o worker de Stockfish.
- `tools/run-tests.cjs` executa os autotestes de questões, referências dos PDFs originais da OBMEP, amostragem de variantes geradas, embaralhamento do gabarito e fluxos do núcleo como pontuação, persistência, revisão e seleção adaptativa.
- `.github/workflows/quality-check.yml` executa a verificação de sintaxe, auditoria e testes no GitHub Actions ao enviar alterações para `main`/`master`, abrir um pull request ou disparar o fluxo manualmente.

Para executar tudo localmente, na raiz do repositório:

```bash
node tools/export-question-bank.cjs .question-bank.audit.json
python tools/audit_questions.py .question-bank.audit.json --strict
node tools/run-tests.cjs
```

É necessário ter Node.js e Python instalados **apenas para executar as ferramentas de desenvolvimento**. O site publicado não precisa de Python para funcionar; continua sendo HTML, CSS e JavaScript estáticos. O GitHub Pages não executa Python do lado do servidor, mas o GitHub Actions pode executar este auditor durante o controle de qualidade. Consulte a [documentação oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

A interface embaralha as alternativas preservando o gabarito, reduzindo padrões de posição da resposta correta. A seleção adaptativa evita IDs vistos recentemente quando há banco suficiente e intercala famílias de tarefa. Algumas tarefas procedurais de atenção e memória geram variantes em cada sessão. A geração aleatória reduz a repetição mecânica, mas não substitui a revisão e expansão contínua do conteúdo.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie o conteúdo desta pasta para a raiz do repositório.
2. Abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Selecione a branch principal e a pasta `/ (root)`; salve.
5. Acesse a URL publicada que o GitHub Pages indicar.

É um site estático: não exige build nem backend. Se editar a organização das pastas, atualize também os caminhos de scripts e estilos em `index.html`.

## Como acrescentar questões

Cada arquivo em `scripts/modules/` registra um módulo usando `MindForge.registerModule`. Uma questão pode ter os seguintes campos:

- `id`: identificador estável e exclusivo;
- `moduleId`: o ID do módulo registrado;
- `type`: `choice`, `number`, `count`, `memory`, `text` ou `open`;
- `level`: número inteiro de 1 a 9;
- `prompt`: enunciado;
- `options` e `answer`: para `choice`, `answer` é o índice da opção correta (começando em zero);
- `answer`: valor numérico para `number` e `count`; texto normalizado para `text`; sequência de símbolos para `memory`;
- `explanation`: justificativa apresentada depois da tentativa;
- `hints`: array opcional de pistas progressivas;
- `tags`: habilidades trabalhadas;
- `reference`: referência textual ou bíblica, quando relevante;
- `criteria`: critérios de autoavaliação em atividades abertas.

Depois de adicionar uma questão, abra `?test=1`, resolva-a manualmente e confirme a explicação e o resultado. O autoteste valida a estrutura e algumas regras geradas, mas não substitui uma revisão editorial do conteúdo.

## Persistência, backup e privacidade

O progresso é guardado no armazenamento local do navegador. Não é enviado a um servidor; por isso, não é sincronizado automaticamente entre dispositivos ou navegadores. Limpar os dados do navegador pode apagar o progresso. Use **Evolução → Exportar progresso** para obter um backup JSON e **Importar backup** para restaurá-lo.

## Conteúdo bíblico e precisão

O módulo bíblico inclui questões textuais e contextuais com referências específicas. As questões de conhecimento textual têm gabaritos objetivos; quando há interpretação, o feedback identifica o foco e ressalta que a conclusão precisa ser limitada pelo texto. O banco inicial não substitui comentário acadêmico, estudo de idiomas originais, pesquisa histórica ou consulta a fontes especializadas. Caso o projeto seja ampliado com conteúdo externo, registre as fontes e revise os direitos autorais das traduções utilizadas.

## Limitações conhecidas

- O progresso é local, sem login, sincronização ou ranking online.
- A geração adaptativa utiliza regras heurísticas transparentes, não uma avaliação cognitiva validada cientificamente.
- O temporizador foi deliberadamente omitido da experiência base; o treino prioriza ritmo livre e exatidão.
- Questões discursivas não recebem avaliação automática: são registradas, pontuadas por conclusão da atividade e acompanhadas de checklist para autoavaliação.
- O banco inicial é expansível e substancial para começar, mas uma versão educacional institucional exigiria revisão especializada, teste com usuários, mais conteúdo validado e auditoria de acessibilidade.

## Licença

Distribuído sob a licença MIT; consulte `LICENSE`.


## Versão 1.2.1 — Simulado e resolução estruturada OBMEP

- A Biblioteca OBMEP oferece um simulado de quatro questões com seleção única por questão.
- Cada questão discursiva permite registrar compreensão, estratégia, desenvolvimento, verificação e aprendizado extraído, salvando os campos na sessão local.
- O relatório não converte respostas abertas em uma taxa de acerto sem gabarito verificável.

## Versão 1.2.0 — Biblioteca OBMEP, estudo e jogos

Esta versão preserva a aplicação 1.1.0 e adiciona páginas ao mesmo shell visual: Biblioteca OBMEP, Estudo inteligente, Plano de treino e Jogos intelectuais.

### Biblioteca OBMEP

- O ZIP recebido contém **14 PDFs de missões**: 1–8 e 10–15. O arquivo da missão 9 não foi enviado.
- As 14 missões possuem quatro páginas de questão cada, totalizando **56 páginas de questões**. Cada página original foi preservada como imagem local, e os **14 PDFs originais** estão em `assets/obmep/originals/` e podem ser abertos na biblioteca. A transcrição é extraída automaticamente e pode conter ruídos, sobretudo em símbolos matemáticos.
- Os metadados não confirmados permanecem nulos ou explicitamente desconhecidos. A página da fonte original deve ser tratada como referência principal.
- Apenas quatro soluções foram revisadas manualmente com base no texto legível. Os PDFs não fornecem um gabarito comentado completo; a plataforma registra as demais resoluções discursivas e apresenta pistas metodológicas genéricas, sem fingir correção automática.
- Cada cartão oferece a página da questão e o PDF integral da missão, quando disponível. Use `tools/audit_obmep_catalog.py` para verificar 56 IDs, metadados, 56 imagens e 14 PDFs originais.
- A versão 1.2.1 adiciona um simulado de quatro questões e uma folha estruturada testável (`scripts/core/obmep-workflow.js`) para compreensão, estratégia, desenvolvimento, verificação e aprendizado extraído.

### Estudo e planejamento

- Oito tutoriais procedimentais abordam recuperação ativa, espaçamento, resolução de problemas, caderno de erros, prática intercalada, foco, autoexplicação e calibração de confiança. As técnicas de recuperação e prática distribuída incluem links para referências acadêmicas.
- O plano local personaliza minutos diários, horizonte de 7/30/90 dias, nível declarado e até três prioridades. É um roteiro de prática, não uma promessa de resultados. O progresso do plano é salvo no navegador e pode ser exportado como texto.

### Jogos intelectuais

- **Sudoku:** gerador de tabuleiros com solução única testada em níveis iniciante, intermediário e avançado; controle por toque e teclado, candidatos, verificação de conflitos, reinício e dica de uma célula.
- **Xadrez:** tabuleiro local de duas pessoas e modo contra motor. Usa `chess.js` (regras e legalidade) e carrega Stockfish.js lite sob demanda de CDN no modo computador. Requer conexão e acesso ao CDN para carregar a biblioteca/motor. A opção UCI `UCI_Elo=1500` é um ajuste nominal, não certifica que a versão lite tenha rating calibrado de 1500. A promoção de peão na interface atual usa rainha automaticamente. Multiplayer entre dispositivos não está implementado, pois requer infraestrutura de sincronização/servidor.
- **Torres de Hanói:** regras de movimento, validação de colocação, reinício, contagem e mínimo teórico.
- **Raciocínio verbal:** questões para avaliar inferências e argumentos, com feedback pós-resposta.

### Testes

Execute na raiz do repositório:

```bash
node tools/export-question-bank.cjs /tmp/mind-forge-bank.json
python tools/audit_questions.py /tmp/mind-forge-bank.json --strict
python tools/audit_obmep_catalog.py
python tools/audit_static_assets.py
node tools/run-tests.cjs
```

O workflow do GitHub Actions executa sintaxe JavaScript, auditoria do banco, validação do catálogo OBMEP e seus PDFs, verificação de referências locais/IDs HTML e testes do núcleo/Sudoku. Para validar o motor Stockfish em uma sessão real, abra `Jogos intelectuais → Xadrez → Contra computador` em navegador com internet; testes estáticos não comprovam a disponibilidade futura de um CDN.

#
### Direitos dos documentos OBMEP fornecidos

Os PDFs das missões foram fornecidos pelo usuário e são preservados com os nomes de missão normalizados para uso dentro deste projeto. A inclusão no ZIP de trabalho não declara que o projeto seja titular dos direitos desses materiais. Antes de tornar o repositório público, confirme as condições de redistribuição da coleção original e preserve a atribuição indicada nos próprios documentos.

## Dependências externas sob demanda

- `chess.js` 1.4.0 via jsDelivr ESM, licença BSD-2-Clause: https://www.jsdelivr.com/package/npm/chess.js
- Stockfish.js 19.0.1 lite single-threaded via jsDelivr, licença GPL-3.0: https://www.jsdelivr.com/package/npm/stockfish

Essas duas dependências não são incorporadas ao arquivo portátil nem empacotadas localmente; o modo de xadrez precisa de internet. O restante do jogo continua estático e o Python só é utilizado nas ferramentas de auditoria/teste e no servidor local de desenvolvimento.
