#!/usr/bin/env python3
"""Audit Atlas covers without assigning unrelated imagery."""
import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
path=root/"dist/data/history/timeline.json"
data=json.loads(path.read_text())
allowed={"exact","related","period-context"}
counts={"approved":0,"unverified":0,"missing":0,"reused":0}
seen={}
for story in data["stories"]:
    cover=story.get("cover")
    if not cover or not cover.get("src"):counts["missing"]+=1;continue
    if cover.get("fallbackFrom"):\n        counts["reused"]+=1\n        raise SystemExit("Rejected copied artwork on "+story["id"])\n    if cover["src"] in seen and cover.get("match")!="related":\n        raise SystemExit("Duplicate artwork: "+seen[cover["src"]]+" and "+story["id"])\n    seen[cover["src"]]=story["id"]\n    if cover.get("match") not in allowed:counts["unverified"]+=1;continue
    if cover.get("match")=="period-context" and not cover.get("sourceUrl"):
        counts["unverified"]+=1;continue
    counts["approved"]+=1
print(json.dumps(counts))
