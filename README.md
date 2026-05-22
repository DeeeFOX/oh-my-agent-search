# Oh My Agent Search

English | [中文](README.zh-CN.md)

> Add privacy-aware SearXNG search to Claude Code through MCP, then verify it before use.

This is the installable companion to [awesome-agent-search](https://github.com/DeeeFOX/awesome-agent-search). The awesome repository explains the research, comparisons, and safety model. This repository focuses on a runnable Claude Code starter.

## What It Does

- verifies that a trusted SearXNG endpoint supports JSON search
- generates the Claude Code MCP command for a SearXNG search adapter
- can precheck SearXNG before installation with `--check-first`
- installs only when `--apply` is provided
- keeps real endpoints out of committed files
- provides a reusable Claude Code search instruction
- documents smoke tests and negative tests

## Quick Start

Use a trusted SearXNG endpoint. Shared docs use a placeholder:

```sh
export SEARXNG_URL="https://search.example.org"
```

Replace the placeholder with a real trusted endpoint before running any command that verifies network access.

If you do not have a trusted endpoint yet, create a local one:

```sh
make setup-searxng
npm run setup:searxng -- --apply --start
export SEARXNG_URL="http://127.0.0.1:8080"
```

If the default search engines are not available from your region, use a region-appropriate profile:

```sh
make setup-searxng PROFILE=bing-only
npm run setup:searxng -- --profile bing-only --apply --start
```

Verify JSON output only:

```sh
make verify-json URL="$SEARXNG_URL"
```

Verify that search returns at least one result:

```sh
make verify-search URL="$SEARXNG_URL"
```

Preview the Claude Code MCP command:

```sh
make install-preview URL="$SEARXNG_URL"
```

Preview with endpoint verification first:

```sh
make install-preview-check URL="$SEARXNG_URL"
```

Install after reviewing the command:

```sh
make install-apply-check URL="$SEARXNG_URL"
```

Run go-live checks:

```sh
make status URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
```

Verify Claude Code sees the server:

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code, run:

```text
/mcp
```

Then copy the instruction from [templates/claude-code-instruction.md](templates/claude-code-instruction.md) into your local project or session instructions.

Use [templates/go-live-prompts.md](templates/go-live-prompts.md) to ask Claude Code to verify search behavior and lifecycle after installation.

Remove the Claude Code MCP server if needed:

```sh
make uninstall-preview
make uninstall-apply
```

## Safety Model

Use SearXNG only for public information. Do not search with:

- secrets, credentials, cookies, or session material
- private code or private issue text
- private hostnames or private endpoints
- local absolute paths
- customer data
- unreleased project names when they reveal intent

Prefer `local` or `user` MCP scope. Use `project` scope only after reviewing the generated `.mcp.json` with the whole team.

## Commands

```sh
npm run doctor
npm run setup:searxng
npm run setup:searxng -- --apply --start
npm run status -- --url "$SEARXNG_URL"
npm run install:claude-code -- --url https://search.example.org
npm run install:claude-code -- --url https://search.example.org --apply
npm run uninstall:claude-code
make doctor
make status URL="$SEARXNG_URL"
make setup-searxng
make install-preview URL=https://search.example.org
make install-apply URL=https://search.example.org
make uninstall-preview
```

With a real trusted endpoint:

```sh
npm run verify:searxng -- --url "$SEARXNG_URL" --min-results 1
npm run install:claude-code -- --url "$SEARXNG_URL" --check-first
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
```

`install:claude-code` defaults to dry-run. It does not modify Claude Code unless `--apply` is passed.

## Repository Layout

- [docs/adapter-choice.md](docs/adapter-choice.md) - current adapter default and replacement criteria.
- [docs/claude-code.md](docs/claude-code.md) - Claude Code setup and verification.
- [docs/go-live-checklist.md](docs/go-live-checklist.md) - post-install acceptance checks.
- [docs/local-searxng.md](docs/local-searxng.md) - local Docker Compose SearXNG setup.
- [docs/post-install.md](docs/post-install.md) - lifecycle, scope, restart, and removal behavior.
- [docs/privacy-reality.md](docs/privacy-reality.md) - real privacy boundaries of local SearXNG and MCP search.
- [docs/research-to-starter.md](docs/research-to-starter.md) - how research findings become installable starter artifacts.
- [docs/searxng.md](docs/searxng.md) - SearXNG endpoint requirements.
- [docs/security.md](docs/security.md) - privacy and MCP safety guidance.
- [docs/troubleshooting.md](docs/troubleshooting.md) - sanitized field lessons and common setup fixes.
- [templates/claude-code-instruction.md](templates/claude-code-instruction.md) - local instruction template.
- [templates/go-live-prompts.md](templates/go-live-prompts.md) - prompts for Claude Code self-testing after installation.
- [templates/mcp-server.json](templates/mcp-server.json) - project-scope MCP template using environment expansion.
- [scripts/doctor.mjs](scripts/doctor.mjs) - local readiness checks.
- [scripts/setup-searxng-local.mjs](scripts/setup-searxng-local.mjs) - dry-run-first local SearXNG setup.
- [scripts/self-test.mjs](scripts/self-test.mjs) - offline tests for installer guards and dry-run output.
- [scripts/status.mjs](scripts/status.mjs) - post-install status summary.
- [scripts/uninstall-claude-code.mjs](scripts/uninstall-claude-code.mjs) - dry-run-first Claude Code MCP removal.
- [scripts/verify-searxng-json.mjs](scripts/verify-searxng-json.mjs) - direct SearXNG JSON smoke test.
- [scripts/install-claude-code.mjs](scripts/install-claude-code.mjs) - dry-run-first Claude Code MCP installer.

## Current Scope

First release scope:

- Claude Code
- SearXNG
- stdio MCP adapter command
- JSON endpoint verification
- privacy-safe instructions

Codex, OpenClaw, remote HTTP MCP servers, and managed team setups should be added only after equivalent verification exists.

## Privacy Reality

Local SearXNG avoids sending queries to a random public SearXNG instance, but selected upstream search engines still receive the search query. This repository provides instruction guards and local verification, not automatic removal of private content from every query.

## References

- [awesome-agent-search](https://github.com/DeeeFOX/awesome-agent-search)
- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
- [SearXNG Search API documentation](https://docs.searxng.org/dev/search_api.html)
- [SearXNG settings documentation](https://docs.searxng.org/admin/settings/settings.html)

## License

MIT. See [LICENSE](LICENSE).
