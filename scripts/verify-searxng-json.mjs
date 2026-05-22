#!/usr/bin/env node

const DEFAULT_QUERY = "SearXNG Search API";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--query") args.query = argv[++index];
    else if (value === "--timeout-ms") args.timeoutMs = Number(argv[++index]);
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/verify-searxng-json.mjs --url <searxng-url> [--query <query>] [--timeout-ms <ms>]",
    "",
    "Example:",
    "  npm run verify:searxng -- --url https://search.example.org"
  ].join("\n");
}

function normalizeEndpoint(rawUrl) {
  if (!rawUrl) throw new Error("Missing --url or SEARXNG_URL.");
  const endpoint = new URL(rawUrl);
  if (!["http:", "https:"].includes(endpoint.protocol)) {
    throw new Error("SearXNG URL must use http or https.");
  }
  if (!endpoint.pathname.endsWith("/")) {
    endpoint.pathname = `${endpoint.pathname}/`;
  }
  return endpoint;
}

function buildSearchUrl(endpoint, query) {
  const searchUrl = new URL("search", endpoint);
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("format", "json");
  return searchUrl;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const endpoint = normalizeEndpoint(args.url || process.env.SEARXNG_URL);
  const query = args.query || DEFAULT_QUERY;
  const timeoutMs = args.timeoutMs || 10000;
  const searchUrl = buildSearchUrl(endpoint, query);

  const response = await fetchWithTimeout(searchUrl, timeoutMs);
  const body = await response.text();

  if (response.status === 403) {
    throw new Error("SearXNG returned 403. Enable JSON output in search.formats and retry.");
  }
  if (!response.ok) {
    throw new Error(`SearXNG returned HTTP ${response.status}.`);
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error("SearXNG did not return valid JSON.");
  }

  if (!Array.isArray(payload.results)) {
    throw new Error("JSON response does not contain a results array.");
  }

  console.log(`verify-searxng-json: ok (${payload.results.length} results, ${endpoint.origin})`);
}

main().catch((error) => {
  console.error(`verify-searxng-json: failed: ${error.message}`);
  process.exitCode = 1;
});
