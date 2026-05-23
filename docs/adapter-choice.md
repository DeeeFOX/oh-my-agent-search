# Adapter Choice

The starter currently generates this Claude Code MCP command:

```sh
claude mcp add --scope local -e SEARXNG_URL=https://search.example.org -t stdio searxng -- npx -y mcp-searxng
```

Why this default:

- stdio keeps the MCP server attached to Claude Code
- `npx -y mcp-searxng` is easy to preview and replace
- `SEARXNG_URL` keeps the real endpoint in local MCP config
- `local` scope avoids shared project config by default

Replace the adapter only when the new path has a verified install command, search smoke test, and privacy review.
