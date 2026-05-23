#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const TOOL_NAME = "setup-searxng-local";
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
    else if (value === "--json") args.json = true;
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/setup-searxng-local.mjs [--profile default|bing-only] [--port 8080] [--apply] [--start] [--force] [--json]",
    "",
    "Dry-run is the default. Add --apply to write ignored local files.",
    "Add --start with --apply to run docker compose up -d.",
    "",
    "Examples:",
    "  npm run setup:searxng",
    "  npm run setup:searxng -- --profile bing-only",
    "  npm run setup:searxng -- --apply",
    "  npm run setup:searxng -- --profile bing-only --apply --start",
    "  npm --silent run setup:searxng -- --json"
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

function runDockerCompose(json) {
  const result = spawnSync("docker", ["compose", "up", "-d"], {
    cwd: root,
    encoding: "utf8",
    stdio: json ? ["ignore", "pipe", "pipe"] : "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (json) {
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
      throw new Error(output || "docker compose up -d failed.");
    }
    process.exitCode = result.status ?? 1;
  }
}

function emitJson(payload) {
  console.log(JSON.stringify(payload));
}

function main(args) {
  if (args.help) {
    console.log(usage());
    return;
  }

  validatePort(args.port);
  if (!profiles.has(args.profile)) {
    throw new Error(`Unknown profile: ${args.profile}. Available profiles: ${Array.from(profiles.keys()).join(", ")}`);
  }

  const url = `http://127.0.0.1:${args.port}`;
  const summary = {
    ok: true,
    tool: TOOL_NAME,
    profile: args.profile,
    port: Number(args.port),
    url,
    settingsPath: "local/searxng/settings.yml",
    envPath: ".env"
  };

  if (args.json) {
    if (!args.apply) {
      emitJson({
        ...summary,
        mode: "dry-run",
        start: Boolean(args.start),
        force: Boolean(args.force)
      });
      return;
    }
  } else {
    console.log("setup-searxng-local:");
    console.log(`  profile:  ${args.profile}`);
    console.log(`  settings: ${settingsPath}`);
    console.log(`  env:      ${envPath}`);
    console.log(`  url:      ${url}`);
  }

  if (!args.apply) {
    if (!args.json) {
      console.log("");
      console.log("Dry-run only. Re-run with --apply to write ignored local files.");
    }
    return;
  }

  if ((existsSync(settingsPath) || existsSync(envPath)) && !args.force) {
    throw new Error("Local SearXNG files already exist. Re-run with --force to overwrite.");
  }

  mkdirSync(localDir, { recursive: true });
  writeFileSync(settingsPath, renderSettings(args.profile));
  writeFileSync(envPath, renderEnv(args.port));
  if (args.json) {
    const payload = {
      ...summary,
      mode: "apply",
      start: Boolean(args.start),
      force: Boolean(args.force),
      createdFiles: ["local/searxng/settings.yml", ".env"],
      started: Boolean(args.start)
    };

    if (args.start) {
      runDockerCompose(true);
    }

    emitJson(payload);
    return;
  }

  console.log("Wrote ignored local SearXNG files.");

  if (args.start) {
    runDockerCompose(false);
  } else {
    console.log("Next: docker compose up -d");
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
    emitJson({
      ok: false,
      tool: TOOL_NAME,
      profile: parsedArgs.profile ?? "default",
      port: parsedArgs.port ? Number(parsedArgs.port) : null,
      mode: parsedArgs.apply ? "apply" : "dry-run",
      error: error.message
    });
  } else {
    console.error(`setup-searxng-local: failed: ${error.message}`);
  }
  process.exitCode = 1;
}
