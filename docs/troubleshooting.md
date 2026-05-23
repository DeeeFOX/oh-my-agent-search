# Troubleshooting

## Missing npm Script

`npm run install:claude-code` must run from this repository root.

From another directory:

```sh
make -C <path-to-oh-my-agent-search> install-preview-check URL="$SEARXNG_URL"
```

or:

```sh
node <path-to-oh-my-agent-search>/scripts/install-claude-code.mjs --url "$SEARXNG_URL" --scope local --check-first
```

## Same-Name Server Exists

Check:

```sh
claude mcp get searxng
```

If the scope is wrong, remove the unwanted entry explicitly:

```sh
npm run uninstall:claude-code -- --scope user
npm run uninstall:claude-code -- --scope user --apply
```

Then reinstall in the desired scope.

## Uninstall Requires Scope

Unscoped dry-run only shows the risk. `--apply` requires an explicit scope:

```sh
npm run uninstall:claude-code -- --scope local --apply
```

## Invalid Environment Variable Format

Use the generated command shape:

```sh
claude mcp add --scope local -e SEARXNG_URL=http://127.0.0.1:8080 -t stdio searxng -- npx -y mcp-searxng
```

Keep `-t stdio` between `-e KEY=value` and the server name.

## JSON Works But Search Returns Zero Results

The endpoint is reachable, but selected engines returned no usable results.

Probe candidate engines first:

```sh
npm run setup:searxng -- --engines bing,yandex,google,baidu --apply --force --start
make probe-engines URL=http://127.0.0.1:8080
```

Then enable every engine that passed:

```sh
npm run setup:searxng -- --engines bing,yandex --apply --force --start
make verify-search URL=http://127.0.0.1:8080
```

Use single-engine profiles such as `bing-only` only for troubleshooting.

## First Search Is Slow

Use a longer timeout and retries:

```sh
make verify-search URL=http://127.0.0.1:8080 TIMEOUT_MS=30000 RETRIES=2
```

## Container Is Still Starting

Check:

```sh
docker compose ps
docker compose logs searxng
```

Then retry `make verify-search`.

## MCP Connected But Search Fails

`claude mcp list` and `claude mcp get searxng` only prove Claude Code can start the MCP server.

Also run:

```sh
make verify-search URL="$SEARXNG_URL"
```
