/** Browser-side lazy loader. No runtime USFM parsing or server is required. */
import { DEFAULT_TRANSLATION_ID, getBibleTranslation, isBibleTranslationId } from "./bible-translations.js";

const loaded = new Map();
const pending = new Map();
const failed = new Set();

function cacheKey(bookId, translationId) {
  return `${translationId}/${bookId}`;
}

export function getLoadedBibleChapter(bookId, chapter, translationId = DEFAULT_TRANSLATION_ID) {
  const translation = getBibleTranslation(translationId);
  const book = loaded.get(cacheKey(bookId, translation.id));
  const selected = book?.chapters?.[chapter - 1];
  if (!selected || selected.number !== chapter) return null;
  return {
    bookId,
    chapter,
    translationId: translation.id,
    sourceUrl: translation.sourceUrl,
    verses: selected.verses
  };
}

export function getBookLoadState(bookId, translationId = DEFAULT_TRANSLATION_ID) {
  const key = cacheKey(bookId, getBibleTranslation(translationId).id);
  return loaded.has(key) ? "ready" : failed.has(key) ? "error" : pending.has(key) ? "loading" : "idle";
}

export async function loadBibleBook(bookId, translationId = DEFAULT_TRANSLATION_ID) {
  if (!/^[a-z0-9-]+$/.test(bookId)) throw new Error("Invalid book ID");
  if (!isBibleTranslationId(translationId)) throw new Error("Invalid Bible translation");
  const translation = getBibleTranslation(translationId);
  const key = cacheKey(bookId, translation.id);
  if (loaded.has(key)) return loaded.get(key);
  if (pending.has(key)) return pending.get(key);
  const task = fetch(new URL(`./${translation.dataDir}/${bookId}.json`, import.meta.url))
    .then(async response => {
      if (!response.ok) throw new Error(`Bible book unavailable: ${response.status}`);
      const book = await response.json();
      if (book.bookId !== bookId || book.translationId !== translation.id || !Array.isArray(book.chapters)) throw new Error("Invalid Bible book data");
      loaded.set(key, book);
      failed.delete(key);
      return book;
    }).catch(error => { failed.add(key); throw error; })
    .finally(() => pending.delete(key));
  pending.set(key, task);
  return task;
}
