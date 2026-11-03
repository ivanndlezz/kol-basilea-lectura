import {NAV_ITEMS,navigationHref,currentNavigationId} from "./navigation-registry.js";
const storageKey="kol-basilea-lectura-v1";
const iconPaths={
 house:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
 route:'<path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3z"/>',
 bookOpen:'<path d="M12 7v14M3 18V4h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v14h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3z"/>',
 chart:'<path d="M3 3v18h18M8 16v-5m5 5V7m5 9V4"/>',
 sliders:'<path d="M4 3v18m8-18v18m8-18v18M1 10h6m2 4h6m2-6h6"/>',
 scrollText:'<path d="M8 21h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8M6 17V5a2 2 0 0 0-4 0v12a4 4 0 0 0 4 4h2M10 8h8m-8 4h8"/>'
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(iconPaths[name]||iconPaths.bookOpen)+'</svg>';
export function mountDocumentNavigation({header=document.querySelector("header"),activeId=currentNavigationId()}={}){
 if(!header||document.querySelector("#kb-global-navigation"))return;
 const trigger=document.createElement("button");
 trigger.type="button";trigger.className="kb-global-menu-trigger";trigger.setAttribute("aria-label","Abrir menú de navegación");trigger.setAttribute("aria-controls","kb-global-navigation-sheet");trigger.setAttribute("aria-expanded","false");
 trigger.innerHTML='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
 header.append(trigger);
 const host=document.createElement("div");host.id="kb-global-navigation";host.hidden=true;
 host.innerHTML='<div class="kb-global-nav-backdrop" data-close></div><aside id="kb-global-navigation-sheet" class="kb-global-nav-sheet" role="dialog" aria-modal="true" aria-labelledby="kb-global-nav-title" tabindex="-1"><div class="kb-global-nav-head"><div><small>Kol Basilea</small><h2 id="kb-global-nav-title">Explorar</h2></div><button type="button" data-close aria-label="Cerrar menú">×</button></div><nav aria-label="Secciones del proyecto">'+NAV_ITEMS.map(item=>'<a class="kb-global-nav-link" href="'+esc(navigationHref(item))+'" '+(item.id===activeId?'aria-current="page"':'')+'>'+icon(item.icon)+'<span><strong>'+esc(item.label)+'</strong><small>'+esc(item.detail)+'</small></span></a>').join("")+'</nav></aside>';
 document.body.append(host);
 let previousFocus=null;
 const close=()=>{host.hidden=true;trigger.setAttribute("aria-expanded","false");document.body.classList.remove("kb-global-nav-open");(previousFocus?.isConnected?previousFocus:trigger).focus({preventScroll:true})};
 const open=()=>{previousFocus=document.activeElement;host.hidden=false;trigger.setAttribute("aria-expanded","true");document.body.classList.add("kb-global-nav-open");host.querySelector("[data-close]")?.focus({preventScroll:true})};
 trigger.addEventListener("click",()=>host.hidden?open():close());
 host.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",close));
 document.addEventListener("keydown",event=>{
   if(host.hidden)return;
   if(event.key==="Escape"){event.preventDefault();close();return;}
   if(event.key!=="Tab")return;
   const elements=[...host.querySelectorAll('a[href],button:not([disabled])')];
   const first=elements[0],last=elements.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 const syncAppearance=()=>{
   let appearance="system";try{const state=JSON.parse(localStorage.getItem(storageKey)||"{}");if(["system","light","dark"].includes(state.appAppearance))appearance=state.appAppearance}catch{}
   host.dataset.appearance=appearance;
 };
 syncAppearance();window.addEventListener("storage",e=>{if(e.key===storageKey)syncAppearance()});
}
