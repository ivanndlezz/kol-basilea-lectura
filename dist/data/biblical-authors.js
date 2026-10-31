/** Canonical JSON-backed editorial registry shared across UI views. */
async function readRegistry(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Cannot load editorial registry: ${path}`);
  return response.json();
}
const [peopleRegistry, relationshipRegistry] = await Promise.all([
  readRegistry("./people.json"),
  readRegistry("./textual-relationships.json")
]);
export const PEOPLE = peopleRegistry.people;
export const AUTHORS = PEOPLE.filter(person => person.showInAuthors !== false);
export const AUTHOR_BY_ID = new Map(PEOPLE.map(person => [person.id, person]));
export const authorsForBook = name => AUTHORS.filter(person => person.books.includes(name));
export const TEXTUAL_RELATIONSHIPS = relationshipRegistry.relationships;
export const relationshipsForBook = name => TEXTUAL_RELATIONSHIPS.filter(item => item.book === name);
export const relationshipsForPerson = id => TEXTUAL_RELATIONSHIPS.filter(item => item.personId === id);
export const COMPILATION_PEOPLE = [...new Set(TEXTUAL_RELATIONSHIPS.map(item => item.personId))].map(id => {
  const person = AUTHOR_BY_ID.get(id);
  const links = relationshipsForPerson(id);
  const first = links[0];
  return {id, name:person?.name || id, books:links.map(link => link.book), role:first.role, evidence:first.evidence, source:first.source, note:first.note, reference:first.reference};
});
