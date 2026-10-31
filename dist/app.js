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

const defaultState = () => ({
  onboardingComplete: false,
  onboardingStep: 1,
  goal: "365",
  view: "home",
  readerBookId: "3-juan",
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
    body = `<div class="hero-copy"><p class="eyebrow">Tu primer libro</p><h1>Comenzamos con<br>${book.name}.</h1><p>Antes de leer, puedes conocer el contexto. Después, marca tu capítulo y mira cómo empieza a crecer tu ruta.</p></div><div class="context-card"><div class="video-placeholder"><div><button type="button" data-action="preview-video" aria-label="Reproducir vista previa del video">▶</button><small>Video de contexto · 4 min</small></div></div><h3>Una carta breve para comenzar</h3><p>Vista previa de contenido. El texto bíblico y el video final se incorporarán cuando se definan las fuentes y licencias.</p></div>`;
  }

  return `<main class="onboarding-shell"><div class="onboarding-top"><div class="brand"><span class="brand-mark" aria-hidden="true">✦</span>Kol Basilea</div><span class="progress-meta">Paso ${step} de 3</span></div><div class="progress-track" role="progressbar" aria-label="Progreso del inicio" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${step}"><div class="progress-fill" style="width:${progress}%"></div></div><section class="onboarding-body">${body}</section><div class="onboarding-actions">${step === 1 ? `<button class="button button-primary button-wide" data-action="onboarding-next">Comenzar con 3 Juan</button><button class="button button-quiet button-wide" data-action="skip-onboarding">Explorar la ruta primero</button>` : step === 2 ? `<button class="button button-primary button-wide" data-action="onboarding-next">Continuar</button>` : `<button class="button button-primary button-wide" data-action="open-reader">Abrir 3 Juan</button>`}</div></main>`;
}

function goalOption(value, title, subtitle) {
  const selected = state.goal === value;
  return `<button type="button" class="goal-option ${selected ? "is-selected" : ""}" data-action="choose-goal" data-goal="${value}" aria-pressed="${selected}"><span><strong>${title}</strong><span>${subtitle}</span></span>${selected ? `<span class="checkmark" aria-hidden="true">✓</span>` : ""}</button>`;
}

function renderApp() {
  const content = state.view === "reader" ? renderReader() : renderView();
  return `<div class="app-shell ${state.view === "reader" ? "is-reading" : ""}">${state.view === "reader" ? content : `${renderTopbar()}${content}${renderNav()}`}${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ""}</div>`;
}

function renderTopbar() {
  return `<header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true">✦</span>Kol Basilea</div><button class="profile-button" data-action="open-more" aria-label="Abrir más opciones">⌘</button></header>`;
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

  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">${doneBooks ? "Continúa tu ruta" : "Tu ruta comienza aquí"}</p><h1>${doneBooks ? `Ya terminaste ${doneBooks} ${doneBooks === 1 ? "libro" : "libros"}.` : "Un paso a la vez."}</h1><p>${doneBooks ? "Retoma desde el último capítulo pendiente y sigue construyendo tu biblioteca." : "Empieza con un libro breve. El progreso se mide por lo que terminas, no por lo que te falta."}</p></div><div class="card current-card"><span class="book-tag">Libro ${book.index + 1} de 66 · ${goalLabel}</span><h2>${escapeHtml(book.name)}</h2><p class="book-meta">Capítulo ${chapter} de ${book.chapters}</p>${progressBar(completed, book.chapters, "Progreso del libro")}<div class="button-row" style="margin-top:20px"><button class="button button-primary" data-action="open-reader">${completed ? "Continuar lectura" : "Comenzar lectura"}</button><button class="button button-secondary" data-action="show-route">Ver ruta</button></div></div><div class="section-heading"><h2>Lo que ya construyes</h2><a href="#" data-action="show-progress">Ver todo</a></div><div class="soft-card milestone-card"><div class="milestone-icon" aria-hidden="true">✦</div><div><h3>${doneBooks} de 66 libros</h3><p>${total} de ${TOTAL_CHAPTERS} capítulos completados. Cada check permanece contigo.</p></div></div><div class="section-heading"><h2>Tu biblioteca</h2><a href="#" data-action="show-route">Ruta completa</a></div><div class="book-strip" aria-label="Libros cercanos en la ruta">${recentBooks.map(bookChip).join("")}</div></main>`;
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
  return `<button class="route-row ${done ? "is-done" : ""} ${current ? "is-current" : ""}" data-action="open-book" data-book-id="${book.id}"><span class="route-number">${done ? "✓" : book.index + 1}</span><span><strong>${escapeHtml(book.name)}</strong><small>${completed} de ${book.chapters} capítulos</small></span><span class="route-status">${done ? "Listo" : current ? "Siguiente" : ""}</span></button>`;
}

