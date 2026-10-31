import { AUTHORS, AUTHOR_BY_ID, authorsForBook, COMPILATION_PEOPLE, relationshipsForBook } from "./data/biblical-authors.js";
import { getBibleChapter, getBibleTranslation } from "./data/bible-rvr1909.js";
import { getLoadedBibleChapter, getBookLoadState, loadBibleBook } from "./data/bible-loader.js";
import { getPericopes, loadPericopes } from "./data/pericopes.js";
const pericopeLoadRequested = new Set();
import { BOOKS, CATEGORIES, TOTAL_CHAPTERS, getCatalogBook, getCategoryColor, narrativeBookTitle } from "./data/bible-catalog.js";
import { JUAN_VIDEO, BOOK_INFO, getBookEditorial } from "./data/editorial-content.js";
import { completedChapters, isBookFinished, completedChapterCount, completedBookCount, nextReadingBook, nextReadingChapter, markChapterComplete } from "./data/reading-progress.js";

const STORAGE_KEY = "kol-basilea-lectura-v1";
const ICONS = {
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.985 12.486A9 9 0 0 1 11.514 3.015 9 9 0 1 0 20.985 12.486z"/>',
  bookOpen: '<path d="M12 7v14"/><path d="M3 18V4.5A1.5 1.5 0 0 1 4.5 3H8a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3.5A1.5 1.5 0 0 1 21 4.5V18h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3H3z"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063L2 12l6.5-2.063A2 2 0 0 0 9.937 8.5L12 2l2.063 6.5A2 2 0 0 0 15.5 9.937L22 12l-6.5 2.063a2 2 0 0 0-1.437 1.437L12 22z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
  house: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  route: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
  scrollText: '<path d="M8 21h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8"/><path d="M6 17V5a2 2 0 0 0-4 0v12a4 4 0 0 0 4 4h2"/><path d="M10 8h8M10 12h8M10 16h5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 16v-5"/><path d="M13 16V7"/><path d="M18 16V4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  externalLink: '<path d="M15 3h6v6M10 14 21 3"/><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
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
  appAppearance: "system",
  navigationOpen: false,
  appearancePopoverOpen: false,
  view: "home",
  readerBookId: "3-juan",
  readerOrigin: "home",
  interludeBookId: null,
  readerChapter: null,
  routeCategory: "all",
  libraryCategory: "all",
  authorsFilter: "all",
  selectedAuthorId: null,
  selectedCompilerId: null,
  readerContextOpen: true,
  readerDisplayOpen: false,
  readerMoreOpen: false,
  chapterSheetOpen: false,
  readerFont: "serif",
  readerTheme: "light",
  readerTranslation: "rvr1909",
  readerBookInfoOpen: false,
  readerReadingProgress: 0,
  completedChapters: {},
  celebratedMilestones: [],
  activeMilestone: null,
  toast: ""
});

let state = loadState();
let toastTimer;
let readerProgressBound = false;
let readerProgressFrame = null;

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState(), ...saved, toast: "", navigationOpen: false, appearancePopoverOpen: false, readerMoreOpen: false };
  } catch {
    return defaultState();
  }
}

function saveState() {
  const { toast, navigationOpen, appearancePopoverOpen, readerMoreOpen, activeMilestone, ...persisted } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function updateReaderReadingProgress() {
  const meter = document.querySelector("[data-reading-meter]");
  const passage = document.querySelector("[data-reading-content]");
  if (!meter || !passage) return;

  const passageTop = passage.getBoundingClientRect().top + window.scrollY;
  const readingPoint = window.scrollY + window.innerHeight * 0.68;
  const atDocumentEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const progress = atDocumentEnd ? 100 : Math.max(0, Math.min(100, Math.round(((readingPoint - passageTop) / Math.max(passage.offsetHeight, 1)) * 100)));
  state.readerReadingProgress = progress;

  const label = meter.querySelector("[data-reading-progress-label]");
  const fill = meter.querySelector("[data-reading-progress-fill]");
  const track = meter.querySelector("[role=progressbar]");
  const completeButton = document.querySelector("[data-complete-chapter]");
  if (label) label.textContent = `${progress}% leído`;
  if (fill) fill.style.width = `${progress}%`;
  if (track) track.setAttribute("aria-valuenow", String(progress));
  if (completeButton && !completeButton.dataset.completed) completeButton.disabled = progress < 100;
}

function scheduleReaderReadingProgress() {
  if (readerProgressFrame) return;
  readerProgressFrame = window.requestAnimationFrame(() => {
    readerProgressFrame = null;
    updateReaderReadingProgress();
  });
}

function bindReaderReadingProgress() {
  if (readerProgressBound) return;
  window.addEventListener("scroll", scheduleReaderReadingProgress, { passive: true });
  window.addEventListener("resize", scheduleReaderReadingProgress);
  readerProgressBound = true;
}

function getBook(id) { return getCatalogBook(id); }
function getCompletedChapters(book) { return completedChapters(state, book); }
function isBookComplete(book) { return isBookFinished(state, book); }
function totalCompletedChapters() { return completedChapterCount(state); }
function totalCompletedBooks() { return completedBookCount(state); }
function currentBook() { return nextReadingBook(state); }
function currentChapter(book = currentBook()) { return nextReadingChapter(state, book); }
function readerChapter(book) {
  const selected = state.readerBookId === book.id && Number.isInteger(state.readerChapter)
    ? state.readerChapter
    : currentChapter(book);
  return Math.max(1, Math.min(selected, book.chapters));
}
function percent(value, total) { return total ? Math.round((value / total) * 100) : 0; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }

function getBookVideo(book) {
  return getBookEditorial(book.id)?.video || null;
}

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
  return `<div class="video-card" data-video-card data-video-id="${video.id}" data-video-title="${escapeHtml(video.title)}"><div class="video-placeholder video-poster is-loading" data-video-shell><img class="video-thumbnail" data-skeleton-image src="${video.thumbnail}" alt="" aria-hidden="true" loading="lazy" decoding="async"><div class="video-poster-content"><button class="video-play-button" type="button" data-action="play-video" aria-label="Reproducir ${escapeHtml(video.title)}">${icon("play", 38)}</button><span class="video-duration">${video.duration}</span></div></div><div class="video-meta"><span class="video-kicker">Contexto compartido</span><h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.description)}</p><div class="video-meta-footer"><span>Proyecto Biblia es el autor y propietario de este video.</span><a href="${video.pageUrl}" target="_blank" rel="noreferrer">Ver fuente</a></div></div></div>`;
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
  document.body.dataset.appAppearance = state.appAppearance || "system";
  root.innerHTML = state.onboardingComplete || state.view === "reader" ? renderApp() : renderOnboarding();
  document.body.classList.toggle("kb-navigation-open", Boolean(state.navigationOpen));
  bindEvents();
  if (state.navigationOpen) document.querySelector(".kb-navigation-close")?.focus({preventScroll:true});
  bindImageSkeletons();
  if (state.view === "reader" && !state.readerBookInfoOpen) {
    const bookId = state.readerBookId;
    if (!pericopeLoadRequested.has(bookId)) {
      pericopeLoadRequested.add(bookId);
      loadPericopes(bookId).then(data => { if (data && state.view === "reader" && state.readerBookId === bookId) render(); });
    }
    if (getBookLoadState(bookId) === "idle") {
      loadBibleBook(bookId).then(() => {
        if (state.view === "reader" && state.readerBookId === bookId) render();
      }).catch(error => console.warn("Bible book load failed", bookId, error));
    }
  }
}

