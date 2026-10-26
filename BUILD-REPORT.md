# Relatório de construção e verificação — MIND FORGE OMEGA ∞

Versão do projeto: 1.2.1  
Data: 26/10/2026

## Escopo desta versão

- Preservada a base visual e o núcleo do projeto 1.1.0; os novos recursos foram adicionados ao shell existente, sem reconstruir a aplicação do zero.
- 12 módulos de treinamento cognitivo com 269 desafios-base e uma 13ª Biblioteca OBMEP com 56 páginas de questões.
- Coleção OBMEP: 14 PDFs originais recebidos (missões 1–8 e 10–15), 56 imagens de páginas de questões e indicação explícita de que a missão 9 não foi fornecida.
- Os PDFs integrais agora acompanham cada cartão de questão e o fluxo de resolução; transcrições extraídas automaticamente continuam marcadas como potencialmente sujeitas a ruído.
- Quatro soluções OBMEP foram revisadas individualmente. Não se inventa gabarito comentado para as páginas restantes.
- Seção de estudo com oito tutoriais procedimentais, plano local de 7/30/90 dias, Sudoku com gerador de solução única, xadrez local/contra motor externo sob demanda, Torres de Hanói e raciocínio verbal.
- Auditorias Python para o catálogo OBMEP e referências estáticas; GitHub Actions chama os testes estruturais e de núcleo.

## Atualizações incrementais 1.2.1

- A Biblioteca OBMEP ganhou um simulado de quatro questões selecionadas sem repetição dentro da sessão e integrado ao motor de sessão já existente.
- A resolução de cada questão OBMEP agora usa uma folha estruturada com cinco campos: compreensão, estratégia, desenvolvimento, verificação e aprendizado extraído.
- Os campos são salvos automaticamente no estado da sessão local, recuperados ao restaurar uma sessão e mostrados após o registro. Para registrar a resposta, as quatro etapas centrais precisam estar preenchidas e o conjunto precisa conter ao menos 60 caracteres; o campo de aprendizado é opcional.
- O relatório do simulado deixa explícito que as questões discursivas não geram uma taxa de acerto automática quando não há gabarito revisado.
- Testes adicionais verificam a presença da folha estruturada, o botão conectado e a seleção de quatro IDs únicos.

## Verificações executadas nesta construção

Além da auditoria básica, a versão 1.2.1 introduz `scripts/core/obmep-workflow.js`, um helper puro de dados que é testado diretamente em Node: as quatro etapas centrais devem ser preenchidas, o conjunto deve ter pelo menos 60 caracteres e o quinto campo (aprendizado extraído) é opcional.

| Verificação | Resultado |
|---|---|
| Sintaxe de arquivos JavaScript em `scripts/` e `tools/` (`node --check`) | Aprovada |
| Auditoria estrita do banco exportado | Aprovada: 13 módulos, 325 questões, 0 alertas de comprimento, 0 prompts repetidos e 0 quase-duplicatas segundo as regras implementadas |
| Auditoria OBMEP | Aprovada: 56 registros, 14 missões presentes, missão 9 indicada como ausente, 56/56 imagens e 14/14 PDFs originais |
| Auditoria de assets estáticos | Aprovada: 27 referências HTML verificadas, 112 IDs sem duplicatas e worker Stockfish presente |
| Testes de núcleo | Aprovados: pontuação, persistência simulada, fila de revisão, diversidade adaptativa, referências de PDF, validação das cinco etapas OBMEP e seleção de quatro IDs únicos para o simulado |
| Gerador Sudoku | Aprovado: tabuleiros completos válidos e solução única nas três dificuldades testadas |
| HTTP smoke checks de assets essenciais | Aprovado: `index.html`, `scripts/core/obmep-workflow.js` e PDF da missão responderam HTTP 200 no servidor local; isso não substitui teste de interface end-to-end |
| Smoke test em navegador nesta execução | **Não concluído**: Chromium retornou `ERR_BLOCKED_BY_ADMINISTRATOR` tanto para `localhost` quanto para `file://`; por isso não afirmo que a nova interface foi verificada de ponta a ponta em navegador nesta execução |
| Motor Stockfish remoto | **Não verificado end-to-end nesta execução**; depende do navegador carregar `chess.js` e o Stockfish.js/WASM do CDN. O modo indica o requisito de internet e o limite da força nominal configurada |

## Repetir a auditoria

Na raiz do repositório, com Node.js e Python instalados:

```bash
find scripts tools \( -name '*.js' -o -name '*.cjs' \) -print0 | xargs -0 -n1 node --check
node tools/export-question-bank.cjs /tmp/mind-forge-bank.json
python tools/audit_questions.py /tmp/mind-forge-bank.json --strict
python tools/audit_obmep_catalog.py
python tools/audit_static_assets.py
node tools/run-tests.cjs
```

## Limites e integridade

- Testes estáticos e de núcleo reduzem riscos, mas não provam ausência absoluta de defeitos.
- A auditoria de similaridade exclui os prompts de metadados da OBMEP para não tratar rótulos como “Problema olímpico — missão X” como duplicatas; o catálogo é auditado por ID, imagem, PDF e cobertura de missões.
- A auditoria automática não substitui revisão matemática, bíblica, científica ou pedagógica humana.
- As atividades abertas são registradas com checklist de autoavaliação, sem nota semântica automática fingida.
- XP e níveis são indicadores internos, não teste de QI ou avaliação clínica.
- A hospedagem principal continua estática. Python é utilizado em desenvolvimento e GitHub Actions; GitHub Pages não o executa do lado do servidor.
- A aplicação ainda não foi publicada no repositório do usuário. O workflow de qualidade está incluído, mas precisa ser enviado ao GitHub junto com os arquivos.
- A coleção recebida contém 14 PDFs, não 15; a missão 9 está ausente. Quatro soluções foram revisadas individualmente.
