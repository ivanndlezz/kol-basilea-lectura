import { readFile } from "node:fs/promises";
const { books: BOOKS } = JSON.parse(await readFile(new URL("../dist/data/catalog/books.json", import.meta.url), "utf8"));
let chapters=0, verses=0;
for (const book of BOOKS) {
  const data=JSON.parse(await readFile(new URL("../dist/data/rvr1909/"+book.id+".json",import.meta.url),"utf8"));
  if(data.bookId!==book.id||data.chapters.length!==book.chapters) throw new Error("Wrong book "+book.id);
  for(const chapter of data.chapters) {
    chapters++;
    if(chapter.number<1||chapter.number>book.chapters||!chapter.verses.length) throw new Error("Invalid chapter "+book.id+" "+chapter.number);
    for(const verse of chapter.verses) {
      verses++;
      if(!verse.text||/\\(?:w|v|c)\b|\|strong=/.test(verse.text)) throw new Error("USFM markup leaked into "+book.id+" "+chapter.number+":"+verse.number+" "+verse.text.slice(0,70));
    }
  }
}
if(chapters!==1189||verses<30000) throw new Error("Incomplete Bible: "+chapters+" chapters, "+verses+" verses");
const third=JSON.parse(await readFile(new URL("../dist/data/rvr1909/3-juan.json",import.meta.url),"utf8"));
if(!third.chapters[0].verses[0].text.includes("EL anciano")) throw new Error("Unexpected 3 John opening");
console.log("PASS: "+BOOKS.length+" books, "+chapters+" chapters, "+verses+" verses, no USFM markup");
