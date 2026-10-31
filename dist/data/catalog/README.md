# Canonical catalog

This directory holds validated JSON registries for Bible books and editorial relationships.

- `books.json` is the stable 66-book catalog. `readingOrder` is independent from `canonicalOrder`.
- `people.json` stores author, scribe and compiler records with `bookIds`.
- `sources.json` stores source records with stable `id` values.
- `relationships.json` joins people, books and sources with `personId`, `bookId` and `sourceId`.

Run `npm run validate:data` after changing any registry.
