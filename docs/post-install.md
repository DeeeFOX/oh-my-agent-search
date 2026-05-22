# Post-Install Lifecycle

## Mental Model

Search capability is available when both conditions are true:

```text
Claude Code MCP config exists
+
SearXNG endpoint is reachable
=
Claude Code can use SearXNG search
```

Do not describe installation as permanently available without those conditions.

## What Persists

| Item | Lifecycle |
| --- | --- |
| Claude MCP config | Persists until removed with `claude mcp remove` or `make uninstall-apply`. |
| Local SearXNG config | Generated under ignored `.env` and `local/`; persists until deleted. |
| SearXNG container | Runs while the container runtime is available; compose uses `restart: unless-stopped`. |
| Current Claude Code session | May need `/mcp` or a restart to refresh visible MCP tools. |

## Scope Behavior

| Scope | Behavior |
| --- | --- |
| `local` | Private to the current project. Restarting Claude Code in the same project should retain the server if the endpoint is reachable. Other projects should not assume access. |
| `user` | Available across the user's Claude Code projects. Use only when the endpoint and policy are appropriate for all projects. |
| `project` | Shareable project config. Requires review because it can affect collaborators. |

The default installer scope is `local`.

## Restart Behavior

After restarting Claude Code:

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code:

```text
/mcp
```

If the MCP server is configured but search fails, check the SearXNG endpoint:

```sh
make status URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
```

## Second Client Behavior

A second Claude Code client follows the configured scope:

- same project + `local` scope: expected to work if endpoint is reachable
- different project + `local` scope: do not assume access
- any project + `user` scope: expected to work if endpoint is reachable
- `project` scope: expected to work for trusted users of that project after approval

## Disable Or Remove

Preview removal:

```sh
make uninstall-preview
```

Remove after review:

```sh
make uninstall-apply
```

If using the local Docker Compose path, stop the local service separately:

```sh
docker compose down
```

Generated local files are ignored and can be removed after review:

```sh
rm -rf local/searxng .env
```

Do not put real local paths in shared docs or issues.
