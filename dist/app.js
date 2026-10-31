import { getBibleChapter, getBibleTranslation } from "./data/bible-rvr1909.js";

const BOOKS = [
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

const CATEGORIES = [
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
  { id: "apocalypse", label: "Apocalipsis" }
];

const CATEGORY_BY_BOOK = {
  "Génesis": "law", "Éxodo": "law", "Levítico": "law", "Números": "law", "Deuteronomio": "law",
  "Josué": "history", "Jueces": "history", "Rut": "history", "1 Samuel": "history", "2 Samuel": "history", "1 Reyes": "history", "2 Reyes": "history", "1 Crónicas": "history", "2 Crónicas": "history", "Esdras": "history", "Nehemías": "history", "Ester": "history",
  "Job": "wisdom", "Salmos": "wisdom", "Proverbios": "wisdom", "Eclesiastés": "wisdom", "Cantares": "wisdom",
  "Isaías": "major-prophets", "Jeremías": "major-prophets", "Lamentaciones": "major-prophets", "Ezequiel": "major-prophets", "Daniel": "major-prophets",
  "Oseas": "minor-prophets", "Joel": "minor-prophets", "Amós": "minor-prophets", "Abdías": "minor-prophets", "Jonás": "minor-prophets", "Miqueas": "minor-prophets", "Nahúm": "minor-prophets", "Habacuc": "minor-prophets", "Sofonías": "minor-prophets", "Ageo": "minor-prophets", "Zacarías": "minor-prophets", "Malaquías": "minor-prophets",
  "Mateo": "gospels", "Marcos": "gospels", "Lucas": "gospels", "Juan": "gospels",
  "Hechos": "church-history",
  "Romanos": "paul-letters", "1 Corintios": "paul-letters", "2 Corintios": "paul-letters", "Gálatas": "paul-letters", "Efesios": "paul-letters", "Filipenses": "paul-letters", "Colosenses": "paul-letters", "1 Tesalonicenses": "paul-letters", "2 Tesalonicenses": "paul-letters", "1 Timoteo": "paul-letters", "2 Timoteo": "paul-letters", "Tito": "paul-letters", "Filemón": "paul-letters",
  "Hebreos": "general-letters", "Santiago": "general-letters", "1 Pedro": "general-letters", "2 Pedro": "general-letters", "1 Juan": "general-letters", "2 Juan": "general-letters", "3 Juan": "general-letters", "Judas": "general-letters",
  "Apocalipsis": "apocalypse"
};

BOOKS.forEach((book) => { book.category = CATEGORY_BY_BOOK[book.name] || "general-letters"; });

const TOTAL_CHAPTERS = BOOKS.reduce((sum, book) => sum + book.chapters, 0);
const STORAGE_KEY = "kol-basilea-lectura-v1";
const JUAN_VIDEO = {
  id: "wQtMnuBzb4c",
  title: "Resumen de 1–3 Juan",
  description: "Un panorama animado sobre las tres cartas y sus temas de vida, verdad y amor.",
  duration: "10:58",
  thumbnail: "https://ik.imagekit.io/bpweb1/web/media/video-images/new-testament-overview/123-john/tr:q-65,w-800/123-john_16.9.jpg",
  pageUrl: "https://bibleproject.com/es/guides/libro-de-1-3-juan/",
  youtubeUrl: "https://www.youtube.com/watch?v=wQtMnuBzb4c"
};

const ICONS = {
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063L2 12l6.5-2.063A2 2 0 0 0 9.937 8.5L12 2l2.063 6.5A2 2 0 0 0 15.5 9.937L22 12l-6.5 2.063a2 2 0 0 0-1.437 1.437L12 22z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
  house: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-1a3.5 3.5 0 0 1 0-7H18"/><circle cx="18" cy="5" r="3"/>',
  chart: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.953C12.449 1.995 12 2.448 12 3v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8.11 2.79"/><path d="M12 12v8a1 1 0 0 0 1 1h8a10.02 10.02 0 0 0-9-9z"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/>',
  ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronUp: '<path d="m18 15-6-6-6 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};

function icon(name, size = 18) {
  return `<svg class="lucide-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;
}

const defaultState = () => ({
  onboardingComplete: false,
  onboardingStep: 1,
  goal: "365",
  view: "home",
  readerBookId: "3-juan",
  readerOrigin: "home",
  readerChapter: null,
  routeCategory: "all",
  readerContextOpen: true,
  readerDisplayOpen: false,
  chapterSheetOpen: false,
  readerFont: "serif",
  readerTheme: "light",
  readerTranslation: "rvr1909",
  readerBookInfoOpen: false,
  completedChapters: {},
  toast: ""
});

let state = loadState();
let toastTimer;

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState(), ...saved, toast: "" };
  } catch {
    return defaultState();
  }
}

function saveState() {
  const { toast, ...persisted } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function getBook(id) { return BOOKS.find((book) => book.id === id) || BOOKS[0]; }
function getCompletedChapters(book) { return state.completedChapters[book.id] || []; }
function isBookComplete(book) { return getCompletedChapters(book).length >= book.chapters; }
function totalCompletedChapters() { return Object.values(state.completedChapters).reduce((sum, chapters) => sum + chapters.length, 0); }
function totalCompletedBooks() { return BOOKS.filter(isBookComplete).length; }
function currentBook() { return BOOKS.find((book) => !isBookComplete(book)) || BOOKS[BOOKS.length - 1]; }
function currentChapter(book = currentBook()) {
  const completed = new Set(getCompletedChapters(book));
  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    if (!completed.has(chapter)) return chapter;
  }
  return book.chapters;
}
function readerChapter(book) {
  const selected = state.readerBookId === book.id && Number.isInteger(state.readerChapter)
    ? state.readerChapter
    : currentChapter(book);
  return Math.max(1, Math.min(selected, book.chapters));
}
function percent(value, total) { return total ? Math.round((value / total) * 100) : 0; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }

function getBookVideo(book) {
  return ["3-juan", "2-juan", "1-juan"].includes(book.id) ? JUAN_VIDEO : null;
}

const BOOK_INFO = {
  "1-juan": {
    lead: "Una carta pastoral sobre la vida, la verdad y el amor.",
    body: "1 Juan anima a comunidades de creyentes a permanecer en la verdad y a reconocer el amor fraternal como una expresión concreta de la comunión con Dios.",
    context: "Tradicionalmente se ha vinculado con Juan y con comunidades de Asia Menor hacia el final del siglo I. Presentamos este dato como contexto histórico editorial, no como una certeza absoluta.",
    themes: ["Luz y tinieblas", "Verdad y error", "Vida y amor"],
    sourceLabel: "Referencia de introducción consultada en Bible App",
    sourceUrl: "https://www.bible.com/es/bible/149/1JN.INTRO1.RVR1960"
  }
};

function getBookInfo(book) {
  const category = CATEGORIES.find((item) => item.id === book.category)?.label || "Ruta editorial";
  return BOOK_INFO[book.id] || {
    lead: `Una introducción breve para ${book.name}.`,
    body: "La información histórica, literaria y temática de este libro se integrará próximamente.",
    context: "Por ahora puedes recorrer sus capítulos y construir tu avance sin salir del lector.",
    themes: [category, `${book.chapters} ${book.chapters === 1 ? "capítulo" : "capítulos"}`],
    sourceLabel: "Ficha editorial en preparación",
    sourceUrl: null
  };
}

function renderVideoCard(video) {
  return `<div class="video-card" data-video-card data-video-id="${video.id}" data-video-title="${escapeHtml(video.title)}"><div class="video-placeholder video-poster" data-video-shell><img class="video-thumbnail" src="${video.thumbnail}" alt="" aria-hidden="true" loading="lazy" decoding="async"><div class="video-poster-content"><button class="video-play-button" type="button" data-action="play-video" aria-label="Reproducir ${escapeHtml(video.title)}">${icon("play", 38)}</button><span class="video-duration">${video.duration}</span></div></div><div class="video-meta"><span class="video-kicker">Contexto compartido</span><h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.description)}</p><div class="video-meta-footer"><span>Proyecto Biblia es el autor y propietario de este video.</span><a href="${video.pageUrl}" target="_blank" rel="noreferrer">Ver fuente</a></div></div></div>`;
}

function renderPendingVideoCard() {
  return `<div class="video-card video-card-pending"><div class="video-placeholder"><div class="video-poster-content"><span class="video-overline">Contexto editorial</span>${icon("sparkles", 22)}<small>Video de este libro · próximamente</small></div></div></div>`;
}

function progressBar(value, total, label = "Progreso") {
  const amount = percent(value, total);
  return `<div class="progress-label"><span>${label}</span><strong>${value} de ${total}</strong></div><div class="progress-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${value}"><div class="progress-fill" style="width:${amount}%"></div></div>`;
}

function render() {
  const root = document.querySelector("#app");
  document.body.dataset.readerTheme = state.view === "reader" ? state.readerTheme : "light";
  root.innerHTML = state.onboardingComplete || state.view === "reader" ? renderApp() : renderOnboarding();
  bindEvents();
}

function renderOnboarding() {
  const step = state.onboardingStep;
  const progress = Math.min(step / 3 * 100, 100);
  let body = "";

  if (step === 1) {
    body = `<div class="leaf-illustration" aria-hidden="true"></div><div class="hero-copy"><p class="eyebrow">Tu ruta comienza aquí</p><h1>Lee la Biblia<br>libro por libro.</h1><p>Una experiencia progresiva, con contexto antes de leer y un avance que celebra lo que ya terminaste.</p></div>`;
  }

  if (step === 2) {
    body = `<div class="hero-copy"><p class="eyebrow">Elige tu ritmo</p><h1>¿Cómo quieres recorrer la ruta?</h1><p>Puedes cambiar esta preferencia en cualquier momento. Tu progreso no se pierde.</p></div><div class="goal-grid">${goalOption("365", "365 días", "Un ritmo constante y flexible")}${goalOption("180", "180 días", "Una ruta más intensa")}${goalOption("none", "Sin fecha", "Avanza sin calendario")}</div>`;
  }

  if (step === 3) {
    const book = BOOKS[0];
    body = `<div class="hero-copy"><p class="eyebrow">Tu primer libro</p><h1>Comenzamos con<br>${book.name}.</h1><p>Antes de leer, puedes conocer el contexto. Después, marca tu capítulo y mira cómo empieza a crecer tu ruta.</p></div><div class="context-card"><h3>Empieza con el contexto</h3>${renderVideoCard(JUAN_VIDEO)}</div>`;
  }

  return `<main class="onboarding-shell"><div class="onboarding-top"><div class="brand"><span class="brand-mark" aria-hidden="true">${icon("sparkles", 16)}</span>Kol Basilea</div><span class="progress-meta">Paso ${step} de 3</span></div><div class="progress-track" role="progressbar" aria-label="Progreso del inicio" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${step}"><div class="progress-fill" style="width:${progress}%"></div></div><section class="onboarding-body">${body}</section><div class="onboarding-actions">${step === 1 ? `<button class="button button-primary button-wide" data-action="onboarding-next">Comenzar con 3 Juan</button><button class="button button-quiet button-wide" data-action="skip-onboarding">Explorar la ruta primero</button>` : step === 2 ? `<button class="button button-primary button-wide" data-action="onboarding-next">Continuar</button>` : `<button class="button button-primary button-wide" data-action="open-reader">Abrir 3 Juan</button>`}</div></main>`;
}

