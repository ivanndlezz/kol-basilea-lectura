#!/usr/bin/env python3
"""Audit Atlas covers without assigning unrelated imagery."""
import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
path=root/"dist/data/history/timeline.json"
data=json.loads(path.read_text())
allowed={"exact","related","period-context"}
counts={"approved":0,"unverified":0,"missing":0}
for story in data["stories"]:
    cover=story.get("cover")
    if not cover or not cover.get("src"):counts["missing"]+=1;continue
    if cover.get("match") not in allowed:counts["unverified"]+=1;continue
    if cover.get("match")=="period-context" and not cover.get("sourceUrl"):
        counts["unverified"]+=1;continue
    counts["approved"]+=1
print(json.dumps(counts))
