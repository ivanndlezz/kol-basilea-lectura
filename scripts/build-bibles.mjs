import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const workDir = await mkdtemp(path.join(tmpdir(), "kol-basilea-bibles-"));
const sourceRoot = path.join(workDir, "sources");

const translations = [
  ["rvr1909", "spaRV1909"],
  ["pdt", "spapddpt"],
  ["onbv", "spaonbv"],
  ["bes", "spabes"]
];

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`No se pudo descargar ${url}: ${response.status}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

try {
  await mkdir(sourceRoot, { recursive: true });
  for (const [id, archive] of translations) {
    const zipPath = path.join(workDir, `${id}.zip`);
    const sourceDir = path.join(sourceRoot, id);
    const outputDir = path.join(root, "dist", "data", id);
    console.log(`Descargando y generando ${id}…`);
    await download(`https://ebible.org/Scriptures/${archive}_usfm.zip`, zipPath);
    await mkdir(sourceDir, { recursive: true });
    await execFile("unzip", ["-q", zipPath, "-d", sourceDir]);
    await execFile(process.execPath, [path.join(root, "scripts", "convert-usfm.mjs"), sourceDir, outputDir, id, "eBible.org"], { cwd: root });
  }
  console.log("Biblias generadas y listas en dist/data/.");
} finally {
  await rm(workDir, { recursive: true, force: true });
}
