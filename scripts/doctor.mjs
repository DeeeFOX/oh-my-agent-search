#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--url") args.url = argv[++index];
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/doctor.mjs [--url <searxng-url>]",
    "",
    "Examples:",
    "  npm run doctor",
    "  npm run doctor -- --url https://search.example.org"
  ].join("\n");
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function printStatus(kind, message) {
  console.log(`${kind}: ${message}`);
}

function checkNode() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 18) {
    printStatus("FAIL", `Node.js ${process.versions.node}; expected >=18`);
    return false;
  }
  printStatus("PASS", `Node.js ${process.versions.node}`);
  return true;
}

function checkClaude() {
  const version = run("claude", ["--version"]);
  if (version.error) {
    printStatus("WARN", "Claude Code CLI not found in PATH");
    return true;
  }
  const output = `${version.stdout}${version.stderr}`.trim();
  printStatus("PASS", output || "Claude Code CLI is available");

  const list = run("claude", ["mcp", "list"]);
  if (list.status === 0) {
    printStatus("PASS", "claude mcp list succeeded");
  } else {
    printStatus("WARN", "claude mcp list did not succeed; run it manually after setup");
  }
  return true;
}

function checkDocker() {
  const docker = run("docker", ["--version"]);
  if (docker.error) {
    printStatus("WARN", "Docker CLI not found; local SearXNG setup will require Docker or another trusted endpoint");
    return true;
  }

  const dockerOutput = `${docker.stdout}${docker.stderr}`.trim();
  printStatus("PASS", dockerOutput || "Docker CLI is available");

  const compose = run("docker", ["compose", "version"]);
  if (compose.status === 0) {
    const composeOutput = `${compose.stdout}${compose.stderr}`.trim();
    printStatus("PASS", composeOutput || "docker compose is available");
  } else {
    printStatus("WARN", "docker compose did not succeed; local SearXNG setup may need manual Docker configuration");
  }
  return true;
}

function checkSearxng(url) {
  if (!url) {
    printStatus("WARN", "No SearXNG URL provided; skipping JSON verification");
    return true;
  }

  const script = join(here, "verify-searxng-json.mjs");
  const result = spawnSync(process.execPath, [script, "--url", url], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.status === 0) {
    printStatus("PASS", result.stdout.trim());
    return true;
  }

  printStatus("FAIL", result.stderr.trim() || "SearXNG JSON verification failed");
  return false;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const checks = [
    checkNode(),
    checkClaude(),
    checkDocker(),
    checkSearxng(args.url || process.env.SEARXNG_URL)
  ];

  if (checks.includes(false)) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(`doctor: failed: ${error.message}`);
  process.exitCode = 1;
}
