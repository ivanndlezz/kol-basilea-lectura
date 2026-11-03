// Central navigation registry shared by reader and historical documents.
export const NAV_ITEMS = Object.freeze([
  {id:"home",label:"Hoy",detail:"Tu siguiente lectura",icon:"house",group:"reading",view:"home"},
  {id:"route",label:"Ruta de lectura",detail:"Sigue la secuencia editorial",icon:"route",group:"reading",view:"route"},
  {id:"library",label:"Biblioteca bíblica",detail:"Explora libremente los 66 libros",icon:"bookOpen",group:"reading",view:"library"},
  {id:"progress",label:"Mi progreso",detail:"Capítulos y libros leídos",icon:"chart",group:"reading",view:"progress"},
  {id:"more",label:"Configuración",detail:"Meta y preferencias",icon:"sliders",group:"settings",view:"more"},
  {id:"history",label:"Historia y eras",detail:"Cronología y relatos",icon:"scrollText",group:"explore",path:"history/"},
  {id:"bible-history",label:"Historia de la Biblia",detail:"Origen y transmisión de los textos",icon:"bookOpen",group:"explore",path:"history/biblia/"}
]);
export const APP_ROOT = new URL("../",import.meta.url);
export function navigationHref(item,base=APP_ROOT) {
  if(item.path)return new URL(item.path,base).href;
  return new URL("?view="+encodeURIComponent(item.view),base).href;
}
export function currentNavigationId(url=location.href) {
  const target=new URL(url,APP_ROOT);
  const root=APP_ROOT.pathname;
  const relative=target.pathname.startsWith(root)?target.pathname.slice(root.length):"";
  if(relative.startsWith("history/biblia/"))return "bible-history";
  if(relative.startsWith("history/"))return "history";
  const view=target.searchParams.get("view");
  return NAV_ITEMS.find(item=>item.view===view)?.id||"home";
}
export function readerNavigationItems() {return NAV_ITEMS.filter(item=>item.view);}
export function externalNavigationItems() {return NAV_ITEMS.filter(item=>item.path);}
