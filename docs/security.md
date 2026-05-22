# Security Guidance

## Threat Model

Adding web search to a coding agent creates two main risks:

- the agent may leak private context in a search query
- the adapter may expose URL-reading behavior that reaches unsafe targets

This repository defaults to explicit verification and narrow instructions instead of hidden search behavior.

## Do Not Search With Private Context

Never include:

- secrets
- credentials
- cookies
- session material
- customer data
- private code excerpts
- private issue text
- private hostnames
- private endpoints
- local absolute paths

When a task contains private context, rewrite it into a general public query.

## MCP Scope

Claude Code supports local, user, and project scopes.

Recommended defaults:

- `local` for a single repository
- `user` for a personal trusted setup across repositories
- `project` only after team review

Project scope can be useful, but it also creates a shared configuration file. Do not commit real endpoint values or credentials.

## URL Reading

Some adapters expose page-reading tools in addition to search.

Treat URL reading as a separate permission boundary:

- open only public URLs
- avoid authenticated pages
- avoid private-network targets
- cap retrieved content
- cite opened URLs

## Installer Safety

The installer is dry-run by default. It requires `--apply` before modifying Claude Code MCP configuration.

Use `--allow-project-scope` only after reviewing the project-scope implications.
