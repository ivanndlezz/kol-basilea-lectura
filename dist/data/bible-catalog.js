/** Canonical classification and the independent 66-book editorial reading route. */
function slugify(value) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
export const BOOKS = [
  ["3 Juan", 1], ["2 Juan", 1], ["1 Juan", 5], ["Filemón", 1], ["Judas", 1], ["Abdías", 1], ["Ageo", 2], ["Tito", 3],
  ["2 Tesalonicenses", 3], ["Nahúm", 3], ["2 Pedro", 3], ["Sofonías", 3], ["Jonás", 4], ["Colosenses", 4], ["1 Tesalonicenses", 5],
  ["Malaquías", 4], ["Filipenses", 4], ["1 Pedro", 5], ["Rut", 4], ["Cantares", 8], ["Santiago", 5], ["Habacuc", 3], ["Joel", 3],
  ["Miqueas", 7], ["Amós", 9], ["Lamentaciones", 5], ["Oseas", 14], ["1 Timoteo", 6], ["2 Timoteo", 4], ["Eclesiastés", 12],
  ["Gálatas", 6], ["Esdras", 10], ["Efesios", 6], ["Nehemías", 13], ["Ester", 10], ["Romanos", 16], ["Hechos", 28],
  ["Proverbios", 31], ["Hebreos", 13], ["Zacarías", 14], ["Daniel", 12], ["Apocalipsis", 22], ["2 Corintios", 13], ["1 Corintios", 16],
  ["Job", 42], ["1 Crónicas", 29], ["Marcos", 16], ["Josué", 24], ["2 Crónicas", 36], ["Mateo", 28], ["Jueces", 21],
  ["Deuteronomio", 34], ["Ezequiel", 48], ["Levítico", 27], ["Juan", 21], ["1 Reyes", 22], ["2 Reyes", 25], ["1 Samuel", 31],
  ["2 Samuel", 24], ["Números", 36], ["Isaías", 66], ["Éxodo", 40], ["Lucas", 24], ["Génesis", 50], ["Jeremías", 52], ["Salmos", 150]
].map(([name, chapters], index) => ({ id: slugify(name), name, chapters, index }));

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

const CATEGORY_BY_BOOK = {
  "Génesis": "law", "Éxodo": "law", "Levítico": "law", "Números": "law", "Deuteronomio": "law",
  "Josué": "history", "Jueces": "history", "Rut": "history", "1 Samuel": "history", "2 Samuel": "history", "1 Reyes": "history", "2 Reyes": "history", "1 Crónicas": "history", "2 Crónicas": "history", "Esdras": "history", "Nehemías": "history", "Ester": "history",
  "Job": "wisdom", "Salmos": "wisdom", "Proverbios": "wisdom", "Eclesiastés": "wisdom", "Cantares": "wisdom",
  "Isaías": "major-prophets", "Jeremías": "major-prophets", "Lamentaciones": "major-prophets", "Ezequiel": "major-prophets", "Daniel": "apocalypse",
  "Oseas": "minor-prophets", "Joel": "minor-prophets", "Amós": "minor-prophets", "Abdías": "minor-prophets", "Jonás": "minor-prophets", "Miqueas": "minor-prophets", "Nahúm": "minor-prophets", "Habacuc": "minor-prophets", "Sofonías": "minor-prophets", "Ageo": "minor-prophets", "Zacarías": "minor-prophets", "Malaquías": "minor-prophets",
  "Mateo": "gospels", "Marcos": "gospels", "Lucas": "gospels", "Juan": "gospels",
  "Hechos": "church-history",
  "Romanos": "paul-letters", "1 Corintios": "paul-letters", "2 Corintios": "paul-letters", "Gálatas": "paul-letters", "Efesios": "paul-letters", "Filipenses": "paul-letters", "Colosenses": "paul-letters", "1 Tesalonicenses": "paul-letters", "2 Tesalonicenses": "paul-letters", "1 Timoteo": "paul-letters", "2 Timoteo": "paul-letters", "Tito": "paul-letters", "Filemón": "paul-letters",
  "Hebreos": "general-letters", "Santiago": "general-letters", "1 Pedro": "general-letters", "2 Pedro": "general-letters", "1 Juan": "general-letters", "2 Juan": "general-letters", "3 Juan": "general-letters", "Judas": "general-letters",
  "Apocalipsis": "apocalypse"
};

const CANONICAL_ORDER = ["Génesis","Éxodo","Levítico","Números","Deuteronomio","Josué","Jueces","Rut","1 Samuel","2 Samuel","1 Reyes","2 Reyes","1 Crónicas","2 Crónicas","Esdras","Nehemías","Ester","Job","Salmos","Proverbios","Eclesiastés","Cantares","Isaías","Jeremías","Lamentaciones","Ezequiel","Daniel","Oseas","Joel","Amós","Abdías","Jonás","Miqueas","Nahúm","Habacuc","Sofonías","Ageo","Zacarías","Malaquías","Mateo","Marcos","Lucas","Juan","Hechos","Romanos","1 Corintios","2 Corintios","Gálatas","Efesios","Filipenses","Colosenses","1 Tesalonicenses","2 Tesalonicenses","1 Timoteo","2 Timoteo","Tito","Filemón","Hebreos","Santiago","1 Pedro","2 Pedro","1 Juan","2 Juan","3 Juan","Judas","Apocalipsis"];
const CANONICAL_INDEX = new Map(CANONICAL_ORDER.map((name, index) => [name, index]));
BOOKS.forEach((book) => {
  book.category = CATEGORY_BY_BOOK[book.name] || "general-letters";
  book.testament = CANONICAL_INDEX.get(book.name) < 39 ? "old" : "new";
  book.canonicalOrder = CANONICAL_INDEX.get(book.name) + 1;
  book.readingOrder = book.index + 1;
  book.chapterCount = book.chapters;
});
export const BOOK_BY_ID = new Map(BOOKS.map(book => [book.id, book]));
export const TOTAL_CHAPTERS = BOOKS.reduce((sum, book) => sum + book.chapters, 0);
export const getCatalogBook = (id) => BOOK_BY_ID.get(id) || BOOKS[0];
export const getCanonicalBooks = () => [...BOOKS].sort((a, b) => a.canonicalOrder - b.canonicalOrder);
export const getReadingBooks = () => BOOKS;
export const getBooksByCategory = (category) => category === "all" ? BOOKS : BOOKS.filter(book => book.category === category);
if (BOOKS.length !== 66 || TOTAL_CHAPTERS !== 1189 || CANONICAL_INDEX.size !== 66 || BOOKS.some(book => !book.canonicalOrder)) throw new Error("Invalid Bible catalog");

