/** Canonical classification and the independent 66-book editorial reading route. */
const catalogResponse = await fetch(new URL("./catalog/books.json", import.meta.url));
if (!catalogResponse.ok) throw new Error("Cannot load canonical Bible catalog");
const catalogRegistry = await catalogResponse.json();
export const BOOKS = catalogRegistry.books.map((book, index) => ({ ...book, index, chapterCount: book.chapters }));

/** Narrative labels for completed-book messages, independent of canonical references. */
const NARRATIVE_BOOK_TITLES = Object.freeze({
  "1 Samuel": "el primer libro de Samuel",
  "2 Samuel": "el segundo libro de Samuel",
  "1 Reyes": "el primer libro de los Reyes",
  "2 Reyes": "el segundo libro de los Reyes",
  "1 Crónicas": "el primer libro de las Crónicas",
  "2 Crónicas": "el segundo libro de las Crónicas",
  "1 Corintios": "la primera carta a los Corintios",
  "2 Corintios": "la segunda carta a los Corintios",
  "1 Tesalonicenses": "la primera carta a los Tesalonicenses",
  "2 Tesalonicenses": "la segunda carta a los Tesalonicenses",
  "1 Timoteo": "la primera carta a Timoteo",
  "2 Timoteo": "la segunda carta a Timoteo",
  "1 Pedro": "la primera carta de Pedro",
  "2 Pedro": "la segunda carta de Pedro",
  "1 Juan": "la primera carta de Juan",
  "2 Juan": "la segunda carta de Juan",
  "3 Juan": "la tercera carta de Juan",
  "Romanos": "la carta a los Romanos",
  "Gálatas": "la carta a los Gálatas",
  "Efesios": "la carta a los Efesios",
  "Filipenses": "la carta a los Filipenses",
  "Colosenses": "la carta a los Colosenses",
  "Tito": "la carta a Tito",
  "Filemón": "la carta a Filemón",
  "Hebreos": "la carta a los Hebreos",
  "Santiago": "la carta de Santiago",
  "Judas": "la carta de Judas",
  "Mateo": "el Evangelio según Mateo",
  "Marcos": "el Evangelio según Marcos",
  "Lucas": "el Evangelio según Lucas",
  "Juan": "el Evangelio según Juan",
  "Hechos": "el libro de los Hechos",
  "Salmos": "el libro de los Salmos",
  "Proverbios": "el libro de los Proverbios",
  "Cantares": "el Cantar de los Cantares",
  "Apocalipsis": "el Apocalipsis"
});
export const narrativeBookTitle = name => NARRATIVE_BOOK_TITLES[name] || name;

export const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "law", label: "La Ley" },
  { id: "history", label: "Históricos" },
  { id: "wisdom", label: "Poéticos y sapienciales" },
  { id: "major-prophets", label: "Profetas mayores" },
  { id: "minor-prophets", label: "Los 12 profetas menores" },
  { id: "gospels", label: "Evangelios" },
  { id: "church-history", label: "Historia de la iglesia" },
  { id: "paul-letters", label: "Cartas de Pablo" },
  { id: "general-letters", label: "Cartas generales" },
  { id: "apocalypse", label: "Literatura apocalíptica" }
];

/** Shared editorial palette for tags, book covers and category accents. */
export const CATEGORY_COLORS = Object.freeze({
  all: "#2C7658", law: "#B8793C", history: "#607C54", wisdom: "#A66C83",
  "major-prophets": "#A75B45", "minor-prophets": "#C48D45", gospels: "#287F72",
  "church-history": "#658A81", "paul-letters": "#846B9B",
  "general-letters": "#8A7056", apocalypse: "#655A80"
});
export const getCategoryColor = (id) => CATEGORY_COLORS[id] || CATEGORY_COLORS.all;

export const BOOK_BY_ID = new Map(BOOKS.map(book => [book.id, book]));
export const TOTAL_CHAPTERS = BOOKS.reduce((sum, book) => sum + book.chapters, 0);
export const getCatalogBook = (id) => BOOK_BY_ID.get(id) || BOOKS[0];
export const getCanonicalBooks = () => [...BOOKS].sort((a, b) => a.canonicalOrder - b.canonicalOrder);
export const getReadingBooks = () => BOOKS;
export const getBooksByCategory = (category) => category === "all" ? BOOKS : BOOKS.filter(book => book.category === category);
if (BOOKS.length !== 66 || TOTAL_CHAPTERS !== 1189 || CANONICAL_INDEX.size !== 66 || BOOKS.some(book => !book.canonicalOrder)) throw new Error("Invalid Bible catalog");

