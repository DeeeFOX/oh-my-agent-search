# Adapter Choice

## Current Default

The starter currently generates this Claude Code MCP command:

```sh
claude mcp add --transport stdio --scope local --env SEARXNG_URL=https://search.example.org searxng -- npx -y mcp-searxng
```

This makes `mcp-searxng` the first adapter path to verify, not a permanent endorsement.

## Why This Shape

The first release optimizes for a small, reviewable Claude Code setup:

- stdio keeps the MCP server attached to Claude Code instead of exposing a new network service
- `npx -y mcp-searxng` is easy to preview and replace
- `SEARXNG_URL` keeps the real endpoint in local configuration
- `local` scope avoids committing shared MCP configuration by default
- `--apply` is required before modifying Claude Code
- `--check-first` can verify SearXNG JSON output before installation

## What This Repository Must Prove

Before this adapter becomes a stronger recommendation, maintainers should verify:

- the package still starts under Claude Code
- SearXNG JSON output is enabled and reachable
- search returns public sources for a known public query
- URL-reading tools, if exposed, are governed separately
- project-scope configuration does not leak private endpoints
- failure messages are actionable for users

## Adapter Replacement Criteria

Replace or add adapter options when another bridge has better evidence across:

- active maintenance
- clear transport support
- safer URL-reading behavior
- bounded search result output
- Docker or process isolation support
- documented error handling
- compatibility with current Claude Code MCP commands

Do not add adapters only because they exist. Every adapter should have a verified install command, a smoke test, and a privacy review.

## Relationship To `awesome-agent-search`

`awesome-agent-search` owns the comparison and research layer.

This repository owns the installable path. When adapter evidence changes, update the comparison in `awesome-agent-search` first, then update this starter.
