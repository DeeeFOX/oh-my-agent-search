#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const installScript = join(here, "install-claude-code.mjs");
const probeScript = join(here, "probe-searxng-engines.mjs");
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
  assert(includes(result, "claude mcp add --scope local -e SEARXNG_URL=https://search.example.org -t stdio searxng"), "claude command missing or malformed");
}

function testInstallJsonDryRun() {
  const result = run([installScript, "--url", "https://search.example.org", "--json"]);
  assert(result.status === 0, "install json dry-run should succeed");
  const payload = parseJson(result);
  assert(payload.ok === true, "install json dry-run should be ok");
  assert(payload.mode === "dry-run", "install json dry-run mode missing");
  assert(payload.command.includes("claude mcp add"), "install json command missing");
  assert(Array.isArray(payload.warnings), "install json warnings missing");
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
  assert(includes(result, "--scope project"), "project scope command missing");
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

function testProbeHelp() {
  const result = run([probeScript, "--help"]);
  assert(result.status === 0, "probe help should succeed");
  assert(includes(result, "Usage:"), "probe help usage missing");
}

function testProbeJsonError() {
  const result = run([probeScript, "--url", "file:///tmp/search", "--json"]);
  assert(result.status !== 0, "probe json error should fail");
  const payload = parseJson(result);
  assert(payload.ok === false, "probe json error should be false");
  assert(payload.error.includes("must use http or https"), "probe json error message missing");
}

function testProbeUnknownEngine() {
  const result = run([probeScript, "--url", "https://search.example.org", "--engines", "bing,unknown", "--json"]);
  assert(result.status !== 0, "unknown probe engine should fail");
  const payload = parseJson(result);
  assert(payload.ok === false, "unknown probe engine json should be false");
  assert(payload.error.includes("Unknown engine"), "unknown probe engine message missing");
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

function testSetupRegionProfilesDryRun() {
  for (const profile of ["yandex-only", "google-only", "baidu-only"]) {
    const result = run([setupScript, "--profile", profile, "--json"]);
    assert(result.status === 0, `${profile} setup json dry-run should succeed`);
    const payload = parseJson(result);
    assert(payload.ok === true, `${profile} setup json dry-run should be ok`);
    assert(payload.profile === profile, `${profile} setup json profile missing`);
  }
}

function testSetupEnginesJsonDryRun() {
  const result = run([setupScript, "--engines", "bing,yandex", "--json"]);
  assert(result.status === 0, "setup engines json dry-run should succeed");
  const payload = parseJson(result);
  assert(payload.ok === true, "setup engines json dry-run should be ok");
  assert(payload.profile === "custom", "setup engines json profile should be custom");
  assert(Array.isArray(payload.engines), "setup engines json engines missing");
  assert(payload.engines.join(",") === "bing,yandex", "setup engines json engines malformed");
}

function testSetupUnknownEngine() {
  const result = run([setupScript, "--engines", "bing,unknown"]);
  assert(result.status !== 0, "unknown setup engine should fail");
  assert(includes(result, "Unknown engine"), "unknown setup engine message missing");
}

function testUnknownSetupProfile() {
  const result = run([setupScript, "--profile", "unknown"]);
  assert(result.status !== 0, "unknown setup profile should fail");
  assert(includes(result, "Unknown profile"), "unknown profile message missing");
  assert(includes(result, "baidu-only"), "unknown profile message should list region profiles");
}

function testUninstallDryRun() {
  const result = run([uninstallScript]);
  assert(result.status === 0, "uninstall dry-run should succeed");
  assert(includes(result, "claude mcp remove searxng"), "uninstall command missing");
  assert(includes(result, "WARN:"), "unscoped uninstall warning missing");
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
  assert(Array.isArray(payload.warnings), "uninstall json warnings missing");
  assert(payload.warnings.length === 1, "unscoped uninstall should warn");
}

function testUninstallScopedJsonDryRun() {
  const result = run([uninstallScript, "--scope", "user", "--json"]);
  assert(result.status === 0, "scoped uninstall json dry-run should succeed");
  const payload = parseJson(result);
  assert(payload.ok === true, "scoped uninstall json dry-run should be ok");
  assert(payload.scope === "user", "scoped uninstall json scope missing");
  assert(payload.command.includes("claude mcp remove --scope user searxng"), "scoped uninstall json command missing");
  assert(Array.isArray(payload.warnings), "scoped uninstall json warnings missing");
  assert(payload.warnings.length === 0, "scoped uninstall should not warn");
}

function testUninstallApplyRequiresScope() {
  const result = run([uninstallScript, "--apply"]);
  assert(result.status !== 0, "uninstall apply should require scope");
  assert(includes(result, "Missing --scope"), "uninstall apply scope guidance missing");
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
  testProbeHelp,
  testProbeJsonError,
  testProbeUnknownEngine,
  testSetupDryRun,
  testSetupJsonDryRun,
  testSetupProfileDryRun,
  testSetupRegionProfilesDryRun,
  testSetupEnginesJsonDryRun,
  testSetupUnknownEngine,
  testUnknownSetupProfile,
  testStatusHelp,
  testStatusJsonError,
  testUninstallDryRun,
  testUninstallJsonDryRun,
  testUninstallScopedJsonDryRun,
  testUninstallApplyRequiresScope
];

try {
  for (const test of tests) test();
  console.log(`self-test: ok (${tests.length} tests)`);
} catch (error) {
  console.error(`self-test: failed: ${error.message}`);
  process.exitCode = 1;
}
