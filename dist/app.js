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
  ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
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
function currentChapter(book = currentBook()) { return Math.min((getCompletedChapters(book).length || 0) + 1, book.chapters); }
function percent(value, total) { return total ? Math.round((value / total) * 100) : 0; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }

function getBookVideo(book) {
  return ["3-juan", "2-juan", "1-juan"].includes(book.id) ? JUAN_VIDEO : null;
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
  return `<main class="screen"><div class="route-header"><p class="eyebrow">La ruta completa</p><h1>Libro por libro.</h1><p>Una secuencia editorial de 66 libros. El siguiente paso siempre está cerca.</p></div><div class="route-summary"><div class="stat-pill"><strong>${done}</strong> / 66 libros</div><div class="stat-pill"><strong>${totalCompletedChapters()}</strong> / ${TOTAL_CHAPTERS} capítulos</div></div><div class="route-list" style="margin-top:18px">${BOOKS.map(routeRow).join("")}</div></main>`;
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
  const overall = percent(chapters, TOTAL_CHAPTERS);
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Tu progreso</p><h1>Lo que ya has leído.</h1><p>Tu avance no desaparece cuando haces una pausa.</p></div><div class="card progress-hero" style="margin-top:20px"><div class="progress-ring" style="--progress:${overall}%" role="img" aria-label="${overall}% de la ruta completada"><span>${overall}%</span></div><div class="metric-list"><div class="metric"><span>Libros terminados</span><strong>${books} / 66</strong></div><div class="metric"><span>Capítulos leídos</span><strong>${chapters} / ${TOTAL_CHAPTERS}</strong></div><div class="metric"><span>Meta actual</span><strong>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</strong></div></div></div><div class="section-heading"><h2>Próximos hitos</h2></div><div class="more-list"><div class="more-row"><span><strong>Primer libro</strong><span>Completa 3 Juan</span></span><strong>${books >= 1 ? icon("check", 17) : "1 libro"}</strong></div><div class="more-row"><span><strong>Primer tramo</strong><span>Completa 7 libros</span></span><strong>${books >= 7 ? icon("check", 17) : `${Math.min(books, 7)}/7`}</strong></div><div class="more-row"><span><strong>Mitad de la ruta</strong><span>Llega a 33 libros</span></span><strong>${books >= 33 ? icon("check", 17) : `${Math.min(books, 33)}/33`}</strong></div></div></main>`;
}

function renderMore() {
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Más</p><h1>Tu experiencia.</h1><p>Preferencias sencillas para mantener la ruta a tu ritmo.</p></div><div class="more-list" style="margin-top:24px"><div class="more-row"><span><strong>Meta de lectura</strong><span>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</span></span><button class="button button-secondary" data-action="change-goal">Cambiar</button></div><div class="more-row"><span><strong>Progreso local</strong><span>Guardado en este dispositivo</span></span><span aria-label="Activado">${icon("check", 17)}</span></div><div class="more-row"><span><strong>Contenido</strong><span>Texto y videos con fuente por definir</span></span><span aria-hidden="true">${icon("chevronRight", 18)}</span></div></div><div class="context-card" style="margin-top:24px"><h3>Una nota sobre este prototipo</h3><p style="margin-bottom:0">La lectura que ves aquí es una maqueta de interacción. El contenido bíblico y los videos reales se integrarán después de resolver las licencias.</p></div></main>`;
}

function renderReader() {
  const book = getBook(state.readerBookId);
  const chapter = currentChapter(book);
  const completed = getCompletedChapters(book).includes(chapter);
  const bookProgress = getCompletedChapters(book).length;
  const origin = state.readerOrigin === "route" ? "Ruta" : "Hoy";
  const video = getBookVideo(book);
  const contextVideo = video ? renderVideoCard(video) : renderPendingVideoCard();
  return `<main><header class="reader-topbar"><button class="reader-back" data-action="back-context" aria-label="Volver a ${origin}">${icon("arrowLeft", 19)}<span>Volver a ${origin}</span></button><div class="reader-topbar-copy"><strong>${escapeHtml(book.name)}</strong><span>Capítulo ${chapter} de ${book.chapters} · Libro ${book.index + 1} de 66</span></div><button class="icon-button" data-action="show-progress" aria-label="Ver progreso">${icon("chart", 20)}</button></header><nav class="reader-breadcrumbs" aria-label="Ruta de navegación del lector"><button class="breadcrumb-link" data-action="back-context">${icon(origin === "Ruta" ? "route" : "house", 15)}<span>${origin}</span></button><span class="breadcrumb-separator" aria-hidden="true">${icon("chevronRight", 15)}</span><span class="breadcrumb-current" aria-current="page">${escapeHtml(book.name)}</span></nav><div class="reader-progress">${progressBar(bookProgress, book.chapters, "Progreso del libro")}</div><article class="reader-content"><p class="eyebrow">Antes de leer</p><h1>${escapeHtml(book.name)}<br><span style="color:var(--brand)">Capítulo ${chapter}</span></h1><div class="context-card"><h3>Lee con un poco de contexto</h3>${contextVideo}</div><div class="reading-copy"><p class="reading-note">Contenido de demostración: aquí se integrará el texto bíblico autorizado. La interfaz ya está preparada para guardar tu check por capítulo.</p><p>La lectura comienza aquí. El objetivo de esta pantalla es mantener el foco: una página cómoda, controles claros y un solo siguiente paso.</p><p>Cuando termines este capítulo, marca tu avance. Si haces una pausa, tu progreso permanecerá guardado en este dispositivo.</p></div></article><footer class="reader-footer"><button class="button button-primary button-wide" data-action="complete-chapter">${completed ? `Capítulo completado ${icon("check", 17)}` : `Marcar capítulo ${chapter} como leído`}</button></footer></main>`;
}

function renderNav() {
  const items = [["home", "house", "Hoy"], ["route", "route", "Ruta"], ["progress", "chart", "Progreso"], ["more", "menu", "Más"]];
  return `<nav class="bottom-nav" aria-label="Navegación principal">${items.map(([view, iconName, label]) => `<button class="nav-item ${state.view === view ? "is-active" : ""}" data-action="navigate" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon(iconName, 19)}</span><span>${label}</span></button>`).join("")}</nav>`;
}

function openReader(bookId = currentBook().id) {
  state.readerBookId = bookId;
  state.readerOrigin = state.view === "route" ? "route" : "home";
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
  const chapter = currentChapter(book);
  const chapters = new Set(getCompletedChapters(book));
  chapters.add(chapter);
  state.completedChapters[book.id] = [...chapters].sort((a, b) => a - b);
  const finishedBook = isBookComplete(book);
  if (state.onboardingStep === 3 && book.index === 0) {
    state.onboardingComplete = true;
    state.view = "home";
    showToast("Primer libro completado. Tu ruta ya comenzó.");
  } else {
    state.view = "home";
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
      if (action === "open-book") { openReader(element.dataset.bookId); }
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
