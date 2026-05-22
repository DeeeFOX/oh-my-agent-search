# Oh My Agent Search

English | [中文](README.zh-CN.md)

> Add privacy-aware SearXNG search to Claude Code through MCP, then verify it before use.

This is the installable companion to [awesome-agent-search](https://github.com/DeeeFOX/awesome-agent-search). The awesome repository explains the research, comparisons, and safety model. This repository focuses on a runnable Claude Code starter.

## What It Does

- verifies that a trusted SearXNG endpoint supports JSON search
- generates the Claude Code MCP command for a SearXNG search adapter
- installs only when `--apply` is provided
- keeps real endpoints out of committed files
- provides a reusable Claude Code search instruction
- documents smoke tests and negative tests

## Quick Start

Use a trusted SearXNG endpoint. Shared docs use a placeholder:

```sh
export SEARXNG_URL="https://search.example.org"
```

Verify JSON output:

```sh
npm run verify:searxng -- --url "$SEARXNG_URL"
```

Preview the Claude Code MCP command:

```sh
npm run install:claude-code -- --url "$SEARXNG_URL"
```

Install after reviewing the command:

```sh
npm run install:claude-code -- --url "$SEARXNG_URL" --apply
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
npm run verify:searxng -- --url https://search.example.org
npm run install:claude-code -- --url https://search.example.org
npm run install:claude-code -- --url https://search.example.org --apply
```

`install:claude-code` defaults to dry-run. It does not modify Claude Code unless `--apply` is passed.

## Repository Layout

- [docs/claude-code.md](docs/claude-code.md) - Claude Code setup and verification.
- [docs/searxng.md](docs/searxng.md) - SearXNG endpoint requirements.
- [docs/security.md](docs/security.md) - privacy and MCP safety guidance.
- [templates/claude-code-instruction.md](templates/claude-code-instruction.md) - local instruction template.
- [templates/mcp-server.json](templates/mcp-server.json) - project-scope MCP template using environment expansion.
- [scripts/doctor.mjs](scripts/doctor.mjs) - local readiness checks.
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
