# Claude Code Setup

This path adds SearXNG search to Claude Code through a stdio MCP server.

## Prerequisites

- Node.js
- Claude Code CLI
- a trusted SearXNG endpoint with JSON enabled, or a local endpoint from [Local SearXNG setup](local-searxng.md)

Run `npm run` and `make` commands from this repository root. From another directory:

```sh
make -C <path-to-oh-my-agent-search> install-preview-check URL="$SEARXNG_URL"
```

## Install

Use a trusted endpoint:

```sh
export SEARXNG_URL="https://search.example.org"
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
```

The installer is dry-run unless `--apply` is provided. `install-preview-check` verifies the endpoint before showing the Claude Code command.

## Scope

Default scope is `local`.

```sh
npm run install:claude-code -- --url "$SEARXNG_URL" --scope local
npm run install:claude-code -- --url "$SEARXNG_URL" --scope user
```

Use `project` scope only after reviewing the shared `.mcp.json` policy.

Before applying, check for an existing same-name server:

```sh
claude mcp get searxng
```

If a server exists in the wrong scope, remove that scope explicitly before reinstalling.

## Verify In Claude Code

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code:

```text
/mcp
```

Then run [go-live prompts](../templates/go-live-prompts.md).

## JSON Output For Agents

Use JSON output when a script or agent parses results:

```sh
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
npm --silent run status -- --url "$SEARXNG_URL" --json
```

Do not scrape human-readable PASS/WARN/FAIL text when JSON output exists.

## Uninstall

Preview and apply removal with an explicit scope:

```sh
make uninstall-preview SCOPE=local
make uninstall-apply SCOPE=local
```

Equivalent npm command:

```sh
npm run uninstall:claude-code -- --scope local --apply
```

Unscoped dry-run is allowed only to show the risk. `--apply` requires `--scope`.

## References

- [Go-live checklist](go-live-checklist.md)
- [Troubleshooting](troubleshooting.md)
- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
