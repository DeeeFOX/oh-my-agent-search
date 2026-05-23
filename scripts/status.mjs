#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const TOOL_NAME = "status";

function parseArgs(argv) {
  const args = { serverName: "searxng" };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--server-name") args.serverName = argv[++index];
    else if (value === "--json") args.json = true;
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/status.mjs [--url <searxng-url>] [--server-name searxng] [--json]",
    "",
    "Examples:",
    "  npm run status",
    "  npm run status -- --url http://127.0.0.1:8080",
    "  npm --silent run status -- --url http://127.0.0.1:8080 --json"
  ].join("\n");
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function print(kind, message) {
  console.log(`${kind}: ${message}`);
}

function parseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function checkCommand(command, args, label, json) {
  const result = run(command, args);
  if (result.error) {
    const entry = { name: label, level: "warn", ok: true, message: `${label} not available` };
    if (!json) print("WARN", entry.message);
    return entry;
  }
  if (result.status === 0) {
    const output = `${result.stdout}${result.stderr}`.trim().split("\n")[0];
    const entry = { name: label, level: "pass", ok: true, message: output || `${label} succeeded` };
    if (!json) print("PASS", entry.message);
    return entry;
  }
  const entry = { name: label, level: "warn", ok: true, message: `${label} returned a non-zero status` };
  if (!json) print("WARN", entry.message);
  return entry;
}

function checkMcp(serverName, json) {
  const result = run("claude", ["mcp", "get", serverName]);
  if (result.error) {
    const entry = { name: "Claude MCP", level: "warn", ok: true, message: "Claude Code CLI not available" };
    if (!json) print("WARN", entry.message);
    return entry;
  }
  const output = `${result.stdout}${result.stderr}`;
  if (result.status !== 0) {
    const entry = {
      name: "Claude MCP",
      level: "fail",
      ok: false,
      message: `Claude Code MCP server '${serverName}' was not found or did not connect`
    };
    if (!json) print("FAIL", entry.message);
    return entry;
  }

  const scope = output.match(/Scope:\s*(.+)/)?.[1]?.trim();
  const status = output.match(/Status:\s*(.+)/)?.[1]?.trim();
  if (status && /failed|error|not connected|\u2717/i.test(status)) {
    const entry = {
      name: "Claude MCP",
      level: "fail",
      ok: false,
      message: `Claude MCP '${serverName}' ${status}${scope ? ` (${scope})` : ""}`
    };
    if (!json) print("FAIL", entry.message);
    return entry;
  }
  if (status && /connected|\u2713/i.test(status)) {
    const entry = {
      name: "Claude MCP",
      level: "pass",
      ok: true,
      message: `Claude MCP '${serverName}' ${status}${scope ? ` (${scope})` : ""}`,
      scope
    };
    if (!json) print("PASS", entry.message);
    return entry;
  }

  const entry = {
    name: "Claude MCP",
    level: "warn",
    ok: true,
    message: `Claude MCP '${serverName}' is configured but status was unclear${scope ? ` (${scope})` : ""}`,
    scope
  };
  if (!json) print("WARN", entry.message);
  return entry;
}