function goalOption(value, title, subtitle) {
  const selected = state.goal === value;
  return `<button type="button" class="goal-option ${selected ? "is-selected" : ""}" data-action="choose-goal" data-goal="${value}" aria-pressed="${selected}"><span><strong>${title}</strong><span>${subtitle}</span></span>${selected ? `<span class="checkmark" aria-hidden="true">${icon("check", 20)}</span>` : ""}</button>`;
}

function renderApp() {
  const content = state.view === "reader" ? renderReader() : renderView();
  return `<div class="app-shell ${state.view === "reader" ? "is-reading" : ""}">${state.view === "reader" ? content : `${renderTopbar()}${state.view === "home" ? "" : renderBreadcrumb(state.view)}${content}${renderNav()}`}${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ""}</div>`;
}

function renderTopbar() {
  return `<header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true">${icon("sparkles", 16)}</span>Kol Basilea</div><button class="profile-button" data-action="open-more" aria-label="Abrir más opciones">${icon("ellipsis", 20)}</button></header>`;
}

function renderBreadcrumb(view) {
  const labels = { route: "Ruta", progress: "Progreso", more: "Más" };
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><button class="breadcrumb-link" data-action="navigate" data-view="home">${icon("house", 15)}<span>Hoy</span></button><span class="breadcrumb-separator" aria-hidden="true">${icon("chevronRight", 15)}</span><span class="breadcrumb-current" aria-current="page">${labels[view] || "Hoy"}</span></nav>`;
}

function renderView() {
  if (state.view === "route") return renderRoute();
  if (state.view === "progress") return renderProgress();
  if (state.view === "more") return renderMore();
  return renderHome();
}

function renderHome() {
  const book = currentBook();
  const chapter = currentChapter(book);
  const completed = getCompletedChapters(book).length;
  const total = totalCompletedChapters();
  const doneBooks = totalCompletedBooks();
  const goalLabel = state.goal === "none" ? "Sin fecha" : `${state.goal} días`;
  const recentBooks = BOOKS.slice(Math.max(0, book.index - 2), Math.min(BOOKS.length, book.index + 5));

  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">${doneBooks ? "Continúa tu ruta" : "Tu ruta comienza aquí"}</p><h1>${doneBooks ? `Ya terminaste ${doneBooks} ${doneBooks === 1 ? "libro" : "libros"}.` : "Un paso a la vez."}</h1><p>${doneBooks ? "Retoma desde el último capítulo pendiente y sigue construyendo tu biblioteca." : "Empieza con un libro breve. El progreso se mide por lo que terminas, no por lo que te falta."}</p></div><div class="card current-card"><span class="book-tag">Libro ${book.index + 1} de 66 · ${goalLabel}</span><h2>${escapeHtml(book.name)}</h2><p class="book-meta">Capítulo ${chapter} de ${book.chapters}</p>${progressBar(completed, book.chapters, "Progreso del libro")}<div class="button-row" style="margin-top:20px"><button class="button button-primary" data-action="open-reader">${completed ? "Continuar lectura" : "Comenzar lectura"}</button><button class="button button-secondary" data-action="show-route">Ver ruta</button></div></div><div class="section-heading"><h2>Lo que ya construyes</h2><a href="#" data-action="show-progress">Ver todo</a></div><div class="soft-card milestone-card"><div class="milestone-icon" aria-hidden="true">${icon("sparkles", 20)}</div><div><h3>${doneBooks} de 66 libros</h3><p>${total} de ${TOTAL_CHAPTERS} capítulos completados. Cada check permanece contigo.</p></div></div><div class="section-heading"><h2>Tu biblioteca</h2><a href="#" data-action="show-route">Ruta completa</a></div><div class="book-strip" aria-label="Libros cercanos en la ruta">${recentBooks.map(bookChip).join("")}</div></main>`;
}

