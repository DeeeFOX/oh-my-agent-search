# Security Guidance

Adding search to a coding agent creates one main risk: private context can leak through a search query.

## Do Not Search With

- secrets, credentials, cookies, or session material
- private code or issue text
- private hostnames or endpoints
- local absolute paths
- customer data
- unreleased names that reveal intent

Rewrite private tasks into public-safe queries before searching.

## SearXNG Reality

Local SearXNG avoids random public instances, but upstream search engines still receive the query. Treat every search query as public.

## MCP Scope

- `local`: best default for one project
- `user`: acceptable for a personal trusted endpoint across projects
- `project`: use only after reviewing the shared `.mcp.json`

## Installer Safety

- install and uninstall preview by default
- mutating commands require `--apply`
- uninstall `--apply` requires explicit `--scope`
- never commit real endpoints or credentials
