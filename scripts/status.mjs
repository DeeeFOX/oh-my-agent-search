#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { serverName: "searxng" };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--server-name") args.serverName = argv[++index];
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/status.mjs [--url <searxng-url>] [--server-name searxng]",
    "",
    "Examples:",
    "  npm run status",
    "  npm run status -- --url http://127.0.0.1:8080"
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

function checkCommand(command, args, label) {
  const result = run(command, args);
  if (result.error) {
    print("WARN", `${label} not available`);
    return true;
  }
  if (result.status === 0) {
    const output = `${result.stdout}${result.stderr}`.trim().split("\n")[0];
    print("PASS", output || `${label} succeeded`);
    return true;
  }
  print("WARN", `${label} returned a non-zero status`);
  return true;
}

function checkMcp(serverName) {
  const result = run("claude", ["mcp", "get", serverName]);
  if (result.error) {
    print("WARN", "Claude Code CLI not available");
    return true;
  }
  const output = `${result.stdout}${result.stderr}`;
  if (result.status !== 0) {
    print("FAIL", `Claude Code MCP server '${serverName}' was not found or did not connect`);
    return false;
  }

  const scope = output.match(/Scope:\s*(.+)/)?.[1]?.trim();
  const status = output.match(/Status:\s*(.+)/)?.[1]?.trim();
  if (status && /failed|error|not connected|\u2717/i.test(status)) {
    print("FAIL", `Claude MCP '${serverName}' ${status}${scope ? ` (${scope})` : ""}`);
    return false;
  }
  if (status && /connected|\u2713/i.test(status)) {
    print("PASS", `Claude MCP '${serverName}' ${status}${scope ? ` (${scope})` : ""}`);
    return true;
  }

  print("WARN", `Claude MCP '${serverName}' is configured but status was unclear${scope ? ` (${scope})` : ""}`);
  return true;
}

function checkEndpoint(url) {
  if (!url) {
    print("WARN", "No SearXNG URL provided; skip endpoint checks");
    return true;
  }

  const script = join(here, "verify-searxng-json.mjs");
  const json = spawnSync(process.execPath, [script, "--url", url, "--min-results", "0", "--timeout-ms", "30000"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (json.status === 0) {
    print("PASS", `JSON check: ${json.stdout.trim()}`);
  } else {
    print("FAIL", `JSON check failed: ${(json.stderr || json.stdout).trim()}`);
    return false;
  }

  const search = spawnSync(process.execPath, [script, "--url", url, "--min-results", "1", "--timeout-ms", "30000", "--retries", "2"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (search.status === 0) {
    print("PASS", `Search check: ${search.stdout.trim()}`);
    return true;
  }

  print("FAIL", `Search check failed: ${(search.stderr || search.stdout).trim()}`);
  return false;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const checks = [
    checkCommand("node", ["--version"], "Node.js"),
    checkCommand("claude", ["--version"], "Claude Code CLI"),
    checkCommand("docker", ["--version"], "Docker-compatible CLI"),
    checkMcp(args.serverName),
    checkEndpoint(args.url || process.env.SEARXNG_URL)
  ];

  console.log("");
  console.log("Lifecycle note: search works when both Claude MCP config exists and the SearXNG endpoint is reachable.");
  console.log("Scope note: local scope is project-specific; user scope is available across the user's projects; project scope is shared and should be reviewed.");
  console.log("Current Claude Code sessions may need /mcp or a restart to refresh visible tools.");

  if (checks.includes(false)) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(`status: failed: ${error.message}`);
  process.exitCode = 1;
}
