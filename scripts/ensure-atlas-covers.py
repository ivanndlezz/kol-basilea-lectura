#!/usr/bin/env python3
"""Validate Atlas artwork; missing images use unique in-browser SVG illustrations."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
data=json.loads((root/"dist/data/history/timeline.json").read_text())
approved={"exact","related","period-context"}

# These stories had matching artwork before the accidental blanket rejection.
# A new verified cover may replace a protected cover, but not a placeholder.
protected={
    "creacion","caida","cain-y-abel","primeras-ciudades-y-reinos","diluvio","babel",
    "llamado-de-abram","abram-en-egipto","relato-pc-021","relato-lucas-2-1"
}
known_bad_files={
    "assets/images/history/jose-en-egipto.webp",
    "assets/images/history/jose-vendido.webp",
    "assets/images/history/jose-y-sus-hermanos.webp",
    "assets/images/history/nacimiento-de-isaac.webp",
    "assets/images/history/relato-juan-9-1.webp",
    "assets/images/history/relato-mateo-1-1.webp",
    "assets/images/history/relato-pc-001.webp",
    "assets/images/history/relato-pc-031.webp"
}
seen={}
counts={"total":0,"approved":0,"editorial_fallback":0,"unverified":0}
for story in data["stories"]:
    counts["total"]+=1
    cover=story.get("cover") or {}
    src=cover.get("src")
    if story["id"] in protected and (not src or cover.get("match") not in approved):
        raise SystemExit("Regression: protected story cover was removed: "+story["id"])
    if src in known_bad_files and cover.get("match") in approved:
        raise SystemExit("Known mismatched artwork was enabled: "+story["id"])
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
