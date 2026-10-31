import { readFile } from "node:fs/promises";

const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.protocol !== "file:") return nativeFetch(input, init);
  try {
    const body = await readFile(url, "utf8");
    return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
  } catch {
    return new Response("", { status: 404 });
  }
};
