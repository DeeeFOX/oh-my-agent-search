# Oh My Agent Search

English | [中文](README.zh-CN.md)

[![Check](https://github.com/DeeeFOX/oh-my-agent-search/actions/workflows/check.yml/badge.svg)](https://github.com/DeeeFOX/oh-my-agent-search/actions/workflows/check.yml)

A self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP.

Use this repository when you want Claude Code to search through a trusted SearXNG endpoint without committing private endpoints, changing MCP config by accident, or relying on random public search instances.

## Why This Exists

Coding agents are more useful with search, but search queries can leak private context. This starter gives Claude Code a repeatable MCP path for SearXNG while keeping the risky parts explicit:

- verify that SearXNG JSON/search works before installing
- preview MCP config changes before applying them
- prefer `local` or `user` scope over shared project config
- keep endpoint values in local MCP config, not in this repository
- use go-live prompts that check search, lifecycle, and privacy behavior

## Who It Is For

- Claude Code users who want MCP search backed by SearXNG
- developers testing a local SearXNG instance before using it with an agent
- developers bringing their own self-hosted or trusted SearXNG endpoint
- teams that need a small, auditable search starter instead of a general agent catalog
- agent workflows that need JSON output for automation and status checks

## What This Provides

- Claude Code MCP install and uninstall helpers
- SearXNG JSON/search verification
- local SearXNG bootstrap for testing
- engine probing for regional search availability
- go-live prompts for smoke, lifecycle, and privacy checks
- concise security guidance for public-safe search queries

## 5-Minute Quick Start

Run `npm run` and `make` commands from this repository root. From another directory, use `make -C <path-to-oh-my-agent-search> <target>`.

Use a trusted SearXNG endpoint:

```sh
export SEARXNG_URL="https://search.example.org"
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
make status URL="$SEARXNG_URL"
```

Then verify Claude Code:

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code:

```text
/mcp
```

After installation, use [templates/go-live-prompts.md](templates/go-live-prompts.md) to verify real behavior.

## No Endpoint Yet

Start a local SearXNG instance:

```sh
make setup-searxng
npm run setup:searxng -- --apply --start
export SEARXNG_URL="http://127.0.0.1:8080"
make verify-search URL="$SEARXNG_URL"
```

If the default engines return no results in your region, probe candidate engines first. Start with a candidate set:

```sh
npm run setup:searxng -- --engines bing,yandex,google,baidu --apply --force --start
make probe-engines URL="$SEARXNG_URL"
```

Then enable all engines that passed, not just one fallback engine:

```sh
npm run setup:searxng -- --engines bing,yandex --apply --force --start
make verify-search URL="$SEARXNG_URL"
```

Single-engine profiles such as `bing-only` are for troubleshooting.

## Common Use Cases

- Add SearXNG search to one Claude Code project with `local` MCP scope.
- Reuse one trusted SearXNG endpoint across projects with `user` MCP scope.
- Test a local SearXNG container before attaching it to Claude Code.
- Check whether search still works after restarting Claude Code or switching projects.
- Give another agent JSON status output instead of scraping human-readable logs.

## What Makes It Safer

The installer is dry-run by default. MCP config changes require `--apply`, and uninstall apply requires an explicit `--scope`.

Default scope is `local`. Use:

- `local` for one project
- `user` when the same trusted endpoint should work across projects
- `project` only after reviewing the shared `.mcp.json`

If a `searxng` server already exists, check its scope before installing:

```sh
claude mcp get searxng
```

Use SearXNG only for public information. Do not search with secrets, private code, private hostnames, private endpoints, local paths, customer data, or unreleased names that reveal intent.

Local SearXNG avoids random public instances, but selected upstream search engines still receive the query.

## Uninstall

Preview and apply removal with an explicit scope:

```sh
make uninstall-preview SCOPE=local
make uninstall-apply SCOPE=local
```

## Automation

Use JSON output when another agent or script parses command results:

```sh
npm --silent run setup:searxng -- --json
npm --silent run probe:engines -- --url "$SEARXNG_URL" --json
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
npm --silent run status -- --url "$SEARXNG_URL" --json
```

## Docs

Start with [docs/README.md](docs/README.md).

Before submitting changes:

```sh
make review
```

## License

MIT. See [LICENSE](LICENSE).
