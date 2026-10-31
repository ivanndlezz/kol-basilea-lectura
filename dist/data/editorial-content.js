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