function bindImageSkeletons() {
  document.querySelectorAll("[data-skeleton-image]").forEach((img) => {
    const shell = img.closest("[data-video-shell]");
    if (!shell) return;
    const finish = () => shell.classList.remove("is-loading");
    const fail = () => { shell.classList.remove("is-loading"); shell.classList.add("image-failed"); };
    img.addEventListener("load", finish, { once: true });
    img.addEventListener("error", fail, { once: true });
    if (img.complete) {
      if (img.naturalWidth > 0) finish();
      else fail();
    }
  });
}

function renderOnboarding() {
  const step = state.onboardingStep;
  const progress = Math.min(step / 3 * 100, 100);
  let body = "";

  if (step === 1) {
    body = `<div class="leaf-illustration" aria-hidden="true"></div><div class="hero-copy"><p class="eyebrow">Tu ruta comienza aquí</p><h1>Descubre la Biblia<br>libro por libro.</h1><p>Lee las Escrituras, comprende su contexto y descubre cada libro a tu propio ritmo.</p></div>`;
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

const READING_MILESTONES = [1,3,5,10,20,33,50,66];
function renderMilestoneSheet() {
  const count = state.activeMilestone;
  if (!READING_MILESTONES.includes(count)) return "";
  const progress = count / 66 * 100;
  const messages = {1:["Tu primer libro.","Una historia terminada. Un camino que apenas comienza."],3:["Tres libros en tu estantería.","Tu colección empieza a tomar forma."],5:["Cinco libros leídos.","Cada página es parte de tu recorrido."],10:["Diez libros.","Ya conoces diez historias de las Escrituras."],20:["Veinte libros.","Un recorrido construido a tu propio ritmo."],33:["A mitad del camino.","Has terminado la mitad de los libros de tu ruta."],50:["Cincuenta libros.","Una colección llena de historias y descubrimientos."],66:["Tu biblioteca está completa.","Has terminado los 66 libros de esta ruta."]};
  const [title,description] = messages[count];
  return `<div class="kb-milestone-layer" role="presentation"><button class="kb-milestone-backdrop" data-action="dismiss-milestone" aria-label="Cerrar celebración"></button><section class="kb-milestone-sheet" role="dialog" aria-modal="true" aria-labelledby="kb-milestone-title"><div class="kb-milestone-grip" aria-hidden="true"></div><p class="eyebrow">Hito de lectura</p><h2 id="kb-milestone-title">${title}</h2><p class="kb-milestone-description">${description}</p><div class="kb-milestone-ring" role="img" aria-label="${count} de 66 libros, ${progress.toFixed(1)} por ciento"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="kb-milestone-ring-track" cx="100" cy="100" r="78"/><circle class="kb-milestone-ring-fill" cx="100" cy="100" r="78" style="--milestone-offset:${(490.09*(1-count/66)).toFixed(2)}"/></svg><div class="kb-milestone-ring-center"><strong>${count}</strong><span>de 66 libros</span><small>${progress.toFixed(1)}%</small></div></div><p class="kb-milestone-footnote">Sin prisa ni rachas. Cada libro cuenta.</p><button class="button button-primary button-wide" data-action="dismiss-milestone">Continuar mi camino</button></section></div>`;
}
function renderApp() {
  const content = state.view === "reader" ? renderReader() : state.view === "interlude" ? renderInterlude() : renderView();
  return `<div class="app-shell ${state.view === "reader" ? "is-reading" : ""}">${["reader", "interlude"].includes(state.view) ? content : `${renderTopbar()}${state.view === "home" ? "" : renderBreadcrumb(state.view)}${content}${renderNav()}`}${renderNavigationSheet()}${renderMilestoneSheet()}${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ""}</div>`;
}


function renderInterlude() {
  const book = getBook(state.interludeBookId || state.justCompletedBookId);
  if (!book || !isBookComplete(book)) return renderHome();
  const next = BOOKS[book.index + 1];
  const completed = totalCompletedBooks();
  return `<main class="kb-interlude" style="${categoryStyle(book.category)}"><div class="kb-interlude-inner"><p class="eyebrow">Un libro más en tu estantería</p><div class="kb-interlude-emblem" aria-hidden="true">${icon("sparkles",32)}</div><div class="kb-interlude-cover">${renderBookCover(book,true)}</div><p class="kb-interlude-overline">Libro ${book.index + 1} de 66 · Completado</p><h1>Terminaste ${escapeHtml(narrativeBookTitle(book.name))}.</h1><p class="kb-interlude-copy">Cada libro es un descubrimiento. Hoy has añadido uno más a tu recorrido.</p><div class="kb-interlude-progress"><strong>${completed} de 66 libros</strong><span>${totalCompletedChapters()} de ${TOTAL_CHAPTERS} capítulos leídos</span></div>${next ? `<div class="kb-interlude-next"><span>Tu próximo libro</span><div class="kb-interlude-next-book" style="${categoryStyle(next.category)}"><span class="kb-interlude-next-mark"></span><strong>${escapeHtml(next.name)}</strong><small>${next.chapters} ${next.chapters === 1 ? "capítulo" : "capítulos"}</small></div></div><button class="button button-primary button-wide" data-action="interlude-next">Comenzar ${escapeHtml(next.name)} ${icon("chevronRight",18)}</button>` : `<p class="kb-interlude-copy">¡Has completado los 66 libros de esta ruta!</p>`}<button class="button button-quiet button-wide" data-action="interlude-home">Volver a Hoy</button></div></main>`;
}

function renderTopbar() {
  return `<header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true">${icon("bookOpen", 18)}</span>Kol Basilea</div><button class="profile-button kb-menu-trigger" data-action="toggle-navigation" aria-label="Abrir menú de navegación" aria-haspopup="dialog" aria-controls="kb-navigation-sheet" aria-expanded="${state.navigationOpen}">${icon("menu", 23)}</button></header>`;
}

function renderNavigationSheet() {
  const items = [["home","house","Hoy","Tu siguiente lectura"],["route","route","Ruta de lectura","Sigue la secuencia editorial"],["library","bookOpen","Biblioteca bíblica","Explora libremente los 66 libros"],["authors","users","Autores bíblicos","Personas, tradiciones y atribuciones"],["compilation","scrollText","Recopilación de textos","Los libros y quienes los recopilaron"],["progress","chart","Mi progreso","Capítulos y libros leídos"],["more","sliders","Configuración","Meta y preferencias"]];
  const appearance = [["system","Automático","smartphone"],["light","Claro","sun"],["dark","Oscuro","moon"]];
  const selectedIcon = state.appAppearance === "dark" ? "moon" : state.appAppearance === "light" ? "sun" : "sun";
  return `<div class="kb-navigation-layer ${state.navigationOpen ? "is-open" : ""}" ${state.navigationOpen ? "" : "hidden"}>
    <button class="kb-navigation-backdrop" data-action="close-navigation" aria-label="Cerrar menú"></button>
    <aside class="kb-navigation-sheet" id="kb-navigation-sheet" role="dialog" aria-modal="true" aria-labelledby="kb-navigation-title">
      <div class="kb-navigation-head"><div><p class="eyebrow">Kol Basilea</p><h2 id="kb-navigation-title">Explorar</h2></div><button class="kb-navigation-close" data-action="close-navigation" aria-label="Cerrar menú">${icon("x",22)}</button></div>
      <nav class="kb-navigation-links" aria-label="Secciones del proyecto">${items.map(([view,symbol,label,detail]) => `<button class="kb-navigation-link ${state.view === view ? "is-current" : ""}" data-action="navigation-go" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}><span class="kb-navigation-link-icon">${icon(symbol,20)}</span><span class="kb-navigation-link-copy"><strong>${label}</strong><small>${detail}</small></span>${icon("chevronRight",17)}</button>`).join("")}</nav><a class="kb-navigation-project" href="https://ivanndlezz.github.io/kol-basilea/" target="_blank" rel="noopener noreferrer">${icon("info",19)}<span>Conoce Kol Basilea</span>${icon("externalLink",16)}</a>
      <div class="kb-navigation-footer"><div class="kb-navigation-appearance"><span class="kb-navigation-appearance-label">Apariencia</span><div class="kb-navigation-popover-anchor"><button class="kb-appearance-toggle" data-action="toggle-appearance-popover" aria-expanded="${state.appearancePopoverOpen}" aria-controls="kb-appearance-popover" aria-label="Elegir apariencia: ${appearance.find(([value]) => value === state.appAppearance)?.[1] || "Automático"}">${icon(selectedIcon,19)}<span>${appearance.find(([value]) => value === state.appAppearance)?.[1] || "Automático"}</span>${icon("chevronDown",15)}</button>
      <div id="kb-appearance-popover" class="kb-appearance-popover" role="group" aria-label="Opciones de apariencia" ${state.appearancePopoverOpen ? "" : "hidden"}>${appearance.map(([value,label,symbol]) => `<button class="kb-appearance-choice ${state.appAppearance === value ? "is-selected" : ""}" data-action="set-appearance" data-appearance="${value}" aria-pressed="${state.appAppearance === value}">${icon(symbol,19)}<span>${label}</span>${state.appAppearance === value ? icon("check",17) : ""}</button>`).join("")}</div></div></div><a class="kb-navigation-external" href="https://klef.agency/" target="_blank" rel="noopener noreferrer" style="display:none">Más</a><p class="kb-navigation-note">Tu recorrido por las Escrituras, a tu ritmo.</p></div>
    </aside>
  </div>`;
}

function renderBreadcrumb(view) {
  const labels = { route: "Ruta", library: "Biblioteca", progress: "Progreso", more: "Configuración", authors: "Autores bíblicos", compilation: "Recopilación" };
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><button class="breadcrumb-link" data-action="navigate" data-view="home">${icon("house", 15)}<span>Hoy</span></button><span class="breadcrumb-separator" aria-hidden="true">${icon("chevronRight", 15)}</span><span class="breadcrumb-current" aria-current="page">${labels[view] || "Hoy"}</span></nav>`;
}

function renderView() {
  if (state.view === "route") return renderRoute();
  if (state.view === "library") return renderLibrary();
  if (state.view === "authors") return renderAuthors();
  if (state.view === "compilation") return renderCompilation();
  if (state.view === "progress") return renderProgress();
  if (state.view === "more") return renderMore();
  return renderHome();
}

function categoryStyle(category) { return `--category-color:${getCategoryColor(category)};`; }
function renderBookCover(book, completed = false) {
  const title = escapeHtml(book.name).replace(/ /g, "<br>");
  return `<div class="kb-cover" style="--cover-color:${getCategoryColor(book.category)};${categoryStyle(book.category)}" aria-hidden="true"><div class="kb-cover-face"><span class="kb-cover-star">✦</span><span class="kb-cover-title">${title}</span><span class="kb-cover-number">LIBRO ${book.index + 1}</span></div>${completed ? `<span class="kb-cover-stamp">${icon("check", 18)}</span>` : ""}</div>`;
}
function renderBookShelf(rewardIndex = -1) {
  return `<div class="kb-shelf" role="img" aria-label="Estantería: ${totalCompletedBooks()} de 66 libros terminados">${BOOKS.map((book, index) => `<span class="kb-spine ${isBookComplete(book) ? "is-done" : ""} ${!isBookComplete(book) && currentBook().id === book.id ? "is-next" : ""} ${index === rewardIndex ? "just-added" : ""}" style="height:${24 + (index * 7 % 4) * 3}px;${categoryStyle(book.category)}" aria-hidden="true"></span>`).join("")}</div>`;
}
function renderHomeAuthor(book) {
  const candidates = authorsForBook(book.name).filter(person => person.kind !== "collective" && person.id !== "autores-anonimos");
  const person = candidates[0];
  if (!person) return "";
  return `<button type="button" class="kb-home-author" data-action="open-author" data-author-id="${escapeHtml(person.id)}" aria-label="Ver ficha de ${escapeHtml(person.name)}"><span class="kb-home-author-avatar">${renderAuthorPortrait(person)}</span><span class="kb-home-author-label"><small>Autor atribuido</small><strong>${escapeHtml(person.name)}</strong></span>${icon("chevronRight",14)}</button>`;
}
function renderHome() {
  const book = currentBook();
  const chapter = currentChapter(book);
  const completed = getCompletedChapters(book).length;
  const total = totalCompletedChapters();
  const doneBooks = totalCompletedBooks();
  const nextBook = BOOKS[book.index + 1];
  const rewardBook = state.justCompletedBookId ? getBook(state.justCompletedBookId) : null;
  const rewardIndex = rewardBook && isBookComplete(rewardBook) ? rewardBook.index : -1;
  const discovery = `<section class="kol-discovery" aria-labelledby="kol-discovery-title"><img class="kol-discovery-image" src="https://ivanndlezz.github.io/kol-basilea/assets/historias-del-reino-portada-redisenada.jpg" alt="Ilustración editorial original de Historias del Reino, Kol Basilea" loading="lazy" decoding="async"><div class="kol-discovery-content"><p class="eyebrow">Descubre Kol Basilea</p><h2 id="kol-discovery-title">Cada historia tiene un mundo detrás.</h2><p>Leer es el comienzo. Descubre los personajes, acontecimientos y contextos que dieron forma a las Escrituras.</p><a class="kol-discovery-link" href="https://ivanndlezz.github.io/kol-basilea/historias-del-reino/un-choque-de-mundos-mentes-y-personas/" target="_blank" rel="noopener noreferrer">Leer en Kol Basilea <span aria-hidden="true">↗</span></a></div></section>`;
  const context = doneBooks === 0 ? "Empiezas por un libro breve: un solo capítulo." : rewardBook ? `¡${escapeHtml(rewardBook.name)} ya está en tu estantería!` : completed > 0 ? `Ya llevas ${completed} de ${book.chapters} capítulos de este libro.` : `Has terminado ${doneBooks} ${doneBooks === 1 ? "libro" : "libros"}. Continúa cuando quieras.`;
  return `<main class="screen home-screen kb-today">
    <header class="kb-intro"><p class="eyebrow">Tu camino por las Escrituras</p><h1>Descubre la Biblia, un libro a la vez.</h1><p>Marca cada capítulo y llena tu estantería de 66 libros.</p></header>
    <section class="kb-verbs" aria-label="Cómo funciona"><div class="kb-verb"><span>${icon("bookOpen", 18)}<strong>Lee</strong></span><small>Un capítulo a la vez</small></div><div class="kb-verb"><span>${icon("checkCircle", 18)}<strong>Marca</strong></span><small>Guarda tu avance</small></div><div class="kb-verb"><span>${icon("bookOpen", 18)}<strong>Colecciona</strong></span><small>66 libros, sin rachas</small></div></section>
    <section class="kb-hero" style="${categoryStyle(book.category)}" aria-labelledby="kb-book-title">
      <div class="kb-hero-top"><span>Tu siguiente lectura</span><strong class="kb-counter ${rewardIndex >= 0 ? "kb-counter-reward" : ""}">${doneBooks} / 66 libros</strong></div>
      <div class="kb-hero-book">${renderBookCover(book)}<div><h2 id="kb-book-title">${escapeHtml(book.name)}</h2><p>${book.chapters === 1 ? "Carta · 1 capítulo" : `${book.chapters} capítulos`} · Libro ${book.index + 1} de 66</p><p class="kb-current-chapter">Capítulo ${chapter} de ${book.chapters}</p>${renderHomeAuthor(book)}</div></div>
      <div class="kb-context">${icon("sparkles", 17)}<span>${context}</span></div>
      <button class="button button-primary kb-start" data-action="open-reader">${completed ? "Continuar leyendo" : "Comenzar a leer"} <span aria-hidden="true">→</span></button>
      <div class="kb-shelf-wrap">${renderBookShelf(rewardIndex)}<div class="kb-shelf-caption"><strong>Tu estantería</strong><span>${total} de 1189 capítulos</span></div></div>
    </section>
    <div class="section-heading kb-library-heading"><h2>Tu biblioteca</h2><a href="#" data-action="show-route">Ver los 66 libros</a></div>
    <div class="book-strip" aria-label="Libros cercanos en la ruta">${BOOKS.slice(Math.max(0,book.index-1),Math.min(66,book.index+5)).map(bookChip).join("")}</div>
    ${discovery}
  </main>`;
}

function bookChip(book) {
  const completed = getCompletedChapters(book).length;
  const done = isBookComplete(book);
  const isCurrent = book.id === currentBook().id;
  return `<button class="book-chip ${done ? "is-done" : ""} ${isCurrent ? "is-current" : ""}" style="${categoryStyle(book.category)}" data-action="open-book" data-book-id="${book.id}"><small>${done ? "Completado" : isCurrent ? "Ahora" : `Libro ${book.index + 1}`}</small><strong>${escapeHtml(book.name)}</strong><span>${completed}/${book.chapters} capítulos</span></button>`;
}

function renderRoute() {
  const done = totalCompletedBooks();
  return `<main class="screen"><div class="route-header"><p class="eyebrow">Tu ruta de lectura</p><h1>Libro por libro.</h1><p>Sigue la secuencia editorial de 66 libros, sin fechas ni atrasos.</p></div><div class="route-summary"><div class="stat-pill"><strong>${done}</strong> / 66 libros</div><div class="stat-pill"><strong>${totalCompletedChapters()}</strong> / ${TOTAL_CHAPTERS} capítulos</div></div><div class="route-list">${BOOKS.map(routeRow).join("")}</div></main>`;
}


const COMPILATION_IMAGES = {"baruc":"https://commons.wikimedia.org/wiki/Special:FilePath/123.Baruch%20Writes%20Jeremiah's%20Prophecies.jpg?width=640","paul":"https://commons.wikimedia.org/wiki/Special:FilePath/Valentin%20de%20Boulogne%20-%20Saint%20Paul%20Writing%20His%20Epistles%20-%20BF.1991.4%20-%20Museum%20of%20Fine%20Arts.jpg?width=640","esdras":"https://commons.wikimedia.org/wiki/Special:FilePath/Esdras-Ezra.jpg?width=640","silvano":"https://commons.wikimedia.org/wiki/Special:FilePath/Jan%20Lievens%20-%20St.%20Paul%20writing%20to%20the%20Thessalonians.jpg?width=640"};
function compilationImage(person) {
  const id = person.id;
  if (id === "baruc") return COMPILATION_IMAGES.baruc;
  if (id === "esdras") return COMPILATION_IMAGES.esdras;
  if (["tercio","sostenes","timoteo"].includes(id)) return COMPILATION_IMAGES.paul;
  if (id === "silvano") return COMPILATION_IMAGES.silvano;
  return null;
}
function compilationBookName(person) {
  if (person.id === "escribas-juda") return "Génesis";
  if (person.id === "esdras") return "Esdras y Nehemías";
  if (person.id === "timoteo") return "Cartas paulinas";
  if (person.id === "silvano") return "Tesalonicenses y 1 Pedro";
  if (person.id === "sostenes") return "1 Corintios";
  if (person.id === "lucas") return "Lucas y Hechos";
  return person.books[0] || "Textos bíblicos";
}
function compilationCategory(person) {
  const book = BOOKS.find(item => item.name === person.books[0]);
  return book?.category || "all";
}
function renderCompilation() {
  const selected = COMPILATION_PEOPLE.find(item => item.id === state.selectedCompilerId);
  const ordered = [...COMPILATION_PEOPLE].sort((a,b) => {
    const ai = BOOKS.find(book => book.name === a.books[0])?.index ?? 99;
    const bi = BOOKS.find(book => book.name === b.books[0])?.index ?? 99;
    return ai-bi;
  });
  const art = (person,hero=false) => {
    const src = compilationImage(person);
    if (src) return `<img class="kb-compilation-painting" src="${src}" loading="${hero?"eager":"lazy"}" decoding="async" alt="Obra artística histórica alusiva a ${escapeHtml(person.name)}; no es un retrato documental" />`;
    return `<div class="kb-compilation-manuscript" aria-label="Composición editorial de un manuscrito antiguo"><span class="kb-manuscript-mark">✦</span><span class="kb-manuscript-lines">━━━━━━<br>━━━━<br>━━━━━━<br>━━━━━</span><span class="kb-manuscript-caption">TEXTOS · TRADICIÓN</span></div>`;
  };
  if (selected) {
    const related = selected.books.map(name=>BOOKS.find(book=>book.name===name)).filter(Boolean);
    return `<main class="screen kb-compilation-page"><button class="kb-author-back" data-action="compilation-back">${icon("arrowLeft",18)} Todos los textos</button><header class="kb-compilation-heading"><p class="eyebrow">Recopilación de textos</p><h1>${escapeHtml(compilationBookName(selected))}</h1><span class="kb-compilation-category" style="${categoryStyle(compilationCategory(selected))}">${escapeHtml(selected.role)}</span></header><article class="kb-compilation-card"><div class="kb-compilation-image">${art(selected,true)}</div><div class="kb-compilation-content"><p class="eyebrow">${escapeHtml(selected.role)}</p><h2>${escapeHtml(selected.name)}</h2><div class="kb-compilation-divider"></div><p class="kb-compilation-question">¿Quién es la fuente de los textos?</p><h3>${selected.id==="escribas-juda"?"Tradición oral de Moisés":escapeHtml(selected.source)}</h3></div></article><section class="kb-compiler-related"><h2>Libros relacionados</h2><div class="kb-compiler-books">${related.map(book=>`<button class="kb-author-book" style="${categoryStyle(book.category)}" data-action="open-book" data-book-id="${book.id}"><span class="kb-author-book-color"></span><strong>${escapeHtml(book.name)}</strong>${icon("chevronRight",17)}</button>`).join("")}</div></section><details class="kb-compiler-research"><summary>Investigación y referencias</summary><p>${escapeHtml(selected.note)}</p><a href="${selected.reference}" target="_blank" rel="noopener noreferrer">Consultar referencia ${icon("externalLink",14)}</a></details></main>`;
  }
  return `<main class="screen kb-compilation-page"><header class="route-header"><p class="eyebrow">Personas y Escrituras</p><h1>Recopilación de textos.</h1><p>Los libros, sus fuentes y quienes participaron en su transmisión.</p></header><div class="kb-compilation-count">${ordered.length} historias de transmisión textual</div><div class="kb-compilation-editorial-list">${ordered.map(person=>`<button class="kb-compilation-editorial-card" data-action="open-compiler" data-compiler-id="${person.id}"><span class="kb-compilation-editorial-art">${art(person)}</span><span class="kb-compilation-editorial-copy"><small class="kb-compilation-editorial-kicker" style="${categoryStyle(compilationCategory(person))}">${escapeHtml(person.role)}</small><strong class="kb-compilation-editorial-title">${escapeHtml(compilationBookName(person))}</strong><span class="kb-compilation-editorial-person">${escapeHtml(person.name)}</span><span class="kb-compilation-editorial-source"><span>Fuente de los textos</span><b>${person.id==="escribas-juda"?"Tradición oral de Moisés":escapeHtml(person.source)}</b></span></span><span class="kb-compilation-editorial-chevron">${icon("chevronRight",18)}</span></button>`).join("")}</div><p class="kb-compilation-art-credit">Imágenes: obras de dominio público de Wikimedia Commons. Son representaciones artísticas posteriores, no documentos visuales de los acontecimientos.</p></main>`;
}
const AUTHOR_ARTWORKS = {
  moises: "Rembrandt - Moses with the Ten Commandments - Google Art Project.jpg",
  david: "David Playing the Harp 1670 Jan de Bray.jpg"
};
const artRequestCache = new Map();
async function resolvePublicDomainArt(query) {
  if (!artRequestCache.has(query)) artRequestCache.set(query, (async () => {
    const params = new URLSearchParams({action:"query",generator:"search",gsrsearch:"filetype:bitmap " + query,gsrnamespace:"6",gsrlimit:"12",prop:"imageinfo",iiprop:"url|extmetadata",iiurlwidth:"360",format:"json",origin:"*"});
    const response = await fetch("https://commons.wikimedia.org/w/api.php?" + params);
    if (!response.ok) return null;
    const payload = await response.json();
    const pages = Object.values(payload.query?.pages || {}).sort((a,b)=>(a.index||99)-(b.index||99));
    for (const page of pages) {
      const info = page.imageinfo?.[0], meta = info?.extmetadata || {};
      const license = (meta.LicenseShortName?.value || "").toLowerCase();
      const usage = (meta.UsageTerms?.value || "").toLowerCase();
      if (!info?.thumburl || !/public domain|pd-old|pd-art|cc0|pdm/.test(license+" "+usage)) continue;
      if (!/\.(jpg|jpeg|png|webp)$/i.test(page.title)) continue;
      return {url:info.thumburl,page:info.descriptionurl,artist:meta.Artist?.value||"",license:meta.LicenseShortName?.value||"Public domain"};
    }
    return null;
  })().catch(()=>null));
  return artRequestCache.get(query);
}
function renderAuthorPortrait(person) {
  const initial = escapeHtml(person.name.slice(0,1));
  const art = person.portrait;
  if (!art?.query) return `<span class="kb-author-editorial-initial" aria-hidden="true">${initial}</span>`;
  return `<span class="kb-author-classic-image" data-art-query="${escapeHtml(art.query)}" data-art-id="${escapeHtml(person.id)}"><span class="kb-author-editorial-initial" aria-hidden="true">${person.kind==="collective"?"✦":initial}</span><img class="kb-author-portrait" alt="${escapeHtml(art.alt)}" loading="lazy" decoding="async" hidden /></span>`;
}
function hydrateAuthorArtwork() {
  document.querySelectorAll(".kb-author-classic-image[data-art-query]:not([data-art-started])").forEach(async node => {
    node.dataset.artStarted = "true";
    const img = node.querySelector("img");
    const art = await resolvePublicDomainArt(node.dataset.artQuery);
    if (!art || !node.isConnected || !img) return;
    img.onload = () => {img.hidden=false;node.classList.add("is-loaded");};
    img.onerror = () => {img.hidden=true;};
    img.src = art.url;
    node.title = "Arte histórico · " + art.license + " · Wikimedia Commons";
  });
}
const artObserver = new MutationObserver(() => hydrateAuthorArtwork());
artObserver.observe(document.documentElement,{childList:true,subtree:true});

function renderAuthors() {
  const filters = [["all","Todos"],["Antiguo Testamento","Antiguo Testamento"],["Nuevo Testamento","Nuevo Testamento"],["disputed","Autoría discutida"]];
  const visible = AUTHORS.filter(person => state.authorsFilter === "all" || (state.authorsFilter === "disputed" ? /discutida|compleja|anónimo|tradicional/i.test(person.status) : person.testament === state.authorsFilter));
  const person = AUTHOR_BY_ID.get(state.selectedAuthorId);
  if (person) {
    return `<main class="screen kb-authors-page"><button class="kb-author-back" data-action="authors-back">${icon("arrowLeft",18)} Todos los autores</button><header class="kb-author-profile-header"><span class="kb-author-monogram">${renderAuthorPortrait(person)}</span><p class="eyebrow">Personas y Escrituras</p><h1>${escapeHtml(person.name)}</h1><span class="kb-author-status">${escapeHtml(person.status)}</span><p>${escapeHtml(person.description)}</p></header><section class="kb-author-note"><h2>Sobre su autoría</h2><p>${escapeHtml(person.note)}</p></section><section class="kb-author-books"><h2>Libros relacionados</h2><p>La relación puede ser una atribución tradicional, una referencia textual o una tradición editorial; no implica autoría demostrada.</p><div class="kb-author-book-list">${person.books.map(name => { const book = BOOKS.find(item => item.name === name); return book ? `<button class="kb-author-book" style="${categoryStyle(book.category)}" data-action="open-book" data-book-id="${book.id}"><span class="kb-author-book-color"></span><strong>${escapeHtml(book.name)}</strong>${icon("chevronRight",17)}</button>` : ""; }).join("")}</div></section></main>`;
  }
  return `<main class="screen kb-authors-page"><header class="route-header"><p class="eyebrow">Personas y Escrituras</p><h1>Autores bíblicos.</h1><p>Conoce a quienes escribieron, recopilaron y transmitieron los textos bíblicos, y qué sabemos realmente sobre sus atribuciones.</p></header><div class="category-filter" role="group" aria-label="Filtrar autores">${filters.map(([id,label]) => `<button class="category-filter-chip ${state.authorsFilter === id ? "is-selected" : ""}" data-action="filter-authors" data-filter="${id}" aria-pressed="${state.authorsFilter === id}">${label}</button>`).join("")}</div><div class="kb-authors-count">${visible.length} fichas · Atribuciones tradicionales e históricas</div><div class="kb-authors-list">${visible.map(person => `<button class="kb-author-card" data-action="open-author" data-author-id="${person.id}"><span class="kb-author-avatar">${renderAuthorPortrait(person)}</span><span class="kb-author-card-copy"><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.description)}</small><em>${escapeHtml(person.status)}</em></span>${icon("chevronRight",17)}</button>`).join("")}</div><p class="kb-authors-disclaimer">Las atribuciones tradicionales no siempre coinciden con las conclusiones de la investigación histórica. Los textos anónimos y las obras colectivas se presentan como tales.</p></main>`;
}

function renderLibrary() {
  const categoryId = CATEGORIES.some(category => category.id === state.libraryCategory) ? state.libraryCategory : "all";
  const selected = CATEGORIES.find(category => category.id === categoryId) || CATEGORIES[0];
  const books = categoryId === "all" ? BOOKS : BOOKS.filter(book => book.category === categoryId);
  const ordered = [...books].sort((a, b) => a.name.localeCompare(b.name, "es"));
  return `<main class="screen kb-library-page"><header class="route-header"><p class="eyebrow">Biblioteca bíblica</p><h1>Explora los libros.</h1><p>66 libros para descubrir a tu ritmo, sin alterar tu ruta de lectura.</p></header><div class="category-filter" role="group" aria-label="Filtrar biblioteca por categoría">${CATEGORIES.map(category => `<button class="category-filter-chip ${category.id === categoryId ? "is-selected" : ""}" style="${categoryStyle(category.id)}" data-action="filter-library-category" data-category="${category.id}" aria-pressed="${category.id === categoryId}">${escapeHtml(category.label)}</button>`).join("")}</div><div class="category-result-label" style="${categoryStyle(categoryId)}"><span>${escapeHtml(selected.label)}</span><strong>${ordered.length} ${ordered.length === 1 ? "libro" : "libros"}</strong></div><div class="kb-library-grid">${ordered.map(book => `<button class="kb-library-tile" data-action="open-book" data-book-id="${book.id}" style="${categoryStyle(book.category)}" aria-label="Abrir ${escapeHtml(book.name)}">${renderBookCover(book, isBookComplete(book))}<span class="kb-library-tile-name">${escapeHtml(book.name)}</span><span class="kb-library-tile-meta">${book.chapters} ${book.chapters === 1 ? "capítulo" : "capítulos"}</span></button>`).join("")}</div></main>`;
}

const CATEGORY_SHORT_LABELS = Object.freeze({
  law: "Ley", history: "Históricos", wisdom: "Sabiduría",
  "major-prophets": "Profetas", "minor-prophets": "Menores",
  gospels: "Evangelios", "church-history": "Historia",
  "paul-letters": "Pablo", "general-letters": "Generales",
  apocalypse: "Apocalíptica"
});

function routeRow(book) {
  const done = isBookComplete(book);
  const current = book.id === currentBook().id;
  const completed = getCompletedChapters(book).length;
  const category = CATEGORIES.find(item => item.id === book.category);
  return `<button class="route-row ${done ? "is-done" : ""} ${current ? "is-current" : ""}" style="${categoryStyle(book.category)}" data-action="open-book" data-book-id="${book.id}"><span class="route-number">${done ? icon("check", 17) : book.index + 1}</span><span class="route-row-content"><strong>${escapeHtml(book.name)}</strong><small>${completed} de ${book.chapters} capítulos</small></span><span class="route-row-side"><span class="route-category-tag" aria-label="Categoría: ${escapeHtml(category?.label || "")}">${escapeHtml(CATEGORY_SHORT_LABELS[book.category] || "Libro")}</span>${done || current ? `<span class="route-status">${done ? "Listo" : "Siguiente"}</span>` : ""}</span></button>`;
}

function renderProgress() {
  const chapters = totalCompletedChapters();
  const books = totalCompletedBooks();
  const overall = percent(books, BOOKS.length);
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Tu progreso</p><h1>Tu camino recorrido.</h1><p>Cada libro que terminas forma parte de tu recorrido. Puedes hacer pausas y continuar cuando quieras.</p></div><div class="card progress-hero" style="margin-top:20px"><div class="progress-ring" style="--progress:${overall}%" role="img" aria-label="${overall}% de la ruta completada por libros terminados"><span>${overall}%</span></div><div class="metric-list"><div class="metric"><span>Libros terminados</span><strong>${books} / ${BOOKS.length}</strong></div><div class="metric"><span>Capítulos leídos</span><strong>${chapters} / ${TOTAL_CHAPTERS}</strong></div><div class="metric"><span>Meta actual</span><strong>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</strong></div></div></div><div class="section-heading"><h2>Próximos hitos</h2></div><div class="more-list"><div class="more-row"><span><strong>Primer libro</strong><span>Completa 3 Juan</span></span><strong>${books >= 1 ? icon("check", 17) : "1 libro"}</strong></div><div class="more-row"><span><strong>Primer tramo</strong><span>Completa 7 libros</span></span><strong>${books >= 7 ? icon("check", 17) : `${Math.min(books, 7)}/7`}</strong></div><div class="more-row"><span><strong>Mitad de la ruta</strong><span>Llega a 33 libros</span></span><strong>${books >= 33 ? icon("check", 17) : `${Math.min(books, 33)}/33`}</strong></div></div></main>`;
}

function renderMore() {
  return `<main class="screen settings-screen"><h1 class="settings-title">Configuración</h1><div class="more-list settings-list"><div class="more-row"><span><strong>Meta de lectura</strong><span>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</span></span><button class="button button-secondary" data-action="change-goal">Cambiar</button></div><section class="appearance-setting" aria-labelledby="appearance-title"><h2 id="appearance-title">Apariencia</h2><div class="appearance-options" role="radiogroup" aria-label="Apariencia de la aplicación">${[["system","Automático","Sigue tu iPhone","smartphone"],["light","Claro","Siempre claro","sun"],["dark","Oscuro","Siempre oscuro","moon"]].map(([value,label,description,symbol]) => `<button type="button" class="appearance-option ${state.appAppearance === value ? "is-selected" : ""}" role="radio" aria-checked="${state.appAppearance === value}" data-action="set-appearance" data-appearance="${value}"><span class="appearance-option-icon" aria-hidden="true">${icon(symbol,20)}</span><span class="appearance-option-text"><strong>${label}</strong><small>${description}</small></span><span class="appearance-option-check" aria-hidden="true">${state.appAppearance === value ? icon("check",18) : ""}</span></button>`).join("")}</div></section><div class="more-row"><span><strong>Progreso local</strong><span>Guardado en este dispositivo</span></span><span aria-label="Activado">${icon("check", 17)}</span></div><div class="more-row"><span><strong>Contenido</strong><span>Texto y videos con fuente por definir</span></span><span aria-hidden="true">${icon("chevronRight", 18)}</span></div></div><div class="context-card" style="margin-top:24px"><h3>Una nota sobre este prototipo</h3><p style="margin-bottom:0">La lectura que ves aquí es una maqueta de interacción. El contenido bíblico y los videos reales se integrarán después de resolver las licencias.</p></div></main>`;
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
  return `<section class="book-info-page" style="${categoryStyle(book.category)}" aria-label="Introducción del libro"><p class="eyebrow book-info-kicker">Introducción del libro</p><p class="book-info-lead">${escapeHtml(info.lead)}</p><p class="book-info-body">${escapeHtml(info.body)}</p><div class="book-info-themes">${info.themes.map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}</div><p class="book-info-context">${escapeHtml(info.context)}</p><div class="book-info-source"><span>${escapeHtml(info.sourceLabel)}</span>${info.sourceUrl ? `<a href="${info.sourceUrl}" target="_blank" rel="noreferrer">Ver referencia</a>` : ""}</div></section>`;
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
  const passage = getLoadedBibleChapter(book.id, chapter, state.readerTranslation) || getBibleChapter(book.id, chapter, state.readerTranslation);
  const translation = getBibleTranslation(state.readerTranslation);

  if (!passage) {
    const loadState = getBookLoadState(book.id);
    const message = loadState === "error" ? "No pudimos descargar este libro. Comprueba tu conexión y vuelve a abrirlo." : "Descargando el texto bíblico de este libro…";
    return `<div class="reading-copy reading-copy-pending ${state.readerFont === "sans" ? "reader-font-sans" : "reader-font-serif"}" data-reading-content><p class="reading-note">${icon("sparkles", 17)}<span><strong>${loadState === "error" ? "Sin conexión:" : "Cargando Biblia:"}</strong> ${message}</span></p><p>Mientras tanto, puedes explorar el contexto del libro, navegar sus capítulos y guardar tu avance cuando el texto esté listo.</p></div>`;
  }

  return `<section class="reading-copy scripture-passage ${state.readerFont === "sans" ? "reader-font-sans" : "reader-font-serif"}" data-reading-content aria-labelledby="scripture-title"><div class="scripture-source"><span><strong>${translation.name}</strong><small>${translation.license} · ${translation.publisher}</small></span><a href="${passage.sourceUrl}" target="_blank" rel="noreferrer">Ver fuente</a></div><h2 id="scripture-title" class="sr-only">${escapeHtml(book.name)} ${chapter}</h2><div class="verse-list">${passage.verses.map((verse) => `${getPericopes(book.id, chapter).filter(section => section.startVerse === verse.number && section.status !== "needs-translation").map(section => `<h3 class="kb-pericope-heading">${escapeHtml(section.title)}</h3>`).join("")}<p class="scripture-verse"><sup>${verse.number}</sup><span>${escapeHtml(verse.text)}</span></p>`).join("")}</div><p class="scripture-attribution">Texto de ${translation.name}. ${translation.license}.</p></section>`;
}

function renderBookTextCredits(book) {
  const authors = authorsForBook(book.name).filter(person => person.showInAuthors !== false && person.id !== "autores-anonimos" && person.kind !== "collective").slice(0,3);
  const compilers = [...new Set(relationshipsForBook(book.name).map(link => link.personId))].map(id => AUTHOR_BY_ID.get(id)).filter(Boolean);
  const personRow = (person,detail) => `<div class="kb-reader-credit-person"><span class="kb-reader-credit-avatar">${renderAuthorPortrait(person)}</span><span class="kb-reader-credit-copy"><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(detail)}</small></span></div>`;
  const authorContent = authors.length ? authors.map(person => personRow(person,person.status)).join("") : '<p class="kb-reader-credit-empty">Autor no identificado en el texto.</p>';
  const compilerContent = compilers.length ? compilers.map(person => {
    const link = relationshipsForBook(book.name).find(item => item.personId === person.id);
    return personRow(person,link?.role || "Transmisión textual");
  }).join("") : '<p class="kb-reader-credit-empty">No se han identificado recopiladores específicos para este libro en el registro.</p>';
  return `<aside class="kb-reader-credits" aria-label="Autor y recopiladores del libro"><p class="eyebrow">Personas detrás del texto</p><div class="kb-reader-credit-group"><h3>Autor</h3>${authorContent}</div><div class="kb-reader-credit-group"><h3>Recopiladores</h3>${compilerContent}</div><p class="kb-reader-credit-disclaimer">Las atribuciones tradicionales y las funciones documentadas no son equivalentes.</p></aside>`;
}
function renderReader() {
  const book = getBook(state.readerBookId);
  const chapter = readerChapter(book);
  const completed = getCompletedChapters(book).includes(chapter);
  const bookProgress = getCompletedChapters(book).length;
  const routeProgress = totalCompletedChapters();
  const origin = state.readerOrigin === "route" ? "Ruta" : state.readerOrigin === "library" ? "Biblioteca" : state.readerOrigin === "authors" ? "Autores" : "Hoy";
  const video = getBookVideo(book);
  const contextVideo = video ? renderVideoCard(video) : renderPendingVideoCard();
  const readerBody = `${renderReaderContext(book, contextVideo)}${renderChapterList(book, chapter)}${state.readerBookInfoOpen ? renderBookInfoPage(book) : renderReadingCopy(book, chapter) + (chapter === book.chapters ? renderBookTextCredits(book) : "")}`;
  const readProgress = Number.isFinite(state.readerReadingProgress) ? state.readerReadingProgress : 0;
  const readerFooter = state.readerBookInfoOpen ? "" : `<footer class="reader-footer"><div class="reader-reading-meter" data-reading-meter><div class="reader-reading-meter-copy"><span data-reading-progress-label>${readProgress}% leído</span><span>Capítulo ${chapter}</span></div><div class="reader-reading-track" role="progressbar" aria-label="Progreso de lectura del capítulo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${readProgress}"><div class="reader-reading-fill" data-reading-progress-fill style="width:${readProgress}%"></div></div></div><button class="button button-primary button-wide" data-action="${completed && chapter < book.chapters ? "continue-chapter" : "complete-chapter"}" data-complete-chapter ${completed ? 'data-completed="true"' : ""} ${!completed && readProgress < 100 ? "disabled" : ""}>${completed && chapter < book.chapters ? `Continuar al capítulo ${chapter + 1} ${icon("chevronRight", 17)}` : chapter === book.chapters ? `Completar libro ${icon("check", 17)}` : "Marcar como leído"}</button></footer>`;
  return `<main class="reader-page" style="${categoryStyle(book.category)}"><header class="reader-topbar kb-reader-compact-header"><div class="kb-reader-toolbar"><button class="reader-back kb-reader-back" data-action="back-context" aria-label="Volver a ${origin}">${icon("arrowLeft", 21)}</button><div class="kb-reader-toolbar-right"><button class="reader-format-button kb-reader-format" data-action="toggle-reader-format" aria-label="Formato de lectura" aria-expanded="${state.readerDisplayOpen}" aria-controls="reader-display-menu">${icon("sliders", 19)}</button><div class="reader-more-anchor"><button class="icon-button reader-more-trigger" data-action="toggle-reader-more" aria-label="Más opciones del capítulo" aria-haspopup="menu" aria-expanded="${Boolean(state.readerMoreOpen)}" aria-controls="reader-more-menu">${icon("ellipsis", 20)}</button>${state.readerMoreOpen ? `<div class="reader-more-popover" id="reader-more-menu" role="menu">${completed ? `<button role="menuitem" data-action="mark-chapter-unread">${icon("bookOpen", 17)}<span>Marcar como no leído</span></button>` : `<p>Este capítulo aún no está marcado como leído.</p>`}</div>` : ""}</div></div></div><div class="kb-reader-selector-row">${renderReaderSelection(book, chapter)}</div></header>${renderReaderDisplayMenu()}<div class="reader-progress"><div class="reader-progress-copy"><span>Progreso del libro</span><strong>${bookProgress} de ${book.chapters} capítulos</strong></div><div class="progress-track" role="progressbar" aria-label="Progreso del libro" aria-valuemin="0" aria-valuemax="${book.chapters}" aria-valuenow="${bookProgress}"><div class="progress-fill" style="width:${percent(bookProgress, book.chapters)}%"></div></div></div><article class="reader-content"><div class="reader-heading"><div class="reader-meta-pill"><span>Capítulo ${chapter} de ${book.chapters}</span></div><h1>${escapeHtml(book.name)}</h1></div>${readerBody}</article>${readerFooter}</main>`;
}

function renderNav() {
  const items = [["home", "house", "Hoy"], ["route", "route", "Ruta"], ["progress", "chart", "Progreso"], ["library", "bookOpen", "Biblioteca"]];
  return `<nav class="bottom-nav" aria-label="Navegación principal">${items.map(([view, iconName, label]) => `<button class="nav-item ${state.view === view ? "is-active" : ""}" data-action="navigate" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon(iconName, 19)}</span><span>${label}</span></button>`).join("")}</nav>`;
}

