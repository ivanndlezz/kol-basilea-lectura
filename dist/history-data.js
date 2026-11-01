// Data access and integrity for the History screen. No DOM or routing dependencies.
const TIMELINE_URL = new URL("./data/history/timeline.json", import.meta.url);
export async function loadHistoryData() {
  const response = await fetch(TIMELINE_URL, {cache:"no-store"});
  if (!response.ok) throw new Error("No se pudo cargar la cronología");
  const data = await response.json();
  if (!Array.isArray(data.eras) || data.eras.length === 0) throw new Error("La cronología no contiene eras");
  const ids = data.eras.map(era => era.id);
  if (new Set(ids).size !== ids.length) throw new Error("La cronología contiene identificadores repetidos");
  return {...data, eras:[...data.eras].sort((a,b)=>a.order-b.order)};
}
