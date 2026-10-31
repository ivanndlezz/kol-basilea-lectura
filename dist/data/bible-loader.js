/** Browser-side lazy loader. No runtime USFM parsing or server is required. */
const loaded = new Map();
const pending = new Map();
const failed = new Set();
export function getLoadedBibleChapter(bookId, chapter, translationId = "rvr1909") {
  if (translationId !== "rvr1909") return null;
  const book = loaded.get(bookId);
  const selected = book?.chapters?.[chapter - 1];
  if (!selected || selected.number !== chapter) return null;
  return {
    bookId, chapter,
    sourceUrl: "https://ebible.org/spaRV1909/",
    verses: selected.verses
  };
}
export function getBookLoadState(bookId) {
  return loaded.has(bookId) ? "ready" : failed.has(bookId) ? "error" : pending.has(bookId) ? "loading" : "idle";
}
export async function loadBibleBook(bookId) {
  if (!/^[a-z0-9-]+$/.test(bookId)) throw new Error("Invalid book ID");
  if (loaded.has(bookId)) return loaded.get(bookId);
  if (pending.has(bookId)) return pending.get(bookId);
  const task = fetch(new URL("./rvr1909/" + bookId + ".json", import.meta.url))
    .then(async response => {
      if (!response.ok) throw new Error("Bible book unavailable: " + response.status);
      const book = await response.json();
      if (book.bookId !== bookId || book.translationId !== "rvr1909" || !Array.isArray(book.chapters)) throw new Error("Invalid Bible book data");
      loaded.set(bookId, book);
      failed.delete(bookId);
      return book;
    }).catch(error => { failed.add(bookId); throw error; })
    .finally(() => pending.delete(bookId));
  pending.set(bookId, task);
  return task;
}
