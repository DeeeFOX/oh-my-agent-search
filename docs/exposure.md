# Exposure Checklist

Use this checklist to make `oh-my-agent-search` easier to find, share, and evaluate on GitHub. Keep it repository-focused: do not publish to npm, submit external registries, or post from personal accounts as part of this repo workflow.

## Positioning

Primary description:

```text
A self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP.
```

Longer share copy:

```text
Oh My Agent Search is a self-contained, self-hosted-friendly SearXNG search starter for Claude Code through MCP. It helps developers bring their own trusted or self-hosted SearXNG endpoint, preview MCP config changes, install with an explicit --apply step, and keep search queries public-safe.
```

Primary keywords:

- Claude Code
- MCP
- Model Context Protocol
- SearXNG
- self-hosted search
- bring-your-own SearXNG
- privacy-aware search
- dry-run installer
- local verification
- agent search

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

Topics:

```text
claude-code
mcp
model-context-protocol
searxng
self-hosted
search
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

## Release Notes Template

Use this for the first GitHub release.

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

Channels to consider manually:

- GitHub profile pinned repositories
- project README references in related private notes or public blog posts
- Claude Code or MCP community discussions where self-promotion is allowed
- SearXNG self-hosting notes where the setup is directly relevant

## Metrics

Track these weekly after README and GitHub metadata changes:

- GitHub stars and forks
- issue count by category
- clone and view traffic in GitHub Insights
- search terms that led users to the repository, when visible
- README click-through to `docs/claude-code.md` and `docs/local-searxng.md`

Prefer small, measurable changes. If a description or README section changes, wait long enough to observe GitHub search and traffic behavior before rewriting it again.
