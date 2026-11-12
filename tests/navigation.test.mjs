import test from "node:test";
import assert from "node:assert/strict";
import {NAV_ITEMS,APP_ROOT,navigationHref,currentNavigationId,readerNavigationItems,externalNavigationItems} from "../dist/navigation/navigation-registry.js";
test("all global destinations have unique IDs and valid targets",()=>{
 assert.equal(new Set(NAV_ITEMS.map(item=>item.id)).size,NAV_ITEMS.length);
 for(const item of NAV_ITEMS){
   assert.ok(item.label&&item.icon&&item.detail);
   assert.equal(Boolean(item.view),!Boolean(item.path));
   assert.equal(new URL(navigationHref(item)).origin,APP_ROOT.origin);
 }
});
test("history and Bible history resolve to distinct destinations",()=>{
 assert.equal(currentNavigationId(new URL("history/era-apostolica/relato-mateo-1-1/",APP_ROOT).href),"history");
 assert.equal(currentNavigationId(new URL("history/biblia/",APP_ROOT).href),"bible-history");
 assert.equal(currentNavigationId(new URL("?view=progress",APP_ROOT).href),"progress");
 assert.equal(currentNavigationId(APP_ROOT.href),"home");
});
test("reader and document destinations share one registry",()=>{
 assert.ok(readerNavigationItems().length>=5);
 assert.ok(externalNavigationItems().length>=2);
});
