import { readFile } from "node:fs/promises";
import { getBibleTranslations } from "../dist/data/bible-translations.js";

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
const translations = getBibleTranslations();
const videoRegistry = await readJson("media/videos.json");
const videoMap = JSON.parse(await readFile(new URL("./data/bibleproject-video-map.json", import.meta.url), "utf8"));

const books = booksRegistry.books;
const people = peopleRegistry.people;
const sources = sourceRegistry.sources;
const relationships = relationshipRegistry.relationships;
const bookIds = uniqueIds(books, "Books");
const personIds = uniqueIds(people, "People");
const sourceIds = uniqueIds(sources, "Sources");

assert(translations.length === 4, `Expected 4 open Bible translations, found ${translations.length}`);
for (const translation of translations) {
  assert(typeof translation.id === "string" && translation.id, "Translation is missing an ID");
  assert(typeof translation.dataDir === "string" && translation.dataDir, `Translation ${translation.id} is missing dataDir`);
  assert(typeof translation.license === "string" && translation.license, `Translation ${translation.id} is missing license`);
  assert(typeof translation.sourceUrl === "string" && translation.sourceUrl, `Translation ${translation.id} is missing source URL`);
  new URL(translation.sourceUrl);
}

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

const mapKeys = new Set();
const mapResourceIds = new Set();
const mappedBookIds = new Set();
for (const entry of videoMap.videos) {
  assert(typeof entry.key === "string" && entry.key, "Video map contains an invalid key");
  assert(!mapKeys.has(entry.key), `Video map contains duplicate key ${entry.key}`);
  mapKeys.add(entry.key);
  assert(typeof entry.id === "string" && entry.id, `Video map entry ${entry.key} is missing an ID`);
  assert(!mapResourceIds.has(entry.id), `Video map contains duplicate resource ID ${entry.id}`);
  mapResourceIds.add(entry.id);
  assert(Array.isArray(entry.bookIds) && entry.bookIds.length > 0, `Video map entry ${entry.key} is missing bookIds`);
  for (const bookId of entry.bookIds) {
    assert(bookIds.has(bookId), `Video map entry ${entry.key} references missing book ${bookId}`);
    mappedBookIds.add(bookId);
  }
  if (entry.chapterStart != null || entry.chapterEnd != null) {
    assert(Number.isInteger(entry.chapterStart) && Number.isInteger(entry.chapterEnd) && entry.chapterStart >= 1 && entry.chapterEnd >= entry.chapterStart, `Video map entry ${entry.key} has an invalid chapter range`);
  }
}
assert(mappedBookIds.size === books.length, `Video map covers ${mappedBookIds.size} books instead of ${books.length}`);

for (const [bookId, resourceIds] of Object.entries(videoRegistry.videoByBook)) {
  assert(bookIds.has(bookId), `Video mapping references missing book ${bookId}`);
  assert(Array.isArray(resourceIds) && resourceIds.length > 0, `Video mapping is empty for ${bookId}`);
  for (const resourceId of resourceIds) assert(videoRegistry.videos[resourceId], `Video mapping references missing resource ${resourceId}`);
}

for (const [resourceId, video] of Object.entries(videoRegistry.videos)) {
  assert(video.provider === "bibleproject", `Video ${resourceId} has an unexpected provider`);
  assert(video.language === "es", `Video ${resourceId} has an unexpected language`);
  assert(video.mediaProvider === "mux", `Video ${resourceId} is not using the canonical Mux provider`);
  assert(!video.youtubeId && !video.youtubeUrl, `Video ${resourceId} still contains legacy YouTube fields`);
  const mediaId = video.youtubeId || video.playbackId;
  assert(typeof mediaId === "string" && mediaId, `Video ${resourceId} is missing a media ID`);
  if (video.youtubeId) assert(/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId), `Video ${resourceId} has an invalid YouTube ID`);
  assert(typeof video.pageUrl === "string" && video.pageUrl, `Video ${resourceId} is missing pageUrl`);
  new URL(video.pageUrl);
  assert(typeof video.embedUrl === "string" && video.embedUrl.includes(mediaId), `Video ${resourceId} is missing embedUrl`);
  new URL(video.embedUrl);
  const thumbnailUrl = video.thumbnailUrl || video.thumbnail;
  assert(typeof thumbnailUrl === "string" && thumbnailUrl, `Video ${resourceId} is missing thumbnail`);
  new URL(thumbnailUrl);
  if (video.bookIds) for (const bookId of video.bookIds) assert(bookIds.has(bookId), `Video ${resourceId} references missing book ${bookId}`);
}

console.log(`PASS: ${books.length} books, ${people.length} people, ${sources.length} sources, ${relationships.length} relationships, and ${Object.keys(videoRegistry.videos).length} video resources are referentially intact`);
