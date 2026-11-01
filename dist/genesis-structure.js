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
const ranges = reference => {
  const match=reference.match(/(?:Génesis\s+)?(\d+)(?::(\d+))?[–-](\d+)(?::(\d+))?/);
  if(!match) return null;
  return {startChapter:Number(match[1]),startVerse:Number(match[2]||1),endChapter:Number(match[3]),endVerse:Number(match[4]||999)};
};
const overlaps=(a,b)=>a&&b&&((a.startChapter*1000+a.startVerse)<=(b.endChapter*1000+b.endVerse))&&((b.startChapter*1000+b.startVerse)<=(a.endChapter*1000+a.endVerse));
export function genesisPanel(data,eraId,basePath,slug){
  if(!["primeval","patriarchs"].includes(eraId)||!data.genesisStructure)return "";
  const structure=data.genesisStructure;
  const units=[...(eraId==="primeval"?[{...structure.prologue,order:0,title:"La creación",kind:"Prólogo"}]:[]),...structure.toledot.filter(u=>u.eraId===eraId).map(u=>({...u,kind:"Toledot"}))];
  const stories=(data.stories||[]).filter(s=>s.eraId===eraId);
  const unitHtml=units.map(u=>{
    const linked=stories.filter(s=>{
      const storyRange=ranges(s.reference);
      const unitRange=ranges(u.reference);
      if(storyRange&&unitRange)return overlaps(storyRange,unitRange);
      const p=passage(s.reference);
      return unitRange&&(p.chapter*1000+p.verse)>=(unitRange.startChapter*1000+unitRange.startVerse)&&(p.chapter*1000+p.verse)<=(unitRange.endChapter*1000+unitRange.endVerse);
    });
    const related=linked.length?'<div class="kb-genesis-related"><span>Historias relacionadas</span>'+linked.map(s=>'<a href="'+basePath+slug+'/'+encodeURIComponent(s.id)+'/">'+escapeHtml(s.title)+' <svg class="kb-lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a>').join("")+'</div>':"";
    return '<details class="kb-genesis-unit"><summary><span class="kb-genesis-symbol" aria-hidden="true">'+(u.order===0?"<svg class=\"kb-lucide\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42\"/></svg>":"<svg class=\"kb-lucide\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 3v12\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"6\" r=\"3\"/><path d=\"M18 9a6 6 0 0 1-6 6H9\"/></svg>")+'</span><span class="kb-genesis-unit-title"><strong>'+escapeHtml(u.title)+'</strong><small>'+escapeHtml(u.order===0?"Prólogo":"Toledot "+u.order)+" · "+escapeHtml(u.reference)+'</small></span><span class="kb-genesis-chevron" aria-hidden="true"><svg class="kb-lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></summary><div class="kb-genesis-unit-body"><p><strong>'+u.kind+'.</strong> '+(u.order===0?"Introducción a los relatos de los orígenes.":"La fórmula «estas son las generaciones de» introduce una nueva sección literaria; no implica necesariamente una biografía del personaje mencionado.")+'</p>'+related+'<a class="kb-genesis-read" href="'+readUrl(u.reference)+'">Leer desde '+escapeHtml(u.reference)+' ↗</a></div></details>';
  }).join("");
  return '<section class="kb-genesis" aria-label="Estructura literaria de Génesis"><div class="kb-genesis-heading"><div><h3>Estructura literaria</h3></div><span>'+units.length+' unidades</span></div><p class="kb-genesis-intro">'+(eraId==="primeval"?"El prólogo y las cinco primeras fórmulas toledot.":"Las cinco fórmulas toledot que organizan el relato patriarcal.")+'</p><div class="kb-genesis-units">'+unitHtml+'</div>';
}
export function initGenesisPanel(root){
  root.querySelectorAll("[data-genesis-cycle]").forEach(button=>button.addEventListener("click",()=>{
    const id=button.dataset.genesisCycle;
    root.querySelectorAll("[data-genesis-cycle]").forEach(b=>{const active=b===button;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
    root.querySelectorAll("[data-genesis-results]").forEach(panel=>{panel.hidden=panel.dataset.genesisResults!==id;});
  }));
}
