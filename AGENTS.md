# Agent Guide

Help users add privacy-aware SearXNG search to Claude Code through MCP.

This repository is an installable starter, not a general search-agent catalog.

## Rules

- Do not commit secrets, credentials, cookies, session material, private endpoints, private proxy values, personal emails, customer data, or local absolute paths.
- Keep installers dry-run by default.
- Require `--apply` for MCP config changes.
- Require explicit `--scope` for uninstall apply.
- Prefer `local` or `user` scope.
- Use `project` scope only after reviewing shared config.
- Use JSON output for automation instead of scraping human-readable text.

## Checks

Run:

```sh
make review
```

For endpoint-specific work, also run:

```sh
make verify-search URL="$SEARXNG_URL"
```
