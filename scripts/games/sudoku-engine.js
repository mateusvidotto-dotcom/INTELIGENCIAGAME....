(function (root, factory) {
  'use strict';
  const engine = factory();
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (root) root.MindForgeSudokuEngine = engine;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SIZE = 9;
  const allDigits = [1,2,3,4,5,6,7,8,9];
  const clone = board => board.slice();
  const shuffle = (array, rng) => {
    const out = array.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  function rowOf(index) { return Math.floor(index / SIZE); }
  function colOf(index) { return index % SIZE; }
  function boxStart(index) { return { row: Math.floor(rowOf(index) / 3) * 3, col: Math.floor(colOf(index) / 3) * 3 }; }
  function candidates(board, index) {
    if (board[index]) return [];
    const row = rowOf(index), col = colOf(index), box = boxStart(index), used = new Set();
    for (let i = 0; i < SIZE; i++) {
      used.add(board[row * SIZE + i]);
      used.add(board[i * SIZE + col]);
    }
    for (let r = box.row; r < box.row + 3; r++) for (let c = box.col; c < box.col + 3; c++) used.add(board[r * SIZE + c]);
    return allDigits.filter(value => !used.has(value));
  }
  function findBestEmpty(board, rng, randomize) {
    let bestIndex = -1, bestOptions = null;
    for (let index = 0; index < board.length; index++) {
      if (board[index]) continue;
      const options = candidates(board, index);
      if (!options.length) return { index, options: [] };
      if (!bestOptions || options.length < bestOptions.length) {
        bestIndex = index; bestOptions = options;
        if (options.length === 1) break;
      } else if (randomize && options.length === bestOptions.length && rng() < 0.18) {
        bestIndex = index; bestOptions = options;
      }
    }
    if (randomize && bestOptions && bestOptions.length > 1) bestOptions = shuffle(bestOptions, rng);
    return { index: bestIndex, options: bestOptions || [] };
  }
  function fillBoard(board, rng) {
    const next = findBestEmpty(board, rng, true);
    if (next.index === -1) return true;
    for (const value of next.options) {
      board[next.index] = value;
      if (fillBoard(board, rng)) return true;
      board[next.index] = 0;
    }
    return false;
  }
  function countSolutions(input, limit) {
    const board = clone(input);
    let count = 0, firstSolution = null;
    const maxCount = Math.max(1, Math.min(2, Number(limit) || 2));
    function visit() {
      if (count >= maxCount) return;
      const next = findBestEmpty(board, Math.random, false);
      if (next.index === -1) {
        count++;
        if (!firstSolution) firstSolution = clone(board);
        return;
      }
      for (const value of next.options) {
        board[next.index] = value;
        visit();
        board[next.index] = 0;
        if (count >= maxCount) return;
      }
    }
    visit();
    return { count, solution: firstSolution };
  }
  function isValidComplete(board) {
    if (!Array.isArray(board) || board.length !== 81 || board.some(v => !Number.isInteger(v) || v < 1 || v > 9)) return false;
    for (let i=0;i<81;i++) {
      const r=rowOf(i), c=colOf(i), b=boxStart(i);
      for (let j=0;j<9;j++) {
        if (j!==c && board[r*9+j]===board[i]) return false;
        if (j!==r && board[j*9+c]===board[i]) return false;
      }
      for(let br=b.row;br<b.row+3;br++) for(let bc=b.col;bc<b.col+3;bc++) {
        const j=br*9+bc;
        if(j!==i&&board[j]===board[i]) return false;
      }
    }
    return true;
  }
  function generate(difficulty, rng) {
    const rand = typeof rng === 'function' ? rng : Math.random;
    const targets = { easy: 34, medium: 43, hard: 49 };
    const targetBlanks = targets[difficulty] || targets.medium;
    const solution = Array(81).fill(0);
    if (!fillBoard(solution, rand) || !isValidComplete(solution)) throw new Error('Não foi possível gerar um tabuleiro completo válido.');
    const puzzle = clone(solution);
    let blanks = 0;
    for (const index of shuffle(Array.from({length:81},(_,i)=>i), rand)) {
      if (blanks >= targetBlanks) break;
      const saved = puzzle[index];
      puzzle[index] = 0;
      const test = countSolutions(puzzle, 2);
      if (test.count === 1) blanks++;
      else puzzle[index] = saved;
    }
    const uniqueness = countSolutions(puzzle, 2);
    if (uniqueness.count !== 1 || !isValidComplete(solution)) throw new Error('O gerador produziu um puzzle inválido ou ambíguo.');
    return { puzzle, solution, difficulty, blanks, unique: true };
  }
  function conflicts(board) {
    const conflict = new Set();
    function checkGroup(indices) {
      const seen = new Map();
      for (const index of indices) {
        const value = board[index];
        if (!value) continue;
        if (!seen.has(value)) seen.set(value, []);
        seen.get(value).push(index);
      }
      for (const positions of seen.values()) if (positions.length > 1) positions.forEach(index => conflict.add(index));
    }
    for (let r=0;r<9;r++) checkGroup(Array.from({length:9},(_,c)=>r*9+c));
    for (let c=0;c<9;c++) checkGroup(Array.from({length:9},(_,r)=>r*9+c));
    for (let br=0;br<3;br++) for (let bc=0;bc<3;bc++) {
      const group=[]; for(let r=br*3;r<br*3+3;r++) for(let c=bc*3;c<bc*3+3;c++) group.push(r*9+c); checkGroup(group);
    }
    return Array.from(conflict);
  }
  return { candidates, countSolutions, conflicts, generate, isValidComplete };
});
