#!/usr/bin/env python3
"""Extract USFM section headings into Kol Basilea pericope JSON.

Usage:
  python3 scripts/extract-pericopes.py --input path/to/BSB_USFM --output dist/data/pericopes --dry-run

Requires locally downloaded USFM from https://berean.bible/downloads.htm .
This does not translate headings; outputs source titles as review-needed,
and does not overwrite reviewed editorial files unless --overwrite is set.
"""
import argparse
import json
import pathlib
import re
import sys

BOOK_CODES = {
"GEN":"genesis",
"EXO":"exodo",
"LEV":"levitico",
"NUM":"numeros",
"DEU":"deuteronomio",
"JOS":"josue",
"JDG":"jueces",
"RUT":"rut",
"EZR":"esdras",
"NEH":"nehemias",
"EST":"ester",
"JOB":"job",
"PSA":"salmos",
"PRO":"proverbios",
"ECC":"eclesiastes",
"SNG":"cantares",
"ISA":"isaias",
"JER":"jeremias",
"LAM":"lamentaciones",
"EZK":"ezequiel",
"DAN":"daniel",
"HOS":"oseas",
"JOL":"joel",
"AMO":"amos",
"OBA":"abdias",
"JON":"jonas",
"MIC":"miqueas",
"NAM":"nahum",
"HAB":"habacuc",
"ZEP":"sofonias",
"HAG":"ageo",
"ZEC":"zacarias",
"MAL":"malaquias",
"MAT":"mateo",
"MRK":"marcos",
"LUK":"lucas",
"JHN":"juan",
"ACT":"hechos",
"ROM":"romanos",
"GAL":"galatas",
"EPH":"efesios",
"PHP":"filipenses",
"COL":"colosenses",
"TIT":"tito",
"PHM":"filemon",
"HEB":"hebreos",
"JAS":"santiago",
"JUD":"judas",
"REV":"apocalipsis",
"1JN":"1-juan","2JN":"2-juan","3JN":"3-juan",
"1SA":"1-samuel","2SA":"2-samuel","1KI":"1-reyes","2KI":"2-reyes",
"1CH":"1-cronicas","2CH":"2-cronicas","1CO":"1-corintios","2CO":"2-corintios",
"1TH":"1-tesalonicenses","2TH":"2-tesalonicenses","1TI":"1-timoteo","2TI":"2-timoteo",
"1PE":"1-pedro","2PE":"2-pedro",
}
MARKER = re.compile(r"\\(id|c|v|s[1-5]?|ms[1-5]?)\s+([^\\\r\n]*)")
def parse_file(path):
    raw = path.read_text(encoding="utf-8-sig")
    book_match = re.search(r"\\id\s+([A-Z0-9]{3})", raw)
    if not book_match: return None
    code = book_match.group(1)
    book_id = BOOK_CODES.get(code)
    if not book_id: return None
    chapter = None
    verse = None
    pending = []
    chapters = {}
    for match in MARKER.finditer(raw):
        marker, value = match.group(1), match.group(2).strip()
        if marker == "c":
            number = re.match(r"\d+", value)
            if number: chapter, verse = int(number.group()), None
        elif marker == "v":
            number = re.match(r"\d+", value)
            if number:
                verse = int(number.group())
                if chapter and pending:
                    for title in pending:
                        chapters.setdefault(chapter, []).append({"startVerse":verse,"sourceTitle":title,"title":title,"status":"needs-translation"})
                    pending.clear()
        elif marker.startswith("s") or marker.startswith("ms"):
            title = re.sub(r"\\[a-z0-9*]+", "", value).strip()
            if title: pending.append(title)
    if pending:
        print(f"WARNING {path.name}: {len(pending)} heading(s) without following verse", file=sys.stderr)
    return {"bookId":book_id,"source":{"name":"Berean Standard Bible","url":"https://berean.bible/downloads.htm","license":"Public domain","note":"Automatically extracted from USFM; Spanish editorial review required."},"chapters":[{"number":num,"sections":sections} for num,sections in sorted(chapters.items())]}
def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input",required=True,type=pathlib.Path)
    p.add_argument("--output",required=True,type=pathlib.Path)
    p.add_argument("--dry-run",action="store_true")
    p.add_argument("--overwrite",action="store_true")
    a=p.parse_args()
    paths = [a.input] if a.input.is_file() else sorted(a.input.rglob("*.usfm"))+sorted(a.input.rglob("*.SFM"))+sorted(a.input.rglob("*.sfm"))
    if not paths: p.error("No USFM files found")
    count=0
    for path in paths:
        data=parse_file(path)
        if not data: continue
        dest=a.output/(data["bookId"]+".json")
        if dest.exists() and not a.overwrite:
            print("SKIP existing reviewed file:",dest)
            continue
        if not a.dry_run:
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print(("CHECK" if a.dry_run else "WROTE"),dest,"sections:",sum(len(c["sections"]) for c in data["chapters"]))
        count+=1
    print("Processed",count,"books")
    if count == 0 and not list(a.output.glob("*.json")): sys.exit(1)
if __name__=="__main__":main()