function bookChip(book) {
  const completed = getCompletedChapters(book).length;
  const done = isBookComplete(book);
  const isCurrent = book.id === currentBook().id;
  return `<button class="book-chip ${done ? "is-done" : ""} ${isCurrent ? "is-current" : ""}" data-action="open-book" data-book-id="${book.id}"><small>${done ? "Completado" : isCurrent ? "Ahora" : `Libro ${book.index + 1}`}</small><strong>${escapeHtml(book.name)}</strong><span>${completed}/${book.chapters} capítulos</span></button>`;
}

function renderRoute() {
  const done = totalCompletedBooks();
  const selectedCategory = CATEGORIES.find((category) => category.id === state.routeCategory) || CATEGORIES[0];
  const visibleBooks = state.routeCategory === "all" ? BOOKS : BOOKS.filter((book) => book.category === state.routeCategory);
  return `<main class="screen"><div class="route-header"><p class="eyebrow">La ruta completa</p><h1>Libro por libro.</h1><p>Una secuencia editorial de 66 libros. Puedes recorrerla completa o explorarla por categorías.</p></div><div class="route-summary"><div class="stat-pill"><strong>${done}</strong> / 66 libros</div><div class="stat-pill"><strong>${totalCompletedChapters()}</strong> / ${TOTAL_CHAPTERS} capítulos</div></div><div class="category-filter" role="tablist" aria-label="Filtrar la ruta por categoría">${CATEGORIES.map((category) => `<button class="category-filter-chip ${category.id === state.routeCategory ? "is-selected" : ""}" data-action="filter-route-category" data-category="${category.id}" role="tab" aria-selected="${category.id === state.routeCategory}">${escapeHtml(category.label)}</button>`).join("")}</div><div class="category-result-label"><span>${escapeHtml(selectedCategory.label)}</span><strong>${visibleBooks.length} ${visibleBooks.length === 1 ? "libro" : "libros"}</strong></div><div class="route-list">${visibleBooks.map(routeRow).join("")}</div></main>`;
}

