# Agent Guide

## Mission

Help users add privacy-aware SearXNG search to Claude Code through MCP.

## Scope

This repository is an installable starter, not a general awesome list.

Agents may update:

- setup docs
- templates
- verification scripts
- dry-run installers
- security guidance
- compatibility notes

Agents must not add:

- secrets
- tokens
- cookies
- session material
- personal email addresses
- private endpoints
- local absolute paths
- private proxy values

## Required Checks

Run:

```sh
make review
```

For endpoint-specific work, also run:

```sh
make verify-searxng URL="$SEARXNG_URL"
```

Use a real endpoint only in local commands. Do not commit it.

## Safety Rules

- Default installers to dry-run.
- Require `--apply` for commands that modify Claude Code MCP configuration.
- Prefer `local` or `user` MCP scope.
- Require explicit confirmation before using `project` scope.
- Never auto-write `.mcp.json` with a real endpoint.
- Keep URL reading separate from search.
- Do not recommend random public SearXNG instances for durable workflows.

## Submission Rules

Every substantial change should state:

- problem
- approach
- expected benefit
- privacy considerations
- verification performed
