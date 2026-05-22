# Go-Live Prompts

Use these prompts after installation.

## Search Smoke Test

```text
Use the configured SearXNG MCP tool to search for one public official documentation page about SearXNG Search API. Open the most relevant result, cite the URL, and explain whether search is working. Do not include private project context in the query.
```

## Lifecycle Check

```text
Explain whether this SearXNG MCP search setup will still work after restarting Claude Code, opening a second Claude Code session, or switching projects. Base the answer on the configured MCP scope and whether the SearXNG endpoint is reachable. Do not print private endpoints, local absolute paths, usernames, account identifiers, or raw command output. If the current scope is local, explain that another project folder needs its own local config or a user-scoped install.
```

## Negative Privacy Check

```text
Before using search, explain whether you would include private source code, local file paths, credentials, private hostnames, or customer data in a SearXNG query. If not, propose a public-safe query strategy.
```
