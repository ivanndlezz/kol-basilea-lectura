import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data=JSON.parse(await readFile(new URL('../dist/data/history/bible-history.json',import.meta.url),'utf8'));
const page=await readFile(new URL('../dist/history/biblia/index.html',import.meta.url),'utf8');
const historyScript=await readFile(new URL('../dist/history.js',import.meta.url),'utf8');

test('Bible history section has one canonical structured source',()=>{
  assert.equal(data.schemaVersion,1);
  assert.equal(data.id,'bible-history');
  assert.equal(data.sections.length,5);
  assert.deepEqual(data.sections.map(section=>section.layout),['timeline','definitions','list','communities','cards']);
  assert.equal(new Set(data.sections.map(section=>section.id)).size,data.sections.length);
  for(const section of data.sections){
    assert.ok(section.eyebrow&&section.title&&section.intro);
    assert.ok(Array.isArray(section.items)&&section.items.length>0);
  }
});

test('Bible history route renders its data asynchronously and preserves theme',()=>{
  assert.match(page,/history\/bible-history\.json\?v=20261103-bible-history-v1/);
  assert.match(page,/data-kb-bible-history-theme/);
  assert.match(page,/renderTimeline/);
  assert.match(page,/renderDefinitions/);
  assert.match(page,/renderCommunities/);
  assert.match(page,/renderCards/);
  assert.match(page,/href="\.\.\/world\/"/);
  assert.match(historyScript,/kb-history-bible-entry/);
});
