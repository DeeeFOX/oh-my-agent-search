#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const installScript = join(here, "install-claude-code.mjs");
const setupScript = join(here, "setup-searxng-local.mjs");
const statusScript = join(here, "status.mjs");
const uninstallScript = join(here, "uninstall-claude-code.mjs");
const verifyScript = join(here, "verify-searxng-json.mjs");

function run(args) {
  return spawnSync(process.execPath, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function runCommand(command, args) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function includes(result, text) {
  return `${result.stdout}${result.stderr}`.includes(text);
}

function parseJson(result) {
  const text = `${result.stdout}${result.stderr}`.trim();
  assert(text.length > 0, "expected JSON output");
  return JSON.parse(text);
}

function testDryRun() {
  const result = run([installScript, "--url", "https://search.example.org"]);
  assert(result.status === 0, "dry-run should succeed");
  assert(includes(result, "install-claude-code: dry-run"), "dry-run label missing");
  assert(includes(result, "claude mcp add -s local -e SEARXNG_URL=https://search.example.org -t stdio searxng"), "claude command missing or malformed");
}

function testInstallJsonDryRun() {
  const result = run([installScript, "--url", "https://search.example.org", "--json"]);
  assert(result.status === 0, "install json dry-run should succeed");
  const payload = parseJson(result);
  assert(payload.ok === true, "install json dry-run should be ok");
  assert(payload.mode === "dry-run", "install json dry-run mode missing");
  assert(payload.command.includes("claude mcp add"), "install json command missing");
}

function testNpmSilentJsonDryRun() {
  const result = runCommand("npm", [
    "--silent",
    "run",
    "install:claude-code",
    "--",
    "--url",
    "https://search.example.org",
    "--json"
  ]);
  assert(result.status === 0, "npm silent json dry-run should succeed");
  const text = result.stdout.trim();
  assert(text.startsWith("{") && text.endsWith("}"), "npm silent json dry-run should emit one JSON object on stdout");
  const payload = JSON.parse(text);
  assert(payload.ok === true, "npm silent json dry-run should be ok");
}

function testProjectScopeGuard() {
  const result = run([installScript, "--url", "https://search.example.org", "--scope", "project"]);
  assert(result.status !== 0, "project scope should require explicit override");
  assert(includes(result, "--allow-project-scope"), "project scope guidance missing");
}

function testProjectScopeOverrideDryRun() {
  const result = run([
    installScript,
    "--url",
    "https://search.example.org",
    "--scope",
    "project",
    "--allow-project-scope"
  ]);
  assert(result.status === 0, "project scope override dry-run should succeed");
  assert(includes(result, "-s project"), "project scope command missing");
}

function testInvalidUrl() {
  const result = run([installScript, "--url", "file:///tmp/search"]);
  assert(result.status !== 0, "invalid protocol should fail");
  assert(includes(result, "must use http or https"), "invalid protocol message missing");
}

function testVerifyJsonError() {
  const result = run([verifyScript, "--url", "file:///tmp/search", "--json"]);
  assert(result.status !== 0, "verify json error should fail");
  const payload = parseJson(result);
  assert(payload.ok === false, "verify json error should be false");
  assert(payload.error.includes("must use http or https"), "verify json error message missing");
}

function testVerifyHelp() {
  const result = run([verifyScript, "--help"]);
  assert(result.status === 0, "verify help should succeed");
  assert(includes(result, "Usage:"), "verify help usage missing");
}

function testSetupDryRun() {
  const result = run([setupScript]);
  assert(result.status === 0, "setup dry-run should succeed");
  assert(includes(result, "Dry-run only"), "setup dry-run label missing");
}

function testSetupJsonDryRun() {
  const result = run([setupScript, "--json"]);
  assert(result.status === 0, "setup json dry-run should succeed");
  const payload = parseJson(result);
  assert(payload.ok === true, "setup json dry-run should be ok");
  assert(payload.mode === "dry-run", "setup json dry-run mode missing");
  assert(payload.settingsPath === "local/searxng/settings.yml", "setup json settings path missing");
}

function testSetupProfileDryRun() {
  const result = run([setupScript, "--profile", "bing-only"]);
  assert(result.status === 0, "setup profile dry-run should succeed");
  assert(includes(result, "profile:  bing-only"), "setup profile label missing");
}

function testUnknownSetupProfile() {
  const result = run([setupScript, "--profile", "unknown"]);
  assert(result.status !== 0, "unknown setup profile should fail");
  assert(includes(result, "Unknown profile"), "unknown profile message missing");
}

function testUninstallDryRun() {
  const result = run([uninstallScript]);
  assert(result.status === 0, "uninstall dry-run should succeed");
  assert(includes(result, "claude mcp remove searxng"), "uninstall command missing");
}

function testStatusHelp() {
  const result = run([statusScript, "--help"]);
  assert(result.status === 0, "status help should succeed");
  assert(includes(result, "Usage:"), "status help usage missing");
}

function testStatusJsonError() {
  const result = run([statusScript, "--url", "file:///tmp/search", "--json"]);
  assert(result.status !== 0, "status json error should fail");
  const payload = parseJson(result);
  assert(payload.ok === false, "status json error should be false");
  assert(Array.isArray(payload.checks), "status json checks missing");
}

function testUninstallJsonDryRun() {
  const result = run([uninstallScript, "--json"]);
  assert(result.status === 0, "uninstall json dry-run should succeed");
  const payload = parseJson(result);
  assert(payload.ok === true, "uninstall json dry-run should be ok");
  assert(payload.command.includes("claude mcp remove"), "uninstall json command missing");
}

const tests = [
  testDryRun,
  testInstallJsonDryRun,
  testNpmSilentJsonDryRun,
  testProjectScopeGuard,
  testProjectScopeOverrideDryRun,
  testInvalidUrl,
  testVerifyJsonError,
  testVerifyHelp,
  testSetupDryRun,
  testSetupJsonDryRun,
  testSetupProfileDryRun,
  testUnknownSetupProfile,
  testStatusHelp,
  testStatusJsonError,
  testUninstallDryRun,
  testUninstallJsonDryRun
];

try {
  for (const test of tests) test();
  console.log(`self-test: ok (${tests.length} tests)`);
} catch (error) {
  console.error(`self-test: failed: ${error.message}`);
  process.exitCode = 1;
}
