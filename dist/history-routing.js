// History route configuration and browser-history operations.
export const ERA_SLUGS = Object.freeze({
  primeval:"historia-primigenia",
  patriarchs:"patriarcas",
  "exodus-judges":"exodo-y-jueces",
  monarchy:"monarquia",
  "exile-restoration":"exilio-y-restauracion",
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
export function navigateToEra(basePath,id,keepRoot=false) {
  const path=pathForEra(basePath,id,keepRoot);
  if(location.pathname!==path) history.pushState({era:id},"",path);
}
