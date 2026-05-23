# Exposure Plan

Use this plan to make `oh-my-agent-search` easier to find, share, and evaluate. Keep it repository-focused: do not publish to npm, automate posting, submit external registries blindly, or post from personal accounts as part of this repo workflow.

This repository should be presented as a Claude Code + SearXNG install and verification starter, not as another generic MCP search server.

## Research Snapshot

Checked on 2026-05-23 with GitHub CLI.

Baseline before the 2026-05-23 exposure update:

- public repository: `DeeeFOX/oh-my-agent-search`
- stars: `1`
- forks: `0`
- issues: enabled
- discussions: disabled
- latest release: `v0.1.0`
- About description: `Bring self-hosted search ability to AI agents through MCP.`
- topics: `agent-tools`, `ai-agents`, `claude-code`, `mcp-tools`, `model-context-protocol`, `search`, `search-engine`, `searxng`, `self-hosted`

GitHub search benchmark:

- `searxng mcp` returns several generic SearXNG MCP servers. Visible examples included `ihor-sokoliuk/mcp-searxng` with 804 stars and 122 forks, `SecretiveShell/MCP-searxng` with 118 stars and 18 forks, and `tisDDM/searxng-mcp` with 41 stars and 10 forks.
- `claude code mcp search searxng` returned Claude Code-oriented MCP search repositories, but did not surface this repository in the first ten results.
- `Claude Code SearXNG` did not surface this repository.
- `SearXNG MCP starter` returned no visible matches.

Implication: do not compete only on "SearXNG MCP server". The clearer long-tail entry is "Claude Code MCP SearXNG search starter" plus "dry-run install", "local verification", and "public-safe queries".

Refresh this snapshot before quoting numbers publicly.

Post-update repository metadata:

- About description: `A self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP.`
- homepage: `https://github.com/DeeeFOX/oh-my-agent-search#readme`
- topics now include `mcp`, `searxng-mcp`, `self-hosted-search`, `privacy`, `developer-tools`, `local-first`, `nodejs`, and `open-source`
- `v0.1.0` remains the first published release

## Positioning

Primary description:

```text
A self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP.
```

Search-friendly subtitle:

```text
Claude Code MCP SearXNG search starter for privacy-aware, self-hosted-friendly agent search.
```

Longer share copy:

```text
Oh My Agent Search is a self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP. It helps developers bring their own trusted or self-hosted SearXNG endpoint, preview MCP config changes, install with an explicit --apply step, and keep search queries public-safe.
```

Use these keywords naturally in README headings, docs titles, release notes, and community posts:

- Claude Code
- Claude Code MCP search
- SearXNG
- SearXNG MCP
- Model Context Protocol
- self-hosted search
- bring-your-own SearXNG
- privacy-aware search
- dry-run installer
- local verification
- public-safe queries
- agent search

## Highest-Leverage Actions

Do these first because they improve discovery without changing runtime behavior.

1. Update GitHub About description to the primary description above.
2. Upload `assets/social-preview.png` as the GitHub social preview.
3. Add missing topics from the topic set below.
4. Keep `v0.1.0` as the first trust artifact and publish follow-up releases only for meaningful docs or install improvements.
5. Pin the repository on the owner's GitHub profile if it is meant to be public-facing.
6. Keep README first-screen copy focused on `Claude Code`, `MCP`, and `SearXNG`.

## GitHub Settings

Set these manually in the GitHub repository settings.

About description:

```text
A self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP.
```

Website:

```text
https://github.com/DeeeFOX/oh-my-agent-search#readme
```

Recommended topics:

```text
claude-code
mcp
mcp-tools
model-context-protocol
searxng
searxng-mcp
self-hosted
self-hosted-search
search
search-engine
privacy
ai-agents
agent-tools
developer-tools
nodejs
local-first
open-source
```

Social preview:

- Upload `assets/social-preview.png`.
- Keep `assets/social-preview.svg` as the editable source artwork.
- Do not include real endpoints, local paths, personal emails, or proxy values in preview images.
- GitHub CLI and the GitHub GraphQL `updateRepository` mutation do not expose a social preview upload field, so this remains a manual GitHub Settings step.

Discussion settings:

- Keep issues enabled.
- Enable discussions only after there is recurring setup/support traffic. Until then, issues with the `setup` template are easier to triage and keep searchable.

## README And Docs SEO

High-value README improvements:

- Keep the subtitle near the top: `Claude Code MCP SearXNG search starter for privacy-aware, self-hosted-friendly agent search.`
- Keep the quick start above deep background.
- Add or preserve exact phrases users may search for: `add SearXNG search to Claude Code`, `Claude Code MCP search`, `self-hosted SearXNG endpoint`, `local MCP scope`, `user MCP scope`.
- Avoid broad claims like "private search". Use "privacy-aware" or "public-safe" because upstream engines may still receive queries.
- Keep the "not a general agent catalog" boundary visible in contributing docs and comparison docs, not as the first message in README.

Long-tail docs:

