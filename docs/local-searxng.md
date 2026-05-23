# Local SearXNG Setup

Use this when you do not have a trusted SearXNG endpoint yet.

## What It Creates

- `.env`
- `local/searxng/settings.yml`

Both files are ignored by git. The default endpoint is `http://127.0.0.1:8080`.

The generated SearXNG settings enable `html` and `json` output.

## Preview

```sh
make setup-searxng
```

JSON output for agents:

```sh
npm --silent run setup:searxng -- --json
```

If the default engines do not work in your region, probe candidate engines first.

Start with a candidate set:

```sh
npm run setup:searxng -- --engines bing,yandex,google,baidu --apply --force --start
make probe-engines URL=http://127.0.0.1:8080
```

Then enable all engines that passed:

```sh
npm run setup:searxng -- --engines bing,yandex --apply --force --start
make verify-search URL=http://127.0.0.1:8080
```

## Create And Start

```sh
npm run setup:searxng -- --apply --start
export SEARXNG_URL="http://127.0.0.1:8080"
```

Single-engine profiles are fallback probes:

```sh
npm run setup:searxng -- --profile bing-only --apply --start
```

With another local port:

```sh
npm run setup:searxng -- --port 8888 --apply --start
```

## Verify

```sh
make verify-json URL="$SEARXNG_URL"
make verify-search URL="$SEARXNG_URL"
```

Then connect Claude Code:

```sh
make install-preview-check URL="$SEARXNG_URL"
make install-apply-check URL="$SEARXNG_URL"
```

## Stop Or Reset

Stop the service:

```sh
docker compose down
```

Remove generated local config after review:

```sh
rm -rf local/searxng .env
```

## Notes

- The compose file binds to `127.0.0.1` by default.
- Local SearXNG still sends public-safe queries to selected upstream search engines.
- Pin the SearXNG image tag before using this in a controlled team environment.
