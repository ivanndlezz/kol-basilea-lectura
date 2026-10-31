import test from "node:test";
import assert from "node:assert/strict";
import { extractYoutubeId, importRegistry, parseMuxCatalog, parseMuxVideo, parseVideoPage } from "../scripts/import-bibleproject-videos.mjs";

const fixture = `<!doctype html>
<html><head>
<meta property="og:title" content="Génesis 1–11">
<meta property="og:description" content="Resumen de Génesis">
<meta property="og:image" content="https://cdn.example/genesis.jpg">
<script type="application/ld+json">{"@type":"VideoObject","name":"Génesis 1–11","embedUrl":"https://www.youtube.com/embed/abcdefghijk","duration":"PT11M24S"}</script>
</head><body><h1>Génesis 1–11</h1></body></html>`;

test("BibleProject importer extracts YouTube metadata", () => {
  assert.equal(extractYoutubeId("https://youtu.be/abcdefghijk"), "abcdefghijk");
  const video = parseVideoPage(fixture, "https://bibleproject.com/es/videos/genesis-1-11/");
  assert.equal(video.youtubeId, "abcdefghijk");
  assert.equal(video.duration, "11:24");
  assert.equal(video.embedUrl, "https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0&modestbranding=1&playsinline=1");
  assert.equal(video.thumbnail, "https://cdn.example/genesis.jpg");
});

test("BibleProject importer ignores pages without an embedded YouTube video", () => {
  assert.equal(parseVideoPage("<html><head><meta property=\"og:title\" content=\"Sin video\"></head></html>", "https://example.com"), null);
});

test("BibleProject importer resolves official Mux catalog links to iframe and thumbnail URLs", () => {
  const catalog = parseMuxCatalog('<a href="https://stream.mux.com/PLAYBACK123/high.mp4?download=genesis-1-11.mp4">Video</a>');
  const video = parseMuxVideo({ key: "genesis-1-11", bookIds: ["genesis"] }, catalog.get("genesis-1-11"), "https://bibleproject.com/es/downloads/");
  assert.equal(video.playbackId, "PLAYBACK123");
  assert.equal(video.embedUrl, "https://player.mux.com/PLAYBACK123");
  assert.equal(video.thumbnailUrl, "https://image.mux.com/PLAYBACK123/thumbnail.jpg");
});

test("BibleProject importer creates ID mappings for shared and split books", async () => {
  const map = { version: 1, catalogUrl: "https://bibleproject.com/es/downloads/", videos: [
    { key: "genesis-1-11", sourcePath: "genesis-1-11", id: "bp-genesis-1-11", bookIds: ["genesis"], order: 1, chapterStart: 1, chapterEnd: 11 },
    { key: "juan-1-3", sourcePath: "1-3-juan", id: "bp-juan123", bookIds: ["1-juan", "2-juan", "3-juan"], order: 1 }
  ] };
  const registry = await importRegistry({ map, existing: { videos: {} }, strict: true, fetchImpl: async url => new Response(fixture, { status: 200 }), onProgress: () => {} });
  assert.deepEqual(registry.videoByBook.genesis, ["bp-genesis-1-11"]);
  assert.deepEqual(registry.videoByBook["2-juan"], ["bp-juan123"]);
  assert.equal(registry.videos["bp-juan123"].bookIds.length, 3);
});

