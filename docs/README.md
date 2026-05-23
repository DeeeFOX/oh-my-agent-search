# Documentation Map

This repository is an installable starter. Read the docs in this order unless you are maintaining the research or security background.

## Build The Current Path

- [Claude Code setup](claude-code.md) - step-by-step Claude Code integration.
- [Local SearXNG setup](local-searxng.md) - local Docker Compose endpoint when no trusted endpoint exists.
- [SearXNG requirements](searxng.md) - endpoint policy, JSON output, engine selection, and query rules.
- [Agent runbook](agent-runbook.md) - machine-readable workflow for AI agents or scripted setup.

## Verify And Operate

- [Go-live checklist](go-live-checklist.md) - final acceptance checks after installation.
- [Post-install lifecycle](post-install.md) - scope, restart, second-session, and removal behavior.
- [Troubleshooting](troubleshooting.md) - sanitized setup lessons and common failures.

## Safety And Hardening

- [Security guidance](security.md) - query privacy, MCP scope, URL-reading boundaries, and installer safety.
- [Privacy reality](privacy-reality.md) - what local SearXNG improves and what it cannot guarantee.
- [Deployment hardening](deployment-hardening.md) - operator-side checklist for durable SearXNG endpoints.

## Research And Decisions

- [Research to starter](research-to-starter.md) - rules for converting research into installable starter material.
- [Adapter choice](adapter-choice.md) - current default adapter and replacement criteria.
- [MCP adapter comparison](mcp-adapter-comparison.md) - dated comparison matrix behind adapter decisions.
- [SearXNG Claude Code research](searxng-claude-code-research.md) - sanitized research background, not an install guide.

## Localized Background

Chinese translations for the longer research/background notes live under [zh-CN](zh-CN/):

- [部署加固](zh-CN/deployment-hardening.md)
- [MCP SearXNG Server 对比](zh-CN/mcp-adapter-comparison.md)
- [SearXNG MCP 与 Claude Code 集成研究](zh-CN/searxng-claude-code-research.md)
