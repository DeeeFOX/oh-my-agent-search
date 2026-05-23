# Starter Compared With SearXNG MCP Servers

This repository is optimized for Claude Code users who want a safe, repeatable way to add SearXNG search through MCP. It is not trying to be another generic SearXNG MCP server.

## What This Starter Does

- verifies SearXNG JSON/search before installing
- previews Claude Code MCP config changes before applying them
- requires explicit `--apply` for MCP config changes
- defaults to `local` MCP scope
- supports `user` scope for a trusted endpoint shared across your projects
- keeps real endpoint values out of the repository
- provides public-safe go-live prompts and JSON output for automation

## How Generic SearXNG MCP Servers Differ

Generic SearXNG MCP servers usually focus on the server implementation and tool features. They may be the right choice when you need a standalone package, custom search tools, scraping behavior, SSE/HTTP transport, or a server that works the same way across multiple MCP clients.

This starter focuses on the Claude Code setup path around an adapter command. It values dry-run install, endpoint verification, MCP scope hygiene, and privacy-aware usage over adding more search tools.

## Choose This Starter When

- you want to add SearXNG search to Claude Code quickly
- you already have, or can start, a trusted SearXNG endpoint
- you want a preview before Claude Code MCP config changes
- you prefer `local` or `user` MCP scope over shared project config
- you need a small starter that another developer can audit
- you want JSON status output for agent or script automation

## Choose A Generic MCP Server When

- you are building or maintaining the MCP search server itself
- you need server features outside this starter's install path
- you want a package meant to be submitted as a standalone MCP server
- you need a transport or runtime model different from the current adapter command

If you replace the adapter, keep the same safety bar: verified install command, successful search smoke test, explicit scope choice, and public-safe query guidance.
