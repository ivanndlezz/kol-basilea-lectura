import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');

test('hamburger menu exposes Bible cross references in a new tab',()=>{
  assert.match(app,/https:\/\/trekhleb\.dev\/bible-cross-references\/es\/\?ref=Ps\.119&t=vbl/);
  assert.match(app,/target = "_blank"/);
  assert.match(app,/rel = "noopener noreferrer"/);
  assert.match(app,/kb-bible-cross-references-link/);
  assert.match(app,/kb-atlas-menu-disabled/) ;
});
