import { BOOKS } from "./bible-catalog.js";

/** Canonical JSON-backed editorial registry shared across UI views. */
async function readRegistry(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Cannot load editorial registry: ${path}`);
  return response.json();
}
const [peopleRegistry, sourceRegistry, relationshipRegistry] = await Promise.all([
  readRegistry("./catalog/people.json"),
  readRegistry("./catalog/sources.json"),
  readRegistry("./catalog/relationships.json")
]);
const BOOK_BY_ID = new Map(BOOKS.map(book => [book.id, book]));
const SOURCE_BY_ID = new Map(sourceRegistry.sources.map(source => [source.id, source]));
const bookIdFor = value => BOOK_BY_ID.has(value) ? value : BOOKS.find(book => book.name === value)?.id;

export const SOURCES = sourceRegistry.sources;
export const PEOPLE = peopleRegistry.people.map(person => {
  const books = person.bookIds.map(bookId => BOOK_BY_ID.get(bookId));
  if (books.some(book => !book)) throw new Error(`Unknown book in person registry: ${person.id}`);
  return { ...person, books: books.map(book => book.name) };
});
export const AUTHORS = PEOPLE.filter(person => person.showInAuthors !== false);
export const AUTHOR_BY_ID = new Map(PEOPLE.map(person => [person.id, person]));
export const authorsForBook = value => {
  const bookId = bookIdFor(value);
  return AUTHORS.filter(person => person.bookIds.includes(bookId));
};
export const TEXTUAL_RELATIONSHIPS = relationshipRegistry.relationships.map(item => {
  const book = BOOK_BY_ID.get(item.bookId);
  const source = SOURCE_BY_ID.get(item.sourceId);
  if (!book) throw new Error(`Unknown book in relationship registry: ${item.bookId}`);
  if (!source) throw new Error(`Unknown source in relationship registry: ${item.sourceId}`);
  return { ...item, book: book.name, source: source.title, reference: source.url };
});
export const relationshipsForBook = value => {
  const bookId = bookIdFor(value);
  return TEXTUAL_RELATIONSHIPS.filter(item => item.bookId === bookId);
};
export const relationshipsForPerson = id => TEXTUAL_RELATIONSHIPS.filter(item => item.personId === id);
export const COMPILATION_PEOPLE = [...new Set(TEXTUAL_RELATIONSHIPS.map(item => item.personId))].map(id => {
  const person = AUTHOR_BY_ID.get(id);
  const links = relationshipsForPerson(id);
  const first = links[0];
  return {id, name:person?.name || id, bookIds:links.map(link => link.bookId), books:links.map(link => link.book), role:first.role, evidence:first.evidence, source:first.source, note:first.note, reference:first.reference};
});