function checkEndpoint(url, json) {
  if (!url) {
    const entry = { name: "SearXNG endpoint", level: "warn", ok: true, message: "No SearXNG URL provided; skip endpoint checks" };
    if (!json) print("WARN", entry.message);
    return entry;
  }

  const script = join(here, "verify-searxng-json.mjs");
  const jsonResult = spawnSync(process.execPath, json ? [script, "--url", url, "--min-results", "0", "--timeout-ms", "30000", "--json"] : [script, "--url", url, "--min-results", "0", "--timeout-ms", "30000"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (jsonResult.status === 0) {
    const payload = json ? parseJson(jsonResult.stdout.trim()) : null;
    if (json && !payload) {
      return {
        name: "SearXNG JSON",
        level: "fail",
        ok: false,
        message: "SearXNG JSON check did not return parseable JSON output"
      };
    }
    const message = payload?.ok ? "SearXNG JSON check passed" : `JSON check: ${jsonResult.stdout.trim()}`;
    const entry = {
      name: "SearXNG JSON",
      level: payload?.ok === false ? "fail" : "pass",
      ok: payload?.ok !== false,
      message,
      results: payload?.results
    };
    if (!json) print("PASS", `JSON check: ${jsonResult.stdout.trim()}`);
    return entry;
  }

  const failurePayload = json ? parseJson(jsonResult.stdout.trim()) : null;
  if (!json) {
    print("FAIL", `JSON check failed: ${(jsonResult.stderr || jsonResult.stdout).trim()}`);
  }
  return {
    name: "SearXNG JSON",
    level: "fail",
    ok: false,
    message: failurePayload?.error || `JSON check failed: ${(jsonResult.stderr || jsonResult.stdout).trim()}`
  };
}

function checkSearch(url, json) {
  const script = join(here, "verify-searxng-json.mjs");
  const search = spawnSync(process.execPath, json ? [script, "--url", url, "--min-results", "1", "--timeout-ms", "30000", "--retries", "2", "--json"] : [script, "--url", url, "--min-results", "1", "--timeout-ms", "30000", "--retries", "2"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (search.status === 0) {
    const payload = json ? parseJson(search.stdout.trim()) : null;
    if (json && !payload) {
      return {
        name: "SearXNG search",
        level: "fail",
        ok: false,
        message: "SearXNG search check did not return parseable JSON output"
      };
    }
    const entry = {
      name: "SearXNG search",
      level: payload?.ok === false ? "fail" : "pass",
      ok: payload?.ok !== false,
      message: payload?.ok ? "SearXNG search check passed" : `Search check: ${search.stdout.trim()}`,
      results: payload?.results
    };
    if (!json) print("PASS", `Search check: ${search.stdout.trim()}`);
    return entry;
  }

  const failurePayload = json ? parseJson(search.stdout.trim()) : null;
  if (!json) {
    print("FAIL", `Search check failed: ${(search.stderr || search.stdout).trim()}`);
  }
  return {
    name: "SearXNG search",
    level: "fail",
    ok: false,
    message: failurePayload?.error || `Search check failed: ${(search.stderr || search.stdout).trim()}`
  };
}

function main(args) {
  if (args.help) {
    console.log(usage());
    return;
  }

  const endpointUrl = args.url || process.env.SEARXNG_URL;
  const checks = [
    checkCommand("node", ["--version"], "Node.js", args.json),
    checkCommand("claude", ["--version"], "Claude Code CLI", args.json),
    checkCommand("docker", ["--version"], "Docker-compatible CLI", args.json),
    checkMcp(args.serverName, args.json),
    checkEndpoint(endpointUrl, args.json),
    ...(endpointUrl ? [checkSearch(endpointUrl, args.json)] : [])
  ];

  const notes = [
    "Lifecycle note: search works when both Claude MCP config exists and the SearXNG endpoint is reachable.",
    "Scope note: local scope is project-specific; user scope is available across the user's projects; project scope is shared and should be reviewed.",
    "Current Claude Code sessions may need /mcp or a restart to refresh visible tools."
  ];

  if (args.json) {
    const ok = !checks.some((check) => check.level === "fail");
    console.log(JSON.stringify({
      ok,
      tool: TOOL_NAME,
      serverName: args.serverName,
      url: endpointUrl || null,
      checks,
      notes
    }));
    if (!ok) {
      process.exitCode = 1;
    }
    return;
  }

  console.log("");
  for (const note of notes) {
    console.log(note);
  }

  if (checks.some((check) => check.level === "fail")) {
    process.exitCode = 1;
  }
}

let parsedArgs = { json: process.argv.slice(2).includes("--json") };

try {
  parsedArgs = parseArgs(process.argv.slice(2));
  if (parsedArgs.help) {
    console.log(usage());
  } else {
    main(parsedArgs);
  }
} catch (error) {
  if (parsedArgs?.json) {
    console.log(JSON.stringify({
      ok: false,
      tool: TOOL_NAME,
      error: error.message
    }));
  } else {
    console.error(`status: failed: ${error.message}`);
  }
  process.exitCode = 1;
}
