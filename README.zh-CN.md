# Oh My Agent Search

[English](README.md) | 中文

通过 MCP 为 Claude Code 接入 SearXNG 搜索，并在使用前完成本地验证。

## 提供什么

- 验证 SearXNG JSON/search 是否可用
- 启动本地 SearXNG 供测试
- 生成 Claude Code MCP 安装/卸载命令
- 提供 go-live 自测 prompts
- 提供公开安全搜索的最小安全边界

## 快速开始

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

## Scope

默认 scope 是 `local`：

- `local`：只用于当前项目
- `user`：同一个可信 endpoint 跨项目可用
- `project`：仅在审查共享 `.mcp.json` 后使用

如果已存在 `searxng` server，安装前先确认 scope：

```sh
claude mcp get searxng
```

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

## 安全

SearXNG 只用于公开信息搜索。不要搜索 secrets、私有代码、私有 hostname、私有 endpoint、本地路径、客户数据，或会暴露意图的未发布名称。

本地 SearXNG 避免使用随机公开实例，但上游搜索引擎仍会收到 query。

## 文档

从 [docs/README.md](docs/README.md) 开始。

提交变更前运行：

```sh
make review
```

## License

MIT. See [LICENSE](LICENSE).
