import test from "node:test";
import assert from "node:assert/strict";
import { parseUsfm } from "../scripts/convert-usfm.mjs";
test("USFM parser preserves chapter/verse and accented text",()=>{
  const book=parseUsfm("\\id 3JN\n\\c 1\n\\p\n\\v 1 EL anciano al muy amado Gaio.\n\\v 2 Amado, á quien yo amo en verdad.");
  assert.equal(book.bookId,"3-juan");
  assert.equal(book.chapters.length,1);
  assert.deepEqual(book.chapters[0].verses.map(v=>v.number),[1,2]);
  assert.match(book.chapters[0].verses[1].text,/á quien/);
});
test("USFM parser rejects incomplete books",()=>{
  assert.throws(()=>parseUsfm("\\id 1JN\n\\c 1\n\\v 1 Hola"),/expected 5 chapters/);
});
