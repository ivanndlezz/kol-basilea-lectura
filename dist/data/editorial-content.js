/** Editorial material is separate from Scripture and reader progress.
 * Do not infer missing history, authorship, video sources or licenses.
 */
const videoResponse = await fetch(new URL("./media/videos.json", import.meta.url));
if (!videoResponse.ok) throw new Error("Cannot load editorial video registry");
const videoRegistry = await videoResponse.json();
const resolveVideo = bookId => {
  const resourceId = videoRegistry.videoByBook[bookId]?.[0];
  if (!resourceId) return null;
  const video = videoRegistry.videos[resourceId];
  if (!video) throw new Error(`Missing video resource: ${resourceId}`);
  return { ...video, id: video.youtubeId };
};
export const JUAN_VIDEO = resolveVideo("1-juan");
export const EDITORIAL_BY_BOOK = Object.freeze(Object.fromEntries(
  Object.keys(videoRegistry.videoByBook).map(bookId => {
    const video = resolveVideo(bookId);
    return [bookId, { video, introductionSummary: video.description, sourceAttribution: "Proyecto Biblia", sourceUrl: video.pageUrl }];
  })
));
export function getBookEditorial(bookId) { return EDITORIAL_BY_BOOK[bookId] || null; }

export const BOOK_INFO = {
  "1-juan": {
    lead: "Una carta pastoral sobre la vida, la verdad y el amor.",
    body: "1 Juan anima a comunidades de creyentes a permanecer en la verdad y a reconocer el amor fraternal como una expresión concreta de la comunión con Dios.",
    context: "Tradicionalmente se ha vinculado con Juan y con comunidades de Asia Menor hacia el final del siglo I. Presentamos este dato como contexto histórico editorial, no como una certeza absoluta.",
    themes: ["Luz y tinieblas", "Verdad y error", "Vida y amor"],
    sourceLabel: "Referencia de introducción consultada en Bible App",
    sourceUrl: "https://www.bible.com/es/bible/149/1JN.INTRO1.RVR1960"
  }
};


