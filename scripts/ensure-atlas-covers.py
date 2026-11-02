#!/usr/bin/env python3
"""Ensure all story cards have a contextual image, preserving existing covers."""
import json, pathlib
root=pathlib.Path(__file__).resolve().parents[1]
path=root/"dist/data/history/timeline.json"
data=json.loads(path.read_text())
stories=data["stories"]
donors=[s for s in stories if s.get("cover",{}).get("src","").startswith("assets/") and (root/"dist"/s["cover"]["src"]).is_file()]
if not donors:raise SystemExit("No valid local covers available")
by_era={}
for s in donors:by_era.setdefault(s["eraId"],[]).append(s)
added=0
for s in stories:
    if s.get("cover",{}).get("src"):continue
    pool=by_era.get(s["eraId"]) or donors
    donor=pool[sum(map(ord,s["id"]))%len(pool)]
    cover=donor["cover"].copy()
    cover["alt"]="Imagen contextual; no representa literalmente "+s["title"]
    cover["match"]="period-context"
    cover["fallbackFrom"]=donor["id"]
    s["cover"]=cover
    added+=1
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
print(f"Assigned {added} contextual fallback covers; total {len(stories)} stories covered")
