import {readFile,writeFile} from "node:fs/promises";

const readJson=path=>readFile(path,"utf8").then(JSON.parse);
const safeRange=item=>Boolean(item?.start?.chapter&&item?.start?.verse&&item?.end?.chapter&&item?.end?.verse);

const timeline=await readJson("dist/data/history/timeline.json");
const editorial=await readJson("dist/data/history/pericopes.json");
const automatic=await readJson("dist/data/history/pericopes-generated.json");
const editorialItems=(editorial.items||[]).filter(safeRange);
const automaticItems=(automatic.items||[]).filter(safeRange);

if(editorialItems.length!==(editorial.items||[]).length||automaticItems.length!==(automatic.items||[]).length){
  throw new Error("History snapshot cannot include open-ended pericopes");
}

const editorialByEra=Object.fromEntries((timeline.eras||[]).map(era=>[
  era.id,
  editorialItems.filter(item=>item.eraId===era.id)
]));
const automaticByEra=Object.fromEntries((timeline.eras||[]).map(era=>{
  const editorialBooks=new Set((editorialByEra[era.id]||[]).map(item=>item.bookId));
  return [era.id,automaticItems
    .filter(item=>(era.bookIds||[]).includes(item.bookId)&&!editorialBooks.has(item.bookId))
    .map(item=>({...item,displayEraId:era.id,sourceKind:"automatic"}))];
}));

const snapshot={
  ...timeline,
  schemaVersion:2,
  historyCatalog:{
    schemaVersion:1,
    editorialByEra,
    automaticByEra,
    totals:{
      editorial:editorialItems.length,
      automatic:automaticItems.length,
      displayedAutomatic:Object.values(automaticByEra).reduce((total,items)=>total+items.length,0)
    }
  }
};

await writeFile("dist/data/history/history-snapshot.json",JSON.stringify(snapshot,null,2)+"\n");
console.log(JSON.stringify({eras:snapshot.eras.length,editorial:editorialItems.length,automatic:automaticItems.length,displayedAutomatic:snapshot.historyCatalog.totals.displayedAutomatic},null,2));
