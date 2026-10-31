import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mapPath = resolve(repoRoot, "scripts/data/bibleproject-video-map.json");
const registryPath = resolve(repoRoot, "dist/data/media/videos.json");

const REQUEST_HEADERS = {
  "user-agent": "Kol Basilea Lectura data importer (+https://github.com/ivanndlezz/kol-basilea-lectura)",
  accept: "text/html,application/xhtml+xml"
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

export function extractAttribute(tag, name) {
  const match = tag.match(new RegExp("\\s" + name + "\\s*=\\s*[\\\"']([^\\\"']+)[\\\"']", "i"));
  return match?.[1]?.trim() || null;
}

export function extractMeta(html, names) {
  const wanted = new Set(names.map(name => name.toLowerCase()));
  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const name = extractAttribute(tag[0], "property") || extractAttribute(tag[0], "name");
    if (name && wanted.has(name.toLowerCase())) return extractAttribute(tag[0], "content");
  }
  return null;
}

export function extractYoutubeId(value) {
  if (!value) return null;
  const match = String(value).match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?(?:[^#]*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  return match?.[1] || null;
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function stripTags(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function durationLabel(duration) {
  if (!duration) return null;
  if (/^\d+:\d{2}(?::\d{2})?$/.test(duration)) return duration;
  const match = String(duration).match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (!match) return null;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const total = hours * 3600 + minutes * 60 + seconds;
  if (!total) return null;
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return hh ? `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${mm}:${String(ss).padStart(2, "0")}`;
}

function jsonLdValues(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(match => {
      try {
        const value = JSON.parse(match[1].trim());
        return Array.isArray(value) ? value : [value];
      } catch {
        return [];
      }
    });
}

export function parseVideoPage(html, pageUrl) {
  const jsonLd = jsonLdValues(html);
  const videoObject = jsonLd.find(value => value && (value["@type"] === "VideoObject" || value.video));
  const candidateUrls = [
    pageUrl,
    extractMeta(html, ["og:video", "og:video:url", "og:video:secure_url"]),
    videoObject?.embedUrl,
    videoObject?.contentUrl,
    html.match(/https?:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)\/[^"'\\s<]+/i)?.[0]
  ];
  const youtubeId = candidateUrls.map(extractYoutubeId).find(Boolean) || null;
  if (!youtubeId) return null;
  const title = extractMeta(html, ["og:title", "twitter:title"]) ||
    videoObject?.name ||
    stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") ||
    "Video de Proyecto Biblia";
  const description = extractMeta(html, ["og:description", "description", "twitter:description"]) ||
    videoObject?.description || "Resumen animado del libro bíblico.";
  const thumbnailUrl = extractMeta(html, ["og:image", "twitter:image"]) ||
    videoObject?.thumbnailUrl || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  const duration = durationLabel(videoObject?.duration) ||
    durationLabel(html.match(/\b(?:\d{1,2}:)?\d{1,2}:\d{2}\b/)?.[0]);
  return {
    title: stripTags(title),
    description: stripTags(description),
    duration: duration || "Video",
    youtubeId,
    youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`,
    thumbnailUrl,
    thumbnail: thumbnailUrl,
    pageUrl
  };
}

async function fetchPage(url) {
  const response = await fetch(url, { headers: REQUEST_HEADERS, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function candidateUrls(entry) {
  const paths = [...new Set([entry.sourcePath, ...(entry.sourcePaths || [])])];
  return paths.flatMap(path => [
    `https://bibleproject.com/es/videos/${path}/`,
    `https://bibleproject.com/es/guides/libro-de-${path}/`
  ]);
}

function normalizedRecord(entry, parsed, existing) {
  const record = {
    ...(existing || {}),
    ...(parsed || {}),
    provider: "bibleproject",
    language: "es",
    kind: entry.chapterStart ? "book-overview-part" : "book-overview",
    sourceKey: entry.key,
    bookIds: entry.bookIds,
    order: entry.order
  };
  if (entry.chapterStart != null) {
    record.chapterStart = entry.chapterStart;
    record.chapterEnd = entry.chapterEnd;
  } else {
    delete record.chapterStart;
    delete record.chapterEnd;
  }
  if (!record.embedUrl && record.youtubeId) record.embedUrl = `https://www.youtube-nocookie.com/embed/${record.youtubeId}?rel=0&modestbranding=1&playsinline=1`;
  if (!record.thumbnailUrl && record.thumbnail) record.thumbnailUrl = record.thumbnail;
  if (!record.thumbnail && record.thumbnailUrl) record.thumbnail = record.thumbnailUrl;
  return record;
}

export async function importRegistry({ map, existing, strict = false, fetchImpl = fetch, onProgress = () => {} }) {
  const videos = {};
  const unresolved = [];
  for (const entry of map.videos) {
    const previous = existing.videos?.[entry.id];
    let parsed = null;
    let resolvedUrl = null;
    let lastError = null;
    for (const url of candidateUrls(entry)) {
      try {
        const response = await fetchImpl(url, { headers: REQUEST_HEADERS, signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        parsed = parseVideoPage(await response.text(), url);
        if (parsed) { resolvedUrl = url; break; }
        lastError = new Error("No se encontró un video de YouTube en la página");
      } catch (error) {
        lastError = error;
      }
    }
    if (!parsed && !previous?.youtubeId) {
      unresolved.push({ key: entry.key, urls: candidateUrls(entry), error: lastError?.message || "Sin metadatos" });
      onProgress({ entry, status: "unresolved" });
      continue;
    }
    const record = normalizedRecord(entry, parsed, previous);
    if (resolvedUrl) record.pageUrl = resolvedUrl;
    videos[entry.id] = record;
    onProgress({ entry, status: parsed ? "imported" : "preserved" });
  }
  if (strict && unresolved.length) {
    const summary = unresolved.map(item => `${item.key}: ${item.error}`).join("; ");
    throw new Error(`No fue posible resolver ${unresolved.length} videos: ${summary}`);
  }
  const mappedBookIds = [...new Set(map.videos.flatMap(entry => entry.bookIds))];
  const videoByBook = Object.fromEntries(mappedBookIds.map(bookId => [
    bookId,
    map.videos.filter(entry => entry.bookIds.includes(bookId) && videos[entry.id]).sort((a, b) => a.order - b.order || (a.chapterStart || 0) - (b.chapterStart || 0)).map(entry => entry.id)
  ]).filter(([, ids]) => ids.length));
  return {
    version: 2,
    source: { provider: "bibleproject", language: "es", catalogUrl: map.catalogUrl, mapVersion: map.version },
    videos,
    videoByBook,
    unresolved
  };
}

async function main() {
  if (process.argv.includes("--help")) {
    console.log("Usage: node scripts/import-bibleproject-videos.mjs [--strict] [--report PATH]");
    return;
  }
  const map = JSON.parse(await readFile(mapPath, "utf8"));
  const existing = JSON.parse(await readFile(registryPath, "utf8"));
  const strict = process.argv.includes("--strict");
  let reportPath = null;
  const reportIndex = process.argv.indexOf("--report");
  if (reportIndex >= 0) reportPath = process.argv[reportIndex + 1];
  const registry = await importRegistry({
    map,
    existing,
    strict,
    onProgress: ({ entry, status }) => console.log(`${status}: ${entry.key}`)
  });
  await writeFile(registryPath, JSON.stringify(registry, null, 2) + "\n");
  if (reportPath) await writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), unresolved: registry.unresolved }, null, 2) + "\n");
  console.log(`Imported ${Object.keys(registry.videos).length} videos; unresolved: ${registry.unresolved.length}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

