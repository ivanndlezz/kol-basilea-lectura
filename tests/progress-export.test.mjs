import assert from "node:assert/strict";
import test from "node:test";
import { createProgressExport, createProgressId, mergeProgressState, PROGRESS_EXPORT_APP_ID, PROGRESS_EXPORT_SCHEMA_VERSION, validateProgressExport } from "../dist/data/progress-export.js";

const books = [
  { id: "3-juan", chapters: 1 },
  { id: "genesis", chapters: 50 }
];

test("creates a UUID v4-compatible progress identifier", () => {
  const progressId = createProgressId();
  assert.match(progressId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

test("exports a normalized progress allowlist without UI state", () => {
  const exported = createProgressExport({
    progressId: "123e4567-e89b-42d3-a456-426614174000",
    completedChapters: { "3-juan": [1, 1, 0, 2], genesis: [50, 51] },
    goal: "365",
    readerTranslation: "rvr1909",
    readerBookId: "3-juan",
    readerChapter: 1,
    readerFont: "sans",
    readerTheme: "sepia",
    view: "maps",
    navigationOpen: true,
    activeMilestone: 1
  }, { books, origin: "https://example.test", exportedAt: "2026-11-05T00:00:00.000Z" });

  assert.equal(exported.schemaVersion, PROGRESS_EXPORT_SCHEMA_VERSION);
  assert.equal(exported.appId, PROGRESS_EXPORT_APP_ID);
  assert.equal(exported.progressId, "123e4567-e89b-42d3-a456-426614174000");
  assert.equal(exported.sourceOrigin, "https://example.test");
  assert.deepEqual(exported.payload.completedChapters, { "3-juan": [1], genesis: [50] });
  assert.equal(exported.payload.goal, "365");
  assert.deepEqual(exported.payload.resume, { bookId: "3-juan", chapter: 1 });
  assert.deepEqual(exported.payload.preferences, { readerFont: "sans", readerTheme: "sepia" });
  assert.equal("view" in exported.payload, false);
  assert.equal("navigationOpen" in exported.payload, false);
  assert.equal("activeMilestone" in exported.payload, false);
});

test("validates the app contract and normalizes imported data", () => {
  const result = validateProgressExport({
    schemaVersion: PROGRESS_EXPORT_SCHEMA_VERSION,
    appId: PROGRESS_EXPORT_APP_ID,
    progressId: "123e4567-e89b-42d3-a456-426614174000",
    payload: {
      completedChapters: { genesis: [2, 2, 0, 51], "3-juan": [1] },
      goal: "365",
      readerTranslation: "rvr1909",
      resume: { bookId: "genesis", chapter: 2 },
      preferences: { readerFont: "sans", readerTheme: "sepia" }
    }
  }, { books });

  assert.equal(result.ok, true);
  assert.deepEqual(result.value.completedChapters, { genesis: [2], "3-juan": [1] });
  assert.deepEqual(result.value.resume, { bookId: "genesis", chapter: 2 });

  assert.equal(validateProgressExport({ appId: "other", schemaVersion: 1, progressId: "123e4567-e89b-42d3-a456-426614174000", payload: {} }, { books }).ok, false);
  assert.equal(validateProgressExport({ appId: PROGRESS_EXPORT_APP_ID, schemaVersion: 1, progressId: "not-a-uuid", payload: {} }, { books }).ok, false);
});

test("merges chapters without losing local progress and is idempotent", () => {
  const current = {
    progressId: "123e4567-e89b-42d3-a456-426614174000",
    completedChapters: { "3-juan": [1] },
    goal: "none",
    readerBookId: "3-juan",
    readerChapter: 1,
    onboardingComplete: false
  };
  const imported = {
    progressId: "223e4567-e89b-42d3-a456-426614174000",
    completedChapters: { "3-juan": [1], genesis: [50] },
    goal: "365",
    readerTranslation: "rvr1909",
    resume: { bookId: "genesis", chapter: 50 },
    preferences: { readerFont: "sans", readerTheme: "sepia" }
  };

  const once = mergeProgressState(current, imported, { books });
  const twice = mergeProgressState(once, imported, { books });
  assert.deepEqual(once.completedChapters, { "3-juan": [1], genesis: [50] });
  assert.deepEqual(twice.completedChapters, once.completedChapters);
  assert.equal(once.progressId, current.progressId);
  assert.equal(once.readerBookId, "genesis");
  assert.equal(once.readerTheme, "sepia");
});

test("adopts imported progress id when local progress is empty", () => {
  const current = { progressId: "123e4567-e89b-42d3-a456-426614174000", completedChapters: {}, goal: "none", readerChapter: null };
  const imported = {
    progressId: "223e4567-e89b-42d3-a456-426614174000",
    completedChapters: { genesis: [1] },
    goal: "none",
    readerTranslation: "pdt",
    resume: null,
    preferences: { readerFont: "serif", readerTheme: "light" }
  };
  assert.equal(mergeProgressState(current, imported, { books }).progressId, imported.progressId);
});
