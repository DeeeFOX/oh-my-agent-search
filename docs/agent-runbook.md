# Agent Runbook

## Purpose

This runbook is for AI agents or scripted workflows that help a user complete the currently implemented Claude Code direction.

It does not add Codex, OpenClaw, remote HTTP MCP, or managed team setup support. Those paths need their own verified installers and acceptance tests before they belong in this repository.

## Inputs

Before making changes or running install commands, establish:

- whether the user has a trusted SearXNG endpoint
- whether local SearXNG should be generated under ignored local files
- intended Claude Code MCP scope: `local`, `user`, or reviewed `project`
- whether endpoint-specific checks may use the real endpoint locally

Use placeholders in shared files. Use a real endpoint only in local commands.

## Hard Rules

- Do not commit real endpoints, credentials, tokens, cookies, session material, network routing values, customer data, or local absolute paths.
- Keep installers dry-run first.
- Do not run mutating install or uninstall commands without `--apply`.
- Do not overwrite generated local files with `--force` unless the user explicitly approves it.
- Prefer `local` or `user` scope.
- Require explicit user approval before `project` scope.
- Never auto-write `.mcp.json` with a real endpoint.
- Keep URL reading separate from search behavior.
- Do not recommend random public SearXNG instances for durable workflows.

## Machine-Readable Commands

Use JSON mode when another agent or script will parse command results:

```sh
npm --silent run setup:searxng -- --json
npm --silent run verify:json -- --url "$SEARXNG_URL" --json
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --json
npm --silent run status -- --url "$SEARXNG_URL" --json
npm --silent run uninstall:claude-code -- --json
```

JSON mode must produce one JSON object on stdout. Use `npm --silent run` or direct `node scripts/...` commands so npm's script banner does not contaminate stdout. Do not scrape human-readable PASS/WARN/FAIL text when JSON mode is available.

## Execution Flow

1. Run repository checks before changing behavior:

   ```sh
   make review
   ```

2. If no trusted endpoint exists, preview local SearXNG setup:

   ```sh
   npm --silent run setup:searxng -- --json
   ```

3. Only after review, write ignored local files and start SearXNG:

   ```sh
   npm --silent run setup:searxng -- --apply --start --json
   export SEARXNG_URL="http://127.0.0.1:8080"
   ```

4. Verify the endpoint:

   ```sh
   npm --silent run verify:json -- --url "$SEARXNG_URL" --json
   npm --silent run verify:search -- --url "$SEARXNG_URL" --json
   ```

5. Preview the Claude Code MCP command:

   ```sh
   npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
   ```

6. Apply only after the user accepts the preview:

   ```sh
   npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --apply --json
   ```

7. Check local status:

   ```sh
   npm --silent run status -- --url "$SEARXNG_URL" --json
   ```

8. Ask Claude Code to run the prompts in [templates/go-live-prompts.md](../templates/go-live-prompts.md).

9. Write back only sanitized findings to docs, templates, or tests. Do not copy raw endpoint values, local paths, account identifiers, or private logs.

## Testing Contract

A change is not ready until:

- `make review` passes
- endpoint-specific work also runs `make verify-search URL="$SEARXNG_URL"` locally
- dry-run output remains available for mutating commands
- JSON mode remains parseable for agent automation
- new docs avoid real endpoints and local absolute paths
- smoke and negative privacy checks are documented when behavior changes

If a real Claude Code go-live check reveals a new issue, update [docs/troubleshooting.md](troubleshooting.md), [docs/go-live-checklist.md](go-live-checklist.md), or [templates/claude-code-instruction.md](../templates/claude-code-instruction.md) with sanitized guidance.
