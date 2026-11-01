#!/usr/bin/env python3
"""Download only individually verified public-domain museum images for Kol Basilea.
Never guess a license or assign an unrelated image merely to fill a card.
"""
import json, pathlib, re, time, urllib.parse, urllib.request, html, io
from PIL import Image, ImageOps

ROOT=pathlib.Path(__file__).resolve().parents[1]
TIMELINE=ROOT/"dist/data/history/timeline.json"
MANIFEST=ROOT/"dist/data/history/image-attributions.json"
OUTPUT=ROOT/"dist/assets/images/history"
HEADERS={"User-Agent":"KolBasileaEditorial/1.0 (public-domain research; GitHub Pages)"}
TRANSLATIONS={"creacion":"Creation","caida":"Fall of Man","diluvio":"Deluge","babel":"Tower of Babel","moises":"Moses","jesus":"Jesus","david":"David","goliat":"Goliath","salomon":"Solomon","elias":"Elijah","eliseo":"Elisha","abraham":"Abraham","isaac":"Isaac","jacob":"Jacob","jose":"Joseph","sanson":"Samson","daniel":"Daniel","ester":"Esther","jonas":"Jonah","pablo":"Saint Paul","pedro":"Saint Peter","crucifixion":"Crucifixion","resurreccion":"Resurrection","pentecostes":"Pentecost","nacimiento":"Nativity","bautismo":"Baptism","ultima cena":"Last Supper","lazaro":"Raising of Lazarus","noe":"Noah","jerico":"Jericho","rut":"Ruth"}
def get(url):
    req=urllib.request.Request(url,headers=HEADERS)
    with urllib.request.urlopen(req,timeout=22) as response:return response.read()
def norm(text):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD',text.lower()) if unicodedata.category(c)!='Mn')
def query_for(story):
    title=norm(story['title'])
    for es,en in sorted(TRANSLATIONS.items(),key=lambda kv:-len(kv[0])):
        if es in title:return en
    return None
def find_art(term):
    api="https://collectionapi.metmuseum.org/public/collection/v1.1/search?"+urllib.parse.urlencode({"q":term,"hasImages":"true","limit":18})
    data=json.loads(get(api))
    for object_id in (data.get("objectIDs") or [])[:14]:
        time.sleep(.25)
        try: art=json.loads(get("https://collectionapi.metmuseum.org/public/collection/v1/objects/"+str(object_id)))
        except Exception:continue
        if not art.get("isPublicDomain") or not art.get("primaryImageSmall"):continue
        title=art.get("title","")
        # Avoid unrelated generic portraits, objects and coincidental search hits.
        if norm(term) not in norm(title):continue
        return art
    return None
def main():
    timeline=json.loads(TIMELINE.read_text())
    manifest=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"schemaVersion":1,"items":[]}
    existing={item["storyId"]:item for item in manifest["items"]}
    OUTPUT.mkdir(parents=True,exist_ok=True)
    cache={}
    done=0
    used_objects={item.get('objectId') for item in existing.values()}
    for story in timeline["stories"]:
        if story.get("cover",{}).get("src"):continue
        term=query_for(story)
        if not term:continue
        try:
            if term not in cache:cache[term]=find_art(term)
            art=cache[term]
            if not art or art.get('objectID') in used_objects:continue
            used_objects.add(art['objectID'])
            raw=get(art["primaryImageSmall"])
            with Image.open(io.BytesIO(raw)) as image:
                image=ImageOps.exif_transpose(image).convert("RGB")
                image.thumbnail((900,1200))
                path=OUTPUT/(story["id"]+".webp")
                image.save(path,"WEBP",quality=82,method=6)
            story["cover"]={"src":"assets/images/history/"+path.name,"alt":"Obra de arte: "+art.get("title",""),"source":"The Metropolitan Museum of Art","license":"CC0","attributionId":story["id"]}
            existing[story["id"]]={"storyId":story["id"],"source":"The Metropolitan Museum of Art","artist":art.get("artistDisplayName") or "Autor no identificado","title":art.get("title"),"date":art.get("objectDate"),"license":"CC0","sourceUrl":art.get("objectURL"),"objectId":art.get("objectID"),"note":"Interpretación artística; no reconstrucción histórica"}
            done+=1
            print("OK",story["id"],art["title"])
        except Exception as exc:print("SKIP",story["id"],str(exc)[:130])
        time.sleep(.4)
    manifest["items"]=sorted(existing.values(),key=lambda x:x["storyId"])
    TIMELINE.write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+"\n")
    MANIFEST.parent.mkdir(parents=True,exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
    print(f"Added {done} verified CC0 images; {sum(bool(s.get('cover',{}).get('src')) for s in timeline['stories'])}/{len(timeline['stories'])} cards have a cover.")
if __name__=="__main__":main()
