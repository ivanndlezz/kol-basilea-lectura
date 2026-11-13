const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const PROGRESS_EXPORT_SCHEMA_VERSION = 1;
export const PROGRESS_EXPORT_APP_ID = "kol-basilea-lectura";
const VALID_TRANSLATIONS = new Set(["rvr1909", "pdt", "onbv", "bes"]);

export function isProgressId(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function createProgressId(cryptoObject = globalThis.crypto) {
  if (typeof cryptoObject?.randomUUID === "function") return cryptoObject.randomUUID();
  if (typeof cryptoObject?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    cryptoObject.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  throw new Error("Este navegador no ofrece una fuente segura para crear el identificador de progreso.");
}

function normalizedCompletedChapters(progress, books) {
  const chapterLimits = new Map(books.map(book => [book.id, book.chapters]));
  return Object.fromEntries(
    Object.entries(progress?.completedChapters || {})
      .map(([bookId, chapters]) => {
        const limit = chapterLimits.get(bookId);
        if (!Number.isInteger(limit) || !Array.isArray(chapters)) return null;
        const valid = [...new Set(chapters)]
          .filter(chapter => Number.isInteger(chapter) && chapter >= 1 && chapter <= limit)
          .sort((a, b) => a - b);
        return valid.length ? [bookId, valid] : null;
      })
      .filter(Boolean)
  );
}

function normalizedResume(progress, books) {
  const book = books.find(item => item.id === progress?.readerBookId);
  const chapter = progress?.readerChapter;
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) return null;
  return { bookId: book.id, chapter };
}

export function createProgressExport(progress, { books = [], origin = "", exportedAt = new Date().toISOString() } = {}) {
  const goal = ["none", "180", "365"].includes(progress?.goal) ? progress.goal : "none";
  const readerTranslation = VALID_TRANSLATIONS.has(progress?.readerTranslation) ? progress.readerTranslation : "pdt";
  const readerFont = ["serif", "sans"].includes(progress?.readerFont) ? progress.readerFont : "serif";
  const readerTheme = ["light", "sepia", "dark"].includes(progress?.readerTheme) ? progress.readerTheme : "light";

  return {
    schemaVersion: PROGRESS_EXPORT_SCHEMA_VERSION,
    appId: PROGRESS_EXPORT_APP_ID,
    progressId: isProgressId(progress?.progressId) ? progress.progressId : null,
    exportedAt,
    sourceOrigin: origin,
    payload: {
      completedChapters: normalizedCompletedChapters(progress, books),
      goal,
      readerTranslation,
      resume: normalizedResume(progress, books),
      preferences: { readerFont, readerTheme }
    }
  };
}

export function validateProgressExport(input, { books = [] } = {}) {
  if (!input || typeof input !== "object") return { ok: false, error: "El archivo no contiene un objeto JSON válido." };
  if (input.schemaVersion !== PROGRESS_EXPORT_SCHEMA_VERSION) return { ok: false, error: "La versión de este archivo no es compatible." };
  if (input.appId !== PROGRESS_EXPORT_APP_ID) return { ok: false, error: "El archivo no pertenece a Kol Basilea Lectura." };
  if (!isProgressId(input.progressId)) return { ok: false, error: "El archivo no contiene un identificador de progreso válido." };
  if (!input.payload || typeof input.payload !== "object") return { ok: false, error: "El archivo no contiene datos de progreso." };

  const payload = input.payload;
  const resume = payload.resume && typeof payload.resume === "object"
    ? { readerBookId: payload.resume.bookId, readerChapter: payload.resume.chapter }
    : {};
  const preferences = payload.preferences && typeof payload.preferences === "object" ? payload.preferences : {};
  const normalized = {
    progressId: input.progressId,
    exportedAt: typeof input.exportedAt === "string" ? input.exportedAt : "",
    completedChapters: normalizedCompletedChapters({ completedChapters: payload.completedChapters }, books),
    goal: ["none", "180", "365"].includes(payload.goal) ? payload.goal : "none",
    readerTranslation: VALID_TRANSLATIONS.has(payload.readerTranslation) ? payload.readerTranslation : "pdt",
    resume: normalizedResume(resume, books),
    preferences: {
      readerFont: ["serif", "sans"].includes(preferences.readerFont) ? preferences.readerFont : "serif",
      readerTheme: ["light", "sepia", "dark"].includes(preferences.readerTheme) ? preferences.readerTheme : "light"
    }
  };
  return { ok: true, value: normalized };
}

function hasLocalProgress(progress, books) {
  return Object.values(normalizedCompletedChapters(progress, books)).some(chapters => chapters.length > 0)
    || progress?.goal !== "none"
    || Number.isInteger(progress?.readerChapter);
}

export function mergeProgressState(current, imported, { books = [] } = {}) {
  const localChapters = normalizedCompletedChapters(current, books);
  const mergedChapters = { ...localChapters };
  for (const [bookId, chapters] of Object.entries(imported.completedChapters)) {
    mergedChapters[bookId] = [...new Set([...(mergedChapters[bookId] || []), ...chapters])].sort((a, b) => a - b);
  }

  const merged = {
    ...current,
    completedChapters: mergedChapters,
    goal: imported.goal,
    readerTranslation: imported.readerTranslation,
    readerBookId: imported.resume?.bookId || current.readerBookId,
    readerChapter: imported.resume?.chapter || current.readerChapter,
    readerFont: imported.preferences.readerFont,
    readerTheme: imported.preferences.readerTheme,
    onboardingComplete: current.onboardingComplete || Object.keys(mergedChapters).length > 0
  };
  if (!hasLocalProgress(current, books)) merged.progressId = imported.progressId;
  return merged;
}
