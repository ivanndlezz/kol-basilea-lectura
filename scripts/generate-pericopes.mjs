// Generador determinista de perícopas candidatas para los 66 libros.
// Uso: node scripts/generate-pericopes.mjs headings.jsonl [salida.json]
// No copia títulos BSB; solo usa referencias de inicio s1 y comprueba RV1909.
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
const osis="GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(" ");
const [source="/tmp/kol-basilea-headings.jsonl",output="reports/pericopes-all-candidates.json"]=process.argv.slice(2);
const catalog=JSON.parse(await readFile("dist/data/catalog/books.json","utf8")).books.sort((a,b)=>a.canonicalOrder-b.canonicalOrder);
if(catalog.length!==66||osis.length!==66)throw Error("Se requieren 66 libros");
const rows=(await readFile(source,"utf8")).split(/\r?\n/).filter(Boolean).map(x=>JSON.parse(x));
const items=[],errors=[],coverage=[];
for(let i=0;i<66;i++){
 const book=catalog[i],code=osis[i];
 const bible=JSON.parse(await readFile(path.join("dist/data/rvr1909",book.id+".json"),"utf8"));
 const refs=bible.chapters.flatMap(ch=>ch.verses.map(v=>({chapter:Number(ch.number),verse:Number(v.number)})));
 const indices=new Map(refs.map((r,j)=>[r.chapter+":"+r.verse,j]));
 const starts=rows.filter(x=>x.b===code&&x.level==="s1");
 let last=-1,exported=0;
 for(let j=0;j<starts.length;j++){
  const h=starts[j],start={chapter:Number(h.c),verse:Number(h.before_v)};
  const at=indices.get(start.chapter+":"+start.verse);
  const next=starts[j+1],nextAt=next?indices.get(Number(next.c)+":"+Number(next.before_v)):refs.length;
  if(at===undefined||nextAt===undefined||at<=last||nextAt<=at){errors.push({bookId:book.id,sourceId:h.id,reason:"invalid_boundary"});continue}
  last=at;
  items.push({id:book.id+"-"+String(j+1).padStart(3,"0"),bookId:book.id,title:null,start,end:refs[nextAt-1],eraId:null,subEraId:null,cycleId:null,literaryType:"unclassified",status:"candidate",source:{id:"bsb-headings",sourceId:h.id,usage:"reference-boundaries-only"}});
  exported++;
 }
 coverage.push({bookId:book.id,headings:starts.length,exported});
}
await mkdir(path.dirname(output),{recursive:true});
await writeFile(output,JSON.stringify({schemaVersion:1,status:"candidate",publicationReady:false,items,coverage,errors},null,2)+"\n");
console.log(JSON.stringify({books:coverage.length,candidates:items.length,errors:errors.length,missingBooks:coverage.filter(x=>!x.headings).map(x=>x.bookId)},null,2));
if(errors.length||coverage.some(x=>!x.headings))process.exitCode=1;
