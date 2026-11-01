// Clasificación editorial conservadora: la pertenencia de un libro a una era es
// una sugerencia, nunca una datación ni un relato publicado.
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
const [sectionsFile="reports/history-sections-pilot.json",timelineFile="dist/data/history/timeline.json",outputFile="reports/history-sections-classified.json",reportFile="reports/history-classification-report.json",overridesFile]=process.argv.slice(2);
const input=JSON.parse(await readFile(sectionsFile,"utf8"));
const timeline=JSON.parse(await readFile(timelineFile,"utf8"));
const overrides=overridesFile?JSON.parse(await readFile(overridesFile,"utf8")):{};
if(!Array.isArray(input.sections)||!Array.isArray(timeline.eras))throw Error("Missing sections or eras");
const eraIds=new Set(timeline.eras.map(e=>e.id));
const subEras=new Map((timeline.subEras||[]).map(s=>[s.id,s]));
const candidatesByBook=new Map();
for(const era of timeline.eras)for(const bookId of era.bookIds||[]){
 const list=candidatesByBook.get(bookId)||[];list.push(era.id);candidatesByBook.set(bookId,list);
}
const allowedKinds=new Set(["literary-unit","event","story","teaching","poetry","prophecy","law","genealogy","context"]);
const allowedReview=new Set(["candidate","verified-reference","editorially-reviewed"]);
const errors=[],counts={total:input.sections.length,unclassified:0,suggested:0,reviewed:0,overrides:0};
const seen=new Set();
const sections=input.sections.map(s=>{
 if(seen.has(s.id))errors.push({id:s.id,reason:"duplicate_id"});seen.add(s.id);
 const suggestion=candidatesByBook.get(s.bookId)||[];
 const edit=overrides[s.id]||{};
 if(overrides[s.id])counts.overrides++;
 const kind=edit.kind??s.kind??"literary-unit";
 const eraId=edit.eraId??null;
 const subEraId=edit.subEraId??null;
 const reviewStatus=overrides[s.id]?"editorially-reviewed":"verified-reference";
 if(!allowedKinds.has(kind))errors.push({id:s.id,reason:"invalid_kind",kind});
 if(eraId&&!eraIds.has(eraId))errors.push({id:s.id,reason:"unknown_era",eraId});
 if(subEraId&&(!subEras.has(subEraId)||subEras.get(subEraId).eraId!==eraId))errors.push({id:s.id,reason:"subera_mismatch",subEraId,eraId});
 if(edit.eraId&&suggestion.length&&!suggestion.includes(edit.eraId))errors.push({id:s.id,reason:"era_not_listed_for_book",eraId});
 if(!allowedReview.has(reviewStatus))errors.push({id:s.id,reason:"invalid_status"});
 if(eraId)counts.reviewed++;else if(suggestion.length)counts.suggested++;else counts.unclassified++;
 return {...s,kind,eraId,subEraId,title:edit.title??s.title??null,summary:edit.summary??s.summary??null,icon:edit.icon??s.icon??null,eraCandidates:suggestion,reviewStatus,classificationMethod:overrides[s.id]?"explicit-editorial-override":suggestion.length?"book-membership-suggestion":"unclassified"};
});
for(const id of Object.keys(overrides))if(!seen.has(id))errors.push({id,reason:"override_unknown_section"});
const report={method:"Era candidates derived from book membership; no automatic chronology or narrative classification",counts,errors,publicationReady:false};
await mkdir(path.dirname(outputFile),{recursive:true});await mkdir(path.dirname(reportFile),{recursive:true});
await writeFile(outputFile,JSON.stringify({schemaVersion:1,sections},null,2)+"\n");
await writeFile(reportFile,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
