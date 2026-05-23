#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const VALID_SCOPES = new Set(["local", "user", "project"]);
const TOOL_NAME = "uninstall-claude-code";

function parseArgs(argv) {
  const args = { serverName: "searxng" };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--server-name") args.serverName = argv[++index];
    else if (value === "--scope") args.scope = argv[++index];
    else if (value === "--apply") args.apply = true;
    else if (value === "--json") args.json = true;
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/uninstall-claude-code.mjs [--server-name searxng] [--scope local|user|project] [--apply] [--json]",
    "",
    "Dry-run is the default. Add --apply to run claude mcp remove.",
    "",
    "Examples:",
    "  npm run uninstall:claude-code",
    "  npm run uninstall:claude-code -- --apply",
    "  npm --silent run uninstall:claude-code -- --json"
  ].join("\n");
}

function buildClaudeArgs(args) {
  const claudeArgs = ["mcp", "remove"];
  if (args.scope) claudeArgs.push("--scope", args.scope);
  claudeArgs.push(args.serverName);
  return claudeArgs;
}

function formatCommand(command, args) {
  return [command, ...args.map((arg) => (arg.includes(" ") ? JSON.stringify(arg) : arg))].join(" ");
}

function emitJson(payload) {
  console.log(JSON.stringify(payload));
}

function main(args) {
  if (args.help) {
    console.log(usage());
    return;
  }
  if (args.scope && !VALID_SCOPES.has(args.scope)) {
    throw new Error(`Invalid scope: ${args.scope}`);
  }

  const claudeArgs = buildClaudeArgs(args);
  const command = formatCommand("claude", claudeArgs);

  if (!args.apply) {
    if (args.json) {
      emitJson({
        ok: true,
        tool: TOOL_NAME,
        mode: "dry-run",
        serverName: args.serverName,
        scope: args.scope,
        command
      });
      return;
    }

    console.log("uninstall-claude-code: dry-run");
    console.log(command);
    console.log("");
    console.log("Re-run with --apply after reviewing the command.");
    return;
  }

  const result = spawnSync("claude", claudeArgs, {
    encoding: "utf8",
    stdio: args.json ? ["ignore", "pipe", "pipe"] : "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (args.json) {
      const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
      throw new Error(output || "claude mcp remove failed.");
    }
    process.exitCode = result.status ?? 1;
    return;
  }

  if (args.json) {
    emitJson({
      ok: true,
      tool: TOOL_NAME,
      mode: "apply",
      serverName: args.serverName,
      scope: args.scope,
      command
    });
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
      mode: parsedArgs.apply ? "apply" : "dry-run",
      error: error.message
    });
  } else {
    console.error(`uninstall-claude-code: failed: ${error.message}`);
  }
  process.exitCode = 1;
}
