# Agent Runbook

Use this when an AI agent or script helps install Claude Code search.

## Inputs

Confirm:

- trusted `SEARXNG_URL`, or approval to start local SearXNG
- intended scope: `local`, `user`, or reviewed `project`
- permission to use the real endpoint only in local commands

Do not write real endpoints, credentials, customer data, or local absolute paths into repository files.

## Commands

Use JSON output for parsing:

```sh
npm --silent run setup:searxng -- --json
npm --silent run probe:engines -- --url "$SEARXNG_URL" --json
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
npm --silent run status -- --url "$SEARXNG_URL" --json
npm --silent run uninstall:claude-code -- --scope local --json
```

Run these commands from the repository root. From another directory:

```sh
node <path-to-oh-my-agent-search>/scripts/install-claude-code.mjs --url "$SEARXNG_URL" --scope local --check-first --json
```

## Flow

1. Run `make review`.
2. If needed, preview local SearXNG with `npm --silent run setup:searxng -- --json`.
3. After approval, start local SearXNG with candidate engines: `npm --silent run setup:searxng -- --engines bing,yandex,google,baidu --apply --start --json`.
4. Probe engines with `npm --silent run probe:engines -- --url "$SEARXNG_URL" --json`.
5. Enable all passing engines with `npm --silent run setup:searxng -- --engines "<passing-engines>" --apply --force --start --json`.
6. Verify search with `npm --silent run verify:search -- --url "$SEARXNG_URL" --json`.
7. Check existing MCP config with `claude mcp get searxng`.
8. Preview install with `npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json`.
9. Apply only after approval by adding `--apply`.
10. Run `npm --silent run status -- --url "$SEARXNG_URL" --json`.
11. Ask Claude Code to run [go-live prompts](../templates/go-live-prompts.md).

## Rules

- Mutating commands require `--apply`.
- Uninstall `--apply` requires explicit `--scope`.
- Prefer `local` or `user` scope.
- Use `project` scope only after reviewing shared config.
- Do not parse human-readable status text when JSON output exists.
- Write back only sanitized findings to docs or tests.
