# Go-Live Checklist

Run this checklist after installing the Claude Code MCP server.

## Local Status

```sh
make status URL="$SEARXNG_URL"
```

Expected:

- Node.js is available
- Claude Code CLI is available
- Claude MCP server is configured
- JSON endpoint check passes
- search result check passes

## Claude MCP Status

```sh
claude mcp list
claude mcp get searxng
```

Expected:

- server is listed
- status is connected
- scope matches the user's intended lifecycle

## In-Session Status

Inside Claude Code:

```text
/mcp
```

Expected:

- SearXNG MCP tools are visible
- no endpoint or startup error is shown

## Agent Search Smoke Test

Ask Claude Code:

```text
Use the configured SearXNG MCP tool to search for one public official documentation page about SearXNG Search API. Open the most relevant result, cite the URL, and explain whether search is working. Do not include private project context in the query.
```

Expected:

- Claude Code uses the SearXNG MCP search tool
- query is public-safe
- answer cites an opened public URL
- answer states whether the search capability is working

## Lifecycle Check

Ask Claude Code:

```text
Explain whether this SearXNG MCP search setup will still work after restarting Claude Code, opening a second Claude Code session, or switching projects. Base the answer on the configured MCP scope and whether the SearXNG endpoint is reachable. Do not print private endpoints, local absolute paths, usernames, account identifiers, or raw command output.
```

Expected:

- answer distinguishes MCP config from endpoint availability
- answer states the configured scope
- answer avoids claiming all projects have search unless scope is `user`
- answer explains that `local` scope requires setup per project folder
- answer tells the user to run `/mcp` or restart the session if tools are not visible
- answer does not recommend bypassing regional search-engine restrictions

## Completion Criteria

The setup is live when:

- `make status URL="$SEARXNG_URL"` passes
- Claude MCP status is connected
- Claude Code can perform a public-safe search through SearXNG
- the user understands scope and lifecycle behavior
