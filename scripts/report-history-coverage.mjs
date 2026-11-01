// Deterministic, non-publishing audit across all 66 canonical books and ten eras.
import {readFile,writeFile,mkdir} from "node:fs/promises";
const read=async p=>JSON.parse(await readFile(p,"utf8"));
const catalog=await read("dist/data/catalog/books.json");
const timeline=await read("dist/data/history/timeline.json");
const classified=await read("reports/history-sections-classified.json").catch(()=>({sections:[]}));
const books=catalog.books.sort((a,b)=>a.canonicalOrder-b.canonicalOrder);
if(books.length!==66||new Set(books.map(b=>b.id)).size!==66)throw Error("Canonical catalog must contain 66 unique books");
if(timeline.eras.length!==10)throw Error("Expected ten historical eras");
const bookIds=new Set(books.map(b=>b.id));
const errors=[];
for(const s of classified.sections){if(!bookIds.has(s.bookId))errors.push({id:s.id,reason:"unknown_book",bookId:s.bookId});}
for(const era of timeline.eras)for(const id of era.bookIds||[])if(!bookIds.has(id))errors.push({eraId:era.id,reason:"unknown_era_book",bookId:id});
const byBook=books.map(b=>{
 const sections=classified.sections.filter(s=>s.bookId===b.id);
 const stories=(timeline.stories||[]).filter(s=>s.bookId===b.id||(b.id==="genesis"&&["primeval","patriarchs"].includes(s.eraId)));
 return {id:b.id,name:b.name,chapters:b.chapters,category:b.category,sections:sections.length,reviewed:sections.filter(s=>s.reviewStatus==="editorially-reviewed").length,publishedStories:stories.filter(s=>s.status==="published").length,eraIds:timeline.eras.filter(e=>e.bookIds?.includes(b.id)).map(e=>e.id)};
});
const eras=timeline.eras.map(e=>({id:e.id,title:e.title,stories:(timeline.stories||[]).filter(s=>s.eraId===e.id).length,events:(timeline.events||[]).filter(s=>s.eraId===e.id).length,periods:(timeline.subEras||[]).filter(s=>s.eraId===e.id).length}));
const report={schemaVersion:1,publicationReady:false,source:"Canonical catalog, timeline, optional classified review data",totals:{books:books.length,booksWithSections:byBook.filter(b=>b.sections).length,sections:classified.sections.length,reviewed:byBook.reduce((n,b)=>n+b.reviewed,0),publishedStories:(timeline.stories||[]).filter(s=>s.status==="published").length},books:byBook,eras,errors};
await mkdir("reports",{recursive:true});
await writeFile("reports/history-coverage.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report.totals));
if(errors.length)throw Error(JSON.stringify(errors));
