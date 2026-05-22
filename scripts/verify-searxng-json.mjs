#!/usr/bin/env node

const DEFAULT_QUERY = "Python programming";
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_MIN_RESULTS = 1;
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY_MS = 3000;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--query") args.query = argv[++index];
    else if (value === "--min-results") args.minResults = Number(argv[++index]);
    else if (value === "--retries") args.retries = Number(argv[++index]);
    else if (value === "--retry-delay-ms") args.retryDelayMs = Number(argv[++index]);
    else if (value === "--timeout-ms") args.timeoutMs = Number(argv[++index]);
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/verify-searxng-json.mjs --url <searxng-url> [--query <query>] [--min-results <n>] [--timeout-ms <ms>] [--retries <n>]",
    "",
    "Examples:",
    "  npm run verify:searxng -- --url https://search.example.org",
    "  npm run verify:searxng -- --url https://search.example.org --min-results 0",
    "  npm run verify:searxng -- --url https://search.example.org --min-results 1 --retries 2"
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
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Timed out after ${timeoutMs}ms while waiting for SearXNG.`);
    }
    throw new Error(`Could not reach SearXNG endpoint: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

function validateNumber(value, name, minimum) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${name} must be an integer >= ${minimum}.`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSearchPayload(searchUrl, timeoutMs) {
  const response = await fetchWithTimeout(searchUrl, timeoutMs);
  const body = await response.text();

  if (response.status === 403) {
    throw new Error("SearXNG returned 403. Enable JSON output in search.formats and retry.");
  }
  if (!response.ok) {
    throw new Error(`SearXNG returned HTTP ${response.status}.`);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("SearXNG did not return valid JSON.");
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
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const minResults = args.minResults ?? DEFAULT_MIN_RESULTS;
  const retries = args.retries ?? DEFAULT_RETRIES;
  const retryDelayMs = args.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  validateNumber(timeoutMs, "--timeout-ms", 1);
  validateNumber(minResults, "--min-results", 0);
  validateNumber(retries, "--retries", 0);
  validateNumber(retryDelayMs, "--retry-delay-ms", 0);

  const searchUrl = buildSearchUrl(endpoint, query);

  let payload;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      payload = await fetchSearchPayload(searchUrl, timeoutMs);
      if (Array.isArray(payload.results) && payload.results.length >= minResults) break;
      lastError = new Error(`SearXNG returned ${Array.isArray(payload.results) ? payload.results.length : "no"} results; expected at least ${minResults}.`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < retries) await sleep(retryDelayMs);
  }

  if (!payload) {
    throw lastError;
  }
  if (!Array.isArray(payload.results)) {
    throw new Error("JSON response does not contain a results array.");
  }
  if (payload.results.length < minResults) {
    throw new Error(`${lastError.message} Use a search engine profile that works in your region, increase timeout, or retry later.`);
  }

  console.log(`verify-searxng-json: ok (${payload.results.length} results, ${endpoint.origin})`);
}

main().catch((error) => {
  console.error(`verify-searxng-json: failed: ${error.message}`);
  process.exitCode = 1;
});
