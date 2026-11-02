#!/usr/bin/env python3
"""Validate Atlas artwork; missing images use unique in-browser SVG illustrations."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
data=json.loads((root/"dist/data/history/timeline.json").read_text())
approved={"exact","related","period-context"}
seen={}
counts={"total":0,"approved":0,"editorial_fallback":0,"unverified":0}
for story in data["stories"]:
    counts["total"]+=1
    cover=story.get("cover") or {}
    src=cover.get("src")
    if not src or cover.get("match") not in approved:
        counts["editorial_fallback"]+=1
        if src:counts["unverified"]+=1
        continue
    if cover.get("fallbackFrom"):
        raise SystemExit("Borrowed artwork is not allowed: "+story["id"])
    if src in seen:
        raise SystemExit("Duplicate artwork: "+seen[src]+" / "+story["id"])
    seen[src]=story["id"]
    if cover.get("match")=="period-context" and not cover.get("sourceUrl"):
        raise SystemExit("Unverified contextual source: "+story["id"])
    if src.startswith("assets/") and not (root/"dist"/src).is_file():
        raise SystemExit("Missing image file: "+src)
    counts["approved"]+=1
print(json.dumps(counts,ensure_ascii=False))
