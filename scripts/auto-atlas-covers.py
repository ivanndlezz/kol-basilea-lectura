#!/usr/bin/env python3
"""Autonomous, conservative Wikimedia Commons cover importer for Atlas cards.

Runs from GitHub Actions on source changes and a weekly schedule.
"""
import argparse, json, pathlib, re, io, time, urllib.parse, urllib.request
from PIL import Image, ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/"dist/data/history/timeline.json"
OUT=ROOT/"dist/assets/images/history"
API="https://commons.wikimedia.org/w/api.php"
UA="KolBasileaAtlas/1.0 (open-license educational image importer)"
LICENSES={"cc0","public domain","cc by","cc by-sa"}
# Restrict vague names to an explicit biblical/historical context; never match on a name alone.
CONTEXT={"primeval":"Book of Genesis Bible","patriarchs":"Genesis Bible","exodus-judges":"Exodus Bible","monarchy":"ancient Israel Bible","exile-restoration":"Babylonian exile Bible","second-temple":"Second Temple Jerusalem","apostolic":"early Christianity apostles","patristic":"early Christian church","medieval":"medieval Christianity","modern":"Protestant Reformation"}
def api(params):
    url=API+"?"+urllib.parse.urlencode(dict(action="query",format="json",**params))
    req=urllib.request.Request(url,headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=25) as r:return json.load(r)
def clean(s):return re.sub(r"<[^>]+>","",s or "").strip()
def candidates(query):
    result=api({"generator":"search","gsrsearch":query+" filetype:bitmap","gsrnamespace":6,"gsrlimit":12,"prop":"imageinfo","iiprop":"url|extmetadata|size","iiurlwidth":1100})
    return list(result.get("query",{}).get("pages",{}).values())
def choose(items,terms):
    for page in sorted(items,key=lambda p:p.get("index",999)):
        info=(page.get("imageinfo") or [{}])[0];meta=info.get("extmetadata") or {}
        license_name=clean(meta.get("LicenseShortName",{}).get("value","")).lower()
        usage=clean(meta.get("UsageTerms",{}).get("value","")).lower()
        if not any(x==license_name or usage.startswith(x) for x in LICENSES):continue
        if "noncommercial" in usage or "nc"==license_name:continue
        title=page.get("title","").lower()
        if not any(term in title for term in terms):continue
        if info.get("width",0)<500 or info.get("height",0)<350:continue
        url=info.get("thumburl") or info.get("url")
        if not url:continue
        return page,info,meta,url
    return None
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--limit",type=int,default=30)
    p.add_argument("--scope",choices=["stories","periods","all"],default="all")
    args=p.parse_args()
    data=json.loads(DATA.read_text())
    targets=[]
    if args.scope in ("stories","all"):targets += [("stories",x) for x in data.get("stories",[])]
    if args.scope in ("periods","all"):targets += [("subEras",x) for x in data.get("subEras",[])]
    imported=[];skipped=[];attempted=0
    for kind,item in targets:
        if attempted>=args.limit:break
        cover=item.get("cover") or {}
        if cover.get("src") and (ROOT/"dist"/cover["src"]).is_file():continue
        attempted+=1
        title=item["title"]
        # Require meaningful, multi-word title matches; generic names are not safe matches.
        words=[w.lower() for w in re.findall(r"[^\W\d_]{4,}",title) if w.lower() not in {"historia","periodo","primeras","relato","tiempo","sobre","desde"}]
        if not words:
            skipped.append(item["id"]);continue
        query=title+" "+CONTEXT.get(item.get("eraId",""),"Bible Christianity")
        try:
            match=choose(candidates(query),words)
            if not match:skipped.append(item["id"]);continue
            page,info,meta,url=match
            req=urllib.request.Request(url,headers={"User-Agent":UA})
            with urllib.request.urlopen(req,timeout=30) as resp:
                if int(resp.headers.get("Content-Length","0"))>12000000:raise ValueError("large file")
                raw=resp.read(12000001)
            if len(raw)>12000000:raise ValueError("large file")
            image=Image.open(io.BytesIO(raw))
            image=ImageOps.exif_transpose(image).convert("RGB")
            if image.width<500 or image.height<350:raise ValueError("small image")
            image.thumbnail((1200,1200))
            dest=OUT/("periods" if kind=="subEras" else "stories")/(item["id"]+".webp")
            dest.parent.mkdir(parents=True,exist_ok=True)
            image.save(dest,"WEBP",quality=82,method=5)
            item["cover"]={"src":str(dest.relative_to(ROOT/"dist")),"alt":"Obra histórica asociada a "+title,"source":page["title"],"sourceUrl":info.get("descriptionurl",""),"license":clean(meta.get("LicenseShortName",{}).get("value","")),"artist":clean(meta.get("Artist",{}).get("value",""))[:300]}
            imported.append(item["id"])
        except Exception as e:
            print("SKIP",item["id"],str(e)[:120]);skipped.append(item["id"])
        time.sleep(0.3)
    if imported:DATA.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({"attempted":attempted,"imported":imported,"unresolved":skipped},ensure_ascii=False))
if __name__=="__main__":main()
