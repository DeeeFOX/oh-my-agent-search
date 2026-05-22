#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PACKAGE = "mcp-searxng";
const DEFAULT_SERVER_NAME = "searxng";
const VALID_SCOPES = new Set(["local", "user", "project"]);
const here = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {
    apply: false,
    packageName: DEFAULT_PACKAGE,
    scope: "local",
    serverName: DEFAULT_SERVER_NAME
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--scope") args.scope = argv[++index];
    else if (value === "--server-name") args.serverName = argv[++index];
    else if (value === "--package") args.packageName = argv[++index];
    else if (value === "--apply") args.apply = true;
    else if (value === "--allow-project-scope") args.allowProjectScope = true;
    else if (value === "--check-first") args.checkFirst = true;
    else if (value === "--retries") args.retries = argv[++index];
    else if (value === "--retry-delay-ms") args.retryDelayMs = argv[++index];
    else if (value === "--timeout-ms") args.timeoutMs = argv[++index];
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }

  return args;
}

function usage() {
  return [
    "Usage: node scripts/install-claude-code.mjs --url <searxng-url> [--scope local|user|project] [--check-first] [--apply]",
    "",
    "Dry-run is the default. Add --apply to run claude mcp add.",
    "",
    "Examples:",
    "  npm run install:claude-code -- --url https://search.example.org",
    "  npm run install:claude-code -- --url https://search.example.org --check-first",
    "  npm run install:claude-code -- --url https://search.example.org --apply"
  ].join("\n");
}

function validateArgs(args) {
  if (!args.url) throw new Error("Missing --url.");
  const endpoint = new URL(args.url);
  if (!["http:", "https:"].includes(endpoint.protocol)) {
    throw new Error("SearXNG URL must use http or https.");
  }
  if (!VALID_SCOPES.has(args.scope)) {
    throw new Error(`Invalid scope: ${args.scope}`);
  }
  if (args.scope === "project" && !args.allowProjectScope) {
    throw new Error("Project scope can commit shared MCP configuration. Re-run with --allow-project-scope after review.");
  }
}

function buildClaudeArgs(args) {
  return [
    "mcp",
    "add",
    "-s",
    args.scope,
    "-e",
    `SEARXNG_URL=${args.url}`,
    "-t",
    "stdio",
    args.serverName,
    "--",
    "npx",
    "-y",
    args.packageName
  ];
}

function formatCommand(command, args) {
  return [command, ...args.map((arg) => (arg.includes(" ") ? JSON.stringify(arg) : arg))].join(" ");
}

function runPrecheck(args) {
  const script = join(here, "verify-searxng-json.mjs");
  const verifyArgs = [script, "--url", args.url];
  if (args.timeoutMs) verifyArgs.push("--timeout-ms", args.timeoutMs);
  if (args.retries) verifyArgs.push("--retries", args.retries);
  if (args.retryDelayMs) verifyArgs.push("--retry-delay-ms", args.retryDelayMs);

  const result = spawnSync(process.execPath, verifyArgs, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error("SearXNG JSON precheck failed. Fix the endpoint before installing.");
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  validateArgs(args);
  if (args.checkFirst) runPrecheck(args);

  const claudeArgs = buildClaudeArgs(args);
  const command = formatCommand("claude", claudeArgs);

  if (!args.apply) {
    console.log("install-claude-code: dry-run");
    console.log(command);
    console.log("");
    console.log("Re-run with --apply after reviewing the command.");
    return;
  }

  const result = spawnSync("claude", claudeArgs, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    return;
  }

  console.log("");
  console.log("install-claude-code: done");
  console.log("Next checks:");
  console.log(`  claude mcp list`);
  console.log(`  claude mcp get ${args.serverName}`);
  console.log("  /mcp");
}

try {
  main();
} catch (error) {
  console.error(`install-claude-code: failed: ${error.message}`);
  process.exitCode = 1;
}
