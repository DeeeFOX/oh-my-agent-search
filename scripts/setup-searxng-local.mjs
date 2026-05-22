#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const templateRoot = join(root, "templates", "searxng");
const profiles = new Map([
  ["default", join(templateRoot, "settings.yml")],
  ["bing-only", join(templateRoot, "profiles", "bing-only.yml")]
]);
const localDir = join(root, "local", "searxng");
const settingsPath = join(localDir, "settings.yml");
const envPath = join(root, ".env");

function parseArgs(argv) {
  const args = { port: "8080", profile: "default" };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--apply") args.apply = true;
    else if (value === "--force") args.force = true;
    else if (value === "--start") args.start = true;
    else if (value === "--port") args.port = argv[++index];
    else if (value === "--profile") args.profile = argv[++index];
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/setup-searxng-local.mjs [--profile default|bing-only] [--port 8080] [--apply] [--start] [--force]",
    "",
    "Dry-run is the default. Add --apply to write ignored local files.",
    "Add --start with --apply to run docker compose up -d.",
    "",
    "Examples:",
    "  npm run setup:searxng",
    "  npm run setup:searxng -- --profile bing-only",
    "  npm run setup:searxng -- --apply",
    "  npm run setup:searxng -- --profile bing-only --apply --start"
  ].join("\n");
}

function validatePort(port) {
  if (!/^[0-9]+$/.test(port)) throw new Error("--port must be numeric.");
  const value = Number(port);
  if (value < 1 || value > 65535) throw new Error("--port must be between 1 and 65535.");
}

function renderSettings(profile) {
  const secret = randomBytes(32).toString("hex");
  const templatePath = profiles.get(profile);
  const template = readFileSync(templatePath, "utf8");
  return template.replace("__SEARXNG_SECRET_KEY__", secret);
}

function renderEnv(port) {
  return [
    `SEARXNG_URL=http://127.0.0.1:${port}`,
    `SEARXNG_BIND=127.0.0.1:${port}`,
    `SEARXNG_BASE_URL=http://127.0.0.1:${port}/`,
    ""
  ].join("\n");
}

function runDockerCompose() {
  const result = spawnSync("docker", ["compose", "up", "-d"], {
    cwd: root,
    stdio: "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  validatePort(args.port);
  if (!profiles.has(args.profile)) {
    throw new Error(`Unknown profile: ${args.profile}. Available profiles: ${Array.from(profiles.keys()).join(", ")}`);
  }

  console.log("setup-searxng-local:");
  console.log(`  profile:  ${args.profile}`);
  console.log(`  settings: ${settingsPath}`);
  console.log(`  env:      ${envPath}`);
  console.log(`  url:      http://127.0.0.1:${args.port}`);

  if (!args.apply) {
    console.log("");
    console.log("Dry-run only. Re-run with --apply to write ignored local files.");
    return;
  }

  if ((existsSync(settingsPath) || existsSync(envPath)) && !args.force) {
    throw new Error("Local SearXNG files already exist. Re-run with --force to overwrite.");
  }

  mkdirSync(localDir, { recursive: true });
  writeFileSync(settingsPath, renderSettings(args.profile));
  writeFileSync(envPath, renderEnv(args.port));
  console.log("Wrote ignored local SearXNG files.");

  if (args.start) {
    runDockerCompose();
  } else {
    console.log("Next: docker compose up -d");
  }
}

try {
  main();
} catch (error) {
  console.error(`setup-searxng-local: failed: ${error.message}`);
  process.exitCode = 1;
}
