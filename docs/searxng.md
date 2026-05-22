# SearXNG Requirements

## Endpoint Policy

Use self-hosted or trusted managed SearXNG for durable coding-agent workflows.

Public instances are acceptable only for quick, non-sensitive experiments. Do not configure random public-instance fallback as a default.

If no trusted endpoint exists yet, use [Local SearXNG Setup](local-searxng.md) to start a local development instance.

## JSON Output

Claude Code MCP adapters need structured search results. SearXNG must allow JSON output for the Search API.

Operator-side setting:

```yaml
search:
  formats:
    - html
    - json
```

After changing settings, restart SearXNG and verify:

```sh
make verify-searxng URL=https://search.example.org
```

If the endpoint returns `403 Forbidden`, JSON output is probably disabled.

## Safe Defaults

Recommended operator defaults:

- keep logs minimal and public-safe
- set reasonable rate limits
- avoid exposing admin surfaces publicly
- document enabled engines
- document safe-search behavior
- keep proxy and credential values out of shared configuration

## Query Rules

Agents should:

- search only after local context is insufficient
- rewrite tasks into narrow public-safe queries
- avoid private code and private issue text
- avoid local paths, private hostnames, credentials, and customer data
- prefer official sources and primary documentation
- cite opened public URLs

## References

- [SearXNG Search API documentation](https://docs.searxng.org/dev/search_api.html)
- [SearXNG settings documentation](https://docs.searxng.org/admin/settings/settings.html)
- [awesome-agent-search hardening guide](https://github.com/DeeeFOX/awesome-agent-search/blob/main/docs/hardening/searxng-deployment.md)
