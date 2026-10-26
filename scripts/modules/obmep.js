(function (global) {
  'use strict';
  const MF = global.MindForge;
  const data = Array.isArray(global.MFOBMEP_DATA) ? global.MFOBMEP_DATA : [];
  if (!MF || !data.length) throw new Error('O banco de questões OBMEP não foi carregado.');

  function hintFor(record) {
    if (Array.isArray(record.specificHints) && record.specificHints.length) return record.specificHints.slice();
    const topics = (record.topics || []).join(' ').toLocaleLowerCase('pt-BR');
    let middle = 'Transforme cada condição do enunciado em uma restrição explícita. Procure primeiro o que é obrigatório antes de testar possibilidades.';
    if (topics.includes('geometria')) middle = 'Faça um esboço auxiliar e marque medidas, ângulos e relações. Não presuma que a figura esteja em escala; use as condições escritas.';
    else if (topics.includes('contagem') || topics.includes('probabilidade')) middle = 'Organize os casos em categorias que não se sobreponham. Verifique se cada caso foi contado uma vez e se nenhum caso possível ficou de fora.';
    else if (topics.includes('funções')) middle = 'Defina as variáveis, escreva a regra matemática de cada situação e confira os limites de validade e as unidades.';
    else if (topics.includes('números')) middle = 'Defina uma variável para a quantidade desconhecida e traduza as condições em uma relação algébrica. Antes de concluir, confira as restrições do domínio.';
    return [
      'Leia a página original e separe os dados de cada subitem. Anote o que é conhecido, o que precisa ser encontrado e quais restrições não podem ser violadas.',
      middle,
      'Valide a solução substituindo o resultado nas condições originais. Mostre por que o método cobre todos os casos relevantes e responda a cada subitem.'
    ];
  }

  const questions = data.map(record => ({
    id: record.id,
    moduleId: 'obmep',
    type: 'open',
    level: record.internalDifficulty || 6,
    prompt: `${record.title}`,
    shortTitle: `OBMEP · Missão ${record.mission} · página ${record.sourcePage}`,
    context: `Questão original da coleção fornecida · nível oficial indicado no material: ${record.sourceLevel}. A dificuldade interna é uma estimativa pedagógica do jogo, não uma equivalência oficial. Leia a imagem com atenção; a plataforma não fará correção automática de uma resolução discursiva.`,
    answer: null,
    criteria: [
      'Identifiquei os dados, as incógnitas e as condições de cada subitem.',
      'Mostrei as etapas do raciocínio e justifiquei os passos importantes.',
      'Conferi o resultado com as condições do enunciado e as unidades.',
      'Respondi a todos os itens solicitados, sem depender apenas de uma resposta final.'
    ],
    hints: hintFor(record),
    reference: `${record.sourceDocument} · página ${record.sourcePage} · material fornecido pelo usuário`,
    imageUrl: record.imageUrl,
    pdfUrl: record.pdfUrl || null,
    imageAlt: record.imageAlt,
    statementText: record.statementText,
    transcriptAvailable: record.transcriptAvailable,
    sourceMission: record.mission,
    sourcePage: record.sourcePage,
    sourceYear: record.officialYear,
    sourceQuestionNumber: record.officialQuestionNumber,
    sourceLevel: record.sourceLevel,
    sourceDocument: record.sourceDocument,
    sourceAttribution: record.sourceAttribution,
    topics: record.topics,
    searchText: record.searchText,
    transcriptStatus: record.transcriptAvailable ? 'Texto extraído automaticamente; consulte a imagem para confirmar fórmulas e figuras.' : 'A extração textual foi incompleta; use a imagem original como referência principal.',
    workedSolution: record.workedSolution || null,
    solutionNote: 'Os PDFs fornecidos são folhas de questões com espaço para resposta; não incluem um gabarito comentado completo. A plataforma não inventa uma resolução oficial quando ela não foi fornecida ou verificada.'
  }));

  MF.registerModule({
    id: 'obmep', title: 'Biblioteca OBMEP', shortTitle: 'OBMEP',
    description: 'Questões originais das missões de nível 3 fornecidas, com figuras preservadas, busca, registro da resolução e pistas graduais.',
    icon: '∑', accent: '#ffbe86', category: 'academic', tag: 'OLIMPÍADA', kicker: 'OFICINA DE MATEMÁTICA OLÍMPICA',
    subtitle: 'Resolva com justificativas. A figura original e a transcrição extraída acompanham a questão.',
    questions, duration: '15–40 min'
  });
})(window);
