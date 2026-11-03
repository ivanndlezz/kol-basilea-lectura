// History route configuration and browser-history operations.
export const ERA_SLUGS = Object.freeze({
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
});
export function eraFromLocation(basePath, locationObject=location) {
  const segment=locationObject.pathname.slice(basePath.length).split("/").filter(Boolean)[0];
  return Object.keys(ERA_SLUGS).find(id=>ERA_SLUGS[id]===segment) ||
    new URL(locationObject.href).searchParams.get("era");
}
export function pathForEra(basePath,id,keepRoot=false) {
  return basePath+(keepRoot?"":ERA_SLUGS[id]+"/");
}
export function storyFromLocation(basePath,stories,locationObject=location) {
  const segments=locationObject.pathname.slice(basePath.length).split("/").filter(Boolean);
  if(segments.length<2)return null;
  const storyId=segments[segments.length-1];
  return (stories||[]).find(story=>story.id===storyId)||null;
}
export function resolveHistoryAssetUrl(src,moduleUrl=import.meta.url) {
  if(!src)return "";
  return /^(https?:)?\/\//i.test(src)?src:new URL("./"+src,moduleUrl).pathname;
}
export function navigateToEra(basePath,id,keepRoot=false) {
  const path=pathForEra(basePath,id,keepRoot);
  if(location.pathname!==path) history.pushState({era:id},"",path);
}
