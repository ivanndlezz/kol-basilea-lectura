import {access,mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";

const timeline=JSON.parse(await readFile("dist/data/history/timeline.json","utf8"));
const slugs={
  primeval:"historia-primigenia",
  patriarchs:"patriarcas",
  "exodus-judges":"exodo-y-jueces",
  monarchy:"monarquia",
  "exile-restoration":"exilio-y-restauracion",
  intertestamental:"cuatrocientos-anos-de-silencio",
  "second-temple":"segundo-templo",
  apostolic:"era-apostolica",
  patristic:"cristianismo-antiguo",
  medieval:"cristianismo-medieval",
  modern:"reformas-y-modernidad"
};

const template='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f6f7f4"><link rel="icon" type="image/svg+xml" href="../../../favicon.svg"><title>Historia · Kol Basilea Lectura</title><link rel="stylesheet" href="../../../history.css?v=history-safe-ranges-v1"></head><body><header class="top"><a href="../../../index.html" class="back">← <span>Kol Basilea</span></a><span class="top-label">Historia</span></header><main class="page"><section class="hero"><h1>Línea del tiempo</h1><p>11 eras en 2 bloques: historia bíblica y cristianismo.<br>Toca una para explorarla.</p></section><section class="atlas" aria-label="Cronología histórica"><div class="block-head"><span>Historia bíblica</span><span>Cristianismo</span></div><div id="scale" class="scale"></div><div id="scale-numbers" class="scale-numbers"></div><div class="axis"><span>Sin fecha firme</span><span>1000 a. C.</span><span>0</span><span>1000</span><span>2000</span></div></section><section id="selector" class="selector"><div class="group-title"><h2 id="group-label">Historia bíblica</h2><span id="group-count">7 eras</span></div><div id="era-strip" class="era-strip" aria-label="Eras históricas"></div><p class="hint">Desliza para recorrer las eras.</p></section><article id="era-detail" class="era-detail" aria-live="polite"></article><p class="note">Las fechas son aproximadas cuando así se indica. El rayado representa relatos o periodos sin datación histórica firme; las eras pueden solaparse.</p></main><script type="module" src="../../../history.js?v=history-route-fix-v2"></script></body></html>\n';

const eraTemplate='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f6f7f4"><link rel="icon" type="image/svg+xml" href="../../favicon.svg"><title>Historia · Kol Basilea Lectura</title><link rel="stylesheet" href="../../history.css?v=history-safe-ranges-v1"></head><body><header class="top"><a href="../../index.html" class="back">← <span>Kol Basilea</span></a><span class="top-label">Historia</span></header><main class="page"><section class="hero"><h1>Línea del tiempo</h1><p>11 eras en 2 bloques: historia bíblica y cristianismo.<br>Toca una para explorarla.</p></section><section class="atlas" aria-label="Cronología histórica"><div class="block-head"><span>Historia bíblica</span><span>Cristianismo</span></div><div id="scale" class="scale"></div><div id="scale-numbers" class="scale-numbers"></div><div class="axis"><span>Sin fecha firme</span><span>1000 a. C.</span><span>0</span><span>1000</span><span>2000</span></div></section><section id="selector" class="selector"><div class="group-title"><h2 id="group-label">Historia bíblica</h2><span id="group-count">7 eras</span></div><div id="era-strip" class="era-strip" aria-label="Eras históricas"></div><p class="hint">Desliza para recorrer las eras.</p></section><article id="era-detail" class="era-detail" aria-live="polite"></article><p class="note">Las fechas son aproximadas cuando así se indica. El rayado representa relatos o periodos sin datación histórica firme; las eras pueden solaparse.</p></main><script type="module" src="../../history.js?v=history-route-fix-v2"></script></body></html>\n';

let written=0;
for(const era of timeline.eras||[]){
  const slug=slugs[era.id];
  if(!slug)throw new Error(`No route slug for era ${era.id}`);
  const output=path.join("dist/history",slug,"index.html");
  try{await access(output)}catch{await mkdir(path.dirname(output),{recursive:true});await writeFile(output,eraTemplate)}
}
for(const story of timeline.stories||[]){
  const slug=slugs[story.eraId];
  if(!slug)throw new Error(`No route slug for era ${story.eraId}`);
  const output=path.join("dist/history",slug,story.id,"index.html");
  await mkdir(path.dirname(output),{recursive:true});
  await writeFile(output,template);
  written++;
}
console.log(JSON.stringify({eraRoutes:(timeline.eras||[]).length,storyRoutes:written},null,2));
