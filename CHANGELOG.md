# Histórico de alterações

## 1.1.0 — Diversidade e auditoria de qualidade

- Embaralhamento de alternativas com remapeamento do gabarito para reduzir viés de posição.
- Revisão editorial de 124 conjuntos de distratores, com ajustes de comprimento e proximidade conceitual em questões selecionadas.
- Variantes procedurais para contagem visual, detecção de pares adjacentes, localização de símbolos e cinco modos de transformação de memória.
- Seleção adaptativa com exclusão de IDs vistos recentemente quando o banco tem alternativas suficientes e intercalação de famílias de tarefa.
- Correção da recuperação da resposta esperada em desafios de memória transformada.
- Auditoria Python de estrutura e sinais editoriais; testes de núcleo em Node.js.
- Fluxo GitHub Actions para sintaxe, auditoria estrita e testes ao enviar mudanças ou abrir pull requests.
- `.nojekyll` para publicar a pasta estática sem processamento Jekyll padrão.

A auditoria automática é um filtro de qualidade; ela não comprova a excelência pedagógica de todos os itens, não valida sozinha interpretações teológicas e não substitui revisão humana ou testes com usuários.


## 1.2.0 — 2026-10-26

- Adicionada a Biblioteca OBMEP com 56 páginas de questões derivadas dos 14 PDFs enviados, preservando também os 14 PDFs integrais em `assets/obmep/originals/`; cartões e sessões oferecem links para a fonte original.
- Integrada a resolução de uma questão OBMEP específica com o mesmo fluxo de sessão, registro e feedback já existente.
- Adicionados oito tutoriais práticos de aprendizagem e plano personalizável de 7/30/90 dias, com salvamento local.
- Adicionados Sudoku (gerador e solução única), xadrez local e contra Stockfish sob demanda, Torres de Hanói e raciocínio verbal.
- Incluídos auditores Python do catálogo OBMEP e dos assets estáticos, validação das referências de PDFs nas questões e testes automatizados do Sudoku no núcleo e no GitHub Actions.
- Documentados explicitamente os limites: missão 9 ausente, apenas quatro soluções OBMEP verificadas individualmente, dependência externa para xadrez, rating nominal não certificado e ausência de multiplayer on-line.


## 1.2.1 — Fluxo estruturado OBMEP

- Adicionado simulado OBMEP de quatro questões, usando o motor de sessão existente e seleção de questões únicas.
- Questões OBMEP abertas agora oferecem uma folha de resolução em cinco passos: compreensão, estratégia, desenvolvimento, verificação e aprendizado extraído.
- Cada etapa é salva automaticamente na sessão local, restaurada quando a sessão volta e exibida no feedback após registro.
- O relatório do simulado deixa explícito que questões discursivas sem gabarito verificado não produzem uma taxa de acerto automática.
- Ampliação dos testes estáticos para verificar os campos estruturados, a conexão do botão do simulado e a seleção de quatro IDs distintos.