function renderProgress() {
  const chapters = totalCompletedChapters();
  const books = totalCompletedBooks();
  const overall = percent(chapters, TOTAL_CHAPTERS);
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Tu progreso</p><h1>Lo que ya has leído.</h1><p>Tu avance no desaparece cuando haces una pausa.</p></div><div class="card progress-hero" style="margin-top:20px"><div class="progress-ring" style="--progress:${overall}%" role="img" aria-label="${overall}% de la ruta completada"><span>${overall}%</span></div><div class="metric-list"><div class="metric"><span>Libros terminados</span><strong>${books} / 66</strong></div><div class="metric"><span>Capítulos leídos</span><strong>${chapters} / ${TOTAL_CHAPTERS}</strong></div><div class="metric"><span>Meta actual</span><strong>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</strong></div></div></div><div class="section-heading"><h2>Próximos hitos</h2></div><div class="more-list"><div class="more-row"><span><strong>Primer libro</strong><span>Completa 3 Juan</span></span><strong>${books >= 1 ? "✓" : "1 libro"}</strong></div><div class="more-row"><span><strong>Primer tramo</strong><span>Completa 7 libros</span></span><strong>${books >= 7 ? "✓" : `${Math.min(books, 7)}/7`}</strong></div><div class="more-row"><span><strong>Mitad de la ruta</strong><span>Llega a 33 libros</span></span><strong>${books >= 33 ? "✓" : `${Math.min(books, 33)}/33`}</strong></div></div></main>`;
}

function renderMore() {
  return `<main class="screen"><div class="hero-copy"><p class="eyebrow">Más</p><h1>Tu experiencia.</h1><p>Preferencias sencillas para mantener la ruta a tu ritmo.</p></div><div class="more-list" style="margin-top:24px"><div class="more-row"><span><strong>Meta de lectura</strong><span>${state.goal === "none" ? "Sin fecha" : `${state.goal} días`}</span></span><button class="button button-secondary" data-action="change-goal">Cambiar</button></div><div class="more-row"><span><strong>Progreso local</strong><span>Guardado en este dispositivo</span></span><span aria-label="Activado">✓</span></div><div class="more-row"><span><strong>Contenido</strong><span>Texto y videos con fuente por definir</span></span><span>›</span></div></div><div class="context-card" style="margin-top:24px"><h3>Una nota sobre este prototipo</h3><p style="margin-bottom:0">La lectura que ves aquí es una maqueta de interacción. El contenido bíblico y los videos reales se integrarán después de resolver las licencias.</p></div></main>`;
}

function renderReader() {
  const book = getBook(state.readerBookId);
  const chapter = currentChapter(book);
  const completed = getCompletedChapters(book).includes(chapter);
  const bookProgress = getCompletedChapters(book).length;
  return `<main><header class="reader-topbar"><button class="icon-button" data-action="back-home" aria-label="Volver">‹</button><div class="reader-topbar-copy"><strong>${escapeHtml(book.name)}</strong><span>Capítulo ${chapter} de ${book.chapters} · Libro ${book.index + 1} de 66</span></div><button class="icon-button" data-action="show-progress" aria-label="Ver progreso">◒</button></header><div class="reader-progress">${progressBar(bookProgress, book.chapters, "Progreso del libro")}</div><article class="reader-content"><p class="eyebrow">Antes de leer</p><h1>${escapeHtml(book.name)}<br><span style="color:var(--brand)">Capítulo ${chapter}</span></h1><div class="context-card"><div class="video-placeholder"><div><button type="button" data-action="preview-video" aria-label="Reproducir video de contexto">▶</button><small>Video de contexto · vista previa</small></div></div><h3>Lee con un poco de contexto</h3><p style="margin-bottom:0">Este espacio mostrará una introducción histórica y literaria breve antes de la lectura.</p></div><div class="reading-copy"><p class="reading-note">Contenido de demostración: aquí se integrará el texto bíblico autorizado. La interfaz ya está preparada para guardar tu check por capítulo.</p><p>La lectura comienza aquí. El objetivo de esta pantalla es mantener el foco: una página cómoda, controles claros y un solo siguiente paso.</p><p>Cuando termines este capítulo, marca tu avance. Si haces una pausa, tu progreso permanecerá guardado en este dispositivo.</p></div></article><footer class="reader-footer"><button class="button button-primary button-wide" data-action="complete-chapter">${completed ? "Capítulo completado ✓" : `Marcar capítulo ${chapter} como leído`}</button></footer></main>`;
}

function renderNav() {
  const items = [["home", "⌂", "Hoy"], ["route", "⌁", "Ruta"], ["progress", "◔", "Progreso"], ["more", "☰", "Más"]];
  return `<nav class="bottom-nav" aria-label="Navegación principal">${items.map(([view, icon, label]) => `<button class="nav-item ${state.view === view ? "is-active" : ""}" data-action="navigate" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`).join("")}</nav>`;
}

function openReader(bookId = currentBook().id) {
  state.readerBookId = bookId;
  if (state.onboardingStep === 3 && bookId === "3-juan") state.onboardingComplete = true;
  state.view = "reader";
  saveState();
  render();
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
      if (action === "preview-video") { showToast("Vista previa: el video se integrará en la siguiente fase."); }
      if (action === "navigate") { state.view = element.dataset.view; saveState(); render(); }
      if (action === "open-more") { state.view = "more"; saveState(); render(); }
      if (action === "show-route") { state.view = "route"; saveState(); render(); }
      if (action === "show-progress") { state.view = "progress"; saveState(); render(); }
      if (action === "open-book") { openReader(element.dataset.bookId); }
      if (action === "back-home") { state.view = "home"; saveState(); render(); }
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
