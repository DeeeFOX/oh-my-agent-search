# Contributing

Thanks for improving `oh-my-agent-search`. Keep changes focused on helping users add self-hosted-friendly SearXNG search to Claude Code through MCP.

## Boundaries

- Do not commit secrets, credentials, cookies, session material, private endpoints, private proxy values, personal emails, customer data, or local absolute paths.
- Keep installers dry-run by default.
- Require `--apply` for MCP config changes.
- Require explicit `--scope` for uninstall apply.
- Prefer `local` or `user` scope.
- Use `project` scope only after reviewing shared config.
- Use JSON output for automation instead of scraping human-readable text.

## Before Opening A PR

Run:

```sh
make review
```

For endpoint-specific work, also run:

```sh
make verify-search URL="https://search.example.org"
```

Use a sanitized endpoint in public issue or PR text. Do not paste real private URLs or local paths.

## Good Changes

- clearer Claude Code MCP setup docs
- safer install, uninstall, and status behavior
- better SearXNG verification and troubleshooting
- public-safe go-live prompts
- GitHub discovery metadata and examples that do not change runtime behavior

This repository is an installable starter, not a general search-agent catalog.
