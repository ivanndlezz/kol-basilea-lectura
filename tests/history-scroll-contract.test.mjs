import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const load=path=>readFile(new URL('../dist/'+path,import.meta.url),'utf8');
const css=await load('history.css');
const js=await load('history.js');
const timeline=JSON.parse(await load('data/history/timeline.json'));
const rule=selector=>{
  const start=css.indexOf(selector+'{');
  assert.ok(start>=0,'Missing CSS selector: '+selector);
  return css.slice(start,css.indexOf('}',start)+1);
};

test('one vertical scrolling surface; cards and timeline are not sticky',()=>{
  assert.match(rule('.kb-history-app .page'),/overflow-y:auto/);
  assert.match(rule('.kb-history-app .era-detail'),/overflow:visible/);
  assert.doesNotMatch(css,/\.kb-history-app\.is-reading/);
  assert.doesNotMatch(js,/is-reading/);
  assert.match(rule('.kb-history-app .era-strip'),/overflow-x:auto/);
});

test('historical eras have a single data source',async()=>{
  assert.equal(timeline.eras.length,10);
  assert.equal(new Set(timeline.eras.map(e=>e.id)).size,10);
  assert.match(js,/data\.eras/);
  for(const path of ['history/index.html','history/historia-primigenia/index.html','history/patriarcas/index.html']){
    const html=await load(path);
    assert.match(html,/id="era-strip"[^>]*><\/div>/);
    assert.match(html,/history\.js\?v=[a-z0-9-]+/);
  }
});
