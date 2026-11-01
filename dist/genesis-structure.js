// Génesis: navegación editorial independiente de la cronología y del progreso.
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const passage = reference => {
  const match = reference.match(/(?:Génesis\s+)?(\d+)(?::(\d+))?/);
  return match ? { chapter:Number(match[1]), verse:Number(match[2] || 1) } : {chapter:1,verse:1};
};
const readUrl = reference => {
  const {chapter,verse}=passage(reference);
  return new URL("./index.html",import.meta.url).pathname+"?book=genesis&chapter="+chapter+"&verse="+verse;
};
export const ranges = reference => {
  const match=String(reference||"").match(/(?:Génesis\s+)?(\d+)(?::(\d+))?[–-](\d+)(?::(\d+))?/);
  if(!match)return null;
  const startChapter=Number(match[1]),startVerse=Number(match[2]||1);
  const sameChapter=!!match[2]&&!match[4];
  return {startChapter,startVerse,endChapter:sameChapter?startChapter:Number(match[3]),endVerse:sameChapter?Number(match[3]):Number(match[4]||999)};
};
const overlaps=(a,b)=>a&&b&&((a.startChapter*1000+a.startVerse)<=(b.endChapter*1000+b.endVerse))&&((b.startChapter*1000+b.startVerse)<=(a.endChapter*1000+a.endVerse));
export function genesisPanel(data,eraId,basePath,slug){
  if(!["primeval","patriarchs"].includes(eraId)||!data.genesisStructure)return "";
  const structure=data.genesisStructure;
  const units=[...(eraId==="primeval"?[{...structure.prologue,order:0,title:"La creación",kind:"Prólogo"}]:[]),...structure.toledot.filter(u=>u.eraId===eraId).map(u=>({...u,kind:"Toledot"}))];
  const stories=(data.stories||[]).filter(s=>s.eraId===eraId);
  const unitHtml=units.map(u=>{
    const linked=stories.filter(s=>{
      const storyRange=ranges(s.reference),unitRange=ranges(u.reference);
      if(storyRange&&unitRange)return overlaps(storyRange,unitRange);
      const p=passage(s.reference);
      return unitRange&&(p.chapter*1000+p.verse)>=(unitRange.startChapter*1000+unitRange.startVerse)&&(p.chapter*1000+p.verse)<=(unitRange.endChapter*1000+unitRange.endVerse);
    });
    return '<button type="button" class="kb-genesis-unit-link" data-genesis-unit="'+escapeHtml(u.id)+'" aria-label="Explorar '+escapeHtml(u.title)+', '+escapeHtml(u.reference)+'"><span class="kb-genesis-number">'+(u.order===0?"P":String(u.order).padStart(2,"0"))+'</span><span class="kb-genesis-unit-title"><strong>'+escapeHtml(u.title)+'</strong><small>'+escapeHtml(u.reference)+'</small></span><span class="kb-genesis-chevron" aria-hidden="true">›</span></button>';
  }).join("");
  const cycles=structure.narrativeCycles.filter(c=>c.eraId===eraId);
  const cycleButtons=cycles.map((c,i)=>'<button type="button" class="kb-genesis-cycle'+(i===0?" active":"")+'" data-genesis-cycle="'+escapeHtml(c.id)+'" aria-pressed="'+(i===0)+'">'+escapeHtml(c.title)+'</button>').join("");
  const cycleStories=cycles.map((c,i)=>{
    const selected=stories.filter(s=>c.id==="primeval"||s.subEraId==="patriarchs--"+c.id);
    return '<div class="kb-genesis-cycle-results" data-genesis-results="'+escapeHtml(c.id)+'" '+(i?"hidden":"")+'><p>'+escapeHtml(c.reference)+' · '+selected.length+' relatos</p><div class="kb-genesis-links">'+selected.map(s=>'<a href="'+basePath+slug+'/'+encodeURIComponent(s.id)+'/">'+escapeHtml(s.title)+' <span>↗</span></a>').join("")+'</div></div>';
  }).join("");
  return '<section class="kb-genesis" aria-label="Estructura literaria de Génesis"><div class="kb-genesis-heading"><div><span class="kb-section-label">GÉNESIS · COMPOSICIÓN LITERARIA</span><h3>Estructura del texto</h3></div><span>'+units.length+' unidades</span></div><p class="kb-genesis-intro">'+(eraId==="primeval"?"El prólogo y las cinco primeras fórmulas toledot.":"Las cinco fórmulas toledot que organizan el relato patriarcal.")+' Explora cada unidad para conocer su alcance y leer el pasaje.</p><div class="kb-genesis-units" role="list">'+unitHtml+'</div><div class="kb-genesis-heading kb-genesis-cycles-heading"><div><span class="kb-section-label">OTRA FORMA DE EXPLORAR</span><h3>Ciclos narrativos</h3></div></div><p class="kb-genesis-intro">Los ciclos reúnen historias por personajes y periodos; no sustituyen las divisiones literarias.</p><div class="kb-genesis-cycle-nav" role="group" aria-label="Seleccionar ciclo narrativo">'+cycleButtons+'</div>'+cycleStories+'</section>';
}
export function initGenesisPanel(root){
  root.querySelectorAll("[data-genesis-cycle]").forEach(button=>button.addEventListener("click",()=>{
    const id=button.dataset.genesisCycle;
    root.querySelectorAll("[data-genesis-cycle]").forEach(b=>{const active=b===button;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
    root.querySelectorAll("[data-genesis-results]").forEach(panel=>{panel.hidden=panel.dataset.genesisResults!==id;});
  }));
}

export function genesisUnitDetail(data,eraId,unitId,basePath,slug){
  const structure=data.genesisStructure;
  if(!structure)return "";
  const raw=[structure.prologue,...structure.toledot].find(u=>u.id===unitId&&u.eraId===eraId);
  if(!raw)return "";
  const isPrologue=unitId===structure.prologue.id;
  const unitRange=ranges(raw.reference);
  const related=(data.stories||[]).filter(story=>{
    if(story.eraId!==eraId)return false;
    const storyRange=ranges(story.reference);
    if(storyRange)return overlaps(unitRange,storyRange);
    const p=passage(story.reference);
    return unitRange&&(p.chapter*1000+p.verse)>=(unitRange.startChapter*1000+unitRange.startVerse)&&(p.chapter*1000+p.verse)<=(unitRange.endChapter*1000+unitRange.endVerse);
  });
  const context=isPrologue?"El prólogo introduce el relato de la creación antes de la primera fórmula toledot.":"La expresión hebrea toledot («estas son las generaciones de…») señala una transición literaria. El nombre mencionado no siempre es el protagonista de toda la unidad.";
  return '<section class="kb-unit-detail" aria-label="Detalle de unidad literaria"><button class="kb-unit-back" type="button" data-genesis-close>‹ Estructura de Génesis</button><span class="kb-section-label">'+(isPrologue?"PRÓLOGO":"TOLEDOT · "+String(raw.order).padStart(2,"0"))+'</span><h2>'+escapeHtml(raw.title)+'</h2><p class="kb-unit-reference">'+escapeHtml(raw.reference)+'</p><p class="kb-unit-explanation">'+escapeHtml(context)+'</p><a class="kb-genesis-read kb-unit-primary" href="'+readUrl(raw.reference)+'">Leer desde '+escapeHtml(raw.reference)+' ↗</a><h3>Relatos relacionados</h3>'+(related.length?'<div class="kb-unit-stories">'+related.map(story=>'<a href="'+basePath+slug+'/'+encodeURIComponent(story.id)+'/">'+escapeHtml(story.title)+' <span aria-hidden="true">›</span></a>').join("")+'</div>':'<p class="kb-unit-empty">Todavía no hay relatos editoriales vinculados a esta unidad.</p>')+'</section>';
}
