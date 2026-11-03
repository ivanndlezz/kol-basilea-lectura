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
// Stable, story-specific editorial art; no external image or borrowed historical scene.
function editorialArt(story){
  const seed=[...String(story.id||story.title)].reduce((n,c)=>(Math.imul(n,33)+c.charCodeAt(0))>>>0,5381);
  const palettes=[["#203e39","#6c8274","#e2c392"],["#34474a","#8b9990","#e6bd87"],["#4b433c","#9b8974","#e5c99d"],["#34493c","#899781","#dbc18a"],["#443f4b","#868093","#e0c09a"],["#4b473c","#9e967e","#e2c78f"],["#344850","#77979b","#dfc29c"],["#52443e","#a48774","#ebcba2"]];
  const [dark,mid,light]=palettes[seed%palettes.length];
  const x=125+seed%550,y=135+(seed>>>6)%165;
  const ridge=500+(seed>>>12)%110;
  const pattern=seed%4;
  const marks=Array.from({length:7},(_,i)=>{const px=75+((seed+i*137)%650),py=65+((seed+i*79)%300);return '<circle cx="'+px+'" cy="'+py+'" r="'+(i%3+2)+'" fill="'+light+'" opacity=".45"/>'}).join("");
  const waves='<path d="M80 750Q250 650 420 750T730 750M120 795Q300 700 650 810" stroke="'+light+'" stroke-width="6" fill="none" opacity=".27"/>';
  const arches='<path d="M140 690V480Q210 365 280 480V690M390 690V450Q465 335 540 450V690" stroke="'+light+'" stroke-width="9" fill="none" opacity=".3"/>';
  const motif=pattern===0?marks:pattern===1?waves:pattern===2?arches:marks+waves;
  return '<svg class="kb-story-editorial-svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="kb-gradient-'+seed+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+dark+'"/><stop offset="1" stop-color="'+mid+'"/></linearGradient></defs><rect width="800" height="1000" fill="url(#kb-gradient-'+seed+')"/><circle cx="'+x+'" cy="'+y+'" r="'+(75+seed%65)+'" fill="'+light+'" opacity=".72"/><path d="M0 '+ridge+'Q200 '+(ridge-150)+' 410 '+(ridge+30)+'T800 '+(ridge-55)+'V1000H0Z" fill="'+dark+'" opacity=".56"/><path d="M0 810Q320 650 800 780V1000H0Z" fill="'+mid+'" opacity=".64"/>'+motif+'<rect x="30" y="30" width="740" height="940" rx="3" fill="none" stroke="'+light+'" opacity=".28" stroke-width="2"/></svg>';
}
export function isApprovedStoryCover(story){
  return Boolean(story?.cover?.src && ["exact", "related", "period-context"].includes(story.cover.match));
}
export function storyCard(story,href,coverUrl,alternatives=[]){
  const sources=isApprovedStoryCover(story)?[coverUrl,...alternatives].filter(Boolean):[];
  const variant=Number.isInteger(story.order)?((story.order-1)%6+6)%6:[...String(story.id||story.title)].reduce((n,c)=>n+c.charCodeAt(0),0)%6;
  const fallback='<span class="kb-story-cover-fallback" aria-hidden="true">'+editorialArt(story)+'</span>';
  const priorityCover=story.eraId==="primeval" && Number(story.order)<=6;
  const image=sources.length?'<img class="kb-story-image" src="'+esc(sources[0])+'" data-cover-sources="'+esc(JSON.stringify(sources))+'" data-cover-index="0" alt="'+esc(story.cover?.alt||story.title)+'" loading="'+(priorityCover?"eager":"lazy")+'" decoding="async">':'';
  const label=story.type==="historical-interlude"?"Interludio histórico":story.reference;
  const subtitle=story.type==="historical-interlude"&&story.subtitle?'<small>'+esc(story.subtitle)+'</small>':"";
  return '<a class="kb-story" href="'+esc(href)+'"><div class="kb-story-art kb-art-'+esc(story.visual)+' kb-cover-variant-'+variant+'">'+fallback+image+'</div><div class="kb-story-copy"><small>'+esc(label)+'</small>'+subtitle+'<h3>'+esc(story.title)+'</h3></div></a>';
}
export function eraPager(eras,index){
  const link=(era,direction)=>era?'<button type="button" class="kb-era-nav-link kb-era-nav-'+direction+'" data-id="'+esc(era.id)+'"><span class="kb-era-nav-direction">'+(direction==="prev"?"← Era anterior":"Siguiente era →")+'</span><strong>'+esc(era.title)+'</strong></button>':"";
  return '<nav class="kb-era-nav" aria-label="Continuar por las eras"><p class="kb-era-nav-eyebrow">Continúa explorando la historia</p><div class="kb-era-nav-actions">'+link(eras[index-1],"prev")+link(eras[index+1],"next")+'</div></nav>';
}
export function renderEraSheet({era,books="",body="",navigation=""}){
  return '<header class="kb-sheet-heading"><h2>'+esc(era.title)+'</h2><p class="kb-history-context">'+esc(era.subtitle)+'</p></header>'+books+'<div class="kb-sheet-content">'+body+'</div>'+navigation;
}
// All eras share the same narrative-card surface. Unreviewed events are clearly labelled.
export function renderEraOverview({era,books,navigation,events=[],periods=[],readerPath="",basePath="",selectedEvent=null,pericopeSection=""}){
  if(selectedEvent){
    const period=periods.find(p=>p.id===selectedEvent.subEraId);
    const sourceBooks=(selectedEvent.bookIds||[]).filter(Boolean);
    const sources=sourceBooks.length?'<p class="kb-story-context">Libros relacionados: '+sourceBooks.map(esc).join(", ")+'</p>':'<p class="kb-story-context">Contexto histórico extrabíblico; no hay un pasaje directo asignado.</p>';
    const body='<a class="kb-story-back" href="'+esc(basePath)+'">← Todos los acontecimientos</a><p class="plate-kicker">'+esc(era.title)+(period?' · '+esc(period.title):'')+'</p><h2>'+esc(selectedEvent.title)+'</h2><p class="summary">'+esc(era.summary||era.subtitle)+'</p>'+sources+'<p class="kb-history-explorer-note">Ficha contextual en preparación. Todavía no hay un relato revisado ni una referencia precisa para este acontecimiento.</p>';
    return renderEraSheet({era,books,body,navigation});
  }
  const groups=periods.length?periods.map(p=>({id:p.id,title:p.title,items:events.filter(e=>e.subEraId===p.id)})).filter(g=>g.items.length):[{id:"all",title:"Acontecimientos",items:events}];
  const covered=new Set(groups.flatMap(g=>g.items.map(e=>e.id)));
  const rest=events.filter(e=>!covered.has(e.id));
  if(rest.length)groups.push({id:"other",title:"Otros acontecimientos",items:rest});
  const cards=groups.map(group=>'<section class="kb-story-section" aria-label="'+esc(group.title)+'"><div class="kb-story-heading"><h3>'+esc(group.title)+'</h3><span>'+group.items.length+' acontecimientos</span></div><div class="kb-story-grid">'+group.items.map(event=>{
    const bookId=event.bookIds?.[0],meta=bookMeta[bookId],name=meta?.name||bookId||"";
    const href=basePath+encodeURIComponent(event.id)+"/";
    const status=event.date?.precision==="debated"?"Cronología debatida":event.dateLabel||"Contexto histórico";
    const content='<div class="kb-story-art" aria-hidden="true"><b>✦</b></div><div class="kb-story-copy"><small>'+esc(status)+'</small><h3>'+esc(event.title)+'</h3><small>Acontecimiento · Ficha pendiente de revisión</small>'+(name?'<small>Relacionado con '+esc(name)+'</small>':"")+'</div>';
    return '<a class="kb-story" href="'+esc(href)+'" aria-label="Abrir ficha de '+esc(event.title)+'">'+content+'</a>';
  }).join("")+'</div></section>').join("");
  const intro=era.summary?'<p class="kb-story-context">'+esc(era.summary)+'</p>':"";
  const body=intro+pericopeSection+'<p class="kb-history-explorer-note">Estos acontecimientos todavía no son relatos editoriales revisados. Las fichas se incorporarán tras su validación.</p>'+cards;
  return renderEraSheet({era,books,body,navigation});
}
