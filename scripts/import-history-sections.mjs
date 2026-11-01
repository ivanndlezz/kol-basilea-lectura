// Paso 5: importador conservador de límites editoriales BSB a referencias RV1909.
// No exporta títulos de BSB ni publica automáticamente relatos.
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
const [headingsFile="/tmp/kol-basilea-headings.jsonl",bibleDir="dist/data/rvr1909",outFile="reports/history-sections-pilot.json",reportFile="reports/history-sections-pilot-report.json"]=process.argv.slice(2);
const books=[["EXO","exodo"],["JDG","jueces"],["LUK","lucas"],["ACT","hechos"]];
const source={id:"bsb-data-output/base/headings.jsonl",license:"CC0 (verify pinned source revision)",usage:"reference boundaries only"};
const raw=(await readFile(headingsFile,"utf8")).split(/\r?\n/).filter(Boolean).map((line,i)=>{try{return JSON.parse(line)}catch{throw Error("Invalid JSONL line "+(i+1))}});
const sections=[],errors=[],coverage=[];
for(const [osis,bookId] of books){
 const bible=JSON.parse(await readFile(path.join(bibleDir,bookId+".json"),"utf8"));
 if(bible.bookId!==bookId)throw Error("Wrong bookId "+bookId);
 const refs=bible.chapters.flatMap(c=>c.verses.map(v=>({chapter:Number(c.number),verse:Number(v.number)})));
 const index=new Map(refs.map((r,i)=>[r.chapter+":"+r.verse,i]));
 const starts=raw.filter(h=>h.b===osis&&h.level==="s1");
 let valid=0;let previous=-1;
 for(let i=0;i<starts.length;i++){
  const h=starts[i],start={chapter:Number(h.c),verse:Number(h.before_v)},key=start.chapter+":"+start.verse;
  const at=index.get(key);
  if(at===undefined){errors.push({bookId,id:h.id,reason:"missing_start",start});continue}
  if(at<=previous){errors.push({bookId,id:h.id,reason:at===previous?"duplicate_start":"out_of_order",start});continue}
  previous=at;valid++;
  const next=starts[i+1],nextAt=next?index.get(Number(next.c)+":"+Number(next.before_v)):refs.length;
  if(nextAt===undefined||nextAt<=at){errors.push({bookId,id:h.id,reason:"invalid_next_boundary",start});continue}
  const end=refs[nextAt-1];
  sections.push({id:bookId+"-"+String(i+1).padStart(3,"0"),bookId,kind:"literary-unit",start,end,source:{...source,sourceId:h.id},reviewStatus:"verified-reference",eraId:null,subEraId:null,title:null,summary:null,icon:null});
 }
 coverage.push({bookId,sourceHeadings:starts.length,validStarts:valid,exported:sections.filter(s=>s.bookId===bookId).length,verses:refs.length});
}
const report={method:"BSB s1 starts checked against RV1909; each end is the verse before the next s1 start",pilotBooks:books.length,sections:sections.length,errors,coverage,publicationReady:false};
await mkdir(path.dirname(outFile),{recursive:true});await mkdir(path.dirname(reportFile),{recursive:true});
await writeFile(outFile,JSON.stringify({schemaVersion:1,source,sections},null,2)+"\n");
await writeFile(reportFile,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({sections:sections.length,errors:errors.length,coverage},null,2));
if(errors.length)process.exitCode=1;