- `docs/faq.md`: short Q&A for common search phrases.
- `docs/comparison.md`: explain how this starter differs from generic SearXNG MCP servers.
- `docs/examples/local-first.md`: one complete local setup walkthrough.

## Release Notes Template

Use this copy for `v0.1.0` and keep future release notes focused on concrete docs or install improvements.

```md
## v0.1.0

Initial self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP.

Highlights:

- verify SearXNG JSON/search before installing
- preview Claude Code MCP config before applying changes
- install with explicit `--apply`
- default to `local` scope
- start a local SearXNG test endpoint
- use go-live prompts for search, lifecycle, and privacy checks

Safety:

- do not search with secrets, private code, private hostnames, private endpoints, local paths, customer data, or unreleased names
- keep real endpoint values out of the repository
- use JSON output for automation
```

## Distribution Channels

Use channels where the repository directly helps the audience. Do not automate posting or cross-post generic self-promotion.

Good manual channels:

- GitHub profile pinned repositories.
- GitHub release notes for `v0.1.0` and later meaningful versions.
- Claude Code or MCP community discussions where setup tools are welcome.
- SearXNG self-hosting discussions when the use case is agent search with a trusted endpoint.
- Blog posts or notes that solve a concrete setup problem, such as "Add SearXNG search to Claude Code with local MCP scope".
- Related README references in projects or notes that already discuss Claude Code, SearXNG, or MCP.

Directory and registry caution:

- Many MCP directories list actual MCP servers, not setup starters.
- Do not submit this repository as a generic MCP server unless the directory explicitly accepts setup guides or companion starters.
- If a directory entry is appropriate, describe it as a Claude Code SearXNG starter and point to the README, not as a standalone server package.

## Community Copy

Short post:

```text
Built a small Claude Code MCP starter for bringing your own SearXNG search endpoint into Claude Code. It focuses on dry-run install, local verification, endpoint privacy, and public-safe search prompts instead of being a general agent catalog.

Repo: https://github.com/DeeeFOX/oh-my-agent-search
```

Long post:

```text
Claude Code is more useful with search, but agent search can leak private context through queries. Oh My Agent Search is a small starter for bringing your own trusted or self-hosted SearXNG endpoint into Claude Code through MCP.

It verifies SearXNG JSON/search first, previews MCP config changes, requires explicit --apply for install, defaults to local scope, and includes go-live prompts for search, lifecycle, and privacy checks.

Repo: https://github.com/DeeeFOX/oh-my-agent-search
```

Directory pitch:

```text
Oh My Agent Search is a Claude Code + SearXNG MCP starter. It is not a standalone search engine or a generic MCP catalog. It helps users verify a trusted SearXNG endpoint, preview Claude Code MCP config changes, install with explicit --apply, and run privacy-aware go-live checks.
```

## 30-Day Plan

Week 1:

- Update GitHub About description, topics, and social preview.
- Confirm `v0.1.0` is published and linked from the repository sidebar.
- Pin the repository if it should be publicly promoted.
- Verify GitHub search visibility for `oh-my-agent-search`, `Claude Code SearXNG`, and `SearXNG MCP starter`.

Week 2:

- Review traffic to `docs/faq.md`, `docs/comparison.md`, and `docs/examples/local-first.md`.
- Share one concrete setup note in one relevant community where self-promotion is allowed.
- Ask for setup feedback from users who already run Claude Code and SearXNG.

Week 3:

- Review issues and search terms.
- Improve troubleshooting docs around any repeated setup failure.
- Add one screenshot or terminal transcript only if it clarifies the install flow without exposing private values.

Week 4:

- Decide whether a directory listing is accurate and allowed.
- Publish a small follow-up release if the first feedback cycle finds docs or install improvements.
- Compare star, fork, issue, and traffic movement against the baseline.

## Metrics

Track these weekly after README and GitHub metadata changes:

- GitHub stars and forks
- clone and view traffic in GitHub Insights
- referring sites in GitHub Insights
- issue count by category
- release page visits or downloads when available
- README click-through to `docs/claude-code.md` and `docs/local-searxng.md`
- README click-through to `docs/faq.md`, `docs/comparison.md`, and `docs/examples/local-first.md`
- search terms that led users to the repository, when visible
- community post impressions, replies, or saves if posted manually

Weekly GitHub search checks:

```text
oh-my-agent-search
Claude Code SearXNG
SearXNG MCP starter
Claude Code MCP search searxng
```

Prefer small, measurable changes. If a description, README section, or topic set changes, wait long enough to observe GitHub search and traffic behavior before rewriting it again.

## Avoid

- Do not promise fully private search. SearXNG can reduce exposure to random public instances, but selected upstream engines may still receive queries.
- Do not submit real endpoints, proxy settings, local paths, or personal contact details in examples.
- Do not publish this package to npm from this repository workflow. It is currently a starter that uses `mcp-searxng`, not the published MCP server itself.
- Do not chase broad "AI agent" keywords at the expense of the clearer Claude Code + SearXNG installation niche.
