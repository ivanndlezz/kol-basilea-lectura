const KB_ICONS={"sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4\"/>","earth":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20\"/>","user-round":"<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M5 21a7 7 0 0 1 14 0\"/>","waves":"<path d=\"M2 6c4-4 6 4 10 0s6 4 10 0M2 12c4-4 6 4 10 0s6 4 10 0M2 18c4-4 6 4 10 0s6 4 10 0\"/>","users":"<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m2 9v-2a5 5 0 0 0-3-4\"/>","git-branch":"<path d=\"M6 3v12\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"6\" r=\"3\"/><path d=\"M18 9a6 6 0 0 1-6 6H9\"/>","tent":"<path d=\"m3 20 9-16 9 16H3Zm9-16v16\"/>","footprints":"<ellipse cx=\"8\" cy=\"7\" rx=\"3\" ry=\"5\"/><ellipse cx=\"16\" cy=\"17\" rx=\"3\" ry=\"5\"/>","wheat":"<path d=\"M12 22V3m0 4-4-3m4 7-4-3m4 7-4-3m0-5 4-3m-4 7 4-3m-4 7 4-3\"/>","mountain":"<path d=\"m2 20 8-14 5 8 3-4 4 10H2Z\"/>","star":"<path d=\"m12 2 3 7 7 .7-5.3 4.8 1.5 7-6.2-3.7-6.2 3.7 1.5-7L2 9.7 9 9Z\"/>"};const iconSvg=name=>'<svg class="kb-lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(KB_ICONS[name]||KB_ICONS['git-branch'])+'</svg>';
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
    return '<details class="kb-genesis-unit"><summary><span class="kb-genesis-symbol" aria-hidden="true">'+iconSvg(u.icon||"git-branch")+'</span><span class="kb-genesis-unit-title"><strong>'+escapeHtml(u.title)+'</strong><small>'+escapeHtml(u.order===0?"Prólogo":"Toledot "+u.order)+" · "+escapeHtml(u.reference)+'</small></span><span class="kb-genesis-chevron" aria-hidden="true"><svg class="kb-lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></summary><div class="kb-genesis-unit-body"><p><strong>'+u.kind+'.</strong> '+(u.order===0?"Introducción a los relatos de los orígenes.":"La fórmula «estas son las generaciones de» introduce una nueva sección literaria; no implica necesariamente una biografía del personaje mencionado.")+'</p>'+related+'<a class="kb-genesis-read" href="'+readUrl(u.reference)+'">Leer desde '+escapeHtml(u.reference)+' ↗</a></div></details>';
  }).join("");
  return '<section class="kb-genesis" aria-label="Estructura literaria de Génesis"><div class="kb-genesis-heading"><div><h3>Estructura literaria</h3></div><span>'+units.length+' unidades</span></div><p class="kb-genesis-intro">'+(eraId==="primeval"?"El prólogo y las cinco primeras fórmulas toledot.":"Las cinco fórmulas toledot que organizan el relato patriarcal.")+'</p><div class="kb-genesis-units">'+unitHtml+'</div>';
}
export function initGenesisPanel(){ /* Literary units use native details elements. */ }
