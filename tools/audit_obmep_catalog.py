#!/usr/bin/env python3
"""Valida o catálogo OBMEP e a presença de cada imagem de fonte fornecida."""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'data' / 'obmep' / 'questions.json'

def main() -> int:
    try:
        payload = json.loads(CATALOG.read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'FALHA: não foi possível ler o catálogo OBMEP: {exc}', file=sys.stderr)
        return 2
    questions = payload.get('questions') if isinstance(payload, dict) else None
    if not isinstance(questions, list):
        print('FALHA: catálogo sem lista questions.', file=sys.stderr)
        return 2
    errors = []
    ids = set()
    for q in questions:
        qid = q.get('id')
        if not isinstance(qid, str) or not qid or qid in ids:
            errors.append(f'ID ausente ou duplicado: {qid!r}')
        ids.add(qid)
        for key in ('mission','sourcePage','sourceDocument','imageUrl','pdfUrl','title','topics','searchText'):
            if key not in q or q[key] in (None, '', []): errors.append(f'{qid}: metadado obrigatório ausente ({key})')
        image = ROOT / str(q.get('imageUrl',''))
        if not image.is_file(): errors.append(f'{qid}: imagem não encontrada: {q.get("imageUrl")}')
        pdf = ROOT / str(q.get('pdfUrl',''))
        if not pdf.is_file(): errors.append(f'{qid}: PDF original não encontrado: {q.get("pdfUrl")}')
        if not isinstance(q.get('statementText'), str): errors.append(f'{qid}: statementText deve ser texto, mesmo quando vazio')
        if q.get('officialYear') is not None and (not isinstance(q['officialYear'], int) or not 2000 <= q['officialYear'] <= 2035):
            errors.append(f'{qid}: ano oficial fora do intervalo esperado ou tipo inválido')
    missions = sorted({q.get('mission') for q in questions if isinstance(q.get('mission'), int)})
    if len(questions) != 56: errors.append(f'Esperadas 56 questões nas missões fornecidas; encontradas {len(questions)}')
    if len(missions) != 14: errors.append(f'Esperadas 14 missões presentes; encontradas {len(missions)}')
    if payload.get('missingMissions') != [9]: errors.append('O catálogo deve declarar a missão 9 como ausente, conforme o ZIP recebido.')
    if payload.get('questionCount') != len(questions): errors.append('questionCount não corresponde ao número de registros.')
    pdf_files = sorted({q.get('pdfUrl') for q in questions if q.get('pdfUrl')})
    if len(pdf_files) != 14: errors.append(f'Esperados 14 PDFs originais distintos; encontrados {len(pdf_files)}')
    if payload.get('originalPdfCount') != 14: errors.append('originalPdfCount deve registrar os 14 PDFs recebidos.')
    declared_pdfs = payload.get('originalPdfFiles')
    if not isinstance(declared_pdfs, list) or sorted(declared_pdfs) != pdf_files:
        errors.append('originalPdfFiles não corresponde aos PDFs referenciados no catálogo.')
    for mission in missions:
        mission_questions = [q for q in questions if q.get('mission') == mission]
        if mission_questions and len({q.get('pdfUrl') for q in mission_questions}) != 1:
            errors.append(f'Missão {mission}: questões apontam para PDFs originais diferentes')
    print('AUDITORIA DO CATÁLOGO OBMEP')
    print(f'Questões: {len(questions)} | Missões recebidas: {len(missions)} | Missões ausentes: {payload.get("missingMissions")} | Imagens: {sum(1 for q in questions if (ROOT / str(q.get("imageUrl",""))).is_file())}/{len(questions)} | PDFs originais: {sum(1 for pdf in pdf_files if (ROOT / pdf).is_file())}/{len(pdf_files)}')
    print(f'Soluções revisadas individualmente: {sum(1 for q in questions if q.get("workedSolution"))}')
    if errors:
        for item in errors: print('FALHA:', item, file=sys.stderr)
        return 1
    print('PASSOU: IDs, metadados, imagens e informação de cobertura coerentes.')
    return 0
if __name__ == '__main__': raise SystemExit(main())
