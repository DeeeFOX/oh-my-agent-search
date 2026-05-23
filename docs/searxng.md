# SearXNG Requirements

Claude Code needs structured search results. Use a trusted SearXNG endpoint with JSON output enabled.

## Endpoint

Use one of:

- a self-hosted SearXNG instance
- a trusted managed SearXNG endpoint
- the local test endpoint from [Local SearXNG setup](local-searxng.md)

Do not use random public instances for durable workflows.

## JSON Output

SearXNG must allow JSON output:

```yaml
search:
  formats:
    - html
    - json
```

Verify:

```sh
make verify-json URL=https://search.example.org
make verify-search URL=https://search.example.org
```

`403 Forbidden` usually means JSON output is disabled.

## Query Rules

Search only public information. Rewrite private tasks into narrow public-safe queries. Prefer official sources and cite opened public URLs.

Do not include private code, issue text, local paths, private hosts, credentials, customer data, or private endpoint values.

## References

- [SearXNG Search API documentation](https://docs.searxng.org/dev/search_api.html)
- [SearXNG settings documentation](https://docs.searxng.org/admin/settings/settings.html)
