#!/usr/bin/env python3
"""Verifica referências locais essenciais na página de entrada do site estático."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / 'index.html'

class AssetsParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[str, str]] = []
        self.ids: list[str] = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'script' and attrs.get('src'):
            self.refs.append(('script', attrs['src']))
        elif tag == 'link' and attrs.get('href') and attrs.get('rel') in ('stylesheet', 'icon', 'manifest'):
            self.refs.append((f"link[{attrs.get('rel')}]", attrs['href']))

def is_external(ref: str) -> bool:
    return bool(re.match(r'^(?:[a-z][a-z0-9+.-]*:|//|#)', ref, re.I))

def main() -> int:
    if not HTML.is_file():
        print('FALHA: index.html ausente.', file=sys.stderr)
        return 2
    parser = AssetsParser()
    parser.feed(HTML.read_text(encoding='utf-8'))
    errors: list[str] = []
    seen: set[str] = set()
    duplicates: list[str] = []
    for item in parser.ids:
        if item in seen and item not in duplicates:
            duplicates.append(item)
        seen.add(item)
    if duplicates:
        errors.append('IDs HTML duplicados: ' + ', '.join(sorted(duplicates)))
    for kind, raw_ref in parser.refs:
        ref = raw_ref.split('?', 1)[0].split('#', 1)[0]
        if not ref or is_external(ref):
            continue
        path = (ROOT / ref).resolve()
        if ROOT.resolve() not in path.parents and path != ROOT.resolve():
            errors.append(f'Referência local sai da raiz do projeto ({kind}): {ref}')
        elif not path.is_file():
            errors.append(f'Arquivo local referenciado não encontrado ({kind}): {ref}')
    worker = ROOT / 'scripts/games/stockfish-loader.js'
    if not worker.is_file():
        errors.append('Worker Stockfish configurado no jogo não foi encontrado.')
    print('AUDITORIA DE ARQUIVOS ESTÁTICOS')
    print(f'Referências locais HTML verificadas: {len(parser.refs)} | IDs HTML: {len(parser.ids)} | Worker Stockfish: {worker.is_file()}')
    if errors:
        for error in errors:
            print('FALHA:', error, file=sys.stderr)
        return 1
    print('PASSOU: referências essenciais e IDs da página de entrada coerentes.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
