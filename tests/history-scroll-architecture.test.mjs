import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const file=async name=>readFile(new URL('../dist/'+name,import.meta.url),'utf8');
const css=await file('history.css');
const js=await file('history.js');
const data=JSON.parse(await file('data/history/timeline.json'));
const pages=['history/index.html','history/historia-primigenia/index.html','history/patriarcas/index.html'];

test('timeline data remains the single source of truth for ten eras',()=>{
  assert.equal(data.eras.length,10);
  assert.equal(new Set(data.eras.map(e=>e.id)).size,10);
  assert.ok(js.includes('data.eras'));
});

test('timeline keeps a single vertical scroll owner, no sticky selector or collapsing reading mode',()=>{
  const layout=css.slice(css.indexOf('/* History screen: one vertical scroll owner'));
  assert.match(layout,/\.kb-history-app \.page\{[^}]*overflow-y:auto/);
  assert.match(layout,/\.kb-history-app \.era-strip\{[^}]*overflow-x:auto/);
  assert.doesNotMatch(css,/\.kb-history-app\.is-reading/);
  assert.doesNotMatch(js,/is-reading/);
});

test('HTML pages do not duplicate eras or content from JSON',async()=>{
  for(const path of pages){
    const html=await file(path);
    assert.match(html,/id="era-strip"[^>]*><\/div>/);
    assert.match(html,/id="era-detail"[^>]*><\/article>/);
    assert.match(html,/history\.js\?v=scroll-architecture-v1/);
  }
});
