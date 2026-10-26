(function (global, document) {
  'use strict';
  const MF = global.MindForge;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const STORE_KEY = 'mind-forge-learning-hub-v1';
  const data = Array.isArray(global.MFOBMEP_DATA) ? global.MFOBMEP_DATA : [];
  const tutorials = [
    {id:'recall',title:'Recuperação ativa: recordar antes de consultar',time:'8–12 min',objective:'Verificar o que consegue recuperar sem apoio, em vez de apenas reconhecer o conteúdo.',steps:['Feche o material e escreva tudo o que lembra sobre um conceito em 2–3 minutos.','Compare sua resposta com a fonte e marque erros, lacunas e pontos corretos.','Corrija usando outra cor e depois explique a ideia sem copiar a redação original.','Tente novamente em outro momento e inclua uma aplicação nova.'],practice:'Depois de estudar um teorema, enuncie-o de memória, diga suas condições e crie um exemplo e um contraexemplo.',common:'Consultar as respostas a cada dúvida transforma o exercício em reconhecimento. Tente recuperar primeiro, mesmo que a lembrança seja incompleta.',source:'Roediger & Karpicke (2006), Test-Enhanced Learning.'},
    {id:'spacing',title:'Revisão espaçada: distribuir o esforço',time:'5 min para planejar',objective:'Retomar o conteúdo em sessões separadas, ajustando o intervalo à retenção observada.',steps:['No dia do estudo, resolva uma questão sem olhar a solução.','Agende uma recuperação breve no dia seguinte.','Retome alguns dias depois e, mais tarde, após uma semana.','Se errar, reduza o intervalo e reconstrua o conceito; se recuperar com segurança em desafios diferentes, aumente gradualmente.'],practice:'Use uma fila simples: hoje, amanhã, daqui a 3 dias, 7 dias e 14 dias. Isso é um ponto de partida, não um intervalo ideal universal.',common:'Deixar a revisão para a véspera concentra o esforço. Intervalos úteis dependem de quando você precisará recordar novamente.',source:'Cepeda et al. (2006), meta-análise de prática distribuída.'},
    {id:'obmep',title:'Resolver uma questão olímpica antes de calcular',time:'15–30 min',objective:'Transformar o enunciado em um problema estruturado e escolher uma estratégia deliberada.',steps:['Reescreva o que é pedido e liste todos os dados e restrições.','Faça um desenho, uma tabela, um caso pequeno ou uma variável, conforme o problema.','Experimente uma estratégia antes de desenvolver a solução completa.','Prove que o argumento cobre os casos necessários e confira o resultado no enunciado.','Registre a ideia que desbloqueou o problema, não somente a resposta.'],practice:'Escolha uma questão OBMEP da biblioteca e escreva a estratégia em palavras antes de fazer contas.',common:'Pular diretamente para cálculos pode esconder a estrutura. Uma figura não necessariamente está em escala; use as condições escritas.',source:'Método de resolução adotado pelo treinamento; é uma estrutura pedagógica, não uma garantia de solução.'},
    {id:'error-log',title:'Caderno de erros que produz novas tentativas',time:'10 min',objective:'Converter um erro observável em uma próxima ação de estudo.',steps:['Registre a questão e o passo concreto em que a solução deixou de funcionar.','Classifique provisoriamente: leitura, conceito, estratégia, cálculo ou verificação.','Escreva o princípio correto com um exemplo mínimo.','Resolva outra questão do mesmo conceito sem copiar o procedimento linha por linha.','Volte ao erro depois de um intervalo.'],practice:'Use a frase: “Eu fiz ___ porque presumi ___; a condição que não conferi foi ___; da próxima vez vou testar ___”.',common:'Escrever apenas “desatenção” costuma ser vago demais para gerar uma correção concreta.',source:'Orientação de metacognição e feedback da plataforma; a classificação é uma ferramenta de autoanálise.'},
    {id:'interleave',title:'Intercalar problemas sem perder os fundamentos',time:'15–25 min',objective:'Praticar a escolha do método, não apenas repetir um tipo já identificado.',steps:['Aprenda inicialmente a ideia central com um exemplo guiado.','Depois misture 2–4 tipos próximos de problema.','Antes de calcular, diga qual conceito acredita que se aplica e por quê.','Após a solução, compare com o método alternativo e observe a pista que distingue os tipos.'],practice:'Em matemática, misture proporção, contagem e equações em vez de fazer 20 exercícios idênticos seguidos — desde que já tenha aprendido os fundamentos.',common:'Misturar assuntos totalmente desconhecidos pode sobrecarregar. Intercale quando já houver uma base mínima.',source:'Dunlosky et al. (2013), revisão de técnicas de aprendizagem.'},
    {id:'focus',title:'Sessão de foco com objetivo e pausa',time:'20–35 min',objective:'Reduzir trocas de contexto e tornar a sessão verificável.',steps:['Defina uma meta observável, como “resolver 2 questões e explicar o método”.','Prepare o material e feche distrações previsíveis.','Trabalhe um bloco de 15–25 minutos, ajustando a duração ao tipo de tarefa.','Faça uma pausa breve, levante-se e retorne se a tarefa exigir.','Finalize anotando o que foi concluído e o próximo passo.'],practice:'Na próxima sessão, deixe o celular fora do alcance e defina previamente qual evidência mostrará que a tarefa foi feita.',common:'Tempo sentado não é igual a aprendizagem. Registre tarefas concluídas, erros corrigidos e conteúdos recuperados.',source:'Procedimento de organização de estudo; a duração deve ser adaptada à pessoa e à tarefa.'},
    {id:'explain',title:'Autoexplicação e compreensão profunda',time:'8–15 min',objective:'Conectar cada passo a uma razão e identificar lacunas de compreensão.',steps:['Explique a ideia com suas palavras sem copiar o livro.','Para cada passo de uma solução, pergunte “por que isso é permitido?”.','Crie um exemplo em que o método funciona e um caso em que não funciona.','Se ficar travado, volte à menor premissa necessária e recomece.'],practice:'Explique uma solução a uma pessoa que ainda não conhece o método, sem esconder os passos essenciais.',common:'Repetir uma definição fluentemente não prova que você sabe aplicá-la.',source:'Dunlosky et al. (2013), técnicas de elaboração e autoexplicação.'},
    {id:'calibration',title:'Calibrar confiança com evidências',time:'5–10 min',objective:'Comparar sua confiança à precisão real ao longo de várias tentativas.',steps:['Antes da resposta, marque sua confiança de 1 a 5.','Responda e registre o resultado.','Quando errar com muita confiança, investigue a premissa não verificada.','Compare tendências ao longo de várias questões; não tire conclusões de um único caso.'],practice:'Em seu próximo treino, anote separadamente confiança, resultado e justificativa.',common:'Confiança é uma estimativa subjetiva, não uma medida direta de inteligência.',source:'Exercício de metacognição e monitoramento; não é teste psicométrico.'}
  ];
  let hubState = loadState();
  let obmepLimit = 24;
  let gameTab = 'sudoku';
  let sudoku = null;
  let chess = null;
  let chessMode = 'local';
  let chessWorker = null;
  let chessEngineReady = false;
  let chessEnginePending = false;
  let chessCtorPromise = null;
  let hanoi = null;
  let verbalIndex = 0;
  let verbalResult = null;

  function loadState() {
    try {
      const raw = global.localStorage.getItem(STORE_KEY);
      if (!raw) return {schema:1, tutorialsDone:[], plan:null, stats:{sudokuSolved:0,hanoiSolved:0,verbalCorrect:0}, sudoku:null};
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.schema !== 1 || !Array.isArray(parsed.tutorialsDone)) throw new Error('invalid');
      parsed.stats = Object.assign({sudokuSolved:0,hanoiSolved:0,verbalCorrect:0}, parsed.stats || {});
      return parsed;
    } catch (_) { return {schema:1, tutorialsDone:[], plan:null, stats:{sudokuSolved:0,hanoiSolved:0,verbalCorrect:0}, sudoku:null}; }
  }
  function saveState() {
    try { global.localStorage.setItem(STORE_KEY, JSON.stringify(hubState)); }
    catch (_) { announce('O navegador não permitiu salvar as preferências desta área. Exporte ou anote o plano, se necessário.', true); }
  }
  function announce(message, error) {
    const region = $('#toast-region');
    if (!region) return;
    const node = document.createElement('div'); node.className = 'toast' + (error ? ' is-error' : ''); node.textContent = message; region.appendChild(node);
    global.setTimeout(() => node.remove(), 4200);
  }
  function renderObmepMetrics() {
    const target = $('#obmep-metrics'); if (!target) return;
    const missions = [...new Set(data.map(q => q.mission))].sort((a,b)=>a-b);
    target.innerHTML = `<article class="hub-metric panel"><strong>${data.length}</strong><span>questões catalogadas</span></article><article class="hub-metric panel"><strong>${missions.length} / 15</strong><span>missões presentes na coleção</span></article><article class="hub-metric panel"><strong>${new Set(data.map(q => (q.topics||[]).join('|'))).size}</strong><span>combinações temáticas no catálogo</span></article>`;
    const missionSelect = $('#obmep-mission-filter');
    if (missionSelect && missionSelect.options.length <= 1) missions.forEach(m => { const op=document.createElement('option'); op.value=String(m); op.textContent=`Missão ${m}`; missionSelect.appendChild(op); });
    const topicSelect = $('#obmep-topic-filter');
    if (topicSelect && topicSelect.options.length <= 1) [...new Set(data.flatMap(q=>q.topics||[]))].sort().forEach(topic => { const op=document.createElement('option'); op.value=topic; op.textContent=topic; topicSelect.appendChild(op); });
  }
  function filterObmep(resetLimit) {
    if (resetLimit) obmepLimit=24;
    const query = ($('#obmep-search')?.value || '').trim().toLocaleLowerCase('pt-BR');
    const mission = $('#obmep-mission-filter')?.value || 'all';
    const topic = $('#obmep-topic-filter')?.value || 'all';
    const transcript = $('#obmep-transcript-filter')?.value || 'all';
    const filtered = data.filter(q => {
      const haystack = [q.title,q.statementText,q.searchText,q.sourceDocument,(q.topics||[]).join(' '),`missão ${q.mission}`,String(q.officialYear||'')].join(' ').toLocaleLowerCase('pt-BR');
      return (!query || haystack.includes(query)) && (mission==='all' || String(q.mission)===mission) && (topic==='all' || (q.topics||[]).includes(topic)) && (transcript==='all' || (transcript==='yes'?q.transcriptAvailable:!q.transcriptAvailable));
    });
    const target = $('#obmep-question-grid'); if (!target) return;
    $('#obmep-results-count').textContent = `${filtered.length} questão(ões) encontradas`;
    const visible = filtered.slice(0,obmepLimit);
    target.innerHTML = visible.map(q => `<article class="obmep-card panel"><a class="obmep-thumb" href="${escapeHTML(q.imageUrl)}" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="${escapeHTML(q.imageUrl)}" alt="${escapeHTML(q.imageAlt||'Página original da questão')}"></a><div class="obmep-card-copy"><div class="obmep-card-meta"><span>MISSÃO ${q.mission}</span><span>PÁG. ${q.sourcePage}</span><span>${q.officialYear?escapeHTML(q.officialYear):'ANO NÃO CONFIRMADO'}</span></div><h2>${escapeHTML(q.title || `Questão ${q.missionQuestion}`)}</h2><div class="tag-row">${(q.topics||[]).map(t=>`<span class="topic-tag">${escapeHTML(t)}</span>`).join('')}<span class="topic-tag">Dificuldade interna ${q.internalDifficulty||'não estimada'}</span></div><p>${q.transcriptAvailable?'Há uma transcrição extraída; confira fórmulas e figuras na imagem original.':'A extração de texto é parcial; use a imagem original como fonte principal.'}</p><div class="obmep-card-actions"><button type="button" class="button button-primary" data-obmep-start="${escapeHTML(q.id)}">Resolver esta questão ↗</button><a class="button button-ghost" href="${escapeHTML(q.imageUrl)}" target="_blank" rel="noopener noreferrer">Abrir página original</a>${q.pdfUrl?`<a class="button button-ghost" href="${escapeHTML(q.pdfUrl)}" target="_blank" rel="noopener noreferrer">PDF integral da missão</a>`:''}</div></div></article>`).join('') + (filtered.length>visible.length ? `<div class="panel load-more-panel"><p>Exibindo ${visible.length} de ${filtered.length} resultados. Carregue mais para continuar.</p><button type="button" class="button button-secondary" data-obmep-more>Mostrar mais questões</button></div>` : '') + (!filtered.length ? '<div class="panel empty-state"><h3>Nenhuma questão encontrada</h3><p>Experimente outro termo ou remova um filtro.</p></div>' : '');
  }
  function renderTutorials() {
    const target=$('#study-tutorial-list'); if(!target) return;
    const research = { recall:['Roediger & Karpicke (2006), Psychological Science','https://pubmed.ncbi.nlm.nih.gov/16507066/'], spacing:['Cepeda et al. (2006), Psychological Bulletin','https://pubmed.ncbi.nlm.nih.gov/16719566/'], interleave:['Dunlosky et al. (2013), Psychological Science in the Public Interest','https://www.psychologicalscience.org/journals/pspi/1529100612453266/'], explain:['Dunlosky et al. (2013), técnicas de autoexplicação e elaboração','https://www.psychologicalscience.org/journals/pspi/1529100612453266/'] };
    target.innerHTML=tutorials.map((t,i)=>`<article class="tutorial-card panel"><div class="tutorial-number">${String(i+1).padStart(2,'0')}</div><div class="tutorial-content"><div class="tutorial-meta"><span>${t.time}</span><span>${hubState.tutorialsDone.includes(t.id)?'APLICADO':'TUTORIAL'}</span></div><h2>${escapeHTML(t.title)}</h2><p>${escapeHTML(t.objective)}</p><details><summary>Ver procedimento prático</summary><ol>${t.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ol><div class="tutorial-practice"><strong>Experimente hoje</strong><p>${escapeHTML(t.practice)}</p></div><div class="tutorial-common"><strong>Erro comum</strong><p>${escapeHTML(t.common)}</p></div><p class="feedback-reference">Base/nota: ${escapeHTML(t.source)}${research[t.id]?` · <a href="${research[t.id][1]}" target="_blank" rel="noopener noreferrer">${escapeHTML(research[t.id][0])}</a>`:''}</p></details><button type="button" class="button ${hubState.tutorialsDone.includes(t.id)?'button-secondary':'button-ghost'}" data-study-done="${t.id}">${hubState.tutorialsDone.includes(t.id)?'Marcar como não aplicado':'Marcar como aplicado'}</button></div></article>`).join('');
    const stat=$('#study-completion-stat'); if(stat) stat.textContent=`${hubState.tutorialsDone.length} de ${tutorials.length} aplicados`;
  }
  const focusLabels = {obmep:'Matemática / OBMEP',logic:'Lógica e estratégia',memory:'Memória e atenção',critical:'Pensamento crítico',chess:'Xadrez e jogos',study:'Métodos de estudo'};
  const focusModules = {obmep:'obmep',logic:'logic',memory:'memory',critical:'critical',chess:'games',study:'study'};
  function buildPlan(formValues) {
    const minutes=Number(formValues.minutes)||20, horizon=Number(formValues.horizon)||30, level=formValues.level||'intermediate';
    const raw=Array.isArray(formValues.focus)?formValues.focus:[];
    const focus=raw.slice(0,3); if(!focus.length) focus.push('obmep','logic');
    const activities={
      obmep:[['Compreender','Escolha uma questão, sublinhe dados e incógnitas, faça um desenho ou tabela.'],['Planejar','Escreva uma estratégia antes de calcular; peça uma dica só depois de tentar.'],['Resolver','Desenvolva os passos e justifique cada igualdade ou contagem.'],['Validar','Confira todos os subitens e procure um contraexemplo para o raciocínio.']],
      logic:[['Deduzir','Resolva uma questão de restrições e registre a cadeia de inferências.'],['Padrões','Compare duas sequências e explique por que sua regra funciona.'],['Revisar hipótese','Crie uma hipótese e procure um caso que poderia refutá-la.']],
      memory:[['Recuperar','Recorde um conteúdo sem consultar e confira as lacunas.'],['Atenção','Faça uma tarefa de observação e anote erros de contagem ou posição.'],['Rever','Retome um conceito de uma sessão anterior sem reler antes.']],
      critical:[['Argumentar','Separe afirmação, premissas, inferência e conclusão.'],['Avaliar fonte','Identifique o que a evidência permite e o que não permite concluir.'],['Contraexemplo','Tente encontrar um caso em que a afirmação deixa de funcionar.']],
      chess:[['Planejar','Resolva uma tática e calcule ao menos duas respostas do adversário.'],['Rever','Escolha um momento da partida e explique a ameaça de cada lado.'],['Estratégia','Jogue uma partida sem pressa e registre uma decisão importante.']],
      study:[['Recuperação ativa','Recorde o conteúdo sem consultar e confira a resposta.'],['Caderno de erros','Transforme um erro recente em uma regra e uma nova questão.'],['Agenda de revisão','Agende uma recuperação para amanhã e outra alguns dias depois.']]
    };
    const plan={createdAt:new Date().toISOString(),minutes,horizon,level,focus,days:[]};
    const phaseOne=Math.max(2,Math.ceil(horizon*0.2));
    const phaseTwo=Math.max(phaseOne+1,Math.ceil(horizon*0.6));
    for(let day=1;day<=horizon;day++){
      const key=focus[(day-1)%focus.length];
      const options=activities[key]||activities.logic;
      const phase=day<=phaseOne?'Construir base':day<=phaseTwo?'Aplicar e intercalar':'Consolidar e transferir';
      const difficulty=level==='beginner'?'Comece com um exemplo e depois tente uma questão semelhante.':level==='advanced'?'Use uma questão nova, justifique sem pistas e compare estratégias.':'Comece com uma questão de nível intermediário e avance se conseguir explicar a solução.';
      const pieces=minutes<15?1:minutes<30?2:3;
      plan.days.push({day,focus:key,label:focusLabels[key]||key,phase,tasks:options.slice(0,pieces),difficulty});
    }
    return plan;
  }
  function savePlanFromForm() {
    const focus=$$('input[name="plan-focus"]:checked').map(el=>el.value);
    if(focus.length>3){announce('Escolha no máximo três prioridades para manter o plano viável.',true);return;}
    const form={minutes:$('#plan-minutes').value,horizon:$('#plan-horizon').value,level:$('#plan-level').value,focus};
    hubState.plan=buildPlan(form); saveState(); renderPlan(); announce('Plano salvo neste navegador. Ajuste-o quando sua rotina mudar.');
  }
  function renderPlan() {
    const target=$('#plan-output'); if(!target) return;
    const plan=hubState.plan;
    if(!plan){target.innerHTML='<div class="panel empty-state"><h2>Seu plano ainda não foi criado</h2><p>Escolha sua disponibilidade e prioridades acima. O roteiro sugerido é uma organização de prática, não uma promessa de resultado.</p></div>';return;}
    const days=plan.days||[];
    target.innerHTML=`<div class="plan-summary panel"><div><div class="eyebrow">PLANO SALVO</div><h2>${plan.horizon} dias · ${plan.minutes} min/dia</h2><p>${plan.focus.map(f=>escapeHTML(focusLabels[f]||f)).join(' · ')}</p><small>Plano criado em ${new Date(plan.createdAt).toLocaleDateString('pt-BR')}. As tarefas são orientações reutilizáveis; varie as questões e ajuste o plano conforme os resultados observados.</small></div><button class="button button-ghost" data-plan-export>Exportar roteiro .txt</button></div><div class="plan-phase-grid"><article class="panel"><span>FASE 1</span><h3>Construir base</h3><p>Estabeleça rotinas simples e confira pré-requisitos.</p></article><article class="panel"><span>FASE 2</span><h3>Aplicar e intercalar</h3><p>Alterne problemas próximos e pratique a escolha da estratégia.</p></article><article class="panel"><span>FASE 3</span><h3>Consolidar</h3><p>Recupere após intervalos e aplique o método a problemas novos.</p></article></div><div class="plan-day-list">${days.map(d=>`<article class="plan-day panel"><div class="plan-day-number">DIA ${d.day}</div><div class="plan-day-copy"><div class="tutorial-meta"><span>${escapeHTML(d.label)}</span><span>${escapeHTML(d.phase)}</span></div><ol>${d.tasks.map(t=>`<li><strong>${escapeHTML(t[0])}:</strong> ${escapeHTML(t[1])}</li>`).join('')}</ol><p>${escapeHTML(d.difficulty)}</p></div><label class="plan-day-check"><input type="checkbox" data-plan-complete="${d.day}" ${hubState.planCompleted&&hubState.planCompleted.includes(d.day)?'checked':''}> Concluído</label></article>`).join('')}</div>`;
  }
  function exportPlan() {
    const p=hubState.plan;if(!p)return;
    const lines=[`MIND FORGE OMEGA — PLANO DE ${p.horizon} DIAS`,`Tempo: ${p.minutes} min/dia`,`Prioridades: ${p.focus.map(f=>focusLabels[f]||f).join(', ')}`,''];
    p.days.forEach(d=>{lines.push(`DIA ${d.day} — ${d.label} (${d.phase})`);d.tasks.forEach(t=>lines.push(`- ${t[0]}: ${t[1]}`));lines.push(d.difficulty,'');});
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='plano-mind-forge.txt';a.click();URL.revokeObjectURL(url);
  }
  function newSudoku(difficulty) {
    const generated=global.MindForgeSudokuEngine.generate(difficulty||'medium');
    sudoku={puzzle:generated.puzzle.slice(),solution:generated.solution.slice(),values:generated.puzzle.slice(),notes:Array.from({length:81},()=>[]),selected:40,difficulty:generated.difficulty,moves:0,hints:0,finished:false};
    hubState.sudoku={...sudoku};saveState();renderSudoku();
  }
  function ensureSudoku() {
    const s=hubState.sudoku;
    if(s&&Array.isArray(s.puzzle)&&s.puzzle.length===81&&Array.isArray(s.solution)&&s.solution.length===81&&Array.isArray(s.values)&&s.values.length===81) sudoku={...s,notes:Array.isArray(s.notes)&&s.notes.length===81?s.notes:Array.from({length:81},()=>[]),selected:Number.isInteger(s.selected)?s.selected:40};
    else newSudoku('medium');
  }
  function saveSudoku() { if(!sudoku)return;hubState.sudoku={...sudoku};saveState(); }
  function renderSudoku() {
    const target=$('#game-lab-content');if(!target||gameTab!=='sudoku'||!sudoku)return;
    const conflicts=new Set(global.MindForgeSudokuEngine.conflicts(sudoku.values));
    const selected=sudoku.selected, sr=Math.floor(selected/9), sc=selected%9, selectedValue=sudoku.values[selected];
    const grid=sudoku.values.map((v,i)=>{const r=Math.floor(i/9),c=i%9,clue=sudoku.puzzle[i]!==0,related=r===sr||c===sc||(Math.floor(r/3)===Math.floor(sr/3)&&Math.floor(c/3)===Math.floor(sc/3));const valueClass=clue?'is-given':v?'is-user':'is-empty';const notes=(sudoku.notes[i]||[]).slice().sort((a,b)=>a-b).join('');return `<button type="button" class="sudoku-cell ${valueClass} ${i===selected?'is-selected':''} ${related&&i!==selected?'is-related':''} ${conflicts.has(i)?'is-conflict':''} ${c%3===2&&c!==8?'box-right':''} ${r%3===2&&r!==8?'box-bottom':''}" data-sudoku-cell="${i}" aria-label="Linha ${r+1}, coluna ${c+1}${v?', valor '+v:', vazio'}${clue?', valor fixo':''}" ${sudoku.finished?'disabled':''}>${v?`<span>${v}</span>`:notes?`<small>${escapeHTML(notes.split('').join(' '))}</small>`:''}</button>`;}).join('');
    target.innerHTML=`<div class="game-card-head"><div><div class="eyebrow">LÓGICA CONSTRUTIVA</div><h2>Sudoku</h2><p>Preencha as linhas, colunas e regiões 3×3 com os números de 1 a 9, sem repetição. O gerador confere que a solução seja única.</p></div><div class="game-head-actions"><label class="input-label">Dificuldade<select id="sudoku-difficulty" class="select-control"><option value="easy" ${sudoku.difficulty==='easy'?'selected':''}>Iniciante</option><option value="medium" ${sudoku.difficulty==='medium'?'selected':''}>Intermediário</option><option value="hard" ${sudoku.difficulty==='hard'?'selected':''}>Avançado</option></select></label><button type="button" class="button button-secondary" data-sudoku-new>Novo tabuleiro</button></div></div><div class="sudoku-layout"><div class="sudoku-board" role="group" aria-label="Tabuleiro Sudoku">${grid}</div><div class="sudoku-controls panel"><div class="sudoku-status" id="sudoku-status" aria-live="polite">${sudoku.finished?'Tabuleiro concluído.':conflicts.size?`Há ${conflicts.size} células em conflito.`:`${sudoku.moves} jogada(s) · ${sudoku.hints} dica(s)`}</div><div class="number-pad">${Array.from({length:9},(_,i)=>`<button type="button" data-sudoku-number="${i+1}" ${sudoku.finished?'disabled':''}>${i+1}</button>`).join('')}<button type="button" data-sudoku-number="0" class="number-clear" aria-label="Apagar valor" ${sudoku.finished?'disabled':''}>⌫</button></div><label class="notes-toggle"><input type="checkbox" id="sudoku-notes"> Anotações de candidatos</label><div class="sudoku-action-stack"><button type="button" class="button button-primary" data-sudoku-check>Verificar tabuleiro</button><button type="button" class="button button-ghost" data-sudoku-hint ${sudoku.finished?'disabled':''}>Dica de uma célula</button><button type="button" class="button button-ghost" data-sudoku-reset>Reiniciar este tabuleiro</button></div><div class="sudoku-stats"><span>Concluídos nesta instalação</span><strong>${hubState.stats.sudokuSolved}</strong></div><p class="feedback-reference">Uma dica revela a resposta de apenas uma célula e é registrada separadamente; não substitui aprender a estratégia.</p></div></div>`;
  }
  function sudokuStatus(message,error) { const el=$('#sudoku-status');if(el){el.textContent=message;el.classList.toggle('is-error',!!error);} }
  function sudokuEntry(number) {
    if(!sudoku||sudoku.finished)return;const i=sudoku.selected;if(i<0||sudoku.puzzle[i]){sudokuStatus('Selecione primeiro uma célula vazia.',true);return;}
    if($('#sudoku-notes')?.checked&&number!==0){const set=new Set(sudoku.notes[i]||[]);if(set.has(number))set.delete(number);else set.add(number);sudoku.notes[i]=[...set].sort((a,b)=>a-b);}
    else {sudoku.values[i]=number; sudoku.notes[i]=[]; sudoku.moves++;}
    saveSudoku();renderSudoku();
  }
  function checkSudoku() {
    if(!sudoku)return;const conflicts=global.MindForgeSudokuEngine.conflicts(sudoku.values);
    if(conflicts.length){sudokuStatus(`Há ${conflicts.length} célula(s) envolvida(s) em repetição. Corrija linhas, colunas ou blocos.`,true);return;}
    if(sudoku.values.some(v=>!v)){sudokuStatus(`Sem repetições no momento; ainda há ${sudoku.values.filter(v=>!v).length} célula(s) vazia(s).`,false);return;}
    if(sudoku.values.every((v,i)=>v===sudoku.solution[i])){sudoku.finished=true;hubState.stats.sudokuSolved++;saveSudoku();saveState();renderSudoku();sudokuStatus('Parabéns: solução válida e completa.');announce('Sudoku concluído!');return;}
    sudokuStatus('O tabuleiro está preenchido, mas há valores incompatíveis com a solução. Revise as deduções.',true);
  }
  function sudokuHint() {
    if(!sudoku||sudoku.finished)return;let i=sudoku.selected;if(i<0||sudoku.puzzle[i]||sudoku.values[i])i=sudoku.values.findIndex((v,index)=>!v&&sudoku.puzzle[index]===0);
    if(i<0){sudokuStatus('Não há células vazias para preencher.');return;}
    sudoku.selected=i;sudoku.values[i]=sudoku.solution[i];sudoku.notes[i]=[];sudoku.hints++;sudoku.moves++;saveSudoku();renderSudoku();sudokuStatus(`Dica usada na célula ${Math.floor(i/9)+1}, coluna ${i%9+1}. Tente deduzir por que ${sudoku.solution[i]} é válido ali.`);
  }
  function renderChessShell() {
    const target=$('#game-lab-content');if(!target)return;
    target.innerHTML=`<div class="game-card-head"><div><div class="eyebrow">CÁLCULO DE VARIANTES</div><h2>Xadrez</h2><p>Modo local para duas pessoas ou contra Stockfish, motor real carregado sob demanda. A biblioteca de regras e o motor precisam ser baixados de um CDN; conexão com a internet é necessária.</p></div><div class="game-head-actions"><label class="input-label">Modo<select id="chess-mode" class="select-control"><option value="local" ${chessMode==='local'?'selected':''}>Duas pessoas no mesmo dispositivo</option><option value="computer" ${chessMode==='computer'?'selected':''}>Contra computador</option></select></label><button type="button" class="button button-secondary" data-chess-new>Nova partida</button></div></div><div class="chess-layout"><div class="chess-board-area"><div class="chess-board" id="chess-board"><div class="panel empty-state">Carregue o tabuleiro para iniciar. O jogo valida movimentos legais, xeque, mate, empate, roque e promoção.</div></div><div class="chess-controls"><button class="button button-ghost" type="button" data-chess-undo>Desfazer último lance</button><button class="button button-ghost" type="button" data-chess-flip>Girar tabuleiro</button></div></div><aside class="panel chess-sidebar"><div class="eyebrow">ESTADO DA PARTIDA</div><p id="chess-status" aria-live="polite">Preparando a biblioteca de regras…</p><div class="eyebrow">HISTÓRICO DE LANCES</div><ol id="chess-history" class="chess-history"></ol><p class="feedback-reference">Força nominal solicitada: Elo 1500 em configuração de limitação do motor. Isso não garante rating competitivo calibrado; a força efetiva depende do motor, ambiente e tempo de busca.</p><p id="chess-engine-status" class="feedback-reference">O motor será baixado somente ao escolher o modo computador.</p></aside></div>`;
    initChess();
  }
  function loadChessCtor() {
    if(!chessCtorPromise) chessCtorPromise=import('https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm').then(mod=>{if(typeof mod.Chess!=='function')throw new Error('Export de Chess ausente');return mod.Chess;});
    return chessCtorPromise;
  }
  async function initChess() {
    const status=$('#chess-status');if(status)status.textContent='Carregando a biblioteca de regras…';
    try { const Chess=await loadChessCtor(); if(gameTab!=='chess')return; if(!chess||typeof chess.moves!=='function') { chess=new Chess(); chess.selectedSquare=null; chess.flipped=false; } renderChessBoard(); if(chessMode==='computer') loadStockfish(); }
    catch(err){if(status)status.textContent='Não foi possível carregar a biblioteca de xadrez. Verifique a conexão e tente novamente.';const board=$('#chess-board');if(board)board.innerHTML='<div class="panel error-panel"><h3>Biblioteca indisponível</h3><p>O modo de xadrez usa chess.js 1.4.0 para validar regras. A página pode continuar funcionando offline, mas o xadrez precisa que a biblioteca seja baixada.</p><button class="button button-secondary" data-chess-retry>Tentar carregar novamente</button></div>';}
  }
  function chessPiece(piece){const table={w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'}};return table[piece.color][piece.type];}
  function chessStatusText() {
    if(!chess)return 'Carregando…';
    if(chess.isCheckmate())return `Xeque-mate. ${chess.turn()==='w'?'Pretas':'Brancas'} venceram.`;
    if(chess.isStalemate())return 'Empate por afogamento.';
    if(chess.isDraw())return 'Empate declarado pelas regras do motor.';
    const turn=chess.turn()==='w'?'Brancas':'Pretas';return `${turn} jogam${chess.isCheck()?' · xeque':''}.`+(chessMode==='computer'&&chess.turn()==='b'?' O computador está pensando…':'');
  }
  function renderChessBoard() {
    const boardEl=$('#chess-board');if(!boardEl||!chess)return;
    const rows=chess.board(), legal=chess.selectedSquare?chess.moves({square:chess.selectedSquare,verbose:true}):[];const targets=new Set(legal.map(m=>m.to));
    let html='';
    for(let vr=0;vr<8;vr++){const r=chess.flipped?7-vr:vr;for(let vc=0;vc<8;vc++){const c=chess.flipped?7-vc:vc;const square='abcdefgh'[c]+(8-r);const piece=rows[r][c];const light=(r+c)%2===0;let cls=`chess-square ${light?'is-light':'is-dark'}`;if(chess.selectedSquare===square)cls+=' is-selected';if(targets.has(square))cls+=' is-legal-target';html+=`<button type="button" class="${cls}" data-chess-square="${square}" aria-label="${square}${piece?', peça '+(piece.color==='w'?'branca':'preta')+' '+piece.type:' vazio'}">${piece?`<span class="chess-piece ${piece.color==='w'?'white-piece':'black-piece'}">${chessPiece(piece)}</span>`:`<span class="chess-coordinate">${square}</span>`}</button>`;}}
    boardEl.innerHTML=html;
    const status=$('#chess-status');if(status)status.textContent=chessStatusText();
    const hist=$('#chess-history');if(hist){const moves=chess.history();let out=[];for(let i=0;i<moves.length;i+=2)out.push(`<li><span>${Math.floor(i/2)+1}.</span> ${escapeHTML(moves[i])} ${moves[i+1]?escapeHTML(moves[i+1]):''}</li>`);hist.innerHTML=out.join('')||'<li>Sem lances ainda.</li>';}
  }
  async function createChessGame(mode) {
    chessMode=mode||chessMode;chessWorkerTerminate();chessEngineReady=false;chessEnginePending=false;chess=null;
    if(gameTab==='chess') { renderChessShell(); return; }
    try{const Chess=await loadChessCtor();chess=new Chess();chess.selectedSquare=null;chess.flipped=false;renderChessBoard();if(chessMode==='computer')loadStockfish();}catch(_){initChess();}
  }
  function chessWorkerTerminate(){if(chessWorker){try{chessWorker.terminate();}catch(_){}chessWorker=null;}}
  function loadStockfish() {
    const status=$('#chess-engine-status');if(status)status.textContent='Baixando e inicializando Stockfish.js (lite, thread único)…';
    try {
      chessWorkerTerminate();
      chessWorker=new Worker('scripts/games/stockfish-loader.js');
      chessWorker.onmessage=function(event){const raw=event.data;const text=typeof raw==='string'?raw:raw&&raw.data?String(raw.data):'';for(const line of text.split(/\r?\n/)){if(!line)continue;if(line.includes('uciok')){chessWorker.postMessage('setoption name UCI_LimitStrength value true');chessWorker.postMessage('setoption name UCI_Elo value 1500');chessWorker.postMessage('isready');}else if(line.includes('readyok')){chessEngineReady=true;chessEnginePending=false;if(status)status.textContent='Stockfish pronto. Limitação UCI_Elo=1500 configurada; não é uma medição oficial de rating.';}else if(line.startsWith('bestmove ')){chessEnginePending=false;const move=line.split(/\s+/)[1];if(move&&move!=='(none)'&&chess&&chess.turn()==='b'&&!chess.isGameOver()){try{chess.move({from:move.slice(0,2),to:move.slice(2,4),promotion:move.length>4?move[4]:'q'});}catch(_){}renderChessBoard();}}}};
      chessWorker.onerror=function(){chessEngineReady=false;chessEnginePending=false;if(status)status.textContent='O motor não carregou. Verifique conexão, CDN ou bloqueador e tente iniciar uma nova partida.';};
      chessWorker.postMessage('uci');
      global.setTimeout(()=>{if(!chessEngineReady&&status&&status.textContent.includes('Baixando'))status.textContent='O carregamento do motor ainda não confirmou prontidão; tente novamente se permanecer assim.';},15000);
    } catch(err){if(status)status.textContent='Este navegador não permitiu iniciar o motor de xadrez.';}
  }
  function requestEngineMove(){if(!chess||!chessWorker||!chessEngineReady||chessEnginePending||chess.isGameOver()||chess.turn()!=='b')return;chessEnginePending=true;const status=$('#chess-status');if(status)status.textContent='Stockfish está calculando…';chessWorker.postMessage('position fen '+chess.fen());chessWorker.postMessage('go movetime 900');}
  async function handleChessSquare(square) {
    if(!chess||chess.isGameOver()||(chessMode==='computer'&&chess.turn()==='b'&&chessEnginePending))return;
    if(chessMode==='computer'&&chess.turn()==='b')return;
    const piece=chess.get(square);
    if(chess.selectedSquare){const legal=chess.moves({square:chess.selectedSquare,verbose:true});if(legal.some(m=>m.to===square)){const from=chess.selectedSquare;try{chess.move({from,to:square,promotion:'q'});chess.selectedSquare=null;renderChessBoard();if(chessMode==='computer')requestEngineMove();return;}catch(_){} }}
    if(piece&&piece.color===chess.turn()){chess.selectedSquare=square;renderChessBoard();}else if(chess.selectedSquare){chess.selectedSquare=null;renderChessBoard();}
  }
  const verbalQuestions = [
    {prompt:'Uma pesquisa observacional encontra associação entre estudar em grupo e obter notas melhores. Qual é a conclusão mais rigorosa?',options:['Estudar em grupo causa notas melhores em qualquer aluno.','A nota melhor leva necessariamente o estudante a procurar grupos.','A associação é compatível com um efeito, mas seleção prévia e outras variáveis podem explicar parte da relação.','A observação não tem valor informativo porque não foi um experimento.'],answer:2,explanation:'Uma associação observacional não estabelece sozinha a direção nem exclui confundidores; mas também não é automaticamente inútil.'},
    {prompt:'Todos os documentos da caixa A estão assinados. Alguns documentos assinados são confidenciais. O que necessariamente se conclui?',options:['Todos os documentos da caixa A são confidenciais.','Alguns documentos da caixa A são confidenciais.','Nenhum documento da caixa A é confidencial.','Não é possível concluir que algum documento da caixa A seja confidencial.'],answer:3,explanation:'Os documentos confidenciais podem estar fora da caixa A. As premissas não garantem interseção entre A e o grupo confidencial.'},
    {prompt:'Uma regra vale para todos os inteiros positivos: “se n é múltiplo de 4, então n é par”. Qual afirmação é logicamente garantida?',options:['Se n é par, então n é múltiplo de 4.','Se n não é par, então n não é múltiplo de 4.','Se n não é múltiplo de 4, então n é ímpar.','Se n é múltiplo de 4, então n também é múltiplo de 8.'],answer:1,explanation:'A contrapositiva de P → Q é não Q → não P e é logicamente equivalente. As recíprocas e conversas não são garantidas.'},
    {prompt:'Em uma equipe, Ana termina antes de Bruno. Carla termina depois de Bruno. Diego termina antes de Ana. Qual ordenação respeita todas as relações?',options:['Ana, Diego, Bruno, Carla','Diego, Ana, Bruno, Carla','Bruno, Diego, Ana, Carla','Diego, Bruno, Carla, Ana'],answer:1,explanation:'Diego < Ana < Bruno < Carla satisfaz as três restrições.'},
    {prompt:'Um teste identificou 8 resultados positivos em 100 pessoas. Nada foi informado sobre a sensibilidade, a especificidade ou a prevalência. O que se pode inferir?',options:['A probabilidade de doença após positivo é exatamente 8%.','O teste tem especificidade de 92%.','Há 8 positivos na amostra, mas a probabilidade posterior não pode ser calculada só com esses dados.','O teste tem 8% de erro.'],answer:2,explanation:'A fração de positivos na amostra não fornece sozinha a probabilidade de doença após um positivo nem os parâmetros do teste.'},
    {prompt:'Uma pessoa afirma: “Nenhum estudante melhora a retenção ao usar flashcards, em nenhuma circunstância”. Qual evidência refutaria diretamente essa afirmação universal?',options:['Um estudo encontra benefício médio, mas não informa se algum participante melhorou individualmente.','Uma revisão encontra efeitos diferentes entre matérias e formatos.','Um estudo bem conduzido e replicado mostra que pelo menos um estudante reteve melhor um conteúdo com flashcards do que com uma condição de comparação adequada.','Um experimento não encontra benefício de flashcards para um grupo específico.'],answer:2,explanation:'A afirmação universal nega qualquer caso de benefício. Um caso bem medido e comparado em que a retenção melhora é suficiente para refutá-la; um efeito médio sem resultado individual ou um resultado nulo em um grupo não demonstram isso diretamente.'},
    {prompt:'Uma sequência de testes tem resultados 2, 6, 12, 20, 30. Qual regra simples explica os termos observados e prevê o próximo?',options:['Somar números pares consecutivos: +4, +6, +8, +10; próximo +12.','Multiplicar por 2 e subtrair 1 a cada passo.','Somar sempre 5 e alternar a direção.','Os dados obrigam a usar a fórmula 2n+1.'],answer:0,explanation:'As diferenças são 4, 6, 8 e 10; a regra de diferenças pares consecutivas prevê 42. Sequências finitas podem admitir outras regras, então “a regra” não é única sem uma classe de modelos.'},
    {prompt:'A equipe escolheu a hipótese H porque combina com a maioria dos resultados observados. Qual é o próximo passo mais informativo?',options:['Repetir o mesmo teste até a maioria ficar mais convincente.','Buscar um resultado que H prevê e as hipóteses concorrentes não preveem, tentando distinguir as explicações.','Excluir resultados que não se encaixam em H sem investigar a causa.','Parar de coletar dados, pois maioria de resultados significa prova.'],answer:1,explanation:'Um teste discriminante ajuda a separar hipóteses rivais; acumular evidência pouco informativa ou descartar resultados inconvenientes cria risco de viés.'},
    {prompt:'Uma pessoa conclui que o ônibus sempre atrasa porque observou três atrasos consecutivos. Qual crítica é mais precisa?',options:['A conclusão é impossível porque três observações nunca informam nada.','A conclusão está demonstrada se as observações foram honestas.','A amostra é pequena para sustentar uma regra universal; seria útil definir período, frequência e condição.','A única explicação alternativa é que o relógio estava errado.'],answer:2,explanation:'O problema é generalizar de uma amostra curta para “sempre”. As observações são evidência, mas insuficiente para uma regra universal.'}
  ];
  function renderVerbal() {
    const target=$('#game-lab-content');if(!target)return;const q=verbalQuestions[verbalIndex%verbalQuestions.length];
    target.innerHTML=`<div class="game-card-head"><div><div class="eyebrow">ARGUMENTAÇÃO E DEDUÇÃO</div><h2>Raciocínio verbal</h2><p>As alternativas foram construídas para representar confusões plausíveis. Leia o alcance de cada afirmação antes de responder.</p></div><div class="game-head-actions"><span class="question-pill">Questão ${(verbalIndex%verbalQuestions.length)+1} / ${verbalQuestions.length}</span><button class="button button-ghost" data-verbal-next>Outra questão</button></div></div><article class="panel verbal-question"><h3>${escapeHTML(q.prompt)}</h3><div class="verbal-options">${q.options.map((o,i)=>`<button type="button" class="verbal-option" data-verbal-option="${i}" ${verbalResult?'disabled':''}><span>${String.fromCharCode(65+i)}</span><span>${escapeHTML(o)}</span></button>`).join('')}</div>${verbalResult?`<div class="feedback-panel ${verbalResult.correct?'':'is-wrong'}"><div class="feedback-title ${verbalResult.correct?'good':'bad'}">${verbalResult.correct?'Resposta correta':'Revise o argumento'}</div><p>${escapeHTML(q.explanation)}</p><p class="feedback-reference">Precisão observada no banco de raciocínio verbal desta instalação: ${hubState.stats.verbalCorrect} acertos registrados.</p></div>`:''}</article>`;
  }
  function hanoiNew(discs) { const n=Math.max(3,Math.min(7,Number(discs)||4));hanoi={n,pegs:[Array.from({length:n},(_,i)=>n-i),[],[]],selected:null,moves:0,history:[],finished:false,message:'Clique na torre de origem e depois na torre de destino.'};renderHanoi(); }
  function renderHanoi() {
    const target=$('#game-lab-content');if(!target)return;
    if(!hanoi)hanoiNew(4);
    target.innerHTML=`<div class="game-card-head"><div><div class="eyebrow">PLANEJAMENTO MULTIPASSOS</div><h2>Torres de Hanói</h2><p>Mova um disco por vez. Nunca coloque um disco maior sobre um menor. Objetivo: transferir a pilha completa para a terceira torre.</p></div><div class="game-head-actions"><label class="input-label">Discos<select id="hanoi-discs" class="select-control">${[3,4,5,6,7].map(n=>`<option value="${n}" ${hanoi.n===n?'selected':''}>${n} discos (mínimo ${2**n-1} movimentos)</option>`).join('')}</select></label><button class="button button-secondary" data-hanoi-new>Reiniciar</button></div></div><div class="hanoi-status panel"><strong>${hanoi.finished?'Desafio concluído!':`${hanoi.moves} movimento(s)`}</strong><span>${hanoi.finished?`Mínimo teórico: ${2**hanoi.n-1} movimentos.`:`Torre selecionada: ${hanoi.selected===null?'nenhuma':hanoi.selected+1}.`}</span></div><div class="hanoi-board">${hanoi.pegs.map((peg,i)=>`<button type="button" class="hanoi-peg ${hanoi.selected===i?'is-selected':''}" data-hanoi-peg="${i}" aria-label="Torre ${i+1}, ${peg.length} discos"><span class="hanoi-stack">${peg.slice().reverse().map(d=>`<span class="hanoi-disk disk-${d}" style="--disk-width:${22+d/hanoi.n*65}%">${d}</span>`).join('')}</span><span class="hanoi-peg-base"></span><strong>Torre ${i+1}</strong></button>`).join('')}</div><div class="panel"><p id="hanoi-message" aria-live="polite">${escapeHTML(hanoi.finished?'Todos os discos foram movidos corretamente.':(hanoi.message||'Clique na torre de origem e depois na torre de destino.'))}</p><p class="feedback-reference">O menor número possível é 2ⁿ − 1. Compare o total de movimentos com esse limite após terminar.</p></div>`;
  }
  function clickHanoiPeg(destination) {
    if(!hanoi||hanoi.finished)return;
    if(hanoi.selected===null){if(!hanoi.pegs[destination].length){hanoi.message='A torre escolhida está vazia. Selecione uma torre que tenha discos.';renderHanoi();return;}hanoi.selected=destination;hanoi.message='Agora escolha a torre de destino.';renderHanoi();return;}
    const source=hanoi.selected;if(source===destination){hanoi.selected=null;hanoi.message='Seleção cancelada. Escolha uma torre de origem.';renderHanoi();return;}
    const disk=hanoi.pegs[source][hanoi.pegs[source].length-1], top=hanoi.pegs[destination][hanoi.pegs[destination].length-1];
    if(!disk){hanoi.selected=null;hanoi.message='Não há disco disponível nessa origem.';renderHanoi();return;}if(top&&top<disk){hanoi.message='Movimento inválido: um disco maior não pode ficar sobre um menor.';hanoi.selected=null;renderHanoi();return;}
    hanoi.history.push({pegs:hanoi.pegs.map(p=>p.slice()),moves:hanoi.moves});hanoi.pegs[source].pop();hanoi.pegs[destination].push(disk);hanoi.moves++;hanoi.selected=null;hanoi.finished=hanoi.pegs[2].length===hanoi.n;hanoi.message=hanoi.finished?'Todos os discos foram movidos corretamente.':'Movimento válido. Continue planejando a transferência.';if(hanoi.finished){hubState.stats.hanoiSolved++;saveState();}renderHanoi();
  }
  function renderGameTab(tab) {
    gameTab=tab;
    $$('#view-games [data-game-tab]').forEach(b=>{b.classList.toggle('is-selected',b.dataset.gameTab===tab);b.setAttribute('aria-selected',String(b.dataset.gameTab===tab));});
    if(tab==='sudoku'){ensureSudoku();renderSudoku();}
    else if(tab==='chess')renderChessShell();
    else if(tab==='hanoi') {if(!hanoi)hanoiNew(4);renderHanoi();}
    else if(tab==='verbal')renderVerbal();
  }
  function renderObmep() {renderObmepMetrics();filterObmep(false);}
  function renderView(view) {
    if(view==='obmep')renderObmep(); else if(view==='study')renderTutorials();else if(view==='plan'){if(hubState.plan){$('#plan-minutes').value=String(hubState.plan.minutes);$('#plan-horizon').value=String(hubState.plan.horizon);$('#plan-level').value=hubState.plan.level||'intermediate';$$('input[name="plan-focus"]').forEach(el=>el.checked=hubState.plan.focus.includes(el.value));}renderPlan();}else if(view==='games')renderGameTab(gameTab);
  }
  function bindHubEvents() {
    document.addEventListener('click',event=>{
      const nav=event.target.closest('[data-nav]');if(nav&&['obmep','study','plan','games'].includes(nav.dataset.nav)){global.setTimeout(()=>renderView(nav.dataset.nav),0);return;}
      const obmepStart=event.target.closest('[data-obmep-start]');if(obmepStart){MF.startQuestion('obmep',obmepStart.dataset.obmepStart);return;}
      if(event.target.closest('[data-obmep-mock]')){MF.startModuleSession('obmep','obmep-mock',4);return;}
      if(event.target.closest('[data-obmep-more]')){obmepLimit+=24;filterObmep(false);return;}
      const done=event.target.closest('[data-study-done]');if(done){const id=done.dataset.studyDone;hubState.tutorialsDone=hubState.tutorialsDone.includes(id)?hubState.tutorialsDone.filter(x=>x!==id):[...hubState.tutorialsDone,id];saveState();renderTutorials();return;}
      if(event.target.closest('[data-plan-export]')){exportPlan();return;}
      if(event.target.closest('[data-sudoku-new]')){newSudoku($('#sudoku-difficulty')?.value||'medium');return;}
      if(event.target.closest('[data-sudoku-reset]')){if(sudoku){sudoku.values=sudoku.puzzle.slice();sudoku.notes=Array.from({length:81},()=>[]);sudoku.selected=40;sudoku.moves=0;sudoku.hints=0;sudoku.finished=false;saveSudoku();renderSudoku();}return;}
      const cell=event.target.closest('[data-sudoku-cell]');if(cell&&sudoku){sudoku.selected=Number(cell.dataset.sudokuCell);saveSudoku();renderSudoku();return;}
      const num=event.target.closest('[data-sudoku-number]');if(num){sudokuEntry(Number(num.dataset.sudokuNumber));return;}
      if(event.target.closest('[data-sudoku-check]')){checkSudoku();return;}if(event.target.closest('[data-sudoku-hint]')){sudokuHint();return;}
      const gameTabButton=event.target.closest('[data-game-tab]');if(gameTabButton){renderGameTab(gameTabButton.dataset.gameTab);return;}
      const chessSquare=event.target.closest('[data-chess-square]');if(chessSquare){handleChessSquare(chessSquare.dataset.chessSquare);return;}
      if(event.target.closest('[data-chess-new]')){chessMode=$('#chess-mode')?.value||'local';createChessGame(chessMode);return;}
      if(event.target.closest('[data-chess-retry]')){chessCtorPromise=null;initChess();return;}
      if(event.target.closest('[data-chess-undo]')){if(chess&&chess.history().length){chess.undo();if(chessMode==='computer'&&chess.history().length)chess.undo();renderChessBoard();}return;}
      if(event.target.closest('[data-chess-flip]')){if(chess){chess.flipped=!chess.flipped;renderChessBoard();}return;}
      if(event.target.closest('[data-hanoi-new]')){hanoiNew($('#hanoi-discs')?.value||4);return;}
      const peg=event.target.closest('[data-hanoi-peg]');if(peg){clickHanoiPeg(Number(peg.dataset.hanoiPeg));return;}
      if(event.target.closest('[data-verbal-next]')){verbalIndex=(verbalIndex+1)%verbalQuestions.length;verbalResult=null;renderVerbal();return;}
      const verbal=event.target.closest('[data-verbal-option]');if(verbal&&!verbalResult){const q=verbalQuestions[verbalIndex%verbalQuestions.length];const correct=Number(verbal.dataset.verbalOption)===q.answer;verbalResult={correct};if(correct){hubState.stats.verbalCorrect++;saveState();}renderVerbal();return;}
    });
    document.addEventListener('input',event=>{if(event.target.id==='obmep-search')filterObmep(true);});
    document.addEventListener('change',event=>{
      if(['obmep-mission-filter','obmep-topic-filter','obmep-transcript-filter'].includes(event.target.id))filterObmep(true);
      if(event.target.id==='sudoku-difficulty')newSudoku(event.target.value);
      if(event.target.id==='chess-mode'){chessMode=event.target.value;createChessGame(chessMode);}
      if(event.target.id==='hanoi-discs')hanoiNew(event.target.value);
      if(event.target.matches('[data-plan-complete]')){hubState.planCompleted=hubState.planCompleted||[];const day=Number(event.target.dataset.planComplete);if(event.target.checked&&!hubState.planCompleted.includes(day))hubState.planCompleted.push(day);else if(!event.target.checked)hubState.planCompleted=hubState.planCompleted.filter(n=>n!==day);saveState();}
    });
    const planForm=$('#plan-form');if(planForm)planForm.addEventListener('submit',event=>{event.preventDefault();savePlanFromForm();});
    document.addEventListener('keydown',event=>{if(gameTab==='sudoku'&&$('#view-games')?.classList.contains('is-visible')&&!event.ctrlKey&&!event.metaKey&&!event.altKey){if(/^[1-9]$/.test(event.key))sudokuEntry(Number(event.key));else if(event.key==='Backspace'||event.key==='Delete')sudokuEntry(0);}});
  }
  function init(){bindHubEvents();const initial=hubState.sudoku;if(initial&&Array.isArray(initial.puzzle)&&initial.puzzle.length===81)sudoku={...initial,notes:Array.isArray(initial.notes)&&initial.notes.length===81?initial.notes:Array.from({length:81},()=>[])};renderObmepMetrics();}
  init();
})(window,document);
