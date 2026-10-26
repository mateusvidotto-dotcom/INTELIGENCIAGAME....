#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const storage = new Map();
const localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); }
};
const context = { console, Math, Date, Set, Map, Array, Object, String, Number, JSON, RegExp, URLSearchParams,
  localStorage, location: { search: '' }, addEventListener() {}, setTimeout, clearTimeout };
context.window = context;
vm.createContext(context);
const files = [
  'scripts/core/storage.js', 'scripts/core/progression.js', 'scripts/core/adaptive-engine.js',
  'scripts/core/review-system.js', 'scripts/core/module-registry.js', 'scripts/core/obmep-workflow.js',
  'scripts/modules/logic.js', 'scripts/modules/attention.js', 'scripts/modules/memory.js',
  'scripts/modules/creativity.js', 'scripts/modules/mathematics.js', 'scripts/modules/critical-thinking.js',
  'scripts/modules/bible.js', 'scripts/modules/science.js', 'scripts/modules/language.js',
  'scripts/modules/strategy.js', 'scripts/modules/interdisciplinary.js', 'scripts/modules/metacognition.js',
  'data/obmep/questions.js', 'scripts/modules/obmep.js',
  'scripts/core/quality-overrides.js', 'scripts/tests/self-tests.js'
];
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), context, { filename:file, timeout: 5000 });
const MF = context.MindForge;
const result = MF.Tests.run();
if (!result.ok) {
  console.error('Falhas de conteúdo:'); result.failures.forEach(item => console.error(' - ' + item)); process.exitCode = 1;
} else {
  console.log(`PASSOU: ${result.moduleCount} módulos, ${result.questionCount} questões, ${result.choiceCount} questões objetivas, ${result.overridesApplied} conjuntos de distratores revisados.`);
  const obmep = MF.getModule('obmep');
  if (!obmep || obmep.questions.length !== 56) { console.error('A biblioteca OBMEP precisa registrar exatamente as 56 páginas de questões fornecidas.'); process.exitCode = 1; }
  if (obmep) {
    const ids = new Set(obmep.questions.map(item => item.id));
    if (ids.size !== 56) { console.error('A biblioteca OBMEP contém IDs repetidos.'); process.exitCode = 1; }
    const missingPdf = obmep.questions.filter(item => !item.pdfUrl || !item.pdfUrl.startsWith('assets/obmep/originals/'));
    if (missingPdf.length) { console.error(`${missingPdf.length} questões OBMEP não apontam para o PDF original da missão.`); process.exitCode = 1; }
    const wrongType = obmep.questions.filter(item => item.type !== 'open' || !item.imageUrl || !Array.isArray(item.hints) || item.hints.length < 3);
    if (wrongType.length) { console.error(`${wrongType.length} questões OBMEP estão sem imagem, pistas ou formato de resolução aberta.`); process.exitCode = 1; }
  }
}
// Exercise real state, persistence, scoring, review and adaptive selection.
const q = MF.getModule('logic').questions.find(item => item.type === 'choice');
const beforeXp = MF.state.xp;
MF.recordAttempt({ question:q, moduleId:q.moduleId, correct:true, firstTry:true, hintUsed:false, confidence:4, mode:'test', userAnswer:q.options[q.answer] });
if (MF.state.xp <= beforeXp) { console.error('XP não aumentou após uma resposta correta.'); process.exitCode = 1; }
if (!localStorage.getItem(MF.Storage.key)) { console.error('Progresso não foi salvo no storage de teste.'); process.exitCode = 1; }
MF.Review.add(q, q.moduleId, false, false);
if (!MF.state.reviewItems.some(item => item.id === q.id)) { console.error('A questão não entrou na fila de revisão.'); process.exitCode = 1; }
const picked = MF.Adaptive.pick(MF.getModule('attention').questions, 'attention', {level:5});
const firstFive = picked.slice(0,5).map(item => item.taskFamily);
if (new Set(firstFive).size < 3) { console.error('Seleção adaptativa não diversificou famílias de tarefa o suficiente.'); process.exitCode = 1; }
if (process.exitCode) process.exit();
console.log('PASSOU: pontuação, persistência, revisão e diversidade adaptativa.');

// Validate generated Sudoku constraints and uniqueness.
const Sudoku = require(path.join(root, 'scripts/games/sudoku-engine.js'));
for (const difficulty of ['easy','medium','hard']) {
  const puzzle = Sudoku.generate(difficulty);
  const uniqueness = Sudoku.countSolutions(puzzle.puzzle, 2);
  if (!puzzle.unique || uniqueness.count !== 1 || !Sudoku.isValidComplete(puzzle.solution) || puzzle.puzzle.some((v,i)=>v!==0&&v!==puzzle.solution[i])) { console.error('Sudoku inválido na dificuldade '+difficulty); process.exitCode = 1; }
}
if (process.exitCode) process.exit();
console.log('PASSOU: Sudoku gera tabuleiros com solução única nas três dificuldades.');

// Check the OBMEP session contract and structured worksheet wiring.
const appSource = fs.readFileSync(path.join(root,'scripts/app.js'),'utf8');
const hubSource = fs.readFileSync(path.join(root,'scripts/extensions/learning-hub.js'),'utf8');
const htmlSource = fs.readFileSync(path.join(root,'index.html'),'utf8');
const workflow = MF.ObmepWorkflow;
const emptyWork = workflow.createEmpty();
const incomplete = workflow.validate(emptyWork);
const completeWork = {understand:'Identifiquei os dados e a incógnita do enunciado.',plan:'Vou organizar os casos numa tabela antes de calcular.',work:'Comparei os casos e registrei as contas com justificativas.',validate:'Substituí o resultado e confirmei que ele satisfaz as condições.',takeaway:'A tabela ajudou a não repetir casos.'};
const validWork = workflow.validate(completeWork);
const tooShortButLabeled = workflow.validate({understand:'dados',plan:'tabela',work:'contas',validate:'confere',takeaway:''});
if (workflow.fields.length !== 5 || incomplete.ok || !incomplete.missing.includes('understand') || !validWork.ok || tooShortButLabeled.ok || tooShortButLabeled.contentLength >= 60 || !workflow.buildDraft(completeWork).includes('3. Desenvolvimento:')) { console.error('Validação da folha estruturada OBMEP falhou.'); process.exitCode = 1; }
if (!appSource.includes('MF.ObmepWorkflow.validate') || !appSource.includes('SIMULADO OBMEP') || !appSource.includes('MF.startModuleSession = function')) { console.error('Contrato de sessão/folha de resolução OBMEP incompleto.'); process.exitCode = 1; }
if (!hubSource.includes("MF.startModuleSession('obmep','obmep-mock',4)") || !htmlSource.includes('data-obmep-mock')) { console.error('O botão do simulado OBMEP não está conectado à sessão do jogo.'); process.exitCode = 1; }
const obmepForMock = MF.getModule('obmep');
const mockQuestions = MF.Adaptive.pick(obmepForMock.questions, 'obmep', {level:MF.Adaptive.recommendedLevel('obmep')}).slice(0,4);
if (mockQuestions.length !== 4 || new Set(mockQuestions.map(item=>item.id)).size !== 4) { console.error('O simulado OBMEP não consegue selecionar quatro questões únicas.'); process.exitCode = 1; }
if (!process.exitCode) console.log('PASSOU: folha estruturada OBMEP (validação real), integração do simulado e seleção de quatro questões únicas.');
