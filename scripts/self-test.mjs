#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const installScript = join(here, "install-claude-code.mjs");
const setupScript = join(here, "setup-searxng-local.mjs");
const uninstallScript = join(here, "uninstall-claude-code.mjs");
const verifyScript = join(here, "verify-searxng-json.mjs");

function run(args) {
  return spawnSync(process.execPath, args, {
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

function testDryRun() {
  const result = run([installScript, "--url", "https://search.example.org"]);
  assert(result.status === 0, "dry-run should succeed");
  assert(includes(result, "install-claude-code: dry-run"), "dry-run label missing");
  assert(includes(result, "claude mcp add -s local -e SEARXNG_URL=https://search.example.org -t stdio searxng"), "claude command missing or malformed");
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

const tests = [
  testDryRun,
  testProjectScopeGuard,
  testProjectScopeOverrideDryRun,
  testInvalidUrl,
  testVerifyHelp,
  testSetupDryRun,
  testSetupProfileDryRun,
  testUnknownSetupProfile,
  testUninstallDryRun
];

try {
  for (const test of tests) test();
  console.log(`self-test: ok (${tests.length} tests)`);
} catch (error) {
  console.error(`self-test: failed: ${error.message}`);
  process.exitCode = 1;
}
