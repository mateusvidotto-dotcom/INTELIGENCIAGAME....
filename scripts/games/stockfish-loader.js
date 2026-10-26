/* Stockfish.js GPL-3.0: carregado sob demanda a partir do pacote oficial via jsDelivr. */
'use strict';
const STOCKFISH_BASE = 'https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/';
self.Module = self.Module || {};
self.Module.locateFile = function (path) {
  return path.endsWith('.wasm') ? STOCKFISH_BASE + path : path;
};
importScripts(STOCKFISH_BASE + 'stockfish-19-lite-single.js');
