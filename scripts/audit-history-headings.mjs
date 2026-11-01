import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";

const headingsFile=process.argv[2]||"/tmp/kol-basilea-headings.jsonl";
const bibleDir=process.argv[3]||"dist/data/rvr1909";
const reportFile=process.argv[4]||"reports/history-heading-compatibility.json";
const pilot=[["EXO","exodo"],["JDG","jueces"],["LUK","lucas"],["ACT","hechos"]];
const raw=await readFile(headingsFile,"utf8");
const headings=raw.split(/\r?\n/).filter(Boolean).map((line,i)=>{try{return JSON.parse(line)}catch{throw new Error("Invalid JSONL line "+(i+1))}});
const report={method:"Validate BSB s1 starting references against generated RVR1909 verse indices; no BSB titles copied",source:"BSB-publishing/bsb-data-output/base/headings.jsonl",translation:"rvr1909",books:[],totals:{headings:0,valid:0,invalid:0,duplicates:0,outOfOrder:0}};
for(const [osis,id] of pilot){
 const bible=JSON.parse(await readFile(path.join(bibleDir,id+".json"),"utf8"));
 if(bible.bookId!==id)throw new Error("Unexpected bookId "+bible.bookId+" for "+id);
 const verses=new Map(bible.chapters.map(c=>[Number(c.number),new Set(c.verses.map(v=>Number(v.number)))]));
 const sections=headings.filter(h=>h.b===osis&&h.level==="s1");
 const errors=[],seen=new Set();let valid=0,duplicates=0,outOfOrder=0,previous=[0,0];
 for(const h of sections){
  const chapter=Number(h.c),verse=Number(h.before_v),key=chapter+":"+verse;
  if(!verses.get(chapter)?.has(verse))errors.push({id:h.id,chapter,verse,reason:"missing_reference"});else valid++;
  if(seen.has(key)){duplicates++;errors.push({id:h.id,chapter,verse,reason:"duplicate_start"})}seen.add(key);
  if(chapter<previous[0]||(chapter===previous[0]&&verse<previous[1])){outOfOrder++;errors.push({id:h.id,chapter,verse,reason:"out_of_order"})}previous=[chapter,verse];
 }
 const result={book:id,osis,headings:sections.length,valid,invalid:sections.length-valid,duplicates,outOfOrder,errors};
 report.books.push(result);
 for(const key of ["headings","valid","invalid","duplicates","outOfOrder"])report.totals[key]+=result[key];
}
await mkdir(path.dirname(reportFile),{recursive:true});
await writeFile(reportFile,JSON.stringify(report,null,2)+"\n");
for(const b of report.books)console.log(`${b.book}: ${b.valid}/${b.headings} valid starts; ${b.duplicates} duplicates; ${b.outOfOrder} out of order`);
console.log("Report:",reportFile);
if(report.totals.invalid||report.totals.duplicates||report.totals.outOfOrder)process.exitCode=1;
