// Genera un catálogo navegable desde los 66 archivos de perícopas ya existentes.
// No publica traducciones automáticas como títulos revisados.
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
const catalog=JSON.parse(await readFile("dist/data/catalog/books.json","utf8")).books;
const output="dist/data/history/pericopes-generated.json";
const items=[],coverage=[],errors=[];
for(const book of catalog){
 try{
  const data=JSON.parse(await readFile(path.join("dist/data/pericopes",book.id+".json"),"utf8"));
  const bible=JSON.parse(await readFile(path.join("dist/data/rvr1909",book.id+".json"),"utf8"));
  const chapters=data.chapters||[{number:data.chapter,sections:data.sections}];
  const verseCounts=new Map(bible.chapters.map(c=>[Number(c.number),c.verses.length]));
  let count=0;
  for(const chapter of chapters){
   const sections=chapter.sections||[];
   for(let i=0;i<sections.length;i++){
    const section=sections[i],start=Number(section.startVerse),ch=Number(chapter.number),next=sections[i+1];
    const end=next?Number(next.startVerse)-1:verseCounts.get(ch);
    if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||end<start||end>verseCounts.get(ch)){errors.push({bookId:book.id,chapter:ch,start,end});continue}
    items.push({id:book.id+"-"+ch+"-"+start,bookId:book.id,bookName:book.name,start:{chapter:ch,verse:start},end:{chapter:ch,verse:end},title:section.title,sourceTitle:section.sourceTitle||null,reviewStatus:section.status==="reviewed"?"reviewed":"draft",eraId:null,subEraId:null});
    count++;
   }
  }
  coverage.push({bookId:book.id,count});
 }catch(e){errors.push({bookId:book.id,error:String(e)})}
}
await mkdir(path.dirname(output),{recursive:true});
await writeFile(output,JSON.stringify({schemaVersion:1,publicationReady:false,source:"existing-pericope-drafts",items,coverage,errors},null,2)+"\n");
console.log(JSON.stringify({books:coverage.length,pericopes:items.length,errors:errors.length},null,2));
if(errors.length||coverage.length!==66)process.exitCode=1;
