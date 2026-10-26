# Plano de teste manual — Mind Forge Omega

## Integridade de conteúdo
- [ ] Abrir `/?test=1` e confirmar que o painel indica sucesso.
- [ ] Conferir o conteúdo factual e a explicação apresentada numa amostra de cada módulo.
- [ ] Confirmar que não existem IDs repetidos.

## Fluxo de sessão
- [ ] Iniciar um laboratório, selecionar uma opção e enviar.
- [ ] Confirmar que a explicação aparece somente depois da tentativa.
- [ ] Em uma questão errada, tentar novamente e depois avançar.
- [ ] Usar uma pista e verificar o indicador de pistas.
- [ ] Terminar uma sessão e conferir o relatório.
- [ ] Sair de uma sessão antes do fim e confirmar que as respostas já enviadas permanecem no histórico.

## Mecânicas específicas
- [ ] Atenção: contar o símbolo-alvo e conferir o feedback.
- [ ] Memória: observar a sequência, ocultá-la, responder e conferir o feedback.
- [ ] Criatividade/metacognição: escrever uma resposta, marcar critérios e registrar a reflexão sem que ela seja tratada como questão objetiva.
- [ ] Revisão: errar uma questão, abrir a fila e praticar o item novamente.
- [ ] Campanha: concluir corretamente uma etapa e confirmar que ela fica registrada; uma etapa errada deve continuar disponível.

## Dados e acessibilidade
- [ ] Atualizar a página e confirmar a persistência do progresso.
- [ ] Exportar um backup e importar o mesmo arquivo.
- [ ] Tentar importar um JSON inválido e confirmar mensagem de erro.
- [ ] Redefinir o progresso somente após confirmação.
- [ ] Navegar por teclado e verificar foco visível.
- [ ] Conferir layout em viewport de celular e desktop.

Este checklist acompanha o projeto. As verificações devem ser marcadas depois de executadas no navegador alvo.

## Verificações automatizadas desta versão 1.2.1

- [x] Sintaxe de todos os arquivos JavaScript (`node --check`).
- [x] Auditoria estrita do banco exportado: 13 módulos, 325 registros, sem alertas estruturais/editoriais gerados pelas regras atuais.
- [x] Auditoria da coleção OBMEP: 56 registros e imagens, 14 PDFs originais, cobertura das missões coerente e missão 9 explicitamente ausente.
- [x] Auditoria de referências locais da página de entrada e IDs HTML duplicados.
- [x] Testes de núcleo: pontuação, armazenamento simulado, fila de revisão, variantes de atenção/memória, diversidade adaptativa e ligações de PDFs no catálogo.
- [x] Sudoku: geração válida e solução única para três dificuldades.
- [x] Folha OBMEP: validação real dos campos obrigatórios e compilação da resposta estruturada.
- [x] Simulado OBMEP: botão conectado à sessão e seleção de quatro IDs únicos.
- [ ] Smoke test de navegador da versão 1.2.1: não foi possível executar nesta sessão porque o Chromium do ambiente foi bloqueado (`ERR_BLOCKED_BY_ADMINISTRATOR`) para endereços locais. Execute a checklist manual após abrir o site localmente.
- [ ] Xadrez contra Stockfish em navegador com internet: depende do carregamento das bibliotecas externas; precisa ser verificado no navegador publicado.

## Repetir os testes localmente

Execute na raiz do repositório:

```bash
node tools/export-question-bank.cjs .question-bank.audit.json
python tools/audit_questions.py .question-bank.audit.json --strict
python tools/audit_obmep_catalog.py
python tools/audit_static_assets.py
node tools/run-tests.cjs
```

O fluxo `.github/workflows/quality-check.yml` realiza estes passos automaticamente no GitHub Actions. Os testes cobrem sintaxe JavaScript, integridade do banco, tipos e níveis de questões, unicidade de IDs, distribuição de alternativas depois do embaralhamento, variantes procedurais de atenção/memória, XP, persistência, fila de revisão, diversidade adaptativa e a presença dos PDFs de origem, validação da folha estruturada OBMEP e seleção de questões únicas para o simulado.

A auditoria não consegue provar automaticamente que todos os distratores são pedagogicamente excelentes, que toda interpretação bíblica é correta ou que a experiência funciona em todos os dispositivos. A revisão humana e a inspeção em navegadores reais continuam necessárias.


## Melhorias OBMEP 1.2.1
- [ ] Abrir Biblioteca OBMEP e iniciar o simulado de quatro questões.
- [ ] Confirmar que o selo de sessão indica “Simulado OBMEP” e que a sessão tem quatro questões distintas.
- [ ] Em uma questão OBMEP, preencher as cinco etapas da folha estruturada; atualizar a página no meio da resolução e confirmar a restauração.
- [ ] Tentar registrar sem completar as etapas centrais e confirmar que a validação identifica quais campos faltam, sem enviar o rascunho incompleto.
- [ ] Registrar a resolução, abrir “Rever minha resolução registrada” e confirmar que os campos aparecem rotulados e escapados como texto.
- [ ] Concluir o simulado e confirmar que o relatório não fabrica uma taxa de acerto para questões abertas.
