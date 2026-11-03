import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {isApprovedStoryCover,storyCard} from "../dist/history-sheet-ui.js";

const data=JSON.parse(await readFile(new URL("../dist/data/history/timeline.json", import.meta.url), "utf8"));
const generated=JSON.parse(await readFile(new URL("../dist/data/history/pericopes-generated.json", import.meta.url), "utf8"));
const story=id=>data.stories.find(item=>item.id===id);
const protectedIds=["creacion","caida","cain-y-abel","primeras-ciudades-y-reinos","diluvio","babel","llamado-de-abram","abram-en-egipto","relato-pc-021","relato-lucas-2-1"];

test("previously valid covers remain visible after image audits",()=>{
  for(const id of protectedIds){
    const item=story(id);
    assert.ok(item,"Missing story "+id);
    assert.equal(isApprovedStoryCover(item),true,"Cover hidden for "+id);
    const card=storyCard(item,"/history/"+id+"/",item.cover.src);
    assert.match(card,/class="kb-story-image"/,"Cover img missing for "+id);
  }
});

test("an unverified cover never renders, including when it has a src",()=>{
  const approved=story("sodoma-y-gomorra");
  assert.ok(approved);
  const item={...approved,cover:{...approved.cover,match:"unverified"}};
  assert.equal(isApprovedStoryCover(item),false);
  assert.doesNotMatch(storyCard(item,"/story/",item.cover.src),/class="kb-story-image"/);
  const missing={id:"example",title:"Example",reference:"Example 1",cover:{src:"wrong.jpg"}};
  assert.equal(isApprovedStoryCover(missing),false);
  assert.doesNotMatch(storyCard(missing,"/story/",missing.cover.src),/class="kb-story-image"/);
});

test("approved local covers exist as files in the deployed directory",async()=>{
  for(const item of data.stories.filter(isApprovedStoryCover)){
    assert.ok(item.cover.src,"Missing approved source for "+item.id);
    if(!item.cover.src.startsWith("assets/"))continue;
    const path=new URL("../dist/"+item.cover.src,import.meta.url);
    const bytes=await readFile(path);
    assert.ok(bytes.byteLength>1000,"Empty cover: "+item.id);
    assert.equal(bytes.toString("ascii",0,4),"RIFF","Invalid WebP for "+item.id);
    assert.equal(bytes.toString("ascii",8,12),"WEBP","Invalid WebP for "+item.id);
  }
});

test("generated pericopes always have a safe end range",()=>{
  assert.ok(generated.items.length>0);
  assert.equal(generated.items.filter(item=>!item.end).length,0);
});
