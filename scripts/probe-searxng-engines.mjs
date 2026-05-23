#!/usr/bin/env node

const DEFAULT_ENGINES = ["bing", "yandex", "google", "baidu"];
const MANAGED_ENGINES = new Set(DEFAULT_ENGINES);
const DEFAULT_MIN_RESULTS = 1;
const DEFAULT_QUERY = "SearXNG Search API official documentation";
const DEFAULT_TIMEOUT_MS = 15000;
const TOOL_NAME = "probe-searxng-engines";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--engines") args.engines = parseEngineList(argv[++index]);
    else if (value === "--query") args.query = argv[++index];
    else if (value === "--min-results") args.minResults = Number(argv[++index]);
    else if (value === "--timeout-ms") args.timeoutMs = Number(argv[++index]);
    else if (value === "--json") args.json = true;
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/probe-searxng-engines.mjs --url <searxng-url> [--engines bing,yandex,google,baidu] [--json]",
    "",
    "Probes candidate engines through SearXNG JSON search and reports which engines return enough results.",
    "",
    "Examples:",
    "  npm run probe:engines -- --url http://127.0.0.1:8080",
    "  npm --silent run probe:engines -- --url \"$SEARXNG_URL\" --json"
  ].join("\n");
}

function parseEngineList(value) {
  if (!value) return [];
  return value.split(",").map((engine) => engine.trim()).filter(Boolean);
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

function validateNumber(value, name, minimum) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${name} must be an integer >= ${minimum}.`);
  }
}

function buildSearchUrl(endpoint, query, engine) {
  const searchUrl = new URL("search", endpoint);
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("engines", engine);
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
      throw new Error(`timed out after ${timeoutMs}ms`);
    }
    throw new Error(error.message);
  } finally {
    clearTimeout(timeout);
  }
}

async function probeEngine(endpoint, query, engine, minResults, timeoutMs) {
  const searchUrl = buildSearchUrl(endpoint, query, engine);
  try {
    const response = await fetchWithTimeout(searchUrl, timeoutMs);
    const body = await response.text();
    if (response.status === 403) {
      return { engine, ok: false, results: 0, status: response.status, error: "JSON output is disabled or forbidden" };
    }
    if (!response.ok) {
      return { engine, ok: false, results: 0, status: response.status, error: `HTTP ${response.status}` };
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return { engine, ok: false, results: 0, status: response.status, error: "invalid JSON" };
    }

    const results = Array.isArray(payload.results) ? payload.results.length : 0;
    return {
      engine,
      ok: results >= minResults,
      results,
      status: response.status,
      error: results >= minResults ? null : `expected at least ${minResults} result(s)`
    };
  } catch (error) {
    return { engine, ok: false, results: 0, status: null, error: error.message };
  }
}

function printHuman(results) {
  console.log("probe-searxng-engines:");
  for (const result of results) {
    const label = result.ok ? "PASS" : "FAIL";
    const detail = result.ok ? `${result.results} result(s)` : result.error;
    console.log(`  ${label}: ${result.engine} (${detail})`);
  }

  const passing = results.filter((result) => result.ok).map((result) => result.engine);
  console.log("");
  if (passing.length === 0) {
    console.log("No candidate engine passed. Check endpoint reachability, engine configuration, timeout, or regional availability.");
    return;
  }

  console.log(`Passing engines: ${passing.join(",")}`);
  console.log("After reviewing the result, enable all passing engines:");
  console.log(`  npm run setup:searxng -- --engines ${passing.join(",")} --apply --force --start`);
}

async function main(args) {
  if (args.help) {
    console.log(usage());
    return;
  }

  const endpoint = normalizeEndpoint(args.url || process.env.SEARXNG_URL);
  const engines = args.engines?.length ? args.engines : DEFAULT_ENGINES;
  const query = args.query || DEFAULT_QUERY;
  const minResults = args.minResults ?? DEFAULT_MIN_RESULTS;
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  validateNumber(minResults, "--min-results", 0);
  validateNumber(timeoutMs, "--timeout-ms", 1);
  if (engines.length === 0) {
    throw new Error("--engines must include at least one engine.");
  }
  for (const engine of engines) {
    if (!MANAGED_ENGINES.has(engine)) {
      throw new Error(`Unknown engine: ${engine}. Available engines: ${DEFAULT_ENGINES.join(", ")}`);
    }
  }

  const results = [];
  for (const engine of engines) {
    results.push(await probeEngine(endpoint, query, engine, minResults, timeoutMs));
  }

  const passingEngines = results.filter((result) => result.ok).map((result) => result.engine);
  const payload = {
    ok: passingEngines.length > 0,
    tool: TOOL_NAME,
    origin: endpoint.origin,
    query,
    minResults,
    engines,
    passingEngines,
    results
  };

  if (args.json) {
    console.log(JSON.stringify(payload));
  } else {
    printHuman(results);
  }

  if (passingEngines.length === 0) {
    process.exitCode = 1;
  }
}

let parsedArgs = { json: process.argv.slice(2).includes("--json") };

try {
  parsedArgs = parseArgs(process.argv.slice(2));
  if (parsedArgs.help) {
    console.log(usage());
  } else {
    await main(parsedArgs);
  }
} catch (error) {
  if (parsedArgs?.json) {
    console.log(JSON.stringify({
      ok: false,
      tool: TOOL_NAME,
      error: error.message
    }));
  } else {
    console.error(`probe-searxng-engines: failed: ${error.message}`);
  }
  process.exitCode = 1;
}