function routeRow(book) {
  const done = isBookComplete(book);
  const current = book.id === currentBook().id;
  const completed = getCompletedChapters(book).length;
  return `<button class="route-row ${done ? "is-done" : ""} ${current ? "is-current" : ""}" data-action="open-book" data-book-id="${book.id}"><span class="route-number">${done ? icon("check", 17) : book.index + 1}</span><span><strong>${escapeHtml(book.name)}</strong><small>${completed} de ${book.chapters} capítulos</small></span><span class="route-status">${done ? "Listo" : current ? "Siguiente" : ""}</span></button>`;
}

function renderProgress() {
  const chapters = totalCompletedChapters();
  const books = totalCompletedBooks();
  const overall = percent(books, BOOKS.length);
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Tu progreso</p><h1>Lo que ya has leído.</h1><p>Tu avance no desaparece cuando haces una pausa. El porcentaje principal se calcula por libros terminados.</p></div><div class="card progress-hero" style="margin-top:20px"><div class="progress-ring" style="--progress:${overall}%" role="img" aria-label="${overall}% de la ruta completada por libros terminados"><span>${overall}%</span></div><div class="metric-list"><div class="metric"><span>Libros terminados</span><strong>${books} / ${BOOKS.length}</strong></div><div class="metric"><span>Capítulos leídos</span><strong>${chapters} / ${TOTAL_CHAPTERS}</strong></div><div class="metric"><span>Meta actual</span><strong>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</strong></div></div></div><div class="section-heading"><h2>Próximos hitos</h2></div><div class="more-list"><div class="more-row"><span><strong>Primer libro</strong><span>Completa 3 Juan</span></span><strong>${books >= 1 ? icon("check", 17) : "1 libro"}</strong></div><div class="more-row"><span><strong>Primer tramo</strong><span>Completa 7 libros</span></span><strong>${books >= 7 ? icon("check", 17) : `${Math.min(books, 7)}/7`}</strong></div><div class="more-row"><span><strong>Mitad de la ruta</strong><span>Llega a 33 libros</span></span><strong>${books >= 33 ? icon("check", 17) : `${Math.min(books, 33)}/33`}</strong></div></div></main>`;
}

function renderMore() {
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Más</p><h1>Tu experiencia.</h1><p>Preferencias sencillas para mantener la ruta a tu ritmo.</p></div><div class="more-list" style="margin-top:24px"><div class="more-row"><span><strong>Meta de lectura</strong><span>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</span></span><button class="button button-secondary" data-action="change-goal">Cambiar</button></div><div class="more-row"><span><strong>Progreso local</strong><span>Guardado en este dispositivo</span></span><span aria-label="Activado">${icon("check", 17)}</span></div><div class="more-row"><span><strong>Contenido</strong><span>Texto y videos con fuente por definir</span></span><span aria-hidden="true">${icon("chevronRight", 18)}</span></div></div><div class="context-card" style="margin-top:24px"><h3>Una nota sobre este prototipo</h3><p style="margin-bottom:0">La lectura que ves aquí es una maqueta de interacción. El contenido bíblico y los videos reales se integrarán después de resolver las licencias.</p></div></main>`;
}

