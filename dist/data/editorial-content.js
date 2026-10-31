/** Editorial material is separate from Scripture and reader progress.
 * Do not infer missing history, authorship, video sources or licenses.
 */
export const JUAN_VIDEO = {
  id: "wQtMnuBzb4c",
  title: "Resumen de 1–3 Juan",
  description: "Un panorama animado sobre las tres cartas y sus temas de vida, verdad y amor.",
  duration: "10:58",
  thumbnail: "https://ik.imagekit.io/bpweb1/web/media/video-images/new-testament-overview/123-john/tr:q-65,w-800/123-john_16.9.jpg",
  pageUrl: "https://bibleproject.com/es/guides/libro-de-1-3-juan/",
  youtubeUrl: "https://www.youtube.com/watch?v=wQtMnuBzb4c"
};


export const EDITORIAL_BY_BOOK = Object.freeze({
  "1-juan": { video: JUAN_VIDEO, introductionSummary: JUAN_VIDEO.description, sourceAttribution: "Proyecto Biblia", sourceUrl: JUAN_VIDEO.pageUrl },
  "2-juan": { video: JUAN_VIDEO, introductionSummary: JUAN_VIDEO.description, sourceAttribution: "Proyecto Biblia", sourceUrl: JUAN_VIDEO.pageUrl },
  "3-juan": { video: JUAN_VIDEO, introductionSummary: JUAN_VIDEO.description, sourceAttribution: "Proyecto Biblia", sourceUrl: JUAN_VIDEO.pageUrl }
});
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


