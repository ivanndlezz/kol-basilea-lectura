#!/usr/bin/env node
/*
 * Resolve one verified, openly licensed image URL per historical story.
 * The script never generates artwork and never assigns a URL without an
 * HTTP 200 response whose content type is an image.
 *
 * Usage:
 *   node scripts/assign-history-cover-urls.mjs --write
 *   node scripts/assign-history-cover-urls.mjs --write --limit 20
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DATA_FILE = path.join(ROOT, "dist/data/history/timeline.json");
const ATTRIBUTIONS_FILE = path.join(ROOT, "dist/data/history/image-attributions.json");
const REPORT_FILE = path.join(ROOT, "reports/history-cover-url-assignment.json");
const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const limitArg = process.argv.find(value => value.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : Infinity;
const USER_AGENT = "KolBasileaLectura/1.0 (open-license image resolver; educational project)";
const APPROVED_MATCHES = new Set(["exact", "related", "period-context"]);
const ALLOWED_LICENSE = /public\s*domain|publicdomain|cc0|cc\s*by(?:-sa)?(?:\s|$)|pd[- ]/i;
const BLOCKED_LICENSE = /non.?commercial|\bcc\s*by-nc|\bcc\s*by-nd|no derivatives|\bnd\b/i;
const CONTEXT = {
  primeval: "Genesis Bible art",
  patriarchs: "Genesis Bible art",
  "exodus-judges": "Exodus Joshua Judges Bible art",
  monarchy: "ancient Israel Judah Bible art",
  "exile-restoration": "Babylonian exile Jerusalem Bible art",
  intertestamental: "intertestamental period Second Temple Jerusalem art",
  "second-temple": "Second Temple Judaism Jerusalem art",
  apostolic: "Jesus apostles early Christianity art",
  patristic: "early Christian church art",
  medieval: "medieval Christianity art",
  modern: "Christian Reformation Bible art"
};
const EXTRA_QUERIES = {
  "exodus-judges": [
    "Moses Exodus Bible painting",
    "Joshua Judges Bible painting",
    "Balaam Bible painting",
    "wilderness Israelites Bible painting"
  ],
  monarchy: [
    "David Saul Solomon Bible painting",
    "Elijah Elisha Bible painting",
    "ancient Israel kings painting",
    "Jerusalem siege Babylon painting",
    "Jonah Nineveh Bible painting"
  ],
  "exile-restoration": [
    "Babylonian exile Bible painting",
    "Daniel Bible painting",
    "Esther Persian court Bible painting",
    "Nehemiah Jerusalem wall painting",
    "Cyrus Persian king Bible painting"
  ]
};
const ALIASES = {
  "llamado-de-abram": ["Abraham leaves Haran", "Abraham journey Canaan"],
  "abram-en-egipto": ["Abraham Sarah Pharaoh Egypt"],
  "abram-y-lot": ["Abraham and Lot", "Abraham rescues Lot"],
  "pacto-con-abraham": ["Covenant Abraham", "Abraham stars"],
  "sodoma-y-gomorra": ["Sodom Gomorrah"],
  "nacimiento-de-isaac": ["Birth of Isaac Sarah Abraham"],
  "sacrificio-de-isaac": ["Binding of Isaac", "Sacrifice of Isaac"],
  "rebeca-e-isaac": ["Isaac Rebecca", "Rebecca at the well"],
  "esau-y-jacob": ["Esau Jacob birthright"],
  "sueno-de-jacob": ["Jacob ladder dream"],
  "jacob-israel": ["Jacob wrestling angel Israel"],
  "jose-vendido": ["Joseph sold by brothers"],
  "jose-en-egipto": ["Joseph Egypt Pharaoh"],
  "jose-y-sus-hermanos": ["Joseph brothers reunion Egypt"],
  "israel-en-egipto": ["Israel family Egypt Jacob Joseph"],
  "relato-pc-001": ["Birth of Moses"],
  "relato-pc-003": ["Moses burning bush"],
  "relato-pc-006": ["Plagues of Egypt Moses"],
  "relato-pc-008": ["Exodus Egypt Moses"],
  "relato-pc-009": ["Crossing Red Sea Moses"],
  "relato-pc-021": ["Fall of Jericho Joshua"],
  "relato-pc-026": ["Deborah Barak Bible"],
  "relato-pc-028": ["Gideon calling Bible"],
  "relato-pc-031": ["Birth of Samson"],
  "relato-pc-032": ["Samson Delilah"],
  "relato-1-samuel-17-1": ["David Goliath"],
  "relato-1-reyes-18-1": ["Elijah Mount Carmel"],
  "relato-1-reyes-8-1": ["Solomon temple dedication", "Dedication of Solomon temple"],
  "relato-2-reyes-5-1": ["Naaman Elisha Jordan", "Naaman healed by Elisha"],
  "relato-2-reyes-25-1": ["Fall of Jerusalem Babylon"],
  "relato-2-reyes-17-1": ["Fall of Samaria", "Siege of Samaria"],
  "relato-2-reyes-19-1": ["Hezekiah Sennacherib", "Hezekiah prays Jerusalem"],
  "relato-2-reyes-22-1": ["Josiah book of the law found", "Finding book of law Josiah"],
  "relato-1-cronicas-22-1": ["David prepares temple", "David temple plans"],
  "relato-2-cronicas-3-1": ["Solomon builds temple", "Temple construction Solomon"],
  "relato-2-cronicas-34-1": ["Josiah reforms temple", "Josiah religious reform"],
  "relato-jonas-1-1": ["Jonah flees Tarshish", "Jonah ship storm"],
  "relato-jonas-2-1": ["Jonah prayer fish", "Jonah in whale prayer"],
  "relato-jonas-3-1": ["Jonah Nineveh repentance", "Nineveh conversion Jonah"],
  "relato-jonas-4-1": ["Jonah gourd plant", "Jonah under the vine"],
  "relato-1-cronicas-13-1": ["David brings ark", "David ark procession"],
  "relato-2-cronicas-29-1": ["Hezekiah temple reform", "Hezekiah purification temple", "Hezekiah restores temple worship"],
  "relato-2-samuel-11-1": ["David Bathsheba", "David and Bathsheba", "David sees Bathsheba"],
  "relato-mateo-1-1": ["Nativity Jesus birth"],
  "relato-mateo-2-1": ["Magi Adoration Christ"],
  "relato-mateo-3-13": ["Baptism of Christ"],
  "relato-mateo-27-32": ["Crucifixion Christ"],
  "relato-mateo-28-1": ["Resurrection Christ"],
  "relato-marcos-1-14": ["Christ preaching Galilee"],
  "relato-lucas-1-26": ["Annunciation Mary"],
  "relato-lucas-2-1": ["Nativity Jesus birth"],
  "relato-lucas-10-25": ["Good Samaritan"],
  "relato-lucas-15-11": ["Prodigal son"],
  "relato-juan-2-1": ["Wedding at Cana"],
  "relato-juan-9-1": ["Healing blind man Christ"],
  "relato-juan-11-1": ["Raising Lazarus"],
  "relato-hechos-2-1": ["Pentecost apostles"],
  "relato-hechos-9-1": ["Conversion Saint Paul"],
  "relato-hechos-17-16": ["Paul Athens Areopagus"]
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const clean = value => String(value ?? "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
const normalize = value => clean(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const tokens = value => new Set(normalize(value).split(/[^a-z0-9]+/).filter(token => token.length >= 4));
const localCover = src => typeof src === "string" && src.startsWith("assets/");
const remoteCover = src => /^https?:\/\//i.test(String(src ?? ""));

async function fetchJson(url, timeoutMs = 10000) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
      });
      if (response.status === 429 && attempt < 2) {
        await sleep(5000 * (attempt + 1));
        continue;
      }
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("HTTP request failed after retries");
}

function licenseAllowed(license, licenseUrl = "") {
  const value = `${license} ${licenseUrl}`;
  return ALLOWED_LICENSE.test(value) && !BLOCKED_LICENSE.test(value);
}

function queryVariants(story) {
  const context = CONTEXT[story.eraId] || "Christian history art";
  const aliases = ALIASES[story.id] || [];
  const title = clean(story.title);
  const reference = clean(story.reference);
  return [...new Set([
    ...aliases,
    `${title} ${context}`,
    `${title} ${reference}`,
    `${title} Christian art`
  ].filter(value => value.trim().length > 3))].slice(0, 4);
}

function scoreCandidate(story, candidate) {
  const target = new Set([...tokens(story.title), ...tokens(ALIASES[story.id]?.join(" ") || "")]);
  // Do not score candidate.query: every result from that query would otherwise
  // inherit the query's words and could look semantically exact by accident.
  const haystack = new Set([...tokens(candidate.title), ...tokens(candidate.description)]);
  const overlap = [...target].filter(token => haystack.has(token)).length;
  const overlapScore = target.size ? overlap / Math.min(target.size, 6) : 0;
  const dimensionScore = Math.min(1, Math.min(candidate.width || 0, candidate.height || 0) / 900);
  const sourceScore = candidate.provider === "Wikimedia Commons" ? 0.08 : candidate.provider === "The Metropolitan Museum of Art" ? 0.07 : 0.05;
  const confidence = Math.min(0.99, 0.42 + overlapScore * 0.42 + dimensionScore * 0.08 + sourceScore);
  const match = confidence >= 0.78 ? "exact" : confidence >= 0.58 ? "related" : "period-context";
  return { ...candidate, confidence: Number(confidence.toFixed(3)), match };
}

async function commonsCandidates(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "50",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size|dimensions",
    iiurlwidth: "960",
    format: "json",
    origin: "*"
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(data.query?.pages || {}).flatMap(page => {
    const info = page.imageinfo?.[0] || {};
    const meta = info.extmetadata || {};
    const license = clean(meta.LicenseShortName?.value || meta.UsageTerms?.value);
    if (!licenseAllowed(license, meta.LicenseUrl?.value)) return [];
    if (!/^image\//i.test(info.mime || "")) return [];
    const url = info.thumburl || info.url;
    if (!url) return [];
    return [{
      provider: "Wikimedia Commons",
      sourceId: `commons:${page.pageid}`,
      title: clean(page.title),
      description: clean(meta.ImageDescription?.value || meta.ObjectDescription?.value),
      imageUrl: url,
      sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/?curid=${page.pageid}`,
      license,
      licenseUrl: clean(meta.LicenseUrl?.value),
      creator: clean(meta.Artist?.value || meta.Credit?.value),
      width: Number(info.width || 0),
      height: Number(info.height || 0),
      query
    }];
  });
}

async function openverseCandidates(query) {
  const params = new URLSearchParams({ q: query, page_size: "20", mature: "false" });
  const data = await fetchJson(`https://api.openverse.org/v1/images/?${params}`);
  return (data.results || []).filter(item => licenseAllowed(item.license, item.license_url)).map(item => ({
    provider: item.provider || "Openverse",
    sourceId: `openverse:${item.id}`,
    title: clean(item.title),
    description: clean([item.tags, item.attribution].flat().join(" ")),
    imageUrl: item.thumbnail || item.url,
    sourceUrl: item.foreign_landing_url || item.detail_url || item.related_url,
    license: clean(item.license),
    licenseUrl: clean(item.license_url),
    creator: clean(item.creator),
    width: Number(item.width || 0),
    height: Number(item.height || 0),
    query
  }));
}

async function metCandidates(query) {
  const params = new URLSearchParams({ q: query, hasImages: "true", isPublicDomain: "true" });
  const search = await fetchJson(`https://collectionapi.metmuseum.org/public/collection/v1/search?${params}`);
  const ids = (search.objectIDs || []).slice(0, 8);
  const results = [];
  for (const id of ids) {
    try {
      const item = await fetchJson(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
      if (!item.isPublicDomain || !item.primaryImageSmall) continue;
      results.push({
        provider: "The Metropolitan Museum of Art",
        sourceId: `met:${item.objectID}`,
        title: clean(item.title),
        description: clean(item.culture || item.medium),
        imageUrl: item.primaryImageSmall,
        sourceUrl: item.objectURL,
        license: "CC0 / Public Domain",
        licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        creator: clean(item.artistDisplayName),
        width: 0,
        height: 0,
        query
      });
    } catch {
      // A single unavailable object must not abort the story.
    }
    await sleep(120);
  }
  return results;
}

function magicIsImage(bytes, contentType) {
  if (/^image\//i.test(contentType)) return true;
  if (!bytes || bytes.length < 4) return false;
  const starts = (values, offset = 0) => values.every((value, index) => bytes[offset + index] === value);
  return starts([0xff, 0xd8, 0xff]) || starts([0x89, 0x50, 0x4e, 0x47]) || starts([0x52, 0x49, 0x46, 0x46]) || starts([0x47, 0x49, 0x46, 0x38]);
}

async function verifyImageUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "image/avif,image/webp,image/jpeg,image/png,image/*" }
    });
    const contentType = response.headers.get("content-type") || "";
    const finalUrl = response.url || url;
    if (response.status !== 200) return { ok: false, status: response.status, finalUrl, contentType, reason: "status" };
    const reader = response.body?.getReader();
    const first = reader ? await reader.read() : { value: new Uint8Array() };
    await reader?.cancel();
    const bytes = first.value ? Uint8Array.from(first.value.slice(0, 16)) : new Uint8Array();
    if (!magicIsImage(bytes, contentType)) return { ok: false, status: response.status, finalUrl, contentType, reason: "not-image" };
    return { ok: true, status: 200, finalUrl, contentType, verifiedAt: new Date().toISOString() };
  } catch (error) {
    return { ok: false, status: null, finalUrl: url, contentType: "", reason: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    clearTimeout(timer);
  }
}

function existingUsedKeys(stories) {
  const used = new Set();
  for (const story of stories) {
    const cover = story.cover || {};
    if (cover.sourceUrl) used.add(`url:${cover.sourceUrl}`);
    if (cover.src && remoteCover(cover.src)) used.add(`image:${cover.src}`);
  }
  return used;
}

async function candidatePool(story) {
  const all = [];
  for (const query of queryVariants(story)) {
    try { all.push(...await commonsCandidates(query)); } catch (error) { console.warn("Commons", story.id, query, error.message); }
    await sleep(180);
    if (all.length >= 20) break;
  }
  if (all.length < 4) {
    for (const query of queryVariants(story).slice(0, 2)) {
      try { all.push(...await openverseCandidates(query)); } catch (error) { console.warn("Openverse", story.id, query, error.message); }
      await sleep(180);
      if (all.length >= 12) break;
    }
  }
  if (all.length < 3) {
    const fallbackQuery = CONTEXT[story.eraId] || "Christian history art";
    try { all.push(...await metCandidates(fallbackQuery)); } catch (error) { console.warn("Met", story.id, error.message); }
  }
  const unique = new Map();
  for (const candidate of all) {
    const key = candidate.sourceId || candidate.imageUrl;
    if (!unique.has(key)) unique.set(key, scoreCandidate(story, candidate));
  }
  return [...unique.values()].sort((a, b) => b.confidence - a.confidence);
}

function rankPool(story, candidates) {
  const unique = new Map();
  for (const candidate of candidates) {
    const key = candidate.sourceId || candidate.imageUrl;
    if (!unique.has(key)) unique.set(key, scoreCandidate(story, candidate));
  }
  return [...unique.values()].sort((a, b) => b.confidence - a.confidence);
}

async function buildSourcePools(stories) {
  const pools = { global: [] };
  const eras = [...new Set(stories
    .filter(story => !localCover(story.cover?.src) || !APPROVED_MATCHES.has(story.cover?.match))
    .map(story => story.eraId)
    .filter(Boolean))];
  for (const eraId of eras) {
    const queries = [
      CONTEXT[eraId] || "Christian history art",
      `${CONTEXT[eraId] || "Christian history"} painting`,
      ...(EXTRA_QUERIES[eraId] || [])
    ];
    const pool = [];
    for (const query of queries) {
      try { pool.push(...await commonsCandidates(query)); } catch (error) { console.warn("Commons pool", eraId, query, error.message); }
      await sleep(1200);
    }
    pools[eraId] = pool;
    console.log(`SOURCE ${eraId} · ${rankPool({ id: eraId, title: eraId }, pool).length} candidates`);
  }
  try { pools.global = await commonsCandidates("Christian art Bible painting"); } catch (error) { console.warn("Commons global pool", error.message); }
  console.log(`SOURCE global · ${pools.global.length} candidates`);
  return pools;
}

async function main() {
  const timeline = JSON.parse(await readFile(DATA_FILE, "utf8"));
  const stories = timeline.stories || [];
  const used = existingUsedKeys(stories);
  const assignments = [];
  const unresolved = [];
  const checkedExisting = [];
  let attempted = 0;
  const sourcePools = await buildSourcePools(stories);

  for (const story of stories) {
    const cover = story.cover || {};
    const keepLocal = localCover(cover.src) && APPROVED_MATCHES.has(cover.match);
    if (keepLocal) continue;
    if (attempted >= limit) { unresolved.push({ id: story.id, reason: "limit" }); continue; }
    attempted++;

    if (remoteCover(cover.src) && APPROVED_MATCHES.has(cover.match)) {
      if (cover.verification?.ok === true && cover.verification?.status === 200) {
        used.add(`url:${cover.sourceUrl || cover.src}`);
        used.add(`image:${cover.verification.finalUrl || cover.src}`);
        continue;
      }
      const verification = await verifyImageUrl(cover.src);
      checkedExisting.push({ id: story.id, url: cover.src, verification });
      if (verification.ok) {
        story.cover = { ...cover, src: verification.finalUrl, verification };
        used.add(`url:${cover.sourceUrl || cover.src}`);
        used.add(`image:${verification.finalUrl}`);
        continue;
      }
    }

    let assigned = null;
    let pool = rankPool(story, [...(sourcePools[story.eraId] || []), ...sourcePools.global]);
    if (pool.length < 4) {
      try { pool = rankPool(story, [...pool, ...await candidatePool(story)]); } catch (error) { console.warn("Fallback search", story.id, error.message); }
    }
    for (const candidate of pool) {
      const key = `source:${candidate.sourceId}`;
      if (used.has(key) || used.has(`url:${candidate.sourceUrl}`) || used.has(`image:${candidate.imageUrl}`)) continue;
      const verification = await verifyImageUrl(candidate.imageUrl);
      if (!verification.ok) continue;
      assigned = { ...candidate, verification, imageUrl: verification.finalUrl };
      used.add(key);
      used.add(`url:${candidate.sourceUrl}`);
      used.add(`image:${verification.finalUrl}`);
      break;
    }
    if (!assigned) {
      try {
        const targetedPool = await candidatePool(story);
        for (const candidate of targetedPool) {
          const key = `source:${candidate.sourceId}`;
          if (used.has(key) || used.has(`url:${candidate.sourceUrl}`) || used.has(`image:${candidate.imageUrl}`)) continue;
          const verification = await verifyImageUrl(candidate.imageUrl);
          if (!verification.ok) continue;
          assigned = { ...candidate, verification, imageUrl: verification.finalUrl };
          used.add(key);
          used.add(`url:${candidate.sourceUrl}`);
          used.add(`image:${verification.finalUrl}`);
          break;
        }
      } catch (error) {
        console.warn("Targeted search", story.id, error.message);
      }
    }
    if (!assigned) {
      unresolved.push({ id: story.id, title: story.title, reason: "no-verified-unique-image", candidates: pool.length });
      continue;
    }
    assignments.push({ storyId: story.id, title: story.title, ...assigned });
    console.log(`OK ${story.id} · ${assigned.match} · ${assigned.provider} · ${assigned.verification.status}`);
    await sleep(180);
  }

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    mode: shouldWrite ? "write" : "dry-run",
    totals: { stories: stories.length, attempted, assigned: assignments.length, unresolved: unresolved.length, checkedExisting: checkedExisting.length },
    assignments,
    checkedExisting,
    unresolved
  };
  await mkdir(path.dirname(REPORT_FILE), { recursive: true });
  await writeFile(REPORT_FILE, JSON.stringify(report, null, 2) + "\n");

  if (shouldWrite) {
    const byId = new Map(assignments.map(item => [item.storyId, item]));
    for (const story of stories) {
      const item = byId.get(story.id);
      if (!item) continue;
      story.cover = {
        src: item.imageUrl,
        alt: `Obra de arte relacionada con ${story.title}`,
        source: item.provider,
        sourceUrl: item.sourceUrl,
        license: item.license,
        licenseUrl: item.licenseUrl,
        artist: item.creator,
        match: item.match,
        confidence: item.confidence,
        reviewStatus: "auto-assigned",
        verification: item.verification
      };
    }
    await writeFile(DATA_FILE, JSON.stringify(timeline, null, 2) + "\n");

    const attributions = ATTRIBUTIONS_FILE ? JSON.parse(await readFile(ATTRIBUTIONS_FILE, "utf8").catch(() => '{"schemaVersion":1,"items":[]}')) : { schemaVersion: 1, items: [] };
    const attributionByStory = new Map((attributions.items || []).map(item => [item.storyId, item]));
    for (const item of assignments) attributionByStory.set(item.storyId, {
      storyId: item.storyId,
      source: item.provider,
      artist: item.creator || "Autor no identificado",
      title: item.title,
      license: item.license,
      licenseUrl: item.licenseUrl,
      sourceUrl: item.sourceUrl,
      imageUrl: item.imageUrl,
      note: "Imagen de fuente abierta; la relación con el relato es editorial y se clasifica en el campo match."
    });
    await mkdir(path.dirname(ATTRIBUTIONS_FILE), { recursive: true });
    await writeFile(ATTRIBUTIONS_FILE, JSON.stringify({ ...attributions, items: [...attributionByStory.values()].sort((a, b) => a.storyId.localeCompare(b.storyId)) }, null, 2) + "\n");

    const coverageStories = timeline.stories || [];
    const local = coverageStories.filter(story => localCover(story.cover?.src)).length;
    const remote = coverageStories.filter(story => remoteCover(story.cover?.src));
    report.coverage = {
      stories: coverageStories.length,
      withCoverSrc: coverageStories.filter(story => Boolean(story.cover?.src)).length,
      local,
      remote: remote.length,
      remoteVerifiedHttp200: remote.filter(story => story.cover?.verification?.ok === true && story.cover?.verification?.status === 200).length,
      unresolved: coverageStories.filter(story => !story.cover?.src).length
    };
    await writeFile(REPORT_FILE, JSON.stringify(report, null, 2) + "\n");
  }

  console.log(JSON.stringify(report.totals));
  if (unresolved.length) process.exitCode = 2;
}

await main();
