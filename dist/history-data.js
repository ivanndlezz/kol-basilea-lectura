// Data access and integrity for the History screen. No DOM or routing dependencies.
const HISTORY_SNAPSHOT_URL = new URL("./data/history/history-snapshot.json?v=history-snapshot-v1", import.meta.url);
const hasRange=item=>Boolean(item?.start?.chapter&&item?.start?.verse&&item?.end?.chapter&&item?.end?.verse);
export async function loadHistoryData() {
  const response = await fetch(HISTORY_SNAPSHOT_URL, {cache:"no-store"});
  if (!response.ok) throw new Error("No se pudo cargar la cronología");
  const data = await response.json();
  if (!Array.isArray(data.eras) || data.eras.length === 0) throw new Error("La cronología no contiene eras");
  const ids = data.eras.map(era => era.id);
  if (new Set(ids).size !== ids.length) throw new Error("La cronología contiene identificadores repetidos");
  const catalog=data.historyCatalog;
  if (!catalog || !catalog.editorialByEra || !catalog.automaticByEra) throw new Error("La cronología no contiene un catálogo único");
  const editorial=Object.values(catalog.editorialByEra).flat();
  const automatic=Object.values(catalog.automaticByEra).flat();
  if ([...editorial,...automatic].some(item=>!hasRange(item))) throw new Error("El catálogo contiene rangos incompletos");
  return {
    ...data,
    eras:[...data.eras].sort((a,b)=>a.order-b.order),
    pericopesByEra:catalog.editorialByEra,
    automaticByEra:catalog.automaticByEra
  };
}
