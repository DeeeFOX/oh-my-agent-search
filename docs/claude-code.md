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

1. Verify SearXNG JSON output.
2. Preview the MCP command.
3. Preview with `--check-first` when the endpoint should be verified before setup.
4. Run the installer with `--apply`.
5. Prefer `--check-first --apply` when the endpoint is reachable from the current machine.
6. Check `claude mcp list`.
7. Check `claude mcp get searxng`.
8. Open `/mcp` inside Claude Code.
9. Run a public-safe smoke test.

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

## References

- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
- [awesome-agent-search Claude Code self-bootstrap guide](https://github.com/DeeeFOX/awesome-agent-search/blob/main/docs/integrations/claude-code-self-bootstrap.md)
