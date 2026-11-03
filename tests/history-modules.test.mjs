import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readdir,readFile} from 'node:fs/promises';
import {loadHistoryData} from '../dist/history-data.js';
import {ERA_SLUGS,eraFromLocation,pathForEra,resolveHistoryAssetUrl,storyFromLocation} from '../dist/history-routing.js';
import {pericopeList,renderEraStrip} from '../dist/history-sheet-ui.js';
import {normalizeDirectoryUrl} from '../dist/url-routing.js';

const snapshot=JSON.parse(await readFile(new URL('../dist/data/history/history-snapshot.json',import.meta.url),'utf8'));
const historySource=await readFile(new URL('../dist/history.js',import.meta.url),'utf8');
const sheetSource=await readFile(new URL('../dist/history-sheet-ui.js',import.meta.url),'utf8');
const generatedStoryRoute=await readFile(new URL('../dist/history/cuatrocientos-anos-de-silencio/cuatrocientos-anos-de-silencio/index.html',import.meta.url),'utf8');
const generatedEraRoute=await readFile(new URL('../dist/history/exodo-y-jueces/index.html',import.meta.url),'utf8');

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

test('generated history routes use the same app shell and controls',()=>{
  for(const html of [generatedStoryRoute,generatedEraRoute]){
    assert.match(html,/<div class="kb-history-app">/);
    assert.match(html,/class="kb-info-button"/);
    assert.match(html,/history\.css\?v=history-route-fix-v4/);
    assert.doesNotMatch(html,/href="[^"]*index\.html/);
    assert.doesNotMatch(html,/<body><header class="top"/);
  }
});

test('public routes stay extensionless and old index URLs normalize',()=>{
  const state={pathname:'/kol-basilea-lectura/history/exodo-y-jueces/index.html',search:'?verify=1',hash:'#relato'};
  const calls=[];
  const historyObject={state:{from:'legacy'},replaceState(...args){calls.push(args)}};
  assert.equal(normalizeDirectoryUrl(state,historyObject),true);
  assert.deepEqual(calls,[[{from:'legacy'},'', '/kol-basilea-lectura/history/exodo-y-jueces/?verify=1#relato']]);
  assert.equal(normalizeDirectoryUrl({pathname:'/kol-basilea-lectura/history/exodo-y-jueces/'},historyObject),false);
  assert.match(historySource,/new URL\("\.\/",import\.meta\.url\)\.pathname/);
});

test('published HTML contains no extensionful internal document links',async()=>{
  const files=await readdir(new URL('../dist/',import.meta.url),{recursive:true});
  const htmlFiles=files.filter(file=>file.endsWith('.html'));
  assert.ok(htmlFiles.length>=160);
  for(const file of htmlFiles){
    const html=await readFile(new URL('../dist/'+file,import.meta.url),'utf8');
    assert.doesNotMatch(html,/href=["'][^"']*index\.html/i,file);
    assert.doesNotMatch(html,/src=["'][^"']*index\.html/i,file);
  }
});

test('era strip is rendered from the normalized era catalog',()=>{
  const html=renderEraStrip(snapshot.eras,'exodus-judges');
  assert.equal((html.match(/class="era"/g)||[]).length,11);
  assert.match(html,/data-id="exodus-judges" aria-pressed="true"/);
  assert.match(html,/400 años de silencio/);
  assert.match(historySource,/stripEl\.innerHTML=renderEraStrip\(eras,active\)/);
});

test('pericopes use a compact reading index without editorial artwork',()=>{
  const items=Array.from({length:6},(_,index)=>({bookId:'genesis',start:{chapter:1,verse:index+1},end:{chapter:1,verse:index+2},title:index===0?'La creación':undefined}));
  const html=pericopeList(items,{readerPath:'/',bookNames:{genesis:'Génesis'},statusLabel:'Borrador',id:'genesis'});
  assert.match(sheetSource,/export function pericopeList/);
  assert.match(sheetSource,/export function initPericopeSheets/);
  assert.match(html,/Muestra de 5/);
  assert.match(html,/Ver todas las 6 perícopas/);
  assert.match(html,/kb-pericope-sheet/);
  assert.match(html,/Génesis 1:1–2/);
  assert.match(html,/href="\/\?book=genesis/);
  assert.doesNotMatch(html,/index\.html/);
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
