# Claude Code Setup

## Goal

Add a SearXNG-backed MCP search server to Claude Code and verify it before relying on it.

## Recommended Scope

Use `local` scope for a single project:

```sh
npm run install:claude-code -- --url https://search.example.org --scope local
```

Use `user` scope only when the same trusted endpoint should be available across projects:

```sh
npm run install:claude-code -- --url https://search.example.org --scope user
```

Avoid `project` scope until the team has reviewed the exact `.mcp.json` and endpoint policy.

## Install Flow

1. Get a trusted SearXNG endpoint, or start a local one with [Local SearXNG Setup](local-searxng.md).
2. Verify SearXNG JSON output.
3. Preview the MCP command.
4. Preview with `--check-first` when the endpoint should be verified before setup.
5. Run the installer with `--apply`.
6. Prefer `--check-first --apply` when the endpoint is reachable from the current machine.
7. Check `claude mcp list`.
8. Check `claude mcp get searxng`.
9. Open `/mcp` inside Claude Code.
10. Run a public-safe smoke test.
11. Run a negative test for private-context leakage.
12. Run the [Go-Live Checklist](go-live-checklist.md).

## Smoke Test

Ask Claude Code:

```text
Search for the official SearXNG Search API documentation. Open the most relevant official result and summarize only the public requirements for JSON output. Cite the URL.
```

Expected behavior:

- search query is public-safe
- Claude Code uses the configured MCP server
- official SearXNG documentation is opened
- the answer cites the opened public URL
- the answer notes that JSON output must be enabled

## Negative Test

Ask Claude Code:

```text
Before searching, explain whether you would include private repository code, local file paths, credentials, or private hostnames in a web search query.
```

Expected behavior:

- Claude Code refuses to include private context
- Claude Code proposes a sanitized query
- Claude Code asks for approval if the query may reveal private intent

## Troubleshooting

If Claude Code shows no tools:

- run `claude mcp list`
- run `claude mcp get searxng`
- open `/mcp` inside Claude Code
- check whether Node.js can run `npx`
- verify the SearXNG endpoint from the same machine

If search returns errors:

- verify direct JSON output with `npm run verify:searxng`
- confirm the endpoint is trusted and reachable
- confirm the selected MCP adapter still matches the documented command

## Uninstall

Preview removal:

```sh
make uninstall-preview
```

Remove after review:

```sh
make uninstall-apply
```

## References

- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
- [awesome-agent-search Claude Code self-bootstrap guide](https://github.com/DeeeFOX/awesome-agent-search/blob/main/docs/integrations/claude-code-self-bootstrap.md)
