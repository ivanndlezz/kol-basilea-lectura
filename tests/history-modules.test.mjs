import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {loadHistoryData} from '../dist/history-data.js';
import {ERA_SLUGS,eraFromLocation,pathForEra,resolveHistoryAssetUrl,storyFromLocation} from '../dist/history-routing.js';
import {pericopeList} from '../dist/history-sheet-ui.js';

const snapshot=JSON.parse(await readFile(new URL('../dist/data/history/history-snapshot.json',import.meta.url),'utf8'));
const historySource=await readFile(new URL('../dist/history.js',import.meta.url),'utf8');
const sheetSource=await readFile(new URL('../dist/history-sheet-ui.js',import.meta.url),'utf8');
const generatedStoryRoute=await readFile(new URL('../dist/history/cuatrocientos-anos-de-silencio/cuatrocientos-anos-de-silencio/index.html',import.meta.url),'utf8');

test('era routes are unique and derived from one mapping',async()=>{
  assert.equal(Object.keys(ERA_SLUGS).length,11);
  assert.equal(new Set(Object.values(ERA_SLUGS)).size,11);
  const base='/kol-basilea-lectura/history/';
  for(const [id,slug] of Object.entries(ERA_SLUGS)){
    const url='https://example.org'+base+slug+'/';
    assert.equal(eraFromLocation(base,{pathname:base+slug+'/',href:url}),id);
    assert.equal(pathForEra(base,id),base+slug+'/');
    await access(new URL(`../dist/history/${slug}/index.html`,import.meta.url));
  }
});

test('query route fallback and root preservation',()=>{
  const base='/kol-basilea-lectura/history/';
  assert.equal(eraFromLocation(base,{pathname:base,href:'https://example.org'+base+'?era=patriarchs'}),'patriarchs');
  assert.equal(pathForEra(base,'primeval',true),base);
});

test('story routes do not collide with an era route sharing the same slug',()=>{
  const base='/kol-basilea-lectura/history/';
  const stories=[{id:'cuatrocientos-anos-de-silencio'}];
  assert.equal(storyFromLocation(base,stories,{pathname:base+'cuatrocientos-anos-de-silencio/',href:'https://example.org'+base}),null);
  assert.deepEqual(storyFromLocation(base,stories,{pathname:base+'cuatrocientos-anos-de-silencio/cuatrocientos-anos-de-silencio/',href:'https://example.org'}),stories[0]);
});

test('history asset resolver preserves absolute URLs',()=>{
  const remote='https://thumb.wikimedia.org/example.jpg';
  assert.equal(resolveHistoryAssetUrl(remote),remote);
  assert.equal(resolveHistoryAssetUrl('assets/example.webp','https://example.org/kol-basilea-lectura/history.js'),'/kol-basilea-lectura/assets/example.webp');
});

test('data loader rejects invalid payloads without DOM dependencies',async()=>{
  const original=globalThis.fetch;
  try{
    globalThis.fetch=async()=>({ok:true,json:async()=>({eras:[{id:'a'},{id:'a'}]})});
    await assert.rejects(loadHistoryData(),/identificadores repetidos/);
    globalThis.fetch=async()=>({ok:false});
    await assert.rejects(loadHistoryData(),/No se pudo cargar/);
  }finally{globalThis.fetch=original;}
});

test('history uses one normalized public snapshot',()=>{
  assert.equal(snapshot.schemaVersion,2);
  assert.ok(snapshot.historyCatalog?.editorialByEra);
  assert.ok(snapshot.historyCatalog?.automaticByEra);
  assert.doesNotMatch(historySource,/pericopes-generated\.json/);
  assert.doesNotMatch(historySource,/data\/history\/pericopes\.json/);
  assert.match(historySource,/pericopesByEra/);
});

test('generated story routes use the same history app shell and controls',()=>{
  assert.match(generatedStoryRoute,/<div class="kb-history-app">/);
  assert.match(generatedStoryRoute,/class="kb-info-button"/);
  assert.match(generatedStoryRoute,/history\.css\?v=history-route-fix-v3/);
  assert.doesNotMatch(generatedStoryRoute,/<body><header class="top"/);
});

test('pericopes use a compact reading index without editorial artwork',()=>{
  const items=Array.from({length:6},(_,index)=>({bookId:'genesis',start:{chapter:1,verse:index+1},end:{chapter:1,verse:index+2},title:index===0?'La creación':undefined}));
  const html=pericopeList(items,{readerPath:'/index.html',bookNames:{genesis:'Génesis'},statusLabel:'Borrador',id:'genesis'});
  assert.match(sheetSource,/export function pericopeList/);
  assert.match(sheetSource,/export function initPericopeSheets/);
  assert.match(html,/Muestra de 5/);
  assert.match(html,/Ver todas las 6 perícopas/);
  assert.match(html,/kb-pericope-sheet/);
  assert.match(html,/Génesis 1:1–2/);
  assert.doesNotMatch(html,/kb-story-art|kb-story-image/);
});

test('every historical story has a direct route',async()=>{
  assert.equal(snapshot.stories.length,151);
  for(const story of snapshot.stories){
    const slug=ERA_SLUGS[story.eraId];
    await access(new URL(`../dist/history/${slug}/${story.id}/index.html`,import.meta.url));
  }
  const interlude=snapshot.stories.find(story=>story.id==='cuatrocientos-anos-de-silencio');
  assert.equal(interlude?.type,'historical-interlude');
  assert.equal(interlude?.eraId,'intertestamental');
  assert.equal(interlude?.subEraId,'intertestamental--silence');
  assert.ok(snapshot.subEras.find(subEra=>subEra.id==='intertestamental--silence')?.storyIds.includes(interlude.id));
  assert.ok(!snapshot.subEras.find(subEra=>subEra.id==='second-temple--hellenistic')?.storyIds.includes(interlude.id));
});
