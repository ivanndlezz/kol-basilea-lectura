// Única fuente de verdad para la superficie editorial de Historia.
// Este módulo recibe datos preparados; no hace fetch, routing ni mutaciones DOM.
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const bookMeta={genesis:{name:"Génesis",category:"Ley",chapters:50,range:"Génesis 1–50"},exodo:{name:"Éxodo",category:"Ley",chapters:40},levitico:{name:"Levítico",category:"Ley",chapters:27},numeros:{name:"Números",category:"Ley",chapters:36},deuteronomio:{name:"Deuteronomio",category:"Ley",chapters:34},josue:{name:"Josué",category:"Históricos",chapters:24},jueces:{name:"Jueces",category:"Históricos",chapters:21},rut:{name:"Rut",category:"Históricos",chapters:4}};
export function bookLinks(era,readerPath){
  if(!era.bookIds?.length)return "";
  return '<div class="kb-history-books"><div class="kb-history-book-row">'+era.bookIds.map(id=>{
    const meta=bookMeta[id]||{name:id.replace(/-/g," "),category:"Libro bíblico"};
    const range=era.relatedTexts?.find(t=>t.toLowerCase().includes(meta.name.toLowerCase()))||era.subtitle;
    return '<a class="kb-history-book" href="'+readerPath+'?book='+encodeURIComponent(id)+'&chapter=1"><span class="kb-history-book-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v14"/></svg></span><span class="kb-history-book-info"><strong>'+esc(meta.name)+'</strong><small>'+esc(meta.chapters?meta.chapters+' capítulos · '+(range||meta.category):range||meta.category)+'</small></span><span class="kb-history-book-arrow" aria-hidden="true">›</span></a>';
  }).join("")+'</div></div>';
}
export function storyCard(story,href,coverUrl){
  return '<a class="kb-story" href="'+href+'"><div class="kb-story-art kb-art-'+esc(story.visual)+'">'+(story.cover?.src?'<img class="kb-story-image" src="'+esc(coverUrl)+'" alt="'+esc(story.cover.alt||story.title)+'" loading="lazy" decoding="async">':'<b aria-hidden="true">'+({cosmos:"✺",garden:"❧",brothers:"◈",city:"▥",flood:"≋",tower:"▤"}[story.visual]||"✦")+'</b>')+'</div><div class="kb-story-copy"><small>'+esc(story.reference)+'</small><h3>'+esc(story.title)+'</h3></div></a>';
}
export function eraPager(eras,index){
  const link=(era,direction)=>era?'<button type="button" class="kb-era-nav-link kb-era-nav-'+direction+'" data-id="'+esc(era.id)+'"><span class="kb-era-nav-direction">'+(direction==="prev"?"← Era anterior":"Siguiente era →")+'</span><strong>'+esc(era.title)+'</strong></button>':"";
  return '<nav class="kb-era-nav" aria-label="Continuar por las eras"><p class="kb-era-nav-eyebrow">Continúa explorando la historia</p><div class="kb-era-nav-actions">'+link(eras[index-1],"prev")+link(eras[index+1],"next")+'</div></nav>';
}
export function renderEraSheet({era,books="",body="",navigation=""}){
  return '<header class="kb-sheet-heading"><h2>'+esc(era.title)+'</h2><p class="kb-history-context">'+esc(era.subtitle)+'</p></header>'+books+'<div class="kb-sheet-content">'+body+'</div>'+navigation;
}
export function renderEraOverview({era,books,navigation,events=[],periods=[],readerPath=""}){
  const groups=periods.length?periods.map(p=>({id:p.id,title:p.title,items:events.filter(e=>e.subEraId===p.id)})).filter(g=>g.items.length):[{id:"all",title:"Acontecimientos",items:events}];
  const covered=new Set(groups.flatMap(g=>g.items.map(e=>e.id)));
  const rest=events.filter(e=>!covered.has(e.id));
  if(rest.length)groups.push({id:"other",title:"Otros acontecimientos",items:rest});
  const cards=groups.map(group=>'<section class="kb-event-group"><h3>'+esc(group.title)+'</h3><div class="kb-event-list">'+group.items.map(event=>{
    const bookId=event.bookIds?.[0],meta=bookMeta[bookId],name=meta?.name||bookId||"";
    const href=bookId?readerPath+'?book='+encodeURIComponent(bookId)+'&chapter=1':"";
    const status=event.date?.precision==="debated"?"Cronología debatida":event.dateLabel||"Contexto histórico";
    return '<article class="kb-event-card"><div class="kb-event-card-copy"><small>'+esc(status)+'</small><h4>'+esc(event.title)+'</h4><p>'+esc(name?("Relacionado con "+name):"Acontecimiento de la era")+'</p></div>'+(href?'<a href="'+esc(href)+'" aria-label="Explorar '+esc(name)+' en la Biblia">Explorar libro <span aria-hidden="true">↗</span></a>':"")+'</article>';
  }).join("")+'</div></section>').join("");
  const intro=era.summary?'<p class="kb-story-context">'+esc(era.summary)+'</p>':"";
  const body=intro+(events.length?'<section class="kb-history-explorer"><div class="kb-history-explorer-head"><span>ATLAS HISTÓRICO</span><strong>'+events.length+' acontecimientos</strong></div><p class="kb-history-explorer-note">Explora los acontecimientos vinculados con esta época. Las referencias y narraciones detalladas se incorporarán conforme se revisen.</p>'+cards+'</section>':"");
  return renderEraSheet({era,books,body,navigation});
}
