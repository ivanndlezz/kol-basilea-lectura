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
function eraYear(year){
  if(year===null||year===undefined)return "actualidad";
  return Math.abs(year)+(year<0?" a. C.":" d. C.");
}
function eraDate(era){
  const date=era.date||{};
  if(date.label)return {uncertain:true,label:date.label};
  if(date.startYear===null||date.startYear===undefined)return {uncertain:true,label:"Sin datación verificable"};
  const prefix=date.precision==="approximate"?"c. ":"";
  return {uncertain:false,label:prefix+eraYear(date.startYear)+" – "+eraYear(date.endYear)};
}
function eraDateSticky(era){
  const date=eraDate(era);
  return '<div class="kb-era-date-sentinel" data-kb-era-date-sentinel aria-hidden="true"></div><div class="kb-era-date-sticky" data-kb-era-date-sticky aria-label="Rango temporal"><span class="kb-era-date-label">'+(date.uncertain?'<span class="kb-hatch" aria-hidden="true"></span>':"")+esc(date.label)+'</span></div>';
}
export function renderEraStrip(eras,activeId){
  const total=eras.length;
  return eras.map((era,index)=>{
    const date=eraDate(era);
    const group=era.groupId==="christianity"?"Cristianismo":"Historia bíblica";
    return '<button class="era" data-id="'+esc(era.id)+'" aria-pressed="'+String(era.id===activeId)+'" style="--era-color:'+esc(era.color)+'"><span class="era-top"><span class="era-group">'+group+'</span><span class="era-count">'+(index+1)+' de '+total+'</span></span><span class="era-title">'+esc(era.title)+'</span><span class="era-date">'+(date.uncertain?'<span class="kb-hatch" aria-hidden="true"></span>':"")+esc(date.label)+'</span></button>';
  }).join("");
}
export function renderEraSheet({era,books="",body="",navigation=""}){
  return eraDateSticky(era)+'<header class="kb-sheet-heading"><h2>'+esc(era.title)+'</h2><p class="kb-history-context">'+esc(era.subtitle)+'</p></header><div class="kb-sheet-content">'+body+'</div>'+books+navigation;
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

const pericopeSheetStore=new Map();
const pericopeRows=(items,{readerPath="",bookNames={},statusLabel="Perícopa propuesta"}={})=>{
  const range=item=>{
    const start=item.start||{},end=item.end||start;
    const book=bookNames[item.bookId]||item.bookName||item.bookId||"Texto bíblico";
    const first=book+" "+start.chapter+":"+start.verse;
    const last=(end.chapter&&end.chapter!==start.chapter?end.chapter+":" : "")+(end.verse||start.verse);
    return first+(last&&last!==String(start.verse)?"–"+last:"");
  };
  return '<div class="kb-pericope-rows">'+items.map(item=>{
    const href=readerPath+'?book='+encodeURIComponent(item.bookId||"")+'&chapter='+encodeURIComponent(item.start?.chapter||1)+'&verse='+encodeURIComponent(item.start?.verse||1);
    const title=item.title||("Perícopa · "+range(item));
    return '<a class="kb-pericope-row" data-book-id="'+esc(item.bookId||"")+'" href="'+esc(href)+'"><span class="kb-pericope-row-copy"><small>'+esc(range(item))+'</small><strong>'+esc(title)+'</strong><em>'+esc(statusLabel)+'</em></span><span class="kb-pericope-row-arrow" aria-hidden="true">›</span></a>';
  }).join("")+'</div>';
};
const pericopeBooks=(items,{bookNames={},readerPath="",statusLabel="Perícopa propuesta"}={})=>{
  const groups=new Map();
  for(const item of items){
    const bookId=item.bookId||"unknown";
    if(!groups.has(bookId))groups.set(bookId,[]);
    groups.get(bookId).push(item);
  }
  return '<div class="kb-pericope-books">'+[...groups.entries()].map(([bookId,group],index)=>'<details class="kb-pericope-book"'+(index===0?' open':'')+'><summary><span>'+esc(bookNames[bookId]||group[0].bookName||bookId)+'</span><small>'+group.length+' '+(group.length===1?'perícopa':'perícopas')+'</small></summary>'+pericopeRows(group,{readerPath,bookNames,statusLabel})+'</details>').join("")+'</div>';
};
export function pericopeList(items,{readerPath="",bookNames={},statusLabel="Perícopa propuesta",id="all"}={}){
  const sheetId="kb-pericope-sheet-"+String(id).replace(/[^a-z0-9_-]+/gi,"-");
  const sample=items.slice(0,5),more=items.length>sample.length;
  if(more)pericopeSheetStore.set(sheetId,{items,readerPath,bookNames,statusLabel});
  return '<div class="kb-pericope-browser"><div class="kb-pericope-sample"><div class="kb-pericope-sample-heading"><strong>Muestra de '+sample.length+'</strong><span>'+items.length+' en total</span></div>'+pericopeRows(sample,{readerPath,bookNames,statusLabel})+'</div>'+(more?'<button type="button" class="kb-pericope-open" data-kb-pericope-open data-kb-pericope-sheet="'+esc(sheetId)+'" aria-controls="'+esc(sheetId)+'">Ver todas las '+items.length+' perícopas <span aria-hidden="true">→</span></button>':"")+'</div>';
}

function renderPericopeSheet(sheetId){
  const data=pericopeSheetStore.get(sheetId);
  if(!data)return null;
  const sheet=document.createElement("div");
  sheet.className="kb-navigation-layer kb-pericope-sheet";
  sheet.id=sheetId;
  sheet.innerHTML='<button class="kb-navigation-backdrop" data-kb-pericope-close aria-label="Cerrar índice"></button><aside class="kb-navigation-sheet kb-pericope-sheet-panel" id="'+esc(sheetId+'-panel')+'" role="dialog" aria-modal="true" aria-labelledby="'+esc(sheetId+'-title')+'"><div class="kb-navigation-head"><div><p class="eyebrow">Índice de lectura</p><h2 id="'+esc(sheetId+'-title')+'">Perícopas</h2><p class="kb-pericope-sheet-count">'+data.items.length+' unidades disponibles en esta sección.</p></div><button type="button" class="kb-navigation-close kb-pericope-sheet-close" data-kb-pericope-close aria-label="Cerrar índice">×</button></div>'+pericopeBooks(data.items,data)+'</aside>';
  return sheet;
}

export function initPericopeSheets(root=document.body){
  if(!root||root.dataset.kbPericopeSheets)return;
  root.dataset.kbPericopeSheets="ready";
  const host=document.createElement("div");
  host.className="kb-pericope-sheet-root";
  document.body.append(host);
  const close=sheet=>{if(!sheet)return;const opener=sheet.__opener;sheet.remove();document.body.classList.remove("kb-navigation-open","kb-pericope-sheet-open");opener?.focus({preventScroll:true})};
  root.addEventListener("click",event=>{
    const open=event.target.closest("[data-kb-pericope-open]");
    if(open){const sheet=renderPericopeSheet(open.dataset.kbPericopeSheet||open.getAttribute("aria-controls"));if(sheet){sheet.__opener=open;host.replaceChildren(sheet);document.body.classList.add("kb-navigation-open","kb-pericope-sheet-open");sheet.querySelector(".kb-pericope-sheet-close")?.focus({preventScroll:true})}return}
  });
  host.addEventListener("click",event=>{
    const closeButton=event.target.closest("[data-kb-pericope-close]");
    if(closeButton)close(closeButton.closest(".kb-pericope-sheet"));
  });
  document.addEventListener("keydown",event=>{const sheet=host.querySelector(".kb-pericope-sheet");if(!sheet)return;if(event.key==="Escape"){event.preventDefault();close(sheet);return}if(event.key!=="Tab")return;const focusable=[...sheet.querySelectorAll("button:not([disabled]),a[href],summary")].filter(el=>el.getClientRects().length);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
}

// El rango temporal vive dentro del sheet, pero su estado sticky se deriva del
// scroll real del contenedor de Historia. Así el render no necesita conocer el
// ciclo de vida del DOM y el comportamiento funciona en todas las eras.
export function initEraDateSticky(root){
  if(!root)return()=>{};
  const date=root.querySelector("[data-kb-era-date-sticky]"),sentinel=root.querySelector("[data-kb-era-date-sentinel]");
  if(!date||!sentinel)return()=>{};
  const scrollRoot=root.closest?.(".page")||null;
  const setStuck=value=>date.classList.toggle("is-stuck",Boolean(value));
  if(typeof IntersectionObserver!=="undefined"){
    const observer=new IntersectionObserver(entries=>setStuck(!entries[0]?.isIntersecting),{root:scrollRoot,threshold:0,rootMargin:"-1px 0px 0px 0px"});
    observer.observe(sentinel);
    return()=>observer.disconnect();
  }
  const target=scrollRoot||window;
  let frame=0;
  const update=()=>{
    frame=0;
    const boundary=scrollRoot?.getBoundingClientRect?.().top||0;
    setStuck(sentinel.getBoundingClientRect().bottom<=boundary+1);
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  target.addEventListener("scroll",onScroll,{passive:true});
  update();
  return()=>{target.removeEventListener("scroll",onScroll);if(frame)cancelAnimationFrame(frame)};
}

if(typeof document!=="undefined"&&typeof MutationObserver!=="undefined"){
  const detail=document.querySelector("#era-detail");
  if(detail){
    let cleanup=()=>{};
    const bind=()=>{cleanup();cleanup=initEraDateSticky(detail)};
    new MutationObserver(bind).observe(detail,{childList:true});
    bind();
  }
}
