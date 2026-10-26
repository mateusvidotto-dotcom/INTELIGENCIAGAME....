(function (global) {
  'use strict';
  const MF = global.MindForge = global.MindForge || {};

  const fields = [
    { key:'understand', label:'1. Compreensão do enunciado', draftLabel:'1. Compreensão', hint:'O que está sendo pedido? Quais dados, condições e subitens foram fornecidos?', required:true },
    { key:'plan', label:'2. Estratégia antes dos cálculos', draftLabel:'2. Estratégia', hint:'Que desenho, tabela, caso pequeno, variável ou propriedade pode ajudar? Por que escolheu essa estratégia?', required:true },
    { key:'work', label:'3. Desenvolvimento da resolução', draftLabel:'3. Desenvolvimento', hint:'Registre os passos, cálculos e justificativas. Não pule a ligação entre uma etapa e a próxima.', required:true },
    { key:'validate', label:'4. Verificação da resposta', draftLabel:'4. Verificação', hint:'Confira os subitens e as condições. O resultado satisfaz o enunciado? Existe algum caso que sua solução não cobre?', required:true },
    { key:'takeaway', label:'5. O que aprendi', draftLabel:'5. Aprendizado', hint:'Qual ideia desbloqueou a questão? Em que outro problema essa estratégia poderia ser útil?', required:false }
  ];

  function createEmpty(legacyDraft) {
    return { understand:'', plan:'', work:String(legacyDraft || '').slice(0,420), validate:'', takeaway:'' };
  }
  function buildDraft(work) {
    const current = work && typeof work === 'object' ? work : {};
    return fields
      .filter(field => String(current[field.key] || '').trim())
      .map(field => `${field.draftLabel}: ${String(current[field.key]).trim()}`)
      .join('\n\n')
      .slice(0,2600)
      .trim();
  }
  function validate(work) {
    const current = work && typeof work === 'object' ? work : {};
    const missing = fields.filter(field => field.required && String(current[field.key] || '').trim().length < 5);
    const draft = buildDraft(current);
    const contentLength = fields.reduce((total, field) => total + String(current[field.key] || '').trim().length, 0);
    if (missing.length) return { ok:false, missing:missing.map(field => field.key), length:draft.length, contentLength, message:'Complete as etapas centrais: ' + missing.map(field => field.label.replace(/^\d+\. /,'')).join(', ') + '.' };
    if (contentLength < 60) return { ok:false, missing:[], length:draft.length, contentLength, message:'Desenvolva um pouco mais a resolução (pelo menos 60 caracteres escritos por você nas etapas).' };
    return { ok:true, missing:[], length:draft.length, contentLength, message:'Resolução estruturada pronta para registro.' };
  }

  MF.ObmepWorkflow = { fields, createEmpty, buildDraft, validate };
})(window);
