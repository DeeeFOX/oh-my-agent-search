# Privacy Reality

## What Local SearXNG Improves

Running SearXNG locally or through a trusted operator gives you more control over:

- which SearXNG instance receives the query
- SearXNG logging and configuration
- enabled search engines
- rate limits and timeout behavior
- whether a random public SearXNG instance is involved

This is useful for coding-agent workflows because it makes the search boundary explicit and reviewable.

## What It Does Not Guarantee

Local SearXNG is not a private offline search index.

The selected upstream search engines still receive the search query. Do not put private repository content, customer data, credentials, internal hostnames, local absolute paths, private issue text, or unreleased project names into search queries.

This repository provides:

- dry-run-first setup
- endpoint verification
- MCP scope controls
- instruction templates
- negative tests for private-context leakage

It does not provide:

- automatic query sanitization at a network gateway
- legal advice
- a guarantee that every upstream search engine has the same privacy policy
- regional service availability workarounds

## Correct User Promise

Use this wording:

> This setup gives Claude Code an explicit, reviewable SearXNG search path and avoids relying on random public SearXNG instances.

Avoid this wording:

> This setup makes all searches completely private.

## Agent Rule

Before searching, the agent should reduce the request to a public-safe query. If the user request contains private context, the agent should ask for approval or propose a generic public query.
