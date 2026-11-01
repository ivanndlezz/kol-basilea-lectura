import test from 'node:test';
import assert from 'node:assert/strict';
import {loadHistoryData} from '../dist/history-data.js';
import {ERA_SLUGS,eraFromLocation,pathForEra} from '../dist/history-routing.js';

test('era routes are unique and derived from one mapping',()=>{
  assert.equal(Object.keys(ERA_SLUGS).length,10);
  assert.equal(new Set(Object.values(ERA_SLUGS)).size,10);
  const base='/kol-basilea-lectura/history/';
  for(const [id,slug] of Object.entries(ERA_SLUGS)){
    const url='https://example.org'+base+slug+'/';
    assert.equal(eraFromLocation(base,{pathname:base+slug+'/',href:url}),id);
    assert.equal(pathForEra(base,id),base+slug+'/');
  }
});

test('query route fallback and root preservation',()=>{
  const base='/kol-basilea-lectura/history/';
  assert.equal(eraFromLocation(base,{pathname:base,href:'https://example.org'+base+'?era=patriarchs'}),'patriarchs');
  assert.equal(pathForEra(base,'primeval',true),base);
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
