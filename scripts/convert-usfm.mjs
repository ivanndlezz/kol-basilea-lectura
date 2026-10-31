import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { BOOKS } from "../dist/data/bible-catalog.js";

const ROOT = process.argv[2] || "sources/rvr1909";
const OUTPUT = process.argv[3] || "dist/data/rvr1909";
const CODE_TO_NAME = Object.fromEntries([
  ["GEN","Génesis"],["EXO","Éxodo"],["LEV","Levítico"],["NUM","Números"],["DEU","Deuteronomio"],["JOS","Josué"],["JDG","Jueces"],["RUT","Rut"],
  ["1SA","1 Samuel"],["2SA","2 Samuel"],["1KI","1 Reyes"],["2KI","2 Reyes"],["1CH","1 Crónicas"],["2CH","2 Crónicas"],["EZR","Esdras"],["NEH","Nehemías"],["EST","Ester"],["JOB","Job"],["PSA","Salmos"],["PRO","Proverbios"],["ECC","Eclesiastés"],["SNG","Cantares"],
  ["ISA","Isaías"],["JER","Jeremías"],["LAM","Lamentaciones"],["EZK","Ezequiel"],["DAN","Daniel"],["HOS","Oseas"],["JOL","Joel"],["AMO","Amós"],["OBA","Abdías"],["JON","Jonás"],["MIC","Miqueas"],["NAM","Nahúm"],["HAB","Habacuc"],["ZEP","Sofonías"],["HAG","Ageo"],["ZEC","Zacarías"],["MAL","Malaquías"],
  ["MAT","Mateo"],["MRK","Marcos"],["LUK","Lucas"],["JHN","Juan"],["ACT","Hechos"],["ROM","Romanos"],["1CO","1 Corintios"],["2CO","2 Corintios"],["GAL","Gálatas"],["EPH","Efesios"],["PHP","Filipenses"],["COL","Colosenses"],["1TH","1 Tesalonicenses"],["2TH","2 Tesalonicenses"],["1TI","1 Timoteo"],["2TI","2 Timoteo"],["TIT","Tito"],["PHM","Filemón"],["HEB","Hebreos"],["JAS","Santiago"],["1PE","1 Pedro"],["2PE","2 Pedro"],["1JN","1 Juan"],["2JN","2 Juan"],["3JN","3 Juan"],["JUD","Judas"],["REV","Apocalipsis"]
]);
const BOOK_BY_NAME = new Map(BOOKS.map(b => [b.name,b]));
function clean(text) {
  return text.replace(/\\f\s+\+?\w+\s+[^\\]*?\\f\*/g,"")
    .replace(/\\(?:x|f)\s+[\s\S]*?\\(?:x|f)\*/g,"")
    .replace(/\\(?:add|bd|bdit|em|it|nd|sc|wj|qt|sig|tl|bk|pn|k|ord|no|sup|pro|rb|sls|dc|ior|iqt|lik|lit|rq|fig|w|wa|wg|wh)\*?/g,"")
    .replace(/\\\+?\w+\*?/g,"")
    .replace(/\s+/g," ").trim();
}
export function parseUsfm(input) {
  const code = input.match(/(?:^|\n)\s*\\id\s+([1-3A-Z]{3})\b/i)?.[1]?.toUpperCase();
  if (!code || !CODE_TO_NAME[code]) throw new Error("Unknown USFM book code: "+code);
  const book = BOOK_BY_NAME.get(CODE_TO_NAME[code]);
  const chapters = {};
  let chapter = 0, verse = null, text = "", heading = "";
  const flush = () => {
    if (verse === null) return;
    const normalized = clean(text);
    if (!normalized) throw new Error("Empty verse "+book.id+" "+chapter+":"+verse);
    const verses = chapters[chapter].verses;
    if (verses.some(v=>v.number===verse)) throw new Error("Duplicate verse "+book.id+" "+chapter+":"+verse);
    verses.push({number:verse,text:normalized,...(heading?{heading}: {})});
    heading = ""; verse = null; text = "";
  };
  // USFM markers may be inline; split only at chapter, verse, paragraph and heading boundaries.
  const tokens = input.replace(/\r\n?/g,"\n").split(/(\\(?:c|v|p|m|q\d?|li\d?|s\d?|ms\d?|mt\d?|r|d|b|nb|pi\d?|pc|pr|cls|sp|qa|qac)\s+)/g);
  for(let i=0;i<tokens.length;i++){
    const marker=tokens[i].match(/^\\(c|v|p|m|q\d?|li\d?|s\d?|ms\d?|mt\d?|r|d|b|nb|pi\d?|pc|pr|cls|sp|qa|qac)\s+$/)?.[1];
    if (!marker) { if(verse!==null) text+=tokens[i]; continue; }
    const following=tokens[++i]||"";
    if(marker==="c"){
      flush(); const match=following.match(/^\s*(\d+)\b/);
      if(!match) throw new Error("Invalid chapter in "+book.id);
      chapter=Number(match[1]); if(chapters[chapter]) throw new Error("Duplicate chapter "+book.id+" "+chapter);
      chapters[chapter]={number:chapter,verses:[]};
      continue;
    }
    if(marker==="v"){
      flush(); const match=following.match(/^\s*(\d+)(?:-\d+)?\s*/);
      if(!match||!chapter) throw new Error("Invalid verse in "+book.id+" "+chapter);
      verse=Number(match[1]); text=following.slice(match[0].length); continue;
    }
    if(/^s\d?$|^ms\d?$|^r$|^d$|^qa$|^sp$/.test(marker)){
      flush(); heading=clean(following); continue;
    }
    if(verse!==null) text+=" "+following;
  }
  flush();
  const result={bookId:book.id,translationId:"rvr1909",source:"eBible.org",chapters:Object.values(chapters)};
  if(result.chapters.length!==book.chapters) throw new Error(book.name+": expected "+book.chapters+" chapters; found "+result.chapters.length);
  for(const ch of result.chapters) {
    if(!ch.verses.length) throw new Error("Empty chapter "+book.id+" "+ch.number);
    if(ch.verses[0].number!==1) throw new Error("First verse missing "+book.id+" "+ch.number);
  }
  return result;
}
async function walk(dir){
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) result.push(...await walk(full));
    else if(/\.(?:usfm|sfm|sf)$/i.test(entry.name)) result.push(full);
  }
  return result;
}
async function main(){
  const files=await walk(ROOT);
  const parsed=new Map();
  for(const file of files){
    const content=await readFile(file,"utf8");
    if(!/(?:^|\n)\s*\\id\s+/i.test(content)) continue;
    const book=parseUsfm(content);
    if(parsed.has(book.bookId)) throw new Error("Duplicate book "+book.bookId);
    parsed.set(book.bookId,book);
  }
  if(parsed.size!==66) throw new Error("Expected 66 books; found "+parsed.size);
  await mkdir(OUTPUT,{recursive:true});
  let total=0;
  for(const book of BOOKS){
    const data=parsed.get(book.id);
    if(!data) throw new Error("Missing "+book.name);
    total+=data.chapters.length;
    await writeFile(path.join(OUTPUT,book.id+".json"),JSON.stringify(data));
  }
  if(total!==1189) throw new Error("Expected 1189 chapters, got "+total);
  console.log("Converted 66 books and "+total+" chapters to "+OUTPUT);
}
if(process.argv[1] && import.meta.url===new URL("file://"+path.resolve(process.argv[1])).href) main().catch(e=>{console.error(e);process.exitCode=1});
