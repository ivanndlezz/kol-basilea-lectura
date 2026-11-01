// Generate a deterministic, non-published editorial review queue from verified sections.
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
const [inputFile="reports/history-sections-classified.json",outputFile="reports/history-editorial-review.json",reportFile="reports/history-editorial-review-report.json",mode="all"]=process.argv.slice(2);
if(!["all","sample"].includes(mode))throw Error("Mode must be all or sample");
const data=JSON.parse(await readFile(inputFile,"utf8"));
if(!Array.isArray(data.sections))throw Error("Missing sections");
const books=["exodo","jueces","lucas","hechos"];
const sample=[],errors=[];
const fmt=r=>r.chapter+":"+r.verse;
for(const bookId of books){
 const units=data.sections.filter(s=>s.bookId===bookId);
 if(!units.length){errors.push({bookId,reason:"no_units"});continue}
 const indices=mode==="sample"?[0,Math.floor((units.length-1)/2),units.length-1]:units.map((_,i)=>i);
 for(const i of [...new Set(indices)]){
  const s=units[i];
  if(!s.start||!s.end||!s.source?.sourceId)errors.push({id:s.id,reason:"missing_reference_or_source"});
  if(s.reviewStatus!=="verified-reference")errors.push({id:s.id,reason:"unexpected_review_status"});
  sample.push({id:s.id,bookId,reference:fmt(s.start)+"–"+fmt(s.end),sourceId:s.source.sourceId,eraCandidates:s.eraCandidates||[],editorial:{kind:null,eraId:null,subEraId:null,title:null,summary:null,icon:null,chronologyStatus:"unassessed",textReviewed:false,notes:null},decision:"pending-human-review"});
 }
}
const result={schemaVersion:1,purpose:"Manual editorial review queue; no inferred titles or genres",mode,publicationReady:false,items:sample};
const report={books:books.length,mode,total:sample.length,pending:sample.filter(s=>s.decision==="pending-human-review").length,errors,publicationReady:false};
await mkdir(path.dirname(outputFile),{recursive:true});await mkdir(path.dirname(reportFile),{recursive:true});
await writeFile(outputFile,JSON.stringify(result,null,2)+"\n");
await writeFile(reportFile,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
if(errors.length)process.exitCode=1;
