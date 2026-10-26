# Third-party notices

This project loads the following open-source libraries only when the chess module is used. These libraries are not bundled in this repository; they are fetched from jsDelivr by the user's browser. Versions and licenses should be rechecked if the pinned dependency version changes.

## chess.js 1.4.0
- Purpose: legal move generation, chess rules, game-state validation, check/checkmate/draw detection.
- License: BSD-2-Clause.
- Project and package information: https://github.com/jhlywa/chess.js and https://www.jsdelivr.com/package/npm/chess.js

## Stockfish.js 19.0.1 (lite, single-threaded WASM engine)
- Purpose: UCI chess engine for the optional player-versus-computer mode.
- License: GPL-3.0.
- Project, build notes, and license: https://github.com/nmrugg/stockfish.js and https://github.com/nmrugg/stockfish.js/blob/master/Copying.txt
- The application loads the engine from jsDelivr at runtime and does not redistribute the engine binaries here: https://www.jsdelivr.com/package/npm/stockfish

The chess interface states that an internet connection is required to load these dependencies. The configured `UCI_Elo=1500` value is an engine setting, not a certified or measured Elo rating for this implementation.

## OBMEP mission PDFs supplied with the project

The 14 mission PDFs in `assets/obmep/originals/` were provided by the user. This project preserves source attribution from the documents but does not claim ownership or establish a right to redistribute them. Before publishing the repository publicly, confirm the original distribution terms and keep the attribution required by the source.
