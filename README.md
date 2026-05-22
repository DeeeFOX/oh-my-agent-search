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

Verify JSON output:

```sh
make verify-searxng URL="$SEARXNG_URL"
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

Remove the Claude Code MCP server if needed:

```sh
make uninstall-preview
make uninstall-apply
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
npm run install:claude-code -- --url https://search.example.org
npm run install:claude-code -- --url https://search.example.org --apply
npm run uninstall:claude-code
make doctor
make setup-searxng
make install-preview URL=https://search.example.org
make install-apply URL=https://search.example.org
make uninstall-preview
```

With a real trusted endpoint:

```sh
npm run verify:searxng -- --url "$SEARXNG_URL"
npm run install:claude-code -- --url "$SEARXNG_URL" --check-first
make verify-searxng URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
```

`install:claude-code` defaults to dry-run. It does not modify Claude Code unless `--apply` is passed.

## Repository Layout

- [docs/adapter-choice.md](docs/adapter-choice.md) - current adapter default and replacement criteria.
- [docs/claude-code.md](docs/claude-code.md) - Claude Code setup and verification.
- [docs/local-searxng.md](docs/local-searxng.md) - local Docker Compose SearXNG setup.
- [docs/research-to-starter.md](docs/research-to-starter.md) - how research findings become installable starter artifacts.
- [docs/searxng.md](docs/searxng.md) - SearXNG endpoint requirements.
- [docs/security.md](docs/security.md) - privacy and MCP safety guidance.
- [templates/claude-code-instruction.md](templates/claude-code-instruction.md) - local instruction template.
- [templates/mcp-server.json](templates/mcp-server.json) - project-scope MCP template using environment expansion.
- [scripts/doctor.mjs](scripts/doctor.mjs) - local readiness checks.
- [scripts/setup-searxng-local.mjs](scripts/setup-searxng-local.mjs) - dry-run-first local SearXNG setup.
- [scripts/self-test.mjs](scripts/self-test.mjs) - offline tests for installer guards and dry-run output.
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

## References

- [awesome-agent-search](https://github.com/DeeeFOX/awesome-agent-search)
- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
- [SearXNG Search API documentation](https://docs.searxng.org/dev/search_api.html)
- [SearXNG settings documentation](https://docs.searxng.org/admin/settings/settings.html)

## License

MIT. See [LICENSE](LICENSE).
