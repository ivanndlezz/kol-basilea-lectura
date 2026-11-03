import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';

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
  assert.deepEqual(data.maps.map(map=>map.eraIds),[
    ['primeval','patriarchs'],
    ['primeval','patriarchs','monarchy','exile-restoration'],
    ['primeval','patriarchs','monarchy','exile-restoration','second-temple','apostolic']
  ]);
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
  assert.match(page,/class="map-switcher"/);
  assert.match(page,/id="map-tabs"/);
  assert.match(page,/id="map-tickmarks"/);
  assert.match(page,/id="scope-filters"/);
  assert.match(page,/aria-label="Buscar fichas del atlas"/);
  assert.match(page,/data.maps/);
  assert.match(page,/data.scopes/);
  assert.match(page,/data\/history\/timeline\.json\?v=20261103-era-ranges-v1/);
  assert.doesNotMatch(page,/data.items.map\(x=>x\.category\)/);
});

test('world atlas exposes era ranges and approximate durations across its views',()=>{
  assert.match(page,/const eraById=new Map\(timeline\.eras/);
  assert.match(page,/function renderEraMeta/);
  assert.match(page,/Era y rango temporal/);
  assert.match(page,/años aprox\./);
  assert.ok(data.items.filter(item=>item.eraIds?.length).length>0);
  for(const map of data.maps)assert.ok(map.eraIds?.length,map.id);
});

test('world atlas map selector behaves like the era strip',()=>{
  assert.match(page,/const focusMapChip=/);
  assert.match(page,/mapTabs\.addEventListener\("touchstart"/);
  assert.match(page,/mapTabs\.addEventListener\("scroll"/);
  assert.match(page,/aria-controls="map-view"/);
  assert.match(page,/map-tab-count/);
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

test('world atlas uses semantic structures per scope instead of one card template',()=>{
  assert.match(page,/<dl class="atlas-definitions">/);
  assert.match(page,/<ol class="atlas-lineage">/);
  assert.match(page,/renderCarousel\(scope\.id,items,renderCommunity,scope\)/);
  assert.match(page,/<ul class="atlas-movements">/);
  assert.match(page,/<dl class="atlas-roles">/);
  assert.match(page,/<ul class="atlas-languages">/);
  assert.match(page,/<ul class="atlas-places">/);
  assert.match(page,/layout:"definitions"/);
  assert.match(page,/layout:"lineage"/);
  assert.match(page,/layout:"movements"/);
});

test('world atlas cards use an accessible carousel with optional imagery',()=>{
  assert.match(page,/renderCarousel/);
  assert.match(page,/atlas-carousel-viewport/);
  assert.match(page,/data-carousel-prev/);
  assert.match(page,/data-carousel-next/);
  assert.match(page,/renderCardMedia/);
  assert.match(page,/item\.image/);
});

test('world atlas confines horizontal overflow to intentional controls',()=>{
  assert.match(page,/html,body\{max-width:100%;overflow-x:hidden\}/);
  assert.match(page,/\.atlas-carousel-viewport\{width:100%;max-width:100%;min-width:0/);
  assert.match(page,/\.atlas-carousel-track\{width:max-content;min-width:100%\}/);
  assert.match(page,/\.map-level\{grid-template-columns:clamp\(50px,18vw,62px\) minmax\(0,1fr\)/);
});

test('world atlas card items have local image assets',async()=>{
  const cardItems=data.items.filter(item=>['peoples-nations','communities'].includes(item.scopeId));
  assert.equal(cardItems.length,17);
  for(const item of cardItems){
    assert.equal(item.image,`/kol-basilea-lectura/assets/images/atlas/world/${item.id}.webp`);
    await access(new URL(`../dist/assets/images/atlas/world/${item.id}.webp`,import.meta.url));
  }
});