function openReader(bookId = currentBook().id) {
  state.justCompletedBookId = null;
  state.readerBookId = bookId;
  state.readerOrigin = ["route", "library", "authors"].includes(state.view) ? state.view : "home";
  state.readerChapter = currentChapter(getBook(bookId));
  state.chapterSheetOpen = false;
  state.readerBookInfoOpen = false;
  state.readerReadingProgress = 0;
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

function continueChapter() {
  const book = getBook(state.readerBookId);
  const chapter = readerChapter(book);
  if (!getCompletedChapters(book).includes(chapter) || chapter >= book.chapters) return;
  state.readerChapter = chapter + 1;
  state.readerReadingProgress = 0;
  state.readerBookInfoOpen = false;
  state.chapterSheetOpen = false;
  state.readerDisplayOpen = false;
  state.readerMoreOpen = false;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function completeChapter() {
  const book = getBook(state.readerBookId);
  const chapter = readerChapter(book);
  const wasComplete = isBookComplete(book);
  if (!getCompletedChapters(book).includes(chapter)) {
    const updatedProgress = markChapterComplete(state, book, chapter);
    state.completedChapters = updatedProgress.completedChapters;
  }
  const finishedBook = isBookComplete(book);
  if (state.onboardingStep === 3 && book.index === 0) state.onboardingComplete = true;
  if (finishedBook && !wasComplete) {
    state.justCompletedBookId = book.id;
    const finishedCount = totalCompletedBooks();
    if (READING_MILESTONES.includes(finishedCount) && !state.celebratedMilestones.includes(finishedCount)) {
      state.activeMilestone = finishedCount;
      state.celebratedMilestones = [...state.celebratedMilestones, finishedCount];
    }
    state.interludeBookId = book.id;
    state.view = "interlude";
    state.readerChapter = null;
  } else if (finishedBook && chapter === book.chapters) {
    // A previously completed book returns to its interlude only on explicit request.
    state.interludeBookId = book.id;
    state.view = "interlude";
  } else {
    // Keep the current chapter visible and expose the explicit Continue action.
    state.view = "reader";
  }
  state.readerReadingProgress = 0;
  state.readerBookInfoOpen = false;
  state.chapterSheetOpen = false;
  state.readerDisplayOpen = false;
  saveState();
  render();
  if (state.view === "interlude") window.scrollTo({ top: 0, behavior: "instant" });
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
      if (action === "navigate") { state.view = element.dataset.view; state.navigationOpen = false; saveState(); render(); }
      if (action === "toggle-navigation") { state.navigationOpen = !state.navigationOpen; state.appearancePopoverOpen = false; render(); }
      if (action === "close-navigation") { state.navigationOpen = false; state.appearancePopoverOpen = false; render(); document.querySelector(".kb-menu-trigger")?.focus({preventScroll:true}); }
      if (action === "navigation-go") { state.view = element.dataset.view; if (state.view === "authors") state.selectedAuthorId = null; if (state.view === "compilation") state.selectedCompilerId = null; state.navigationOpen = false; state.appearancePopoverOpen = false; saveState(); render(); window.scrollTo({ top: 0, behavior: "instant" }); }
      if (action === "toggle-appearance-popover") { state.appearancePopoverOpen = !state.appearancePopoverOpen; render(); document.querySelector(".kb-appearance-toggle")?.focus({preventScroll:true}); }
      if (action === "open-more") { state.view = "more"; saveState(); render(); }
      if (action === "show-route") { state.view = "route"; saveState(); render(); }
      if (action === "show-progress") { state.view = "progress"; saveState(); render(); }
      if (action === "open-compiler") { state.selectedCompilerId = element.dataset.compilerId; saveState(); render(); window.scrollTo({top:0,behavior:"instant"}); }
      if (action === "compilation-back") { state.selectedCompilerId = null; saveState(); render(); window.scrollTo({top:0,behavior:"instant"}); }
      if (action === "filter-authors") { state.authorsFilter = element.dataset.filter; state.selectedAuthorId = null; saveState(); render(); }
      if (action === "open-author") { state.view = "authors"; state.selectedAuthorId = element.dataset.authorId; state.navigationOpen = false; saveState(); render(); window.scrollTo({top:0,behavior:"instant"}); }
      if (action === "authors-back") { state.selectedAuthorId = null; saveState(); render(); window.scrollTo({top:0,behavior:"instant"}); }
      if (action === "filter-library-category") { state.libraryCategory = CATEGORIES.some(category => category.id === element.dataset.category) ? element.dataset.category : "all"; saveState(); render(); }
      if (action === "filter-route-category") { state.routeCategory = CATEGORIES.some((category) => category.id === element.dataset.category) ? element.dataset.category : "all"; saveState(); render(); }
      if (action === "open-book") { openReader(element.dataset.bookId); }
      if (action === "select-chapter") { state.readerChapter = Number(element.dataset.chapter); state.chapterSheetOpen = false; state.readerBookInfoOpen = false; state.readerReadingProgress = 0; saveState(); render(); }
      if (action === "open-book-info") { state.readerBookInfoOpen = true; state.chapterSheetOpen = false; saveState(); render(); }
      if (action === "close-book-info") { state.readerBookInfoOpen = false; saveState(); render(); }
      if (action === "toggle-chapter-sheet") { state.chapterSheetOpen = !state.chapterSheetOpen; saveState(); render(); }
      if (action === "close-chapter-sheet") { state.chapterSheetOpen = false; saveState(); render(); }
      if (action === "toggle-reader-format") { state.readerDisplayOpen = !state.readerDisplayOpen; saveState(); render(); }
      if (action === "toggle-reader-context") { state.readerContextOpen = !state.readerContextOpen; saveState(); render(); }
      if (action === "set-reader-font") { state.readerFont = element.dataset.font === "sans" ? "sans" : "serif"; state.readerDisplayOpen = false; saveState(); render(); }
      if (action === "set-reader-theme") { state.readerTheme = ["light", "sepia", "dark"].includes(element.dataset.theme) ? element.dataset.theme : "light"; state.readerDisplayOpen = false; saveState(); render(); }
      if (action === "back-home" || action === "back-context") { state.view = ["route", "library", "authors"].includes(state.readerOrigin) ? state.readerOrigin : "home"; saveState(); render(); }
      if (action === "toggle-reader-more") { state.readerMoreOpen = !state.readerMoreOpen; render(); document.querySelector(".reader-more-trigger")?.focus({preventScroll:true}); }
      if (action === "mark-chapter-unread") {
        const book = getBook(state.readerBookId);
        const chapter = readerChapter(book);
        const remaining = getCompletedChapters(book).filter(number => number !== chapter);
        state.completedChapters = { ...state.completedChapters, [book.id]: remaining };
        state.readerMoreOpen = false;
        state.readerReadingProgress = 0;
        saveState(); render();
      }
      if (action === "dismiss-milestone") { state.activeMilestone = null; saveState(); render(); }
      if (action === "complete-chapter") { completeChapter(); }
      if (action === "continue-chapter") { continueChapter(); }
      if (action === "interlude-next") { const finished = getBook(state.interludeBookId); const next = finished && BOOKS[finished.index + 1]; if (next) { state.view = "home"; state.interludeBookId = null; openReader(next.id); window.scrollTo({ top: 0, behavior: "instant" }); } }
      if (action === "interlude-home") { state.interludeBookId = null; state.view = "home"; saveState(); render(); window.scrollTo({ top: 0, behavior: "instant" }); }
      if (action === "set-appearance") { const value = element.dataset.appearance; if (["system", "light", "dark"].includes(value)) { state.appAppearance = value; state.appearancePopoverOpen = false; saveState(); render(); document.querySelector(".kb-appearance-toggle")?.focus({preventScroll:true}); } }
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

document.addEventListener("keydown", event => {
  if (!state.navigationOpen) return;
  if (event.key === "Escape") { event.preventDefault(); state.navigationOpen = false; state.appearancePopoverOpen = false; render(); document.querySelector(".kb-menu-trigger")?.focus({preventScroll:true}); return; }
  if (event.key !== "Tab") return;
  const dialog = document.querySelector("#kb-navigation-sheet");
  const focusable = [...(dialog?.querySelectorAll('button:not([disabled]),a[href]') || [])].filter(el => el.getClientRects().length);
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
bindReaderReadingProgress();
render();
updateReaderReadingProgress();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(error => console.warn("Offline cache unavailable", error)));
}
window.addEventListener("online", () => {
  if (state.view !== "reader" || getBookLoadState(state.readerBookId) !== "error") return;
  const bookId = state.readerBookId;
  loadBibleBook(bookId).then(() => { if (state.view === "reader" && state.readerBookId === bookId) render(); }).catch(() => {});
});
