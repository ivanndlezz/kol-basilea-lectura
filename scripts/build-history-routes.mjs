import {mkdir,readFile,writeFile} from "node:fs/promises";
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

const historyShell=prefix=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f6f7f4"><link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg"><title>Historia · Kol Basilea Lectura</title><link rel="stylesheet" href="${prefix}history.css?v=history-route-fix-v3"></head><body><div class="kb-history-app"><header class="top"><a href="${prefix}index.html" class="back" aria-label="Volver a Kol Basilea"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></a><h1 class="top-label">Línea del tiempo</h1><button class="kb-info-button" type="button" aria-label="Información de la cronología" aria-expanded="false" aria-controls="kb-history-note"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/></svg></button></header><main class="page"><section class="atlas" aria-label="Cronología histórica"><div class="block-head"><span>Historia bíblica</span><span>Cristianismo</span></div><div id="scale" class="scale"></div><div id="scale-numbers" class="scale-numbers"></div><div class="axis"><span>Sin fecha firme</span><span>1000 a. C.</span><span>0</span><span>1000</span><span>2000</span></div></section><section id="selector" class="selector"><div class="group-title"><h2 id="group-label">Historia bíblica</h2><span id="group-count">7 eras</span></div><div id="era-strip" class="era-strip" aria-label="Eras históricas"></div><p class="hint">Desliza para recorrer las eras.</p></section><article id="era-detail" class="era-detail" aria-live="polite"><div class="kb-history-skeleton" role="status" aria-label="Cargando contenido de la era"><span class="kb-skeleton-line kb-skeleton-title" aria-hidden="true"></span><span class="kb-skeleton-line kb-skeleton-short" aria-hidden="true"></span><span class="kb-skeleton-card" aria-hidden="true"></span></div></article></main><aside id="kb-history-note" class="kb-history-note" hidden><strong>Cómo leer la cronología</strong><p>Las zonas rayadas representan periodos sin datación verificable o de cronología debatida. Las eras son divisiones de estudio y pueden solaparse.</p></aside></div><script type="module" src="${prefix}history.js?v=history-route-fix-v3"></script><script>const info=document.querySelector(".kb-info-button"),note=document.querySelector("#kb-history-note");info.addEventListener("click",()=>{note.hidden=!note.hidden;info.setAttribute("aria-expanded",String(!note.hidden))});document.addEventListener("keydown",e=>{if(e.key==="Escape"){note.hidden=true;info.setAttribute("aria-expanded","false")}});document.addEventListener("click",e=>{if(!note.hidden&&!note.contains(e.target)&&!info.contains(e.target)){note.hidden=true;info.setAttribute("aria-expanded","false")}})</script></body></html>
`;
const template=historyShell("../../../");
const eraTemplate=historyShell("../../");

let written=0;
for(const era of timeline.eras||[]){
  const slug=slugs[era.id];
  if(!slug)throw new Error(`No route slug for era ${era.id}`);
  const output=path.join("dist/history",slug,"index.html");
  await mkdir(path.dirname(output),{recursive:true});
  await writeFile(output,eraTemplate);
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
