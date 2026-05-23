# Post-Install Lifecycle

Search works only when both are true:

```text
Claude Code MCP config exists
SearXNG endpoint is reachable
```

## Scope Behavior

| Scope | Behavior |
| --- | --- |
| `local` | Current project only. |
| `user` | Available across the user's Claude Code projects. |
| `project` | Shared project config. Review before committing. |

The default installer scope is `local`.

## After Restart Or New Session

Check:

```sh
claude mcp list
claude mcp get searxng
make status URL="$SEARXNG_URL"
```

Inside Claude Code:

```text
/mcp
```

If MCP is connected but search fails, verify the endpoint:

```sh
make verify-search URL="$SEARXNG_URL"
```

## Remove

Use an explicit scope:

```sh
make uninstall-preview SCOPE=local
make uninstall-apply SCOPE=local
```

If using local Docker Compose, stop SearXNG separately:

```sh
docker compose down
```
