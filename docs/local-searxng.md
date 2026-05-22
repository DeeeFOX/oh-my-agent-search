# Local SearXNG Setup

## Goal

Start a local SearXNG instance for Claude Code search testing when no trusted endpoint is available yet.

This path is for local development. For shared or production use, review deployment hardening in `awesome-agent-search`.

## Safety Defaults

The provided Docker Compose file:

- binds SearXNG to `127.0.0.1:8080` by default
- stores generated local configuration under ignored `local/`
- writes a generated local `server.secret_key`
- enables `html` and `json` search formats
- does not configure random public-instance fallback

## Dry Run

Preview the local files that would be created:

```sh
make setup-searxng
```

Expected output:

- target settings path
- target `.env` path
- local URL
- dry-run note

## Create Local Config

Write ignored local files:

```sh
npm run setup:searxng -- --apply
```

This creates:

```text
.env
local/searxng/settings.yml
```

Both are ignored by git. Do not commit generated local settings.

## Start SearXNG

Start with Docker Compose:

```sh
docker compose up -d
```

Or create local config and start in one command:

```sh
npm run setup:searxng -- --apply --start
```

If you need a different local port:

```sh
npm run setup:searxng -- --port 8888 --apply --start
```

## Verify JSON

After the service starts:

```sh
make verify-searxng URL=http://127.0.0.1:8080
```

Expected result:

```text
verify-searxng-json: ok
```

If verification fails:

- check `docker compose ps`
- check `docker compose logs searxng`
- confirm `local/searxng/settings.yml` includes `search.formats` with `json`
- confirm the port matches `.env`

## Connect Claude Code

After JSON verification:

```sh
make install-preview-check URL=http://127.0.0.1:8080
make install-apply-check URL=http://127.0.0.1:8080
```

Then verify:

```sh
claude mcp list
claude mcp get searxng
```

Inside Claude Code:

```text
/mcp
```

## Stop Local SearXNG

```sh
docker compose down
```

This does not remove generated local configuration.

## Reset Local Config

Generated files are ignored under `local/` and `.env`.

To reset manually:

```sh
docker compose down
rm -rf local/searxng .env
```

Review paths before deleting.

## Notes

- The compose file uses `searxng/searxng:latest` for starter simplicity. Pin an image tag before using this in a controlled team environment.
- Keep the local endpoint private unless you intentionally expose it.
- Do not paste private repository context into search queries.