function renderChapterButton(book, chapter, selectedChapter, variant = "chapter-row") {
  const completed = new Set(getCompletedChapters(book));
  const done = completed.has(chapter);
  const selected = chapter === selectedChapter;
  const status = done ? "Leído" : selected ? "En curso" : "";
  if (variant === "chapter-sheet-button") {
    return `<button class="${variant} ${done ? "is-complete" : ""} ${selected ? "is-current" : ""}" data-action="select-chapter" data-chapter="${chapter}" aria-label="Capítulo ${chapter}${done ? ", leído" : selected ? ", en curso" : ", pendiente"}" ${selected ? 'aria-current="step" data-current-chapter="true"' : ""}><span class="chapter-sheet-number">${done ? icon("check", 16) : chapter}</span></button>`;
  }
  return `<button class="${variant} ${done ? "is-complete" : ""} ${selected ? "is-current" : ""}" data-action="select-chapter" data-chapter="${chapter}" aria-label="Capítulo ${chapter}${done ? ", leído" : ", pendiente"}" ${selected ? 'aria-current="step"' : ""}><span class="chapter-number">${done ? icon("check", 15) : chapter}</span><span class="chapter-label">Capítulo ${chapter}</span><span class="chapter-status">${status}</span></button>`;
}

function renderChapterSheet(book, selectedChapter) {
  const rows = Array.from({ length: book.chapters }, (_, index) => renderChapterButton(book, index + 1, selectedChapter, "chapter-sheet-button")).join("");
  const open = state.chapterSheetOpen;
  return `<div class="chapter-sheet-layer" ${open ? "" : "hidden"}><button class="chapter-sheet-backdrop" data-action="close-chapter-sheet" aria-label="Cerrar capítulos"></button><aside id="chapter-sheet" class="chapter-sheet" role="dialog" aria-modal="true" aria-labelledby="chapter-sheet-title"><header class="chapter-sheet-header"><div><p class="eyebrow">Navegar</p><h2 id="chapter-sheet-title">Capítulos</h2><p>${escapeHtml(book.name)} · ${getCompletedChapters(book).length} de ${book.chapters} leídos</p></div><button class="icon-button" data-action="close-chapter-sheet" aria-label="Cerrar capítulos">${icon("arrowLeft", 19)}</button></header><div class="chapter-sheet-grid">${rows}</div></aside></div>`;
}

function renderBookInfoTrigger(book, variant = "chapter-info-button") {
  return `<button class="${variant} ${state.readerBookInfoOpen ? "is-active" : ""}" data-action="open-book-info" aria-label="Información sobre ${escapeHtml(book.name)}">${icon("info", variant.includes("mini") ? 21 : 25)}<span class="sr-only">Información sobre ${escapeHtml(book.name)}</span></button>`;
}

function renderBookInfoPage(book) {
  const info = getBookInfo(book);
  return `<section class="book-info-page" aria-label="Introducción del libro"><p class="eyebrow book-info-kicker">Introducción del libro</p><p class="book-info-lead">${escapeHtml(info.lead)}</p><p class="book-info-body">${escapeHtml(info.body)}</p><div class="book-info-themes">${info.themes.map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}</div><p class="book-info-context">${escapeHtml(info.context)}</p><div class="book-info-source"><span>${escapeHtml(info.sourceLabel)}</span>${info.sourceUrl ? `<a href="${info.sourceUrl}" target="_blank" rel="noreferrer">Ver referencia</a>` : ""}</div></section>`;
}

