#!/usr/bin/env python3
"""Translate USFM pericope draft titles offline with Argos Translate.
Machine translations are labelled as such and must be editorially reviewed.
Existing reviewed Spanish titles are not modified.
"""
import json
from pathlib import Path
import argostranslate.package
import argostranslate.translate

argostranslate.package.update_package_index()
models = [p for p in argostranslate.package.get_available_packages() if p.from_code == "en" and p.to_code == "es"]
if not models: raise SystemExit("No English-Spanish Argos package available")
argostranslate.package.install_from_path(models[0].download())
translator = argostranslate.translate.get_translation_from_codes("en", "es")
if not translator: raise SystemExit("Translation model not loaded")
count = 0
for path in sorted(Path("dist/data/pericopes").glob("*.json")):
    data = json.loads(path.read_text(encoding="utf-8"))
    chapters = data.get("chapters") or [data]
    changed = False
    for chapter in chapters:
        for section in chapter.get("sections", []):
            if section.get("status") != "needs-translation": continue
            title = translator.translate(section["sourceTitle"]).strip()
            if not title: raise SystemExit(f"Translation missing: {path}: {section['sourceTitle']}")
            if title == section["sourceTitle"]:
                section["status"] = "needs-editorial-translation"
                continue
            section["title"] = title[:1].upper() + title[1:]
            section["status"] = "machine-translated"
            count += 1
            changed = True
    if changed: path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"Translated {count} section headings. Editorial review remains required.")
