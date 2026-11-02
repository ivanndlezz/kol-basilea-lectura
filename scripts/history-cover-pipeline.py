#!/usr/bin/env python3
"""Editorial cover pipeline: audit, queue, and apply reviewed assets.

Usage:
 python3 scripts/history-cover-pipeline.py audit
 python3 scripts/history-cover-pipeline.py plan --era patriarchs
 python3 scripts/history-cover-pipeline.py apply --era patriarchs

The plan never generates or publishes artwork. Review each image and put
<story-id>.webp in dist/assets/images/history/ before apply.
"""
import argparse, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/"dist/data/history/timeline.json"
IMAGES=ROOT/"dist/assets/images/history"
QUEUE=ROOT/"docs/history-cover-queue.json"
ATTR=ROOT/"dist/data/history/image-attributions.json"
STYLE=("Cinematic historical graphic-novel illustration, dramatic foreground and "
"deep layered background, painterly grain and expressive angular brushwork, "
"coral and warm gold contrasted with petrol teal and cyan, action not posing; "
"no text, no lettering, no logos, no modern objects, landscape 4:3.")
KNOWN_BAD={"jose-en-egipto","jose-vendido","jose-y-sus-hermanos","nacimiento-de-isaac",
           "relato-juan-9-1","relato-mateo-1-1","relato-pc-001","relato-pc-031"}
def load(path): return json.loads(path.read_text(encoding="utf-8"))
def save(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
def image_ok(path):
    if not path.is_file():return False
    with path.open("rb") as f:
        header=f.read(12)
    return header[:4]==b"RIFF" and header[8:12]==b"WEBP"
def main():
    p=argparse.ArgumentParser()
    p.add_argument("command",choices=["audit","plan","apply"])
    p.add_argument("--era",default=None)
    a=p.parse_args()
    timeline=load(DATA)
    stories=[s for s in timeline["stories"] if not a.era or s.get("eraId")==a.era]
    if not stories:sys.exit("No matching stories")
    if a.command=="audit":
        issues=[]
        for s in stories:
            src=(s.get("cover") or {}).get("src")
            if not src:reason="missing"
            elif s["id"] in KNOWN_BAD:reason="mismatched-artwork"
            elif not (ROOT/"dist"/src).is_file():reason="missing-file"
            else:continue
            issues.append({"id":s["id"],"title":s["title"],"reason":reason})
        print(json.dumps({"total":len(stories),"issues":issues},ensure_ascii=False,indent=2))
        return
    if a.command=="plan":
        queue=[]
        for s in stories:
            src=(s.get("cover") or {}).get("src")
            if src and s["id"] not in KNOWN_BAD and (ROOT/"dist"/src).is_file():continue
            queue.append({"id":s["id"],"eraId":s.get("eraId"),"title":s["title"],
                          "reference":s.get("reference",""),"summary":s.get("synopsis") or s.get("summary",""),
                          "filename":s["id"]+".webp","status":"needs-artwork",
                          "artDirection":STYLE+" Scene: "+s["title"]+
                          ". Biblical passage: "+s.get("reference","")+
                          ". Narrative: "+(s.get("synopsis") or s.get("summary",""))})
        save(QUEUE,{"version":1,"editorialReviewRequired":True,"items":queue})
        print(f"Queued {len(queue)} cover(s) in {QUEUE.relative_to(ROOT)}")
        return
    if not QUEUE.is_file():sys.exit("Run plan first")
    queue=load(QUEUE)["items"]
    approved={q["id"]:q for q in queue if q.get("status")=="approved"}
    changed=[]
    for s in stories:
        q=approved.get(s["id"])
        if not q:continue
        expected=s["id"]+".webp"
        if q.get("filename")!=expected:sys.exit("Unexpected filename for "+s["id"])
        path=IMAGES/expected
        if not image_ok(path):sys.exit("Missing/invalid WebP: "+str(path))
        s["cover"]={"src":"assets/images/history/"+expected,
                    "alt":"Ilustración editorial de "+s["title"],
                    "source":"Kol Basilea, ilustración editorial original",
                    "attributionId":s["id"]}
        changed.append(s["id"])
    if not changed:sys.exit("No approved images to apply; edit queue status after visual review")
    attrs=load(ATTR)
    attrs["items"]=[x for x in attrs["items"] if x.get("storyId") not in changed]
    attrs["items"]+= [{"storyId":i,"source":"Kol Basilea","title":next(s["title"] for s in stories if s["id"]==i),
                        "license":"Original editorial artwork","note":"Illustration, not a historical reconstruction"} for i in changed]
    save(DATA,timeline);save(ATTR,attrs)
    print("Applied "+", ".join(changed))
if __name__=="__main__":main()
