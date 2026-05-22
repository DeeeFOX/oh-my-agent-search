# Oh My Agent Search

[English](README.md) | 中文

> 通过 MCP 为 Claude Code 添加隐私友好的 SearXNG 搜索能力，并在使用前完成验证。

这是 [awesome-agent-search](https://github.com/DeeeFOX/awesome-agent-search) 的安装型 companion 仓库。awesome 仓库负责研究、对比和安全模型；本仓库负责可运行的 Claude Code starter。

## 它做什么

- 验证可信 SearXNG endpoint 是否支持 JSON 搜索
- 生成 Claude Code MCP 接入命令
- 可用 `--check-first` 在安装前验证 SearXNG
- 默认 dry-run，只有传入 `--apply` 才会安装
- 避免把真实 endpoint 写入公开文件
- 提供可复用的 Claude Code 搜索指令
- 提供 smoke test 和 negative test

## 快速开始

使用一个可信的 SearXNG endpoint。公开文档中使用占位符：

```sh
export SEARXNG_URL="https://search.example.org"
```

运行任何网络验证命令前，把占位符替换成真实可信 endpoint。

如果还没有可信 endpoint，可以先启动本地 SearXNG：

```sh
make setup-searxng
npm run setup:searxng -- --apply --start
export SEARXNG_URL="http://127.0.0.1:8080"
```

如果默认搜索引擎在当前地区不可用，请选择当前地区可用的搜索引擎 profile：

```sh
make setup-searxng PROFILE=bing-only
npm run setup:searxng -- --profile bing-only --apply --start
```

只验证 JSON 输出：

```sh
make verify-json URL="$SEARXNG_URL"
```

验证搜索至少返回一条结果：

```sh
make verify-search URL="$SEARXNG_URL"
```

预览 Claude Code MCP 命令：

```sh
make install-preview URL="$SEARXNG_URL"
```

先验证 endpoint，再预览安装命令：

```sh
make install-preview-check URL="$SEARXNG_URL"
```

确认后安装：

```sh
make install-apply-check URL="$SEARXNG_URL"
```

检查 Claude Code 是否识别 server：

```sh
claude mcp list
claude mcp get searxng
```

在 Claude Code 里运行：

```text
/mcp
```

然后把 [templates/claude-code-instruction.md](templates/claude-code-instruction.md) 中的指令加入本地项目或当前 session。

如果需要移除 MCP server：

```sh
make uninstall-preview
make uninstall-apply
```

## 安全模型

SearXNG 只用于公开信息搜索。不要把以下内容放进搜索 query：

- secrets、credentials、cookies 或 session material
- 私有代码或私有 issue 内容
- 私有 hostname 或私有 endpoint
- 本机绝对路径
- customer data
- 会暴露意图的未发布项目名

优先使用 `local` 或 `user` MCP scope。只有在团队审核过 `.mcp.json` 后，才使用 `project` scope。

## 当前范围

第一版只覆盖：

- Claude Code
- SearXNG
- stdio MCP adapter command
- JSON endpoint 验证
- 隐私友好的默认指令

Codex、OpenClaw、remote HTTP MCP servers 和团队托管方案，应该等到有同等验证后再加入。

## 调研如何落地

[docs/research-to-starter.md](docs/research-to-starter.md) 说明了如何把 `awesome-agent-search` 中的调研结论拆成安装型 starter：SearXNG JSON 验证、Claude Code MCP 接入、dry-run installer、安全指令、smoke test 和 negative test。

[docs/adapter-choice.md](docs/adapter-choice.md) 说明了为什么当前默认生成 `npx -y mcp-searxng` 形态，以及未来替换 adapter 的标准。

[docs/local-searxng.md](docs/local-searxng.md) 说明了如何在没有可信 endpoint 时，用本地 Docker Compose 先启动一个 SearXNG。

[docs/troubleshooting.md](docs/troubleshooting.md) 记录了脱敏后的真实使用问题和处理方式。

[docs/privacy-reality.md](docs/privacy-reality.md) 说明 local SearXNG 的真实隐私边界：它避免使用随机公共 SearXNG 实例，但上游搜索引擎仍会收到 query；本仓库提供的是指令约束和验证流程，不是自动清洗所有 query 的强制网关。
