# Claude Code Setup

## Goal

Add a SearXNG-backed MCP search server to Claude Code and verify it before relying on it.

This is the currently implemented direction in this starter. Other agents can read the repository and help with setup, but this page only describes the Claude Code integration path.

## Quickstart

Use a trusted SearXNG endpoint, or start a local development endpoint with [Local SearXNG Setup](local-searxng.md).

```sh
export SEARXNG_URL="https://search.example.org"
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
make status URL="$SEARXNG_URL"
```

Then verify the MCP server in Claude Code:

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code:

```text
/mcp
```

Use [templates/go-live-prompts.md](../templates/go-live-prompts.md) for the post-install search, lifecycle, and privacy checks.

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

## Machine-Readable Output

Use `--json` when another agent or script needs to parse command results:

```sh
npm --silent run verify:json -- --url "$SEARXNG_URL" --json
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
npm --silent run status -- --url "$SEARXNG_URL" --json
```

Use the human-readable output for manual review. Use JSON output for automation and do not parse PASS/WARN/FAIL prose. Use `npm --silent run` or direct `node scripts/...` commands when stdout must be pure JSON.

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
- [awesome-agent-search Claude Code MCP guide](https://github.com/DeeeFOX/awesome-agent-search/blob/main/docs/integrations/claude-code-mcp.md)
