# Oh My Agent Search

[English](README.md) | 中文

[![Check](https://github.com/DeeeFOX/oh-my-agent-search/actions/workflows/check.yml/badge.svg)](https://github.com/DeeeFOX/oh-my-agent-search/actions/workflows/check.yml)

面向 Claude Code 的 MCP SearXNG search starter：把你自己的可信或 self-hosted SearXNG endpoint 接入 coding agent，并提供本地验证、dry-run installer 和公开安全搜索指引。

当你希望 Claude Code 通过可信 SearXNG endpoint 搜索，同时避免提交私有 endpoint、误改 MCP 配置，或依赖随机公开搜索实例时，可以使用这个仓库。

## 为什么需要它

coding agent 接入搜索后更有用，但搜索 query 也可能泄露私有上下文。这个 starter 为 Claude Code 提供一条可重复的 SearXNG MCP 接入路径，并把风险点显式化：

- 安装前验证 SearXNG JSON/search 是否可用
- 应用 MCP 配置前先预览变更
- 默认使用 `local` 或 `user` scope，避免不必要的共享项目配置
- endpoint 保留在本地 MCP 配置中，不提交到仓库
- 使用 go-live prompts 检查搜索、生命周期和隐私行为

## 适合谁

- 想为 Claude Code 接入 SearXNG MCP search 的用户
- 想先测试本地 SearXNG 再交给 agent 使用的开发者
- 想接入自己维护的 self-hosted 或可信 SearXNG endpoint 的开发者
- 需要小而可审计的搜索 starter，而不是通用 agent catalog 的团队
- 需要 JSON 输出做自动化和状态检查的 agent workflow

## 提供什么

- Claude Code MCP 安装/卸载辅助脚本
- SearXNG JSON/search 可用性验证
- 本地 SearXNG 测试环境启动
- 面向不同地区搜索可用性的 engine probe
- 用于 smoke、lifecycle、privacy 检查的 go-live prompts
- 公开安全搜索的最小安全边界

## 5 分钟快速开始

`npm run` 和 `make` 命令默认在本仓库根目录运行。从其他目录执行时使用 `make -C <path-to-oh-my-agent-search> <target>`。

使用可信 SearXNG endpoint：

```sh
export SEARXNG_URL="https://search.example.org"
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
make status URL="$SEARXNG_URL"
```

检查 Claude Code：

```sh
claude mcp list
claude mcp get searxng
```

在 Claude Code 内运行：

```text
/mcp
```

安装后使用 [templates/go-live-prompts.md](templates/go-live-prompts.md) 做真实自测。

## 还没有 Endpoint

启动本地 SearXNG：

```sh
make setup-searxng
npm run setup:searxng -- --apply --start
export SEARXNG_URL="http://127.0.0.1:8080"
make verify-search URL="$SEARXNG_URL"
```

如果默认搜索引擎在当前地区没有结果，先探测候选引擎。先启动候选集合：

```sh
npm run setup:searxng -- --engines bing,yandex,google,baidu --apply --force --start
make probe-engines URL="$SEARXNG_URL"
```

然后启用所有探测通过的引擎，而不是只保留一个 fallback：

```sh
npm run setup:searxng -- --engines bing,yandex --apply --force --start
make verify-search URL="$SEARXNG_URL"
```

`bing-only` 这类单引擎 profile 只作为排障 fallback。

## 常见使用场景

- 用 `local` MCP scope 为单个 Claude Code 项目增加 SearXNG search。
- 用 `user` MCP scope 在多个项目复用同一个可信 SearXNG endpoint。
- 先测试本地 SearXNG container，再接入 Claude Code。
- 检查重启 Claude Code 或切换项目后搜索是否仍然可用。
- 给其他 agent 提供 JSON 状态输出，避免解析人类可读日志。

## 为什么更安全

installer 默认 dry-run。MCP 配置变更需要显式 `--apply`，卸载 apply 需要显式 `--scope`。

默认 scope 是 `local`：

- `local`：只用于当前项目
- `user`：同一个可信 endpoint 跨项目可用
- `project`：仅在审查共享 `.mcp.json` 后使用

如果已存在 `searxng` server，安装前先确认 scope：

```sh
claude mcp get searxng
```

SearXNG 只用于公开信息搜索。不要搜索 secrets、私有代码、私有 hostname、私有 endpoint、本地路径、客户数据，或会暴露意图的未发布名称。

本地 SearXNG 避免使用随机公开实例，但上游搜索引擎仍会收到 query。

## 卸载

卸载时显式指定 scope：

```sh
make uninstall-preview SCOPE=local
make uninstall-apply SCOPE=local
```

## 自动化

agent 或脚本解析输出时使用 JSON：

```sh
npm --silent run setup:searxng -- --json
npm --silent run probe:engines -- --url "$SEARXNG_URL" --json
npm --silent run verify:search -- --url "$SEARXNG_URL" --json
npm --silent run install:claude-code -- --url "$SEARXNG_URL" --scope local --check-first --json
npm --silent run status -- --url "$SEARXNG_URL" --json
```

## 文档

从 [docs/README.md](docs/README.md) 开始。

提交变更前运行：

```sh
make review
```

## License

MIT. See [LICENSE](LICENSE).
