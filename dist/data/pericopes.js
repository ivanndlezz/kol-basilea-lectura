/** Independent editorial headings, loaded only for books with verified sections. */
const cache = new Map();
const pending = new Map();
export function getPericopes(bookId, chapter) {
  const book = cache.get(bookId);
  return book?.chapters ? (book.chapters.find(item => item.number === chapter)?.sections || []) : book?.chapter === chapter ? book.sections : [];
}
export function loadPericopes(bookId) {
  if (!/^[a-z0-9-]+$/.test(bookId)) return Promise.resolve(null);
  if (cache.has(bookId)) return Promise.resolve(cache.get(bookId));
  if (pending.has(bookId)) return pending.get(bookId);
  const task = fetch(new URL("./pericopes/" + bookId + ".json", import.meta.url))
    .then(async response => {
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Editorial sections unavailable");
      const data = await response.json();
      if (data.bookId !== bookId || !(Array.isArray(data.chapters) || (Number.isInteger(data.chapter) && Array.isArray(data.sections)))) throw new Error("Invalid section data");
      const chapters = data.chapters || [{number:data.chapter,sections:data.sections}];
      if (!chapters.every(ch => Number.isInteger(ch.number) && Array.isArray(ch.sections) && ch.sections.every(section => Number.isInteger(section.startVerse) && section.startVerse > 0 && typeof section.title === "string"))) throw new Error("Invalid section headings");
      cache.set(bookId, data);
      return data;
    }).catch(() => null).finally(() => pending.delete(bookId));
  pending.set(bookId, task);
  return task;
}
