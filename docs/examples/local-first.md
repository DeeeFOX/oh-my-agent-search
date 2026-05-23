# Local-First SearXNG To Claude Code

This walkthrough starts a local SearXNG test endpoint, verifies search, and installs it into Claude Code with local MCP scope.

Use sanitized values when sharing logs publicly. Replace any real endpoint with `https://search.example.org`.

## 1. Check Local Tools

Run the repository review first:

```sh
make review
```

Warnings about a missing `SEARXNG_URL` only mean endpoint verification was skipped. Fix Docker warnings before relying on local SearXNG.

## 2. Preview Local SearXNG Setup

The setup command is dry-run by default:

```sh
make setup-searxng
```

It will create ignored local files only when `--apply` is used.

## 3. Start Local SearXNG

```sh
npm run setup:searxng -- --apply --start
export SEARXNG_URL="http://127.0.0.1:8080"
```

The generated local config enables SearXNG `html` and `json` output. The compose service binds to `127.0.0.1` by default.

## 4. Verify Search

```sh
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
```

If search returns no results in your region, start with a candidate engine set and probe it:

```sh
npm run setup:searxng -- --engines bing,yandex,google,baidu --apply --force --start
make probe-engines URL="$SEARXNG_URL"
```

Then enable all engines that passed:

```sh
npm run setup:searxng -- --engines bing,yandex --apply --force --start
make verify-search URL="$SEARXNG_URL"
```

## 5. Preview And Apply Claude Code MCP Install

Preview first:

```sh
make install-preview-check URL="$SEARXNG_URL"
```

Apply only after the preview looks correct:

```sh
make install-apply-check URL="$SEARXNG_URL"
```

Default scope is `local`, which keeps the MCP entry tied to the current Claude Code project.

## 6. Verify In Claude Code

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code:

```text
/mcp
```

Then run the prompts in [go-live prompts](../../templates/go-live-prompts.md) to check search, lifecycle, and public-safe query behavior.

## 7. Stop Or Uninstall

Stop the local SearXNG container:

```sh
docker compose down
```

Preview and apply MCP removal with an explicit scope:

```sh
make uninstall-preview SCOPE=local
make uninstall-apply SCOPE=local
```
