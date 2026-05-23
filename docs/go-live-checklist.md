# Go-Live Checklist

Use this after install or scope changes.

## 1. Check Existing MCP Config

```sh
claude mcp get searxng
```

Expected:

- the server exists
- scope matches the intended lifecycle
- no duplicate same-name entry is needed in another scope

## 2. Check Local Status

```sh
make status URL="$SEARXNG_URL"
```

Agent-readable form:

```sh
npm --silent run status -- --url "$SEARXNG_URL" --json
```

Expected:

- Claude Code CLI is available
- MCP server is configured
- SearXNG JSON check passes
- search check passes

## 3. Check Claude Code Session

Inside Claude Code:

```text
/mcp
```

Expected:

- SearXNG MCP tools are visible
- no endpoint startup error is shown

MCP connected status is not enough by itself. Search also requires the SearXNG endpoint to be reachable.

## 4. Smoke Test

Ask Claude Code:

```text
Use the configured SearXNG MCP tool to search for one public official documentation page about SearXNG Search API. Open the most relevant result, cite the URL, and explain whether search is working. Do not include private project context in the query.
```

Expected:

- query is public-safe
- answer cites an opened public URL
- answer states whether search is working

## 5. Lifecycle Check

Ask Claude Code:

```text
Explain whether this SearXNG MCP search setup will still work after restarting Claude Code, opening a second Claude Code session, or switching projects. Base the answer on the configured MCP scope and endpoint reachability. Do not print private endpoints, local paths, usernames, or raw command output.
```

Expected:

- answer distinguishes MCP config from endpoint availability
- answer explains `local`, `user`, or `project` scope accurately
- answer avoids private values

The setup is live when status passes and Claude Code can complete the public-safe smoke test.
