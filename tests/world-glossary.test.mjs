import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const data=JSON.parse(await readFile(new URL('../dist/data/history/world-glossary.json',import.meta.url),'utf8'));
const page=await readFile(new URL('../dist/history/world/index.html',import.meta.url),'utf8');

test('world atlas separates scopes and relational maps',()=>{
  assert.equal(data.schemaVersion,2);
  assert.ok(data.scopes.some(scope=>scope.id==='tribes-lineages'));
  assert.ok(data.scopes.some(scope=>scope.id==='language-genealogy'));
  assert.deepEqual(data.maps.map(map=>map.id),['shem-genealogy','mesopotamia-peoples','semitic-languages']);
  assert.ok(data.maps[0].relations.some(relation=>relation.from==='sem'&&relation.to==='aram'&&relation.type==='parent'));
  assert.ok(data.maps[1].relations.some(relation=>relation.from==='mesopotamia'&&relation.to==='ur'&&relation.type==='place'));
  assert.ok(data.maps[2].relations.some(relation=>relation.from==='northwest-semitic'&&relation.to==='aramaic'));
});

test('world atlas keeps historical entities distinct from linguistic labels',()=>{
  const byId=new Map(data.items.map(item=>[item.id,item]));
  assert.equal(byId.get('aramaeans').scopeId,'peoples-nations');
  assert.equal(byId.get('aramaic').scopeId,'language-genealogy');
  assert.equal(byId.get('chaldeans').kind,'tribal-people');
  assert.equal(byId.get('ur').kind,'city');
  assert.equal(byId.get('sumerians').historicalStatus,'historical');
});

test('world atlas page renders maps, scopes and accessible search',()=>{
  assert.match(page,/id="map-tabs"/);
  assert.match(page,/id="scope-filters"/);
  assert.match(page,/aria-label="Buscar fichas del atlas"/);
  assert.match(page,/data.maps/);
  assert.match(page,/data.scopes/);
  assert.doesNotMatch(page,/data.items.map\(x=>x\.category\)/);
});

test('world atlas reuses the main app appearance preference',()=>{
  assert.match(page,/kol-basilea-lectura-v1/);
  assert.match(page,/appAppearance/);
  assert.match(page,/data-kb-world-theme/);
  assert.match(page,/storage/);
  assert.match(page,/prefers-color-scheme/);
  assert.match(page,/color-scheme:light/);
});

test('world atlas renders each scope as a distinct catalog group',()=>{
  assert.match(page,/scopePresentation/);
  assert.match(page,/renderScopeGroup/);
  assert.match(page,/scope-group-items--tribes-lineages/);
  assert.match(page,/scope-group-items--language-genealogy/);
  assert.match(page,/scope-group-items--places-regions/);
  for(const scope of data.scopes)assert.match(page,new RegExp('"'+scope.id+'"'));
});
