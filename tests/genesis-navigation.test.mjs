import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ranges,genesisPanel,genesisUnitDetail} from '../dist/genesis-structure.js';

const data=JSON.parse(await readFile(new URL('../dist/data/history/timeline.json',import.meta.url),'utf8'));

test('Génesis: prologue, ten toledot and five narrative cycles',()=>{
  assert.equal(data.genesisStructure.toledot.length,10);
  assert.equal(data.genesisStructure.narrativeCycles.length,5);
  assert.equal(data.genesisStructure.toledot.filter(u=>u.eraId==='primeval').length,5);
  assert.equal(data.genesisStructure.toledot.filter(u=>u.eraId==='patriarchs').length,5);
});

test('verse ranges distinguish abbreviated same-chapter endpoints',()=>{
  assert.deepEqual(ranges('Génesis 11:10–26'),{startChapter:11,startVerse:10,endChapter:11,endVerse:26});
  assert.deepEqual(ranges('Génesis 25:12–18'),{startChapter:25,startVerse:12,endChapter:25,endVerse:18});
  assert.deepEqual(ranges('Génesis 11:27–25:11'),{startChapter:11,startVerse:27,endChapter:25,endVerse:11});
});

test('literary list opens dedicated details without accordion',()=>{
  const html=genesisPanel(data,'primeval','/history/','historia-primigenia');
  assert.match(html,/data-genesis-unit="creation-prologue"/);
  assert.match(html,/data-genesis-unit="sem"/);
  assert.doesNotMatch(html,/<details class="kb-genesis-unit"/);
  const detail=genesisUnitDetail(data,'primeval','sem','/history/','historia-primigenia');
  assert.match(detail,/Génesis 11:10–26/);
  assert.match(detail,/data-genesis-close/);
  assert.match(detail,/book=genesis&chapter=11&verse=10/);
  assert.equal(genesisUnitDetail(data,'primeval','ismael','/history/','historia-primigenia'),'');
});