function renderCompactChapterNavigator(book, selectedChapter) {
  const completed = new Set(getCompletedChapters(book));
  const start = Math.max(1, Math.min(selectedChapter - 2, book.chapters - 4));
  const nearby = Array.from({ length: Math.min(5, book.chapters) }, (_, index) => start + index);
  return `<section class="chapter-panel chapter-panel-compact" aria-labelledby="chapter-list-title"><div class="chapter-panel-header"><div><p class="eyebrow">Tu avance</p><h2 id="chapter-list-title">Capítulos</h2></div><strong>${completed.size} de ${book.chapters}</strong></div><div class="chapter-nearby-grid">${renderBookInfoTrigger(book, "chapter-info-button chapter-info-button-mini")}${nearby.map((chapter) => renderChapterButton(book, chapter, selectedChapter, "chapter-mini")).join("")}</div><button class="chapter-panel-action" data-action="toggle-chapter-sheet" aria-expanded="${state.chapterSheetOpen}" aria-controls="chapter-sheet"><span>${icon("menu", 16)} Ver todos los capítulos</span>${icon("chevronRight", 16)}</button></section>${renderChapterSheet(book, selectedChapter)}`;
}

function renderChapterList(book, selectedChapter) {
  if (book.chapters > 12) return renderCompactChapterNavigator(book, selectedChapter);
  const completed = new Set(getCompletedChapters(book));
  const rows = Array.from({ length: book.chapters }, (_, index) => renderChapterButton(book, index + 1, selectedChapter)).join("");
  return `<section class="chapter-panel" aria-labelledby="chapter-list-title"><div class="chapter-panel-header"><div><p class="eyebrow">Tu avance</p><h2 id="chapter-list-title">Capítulos</h2></div><strong>${completed.size} de ${book.chapters}</strong></div><div class="chapter-grid">${renderBookInfoTrigger(book)}${rows}</div></section>${renderChapterSheet(book, selectedChapter)}`;
}

function renderReaderDisplayMenu() {
  const serif = state.readerFont === "serif";
  const light = state.readerTheme === "light";
  const sepia = state.readerTheme === "sepia";
  const dark = state.readerTheme === "dark";
  return `<div id="reader-display-menu" class="reader-display-menu" role="dialog" aria-label="Formato de lectura" ${state.readerDisplayOpen ? "" : "hidden"}><div class="display-menu-section"><span class="display-menu-label">Tipografía</span><div class="display-choice-grid display-choice-grid-two"><button class="display-choice ${serif ? "is-selected" : ""}" data-action="set-reader-font" data-font="serif" aria-pressed="${serif}">Serif</button><button class="display-choice ${!serif ? "is-selected" : ""}" data-action="set-reader-font" data-font="sans" aria-pressed="${!serif}">Sans</button></div></div><div class="display-menu-section"><span class="display-menu-label">Tema</span><div class="display-choice-grid"><button class="display-choice ${light ? "is-selected" : ""}" data-action="set-reader-theme" data-theme="light" aria-pressed="${light}">Claro</button><button class="display-choice display-choice-sepia ${sepia ? "is-selected" : ""}" data-action="set-reader-theme" data-theme="sepia" aria-pressed="${sepia}">Sepia</button><button class="display-choice display-choice-dark ${dark ? "is-selected" : ""}" data-action="set-reader-theme" data-theme="dark" aria-pressed="${dark}">Oscuro</button></div></div></div>`;
}

function renderReaderContext(book, contextVideo) {
  const open = state.readerContextOpen;
  return `<section class="reader-context ${open ? "is-open" : "is-collapsed"}" aria-labelledby="reader-context-title"><button class="reader-context-toggle" data-action="toggle-reader-context" aria-expanded="${open}" aria-controls="reader-context-content"><span class="reader-context-heading"><span class="reader-context-icon" aria-hidden="true">${icon("play", 16)}</span><span><strong id="reader-context-title">Contexto en video: ${book.id === "3-juan" || book.id === "2-juan" || book.id === "1-juan" ? "Resumen de 1–3 Juan" : "Contexto editorial"}</strong><small>${getBookVideo(book) ? "10:58 min · Proyecto Biblia" : "Video de este libro · próximamente"}</small></span></span>${icon("chevronRight", 18)}</button><div id="reader-context-content" class="reader-context-content" ${open ? "" : "hidden"}>${contextVideo}</div></section>`;
}

function renderReaderSelection(book, chapter) {
  const translation = getBibleTranslation(state.readerTranslation);
  return `<div class="reader-selection-bar"><button class="reader-selection-button" data-action="toggle-chapter-sheet" aria-expanded="${state.chapterSheetOpen}" aria-controls="chapter-sheet"><span>${escapeHtml(book.name.toUpperCase())} ${chapter}</span>${icon("chevronDown", 16)}</button><span class="reader-translation-pill" aria-label="Traducción ${escapeHtml(translation.name)}">${escapeHtml(translation.shortName)}</span></div>`;
}

