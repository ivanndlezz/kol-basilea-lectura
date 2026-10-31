/** Pure selectors: chapter completion is the only persisted source of truth. */
import { BOOKS } from "./bible-catalog.js";
export function completedChapters(progress, book) {
  const chapters = progress?.completedChapters?.[book.id];
  return Array.isArray(chapters) ? chapters.filter(n => Number.isInteger(n) && n >= 1 && n <= book.chapters) : [];
}
export function isBookFinished(progress, book) {
  return new Set(completedChapters(progress, book)).size === book.chapters;
}
export function completedChapterCount(progress) {
  return BOOKS.reduce((sum, book) => sum + new Set(completedChapters(progress, book)).size, 0);
}
export function completedBookCount(progress) {
  return BOOKS.filter(book => isBookFinished(progress, book)).length;
}
export function nextReadingBook(progress) {
  return BOOKS.find(book => !isBookFinished(progress, book)) || BOOKS[BOOKS.length - 1];
}
export function nextReadingChapter(progress, book) {
  const completed = new Set(completedChapters(progress, book));
  for (let n = 1; n <= book.chapters; n += 1) if (!completed.has(n)) return n;
  return book.chapters;
}
export function markChapterComplete(progress, book, chapter) {
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) return progress;
  const chapters = new Set(completedChapters(progress, book));
  chapters.add(chapter);
  return { ...progress, completedChapters: { ...progress.completedChapters, [book.id]: [...chapters].sort((a,b) => a-b) } };
}
