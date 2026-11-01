import { readFile } from "node:fs/promises";
import { getBibleTranslations } from "../dist/data/bible-translations.js";
const { books: BOOKS } = JSON.parse(await readFile(new URL("../dist/data/catalog/books.json", import.meta.url), "utf8"));
for (const translation of getBibleTranslations()) {
  let chapters=0, verses=0;
  for (const book of BOOKS) {
    const data=JSON.parse(await readFile(new URL(`../dist/data/${translation.dataDir}/${book.id}.json`,import.meta.url),"utf8"));
    if(data.bookId!==book.id||data.translationId!==translation.id||data.chapters.length!==book.chapters) throw new Error(`Wrong ${translation.id} book ${book.id}`);
    for(const chapter of data.chapters) {
      chapters++;
      if(chapter.number<1||chapter.number>book.chapters||!chapter.verses.length) throw new Error(`Invalid ${translation.id} chapter ${book.id} ${chapter.number}`);
      for(const verse of chapter.verses) {
        verses++;
        if(!verse.text||/\\(?:w|v|c)\b|\|strong=/.test(verse.text)) throw new Error(`USFM markup leaked into ${translation.id} ${book.id} ${chapter.number}:${verse.number} ${verse.text.slice(0,70)}`);
      }
    }
  }
  if(chapters!==1189||verses<28000) throw new Error(`Incomplete ${translation.id}: ${chapters} chapters, ${verses} verses`);
  console.log(`PASS: ${translation.id} · ${BOOKS.length} books, ${chapters} chapters, ${verses} verses, no USFM markup`);
}
const third=JSON.parse(await readFile(new URL("../dist/data/rvr1909/3-juan.json",import.meta.url),"utf8"));
if(!third.chapters[0].verses[0].text.includes("EL anciano")) throw new Error("Unexpected 3 John opening");
