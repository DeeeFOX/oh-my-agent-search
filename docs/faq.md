# FAQ

Short answers for people evaluating Claude Code MCP search with SearXNG.

## Is This An MCP Server?

No. This repository is a Claude Code + SearXNG starter. It helps you verify a trusted SearXNG endpoint, preview the Claude Code MCP command, and install the `searxng` MCP entry safely.

The current adapter command uses `npx -y mcp-searxng`. See [Adapter choice](adapter-choice.md) for the exact command and replacement criteria.

## How Do I Add SearXNG Search To Claude Code?

Use a trusted or self-hosted SearXNG endpoint, verify JSON/search first, preview the MCP config change, then apply it explicitly:

```sh
export SEARXNG_URL="https://search.example.org"
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
```

Then check Claude Code:

```sh
claude mcp list
claude mcp get searxng
```

## Should I Use Local, User, Or Project MCP Scope?

Use `local` for one project. Use `user` when the same trusted endpoint should be available across projects. Use `project` only after reviewing the shared `.mcp.json`, because project scope is meant for collaborators.

This starter defaults to `local` scope.

## Is Local SearXNG Fully Private?

No. Local SearXNG helps avoid random public instances and keeps your endpoint out of the repository, but selected upstream search engines can still receive the query.

Only search for public information. Do not search with secrets, private code, private hostnames, private endpoints, local paths, customer data, or unreleased names that reveal intent.

## Can I Use A Public SearXNG Instance?

Use only a trusted endpoint. Random public instances may log, rate-limit, alter, or break requests. A self-hosted SearXNG endpoint is easier to verify and reason about.

## Why Verify JSON And Search Before Installing?

Claude Code can only use the MCP search tool if the endpoint returns usable SearXNG JSON results. Verification catches endpoint, engine, and regional availability problems before MCP config changes are applied.

## Is This Package Published To npm?

No. `oh-my-agent-search` is an installable starter repository and keeps `package.json` private. It uses the configured MCP adapter rather than publishing a separate SearXNG MCP server package.

## What Output Should Automation Parse?

Use JSON output instead of scraping human-readable logs:

```sh
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
npm --silent run status -- --url "$SEARXNG_URL" --json
```

When sharing output publicly, replace real endpoints with `https://search.example.org`.
