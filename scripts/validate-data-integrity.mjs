import { readFile } from "node:fs/promises";

const root = new URL("../dist/data/", import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const uniqueIds = (records, label) => {
  const ids = records.map(record => record.id);
  if (ids.some(id => typeof id !== "string" || !id)) throw new Error(`${label} contains an invalid ID`);
  if (new Set(ids).size !== ids.length) throw new Error(`${label} contains duplicate IDs`);
  return new Set(ids);
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const booksRegistry = await readJson("catalog/books.json");
const peopleRegistry = await readJson("catalog/people.json");
const sourceRegistry = await readJson("catalog/sources.json");
const relationshipRegistry = await readJson("catalog/relationships.json");
const videoRegistry = await readJson("media/videos.json");

const books = booksRegistry.books;
const people = peopleRegistry.people;
const sources = sourceRegistry.sources;
const relationships = relationshipRegistry.relationships;
const bookIds = uniqueIds(books, "Books");
const personIds = uniqueIds(people, "People");
const sourceIds = uniqueIds(sources, "Sources");

assert(books.length === 66, `Expected 66 books, found ${books.length}`);
assert(new Set(books.map(book => book.readingOrder)).size === books.length, "Reading order must be unique");
assert(new Set(books.map(book => book.canonicalOrder)).size === books.length, "Canonical order must be unique");
assert(books.every(book => book.readingOrder >= 1 && book.readingOrder <= books.length), "Reading order is out of range");
assert(books.every(book => book.canonicalOrder >= 1 && book.canonicalOrder <= books.length), "Canonical order is out of range");

for (const person of people) {
  assert(Array.isArray(person.bookIds), `Person ${person.id} must use bookIds`);
  assert(!Object.hasOwn(person, "books"), `Person ${person.id} contains legacy book names`);
  assert(new Set(person.bookIds).size === person.bookIds.length, `Person ${person.id} contains duplicate book IDs`);
  for (const bookId of person.bookIds) assert(bookIds.has(bookId), `Person ${person.id} references missing book ${bookId}`);
}

for (const source of sources) {
  assert(typeof source.title === "string" && source.title, `Source ${source.id} is missing a title`);
  assert(typeof source.url === "string" && source.url, `Source ${source.id} is missing a URL`);
  new URL(source.url);
}

const relationshipKeys = new Set();
for (const relationship of relationships) {
  assert(!Object.hasOwn(relationship, "book"), "Relationships must use bookId");
  assert(!Object.hasOwn(relationship, "source"), "Relationships must use sourceId");
  assert(personIds.has(relationship.personId), `Relationship references missing person ${relationship.personId}`);
  assert(bookIds.has(relationship.bookId), `Relationship references missing book ${relationship.bookId}`);
  assert(sourceIds.has(relationship.sourceId), `Relationship references missing source ${relationship.sourceId}`);
  const key = `${relationship.personId}:${relationship.bookId}:${relationship.sourceId}`;
  assert(!relationshipKeys.has(key), `Duplicate relationship ${key}`);
  relationshipKeys.add(key);
}

for (const [bookId, resourceIds] of Object.entries(videoRegistry.videoByBook)) {
  assert(bookIds.has(bookId), `Video mapping references missing book ${bookId}`);
  assert(Array.isArray(resourceIds) && resourceIds.length > 0, `Video mapping is empty for ${bookId}`);
  for (const resourceId of resourceIds) assert(videoRegistry.videos[resourceId], `Video mapping references missing resource ${resourceId}`);
}

console.log(`PASS: ${books.length} books, ${people.length} people, ${sources.length} sources, ${relationships.length} relationships, and ${Object.keys(videoRegistry.videos).length} video resources are referentially intact`);