function renderReadingCopy(book, chapter) {
  const passage = getBibleChapter(book.id, chapter, state.readerTranslation);
  const translation = getBibleTranslation(state.readerTranslation);

  if (!passage) {
    return `<div class="reading-copy reading-copy-pending ${state.readerFont === "sans" ? "reader-font-sans" : "reader-font-serif"}"><p class="reading-note">${icon("sparkles", 17)}<span><strong>Texto en preparación:</strong> Este capítulo estará disponible cuando terminemos de integrar la fuente autorizada.</span></p><p>Mientras tanto, puedes explorar el contexto del libro, navegar sus capítulos y guardar tu avance cuando el texto esté listo.</p></div>`;
  }

  return `<section class="reading-copy scripture-passage ${state.readerFont === "sans" ? "reader-font-sans" : "reader-font-serif"}" aria-labelledby="scripture-title"><div class="scripture-source"><span><strong>${translation.name}</strong><small>${translation.license} · ${translation.publisher}</small></span><a href="${passage.sourceUrl}" target="_blank" rel="noreferrer">Ver fuente</a></div><h2 id="scripture-title" class="sr-only">${escapeHtml(book.name)} ${chapter}</h2><div class="verse-list">${passage.verses.map((verse) => `<p class="scripture-verse"><sup>${verse.number}</sup><span>${escapeHtml(verse.text)}</span></p>`).join("")}</div><p class="scripture-attribution">Texto de ${translation.name}. ${translation.license}.</p></section>`;
}

function renderReader() {
  const book = getBook(state.readerBookId);
  const chapter = readerChapter(book);
  const completed = getCompletedChapters(book).includes(chapter);
  const bookProgress = getCompletedChapters(book).length;
  const routeProgress = totalCompletedChapters();
  const origin = state.readerOrigin === "route" ? "Ruta" : "Hoy";
  const video = getBookVideo(book);
  const contextVideo = video ? renderVideoCard(video) : renderPendingVideoCard();
  const readerBody = `${renderReaderContext(book, contextVideo)}${renderChapterList(book, chapter)}${state.readerBookInfoOpen ? renderBookInfoPage(book) : renderReadingCopy(book, chapter)}`;
  const readerFooter = state.readerBookInfoOpen ? "" : `<footer class="reader-footer"><button class="button button-primary button-wide" data-action="complete-chapter">${completed ? `Capítulo completado ${icon("check", 17)}` : `Marcar capítulo ${chapter} como leído`}</button></footer>`;
  return `<main class="reader-page"><header class="reader-topbar"><div class="reader-topbar-left"><button class="reader-back" data-action="back-context" aria-label="Volver a ${origin}">${icon("arrowLeft", 19)}<span>Volver a ${origin}</span></button><span class="reader-topbar-divider" aria-hidden="true"></span><nav class="reader-topbar-breadcrumbs" aria-label="Ruta de navegación del lector"><button class="reader-topbar-link" data-action="back-context">${origin}</button><span aria-hidden="true">${icon("chevronRight", 13)}</span><strong>${escapeHtml(book.name)} ${chapter}</strong><span class="reader-book-index">${book.index + 1}/66</span></nav></div><div class="reader-topbar-actions"><button class="reader-format-button" data-action="toggle-reader-format" aria-expanded="${state.readerDisplayOpen}" aria-controls="reader-display-menu">${icon("sliders", 16)}<span>Formato</span></button><button class="icon-button" data-action="show-progress" aria-label="Ver progreso">${icon("chart", 20)}</button></div><div class="reader-route-progress" role="progressbar" aria-label="Progreso total de la ruta" aria-valuemin="0" aria-valuemax="${TOTAL_CHAPTERS}" aria-valuenow="${routeProgress}"><div style="width:${percent(routeProgress, TOTAL_CHAPTERS)}%"></div></div></header>${renderReaderSelection(book, chapter)}${renderReaderDisplayMenu()}<div class="reader-progress"><div class="reader-progress-copy"><span>Libro ${book.index + 1} de 66</span><strong>${bookProgress} de ${book.chapters} capítulos</strong></div><div class="progress-track" role="progressbar" aria-label="Progreso del libro" aria-valuemin="0" aria-valuemax="${book.chapters}" aria-valuenow="${bookProgress}"><div class="progress-fill" style="width:${percent(bookProgress, book.chapters)}%"></div></div></div><article class="reader-content"><div class="reader-heading"><div class="reader-meta-pill"><span>Libro ${book.index + 1} de 66</span><span aria-hidden="true">•</span><span>Capítulo ${chapter} de ${book.chapters}</span></div><h1>${escapeHtml(book.name)}</h1></div>${readerBody}</article>${readerFooter}</main>`;
}

function renderNav() {
  const items = [["home", "house", "Hoy"], ["route", "route", "Ruta"], ["progress", "chart", "Progreso"], ["more", "menu", "Más"]];
  return `<nav class="bottom-nav" aria-label="Navegación principal">${items.map(([view, iconName, label]) => `<button class="nav-item ${state.view === view ? "is-active" : ""}" data-action="navigate" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon(iconName, 19)}</span><span>${label}</span></button>`).join("")}</nav>`;
}

function openReader(bookId = currentBook().id) {
  state.readerBookId = bookId;
  state.readerOrigin = state.view === "route" ? "route" : "home";
  state.readerChapter = currentChapter(getBook(bookId));
  state.chapterSheetOpen = false;
  state.readerBookInfoOpen = false;
  if (state.onboardingStep === 3 && bookId === "3-juan") state.onboardingComplete = true;
  state.view = "reader";
  saveState();
  render();
}

function activateVideo(button) {
  const card = button.closest("[data-video-card]");
  if (!card || card.classList.contains("is-playing")) return;
  const videoId = card.dataset.videoId;
  const title = card.dataset.videoTitle || "Video de contexto";
  const shell = card.querySelector("[data-video-shell]");
  if (!videoId || !shell) return;

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  iframe.title = title;
  iframe.loading = "eager";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  shell.replaceChildren(iframe);
  card.classList.add("is-playing");
}

function completeChapter() {
  const book = getBook(state.readerBookId);
  const chapter = readerChapter(book);
  const chapters = new Set(getCompletedChapters(book));
  chapters.add(chapter);
  state.completedChapters[book.id] = [...chapters].sort((a, b) => a - b);
  const finishedBook = isBookComplete(book);
  if (state.onboardingStep === 3 && book.index === 0) {
    state.onboardingComplete = true;
    state.view = "home";
    showToast("Primer libro completado. Tu ruta ya comenzó.");
  } else if (!finishedBook) {
    state.readerChapter = currentChapter(book);
    showToast(`Capítulo ${chapter} guardado.`);
  } else {
    state.view = "home";
    state.readerChapter = null;
    showToast(finishedBook ? `${book.name} completado. Siguiente: ${BOOKS[book.index + 1]?.name || "Salmos"}.` : `Capítulo ${chapter} guardado.`);
  }
  saveState();
  render();
}

function showToast(message) {
  clearTimeout(toastTimer);
  state.toast = message;
  toastTimer = setTimeout(() => { state.toast = ""; render(); }, 3500);
}

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      const action = element.dataset.action;
      if (action === "onboarding-next") { state.onboardingStep = Math.min(state.onboardingStep + 1, 3); saveState(); render(); }
      if (action === "choose-goal") { state.goal = element.dataset.goal; saveState(); render(); }
      if (action === "open-reader") { openReader(state.onboardingStep === 3 ? "3-juan" : currentBook().id); }
      if (action === "skip-onboarding") { state.onboardingComplete = true; saveState(); render(); showToast("Puedes comenzar cuando quieras."); }
      if (action === "play-video") { activateVideo(element); }
      if (action === "navigate") { state.view = element.dataset.view; saveState(); render(); }
      if (action === "open-more") { state.view = "more"; saveState(); render(); }
      if (action === "show-route") { state.view = "route"; saveState(); render(); }
      if (action === "show-progress") { state.view = "progress"; saveState(); render(); }
      if (action === "filter-route-category") { state.routeCategory = CATEGORIES.some((category) => category.id === element.dataset.category) ? element.dataset.category : "all"; saveState(); render(); }
      if (action === "open-book") { openReader(element.dataset.bookId); }
      if (action === "select-chapter") { state.readerChapter = Number(element.dataset.chapter); state.chapterSheetOpen = false; state.readerBookInfoOpen = false; saveState(); render(); }
      if (action === "open-book-info") { state.readerBookInfoOpen = true; state.chapterSheetOpen = false; saveState(); render(); }
      if (action === "close-book-info") { state.readerBookInfoOpen = false; saveState(); render(); }
      if (action === "toggle-chapter-sheet") { state.chapterSheetOpen = !state.chapterSheetOpen; saveState(); render(); }
      if (action === "close-chapter-sheet") { state.chapterSheetOpen = false; saveState(); render(); }
      if (action === "toggle-reader-format") { state.readerDisplayOpen = !state.readerDisplayOpen; saveState(); render(); }
      if (action === "toggle-reader-context") { state.readerContextOpen = !state.readerContextOpen; saveState(); render(); }
      if (action === "set-reader-font") { state.readerFont = element.dataset.font === "sans" ? "sans" : "serif"; state.readerDisplayOpen = false; saveState(); render(); }
      if (action === "set-reader-theme") { state.readerTheme = ["light", "sepia", "dark"].includes(element.dataset.theme) ? element.dataset.theme : "light"; state.readerDisplayOpen = false; saveState(); render(); }
      if (action === "back-home" || action === "back-context") { state.view = state.readerOrigin === "route" ? "route" : "home"; saveState(); render(); }
      if (action === "complete-chapter") { completeChapter(); }
      if (action === "change-goal") {
        const nextGoal = state.goal === "365" ? "180" : state.goal === "180" ? "none" : "365";
        state.goal = nextGoal;
        saveState();
        render();
        showToast(`Meta actualizada: ${nextGoal === "none" ? "sin fecha" : `${nextGoal} días`}.`);
        render();
      }
    });
  });
}

render();
