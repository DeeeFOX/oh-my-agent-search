# All targets assume the working directory is this repository root.
# From another directory, use: make -C <path-to-oh-my-agent-search> <target>
URL ?= https://search.example.org
SCOPE ?= local
PROFILE ?= default
TIMEOUT_MS ?= 30000
RETRIES ?= 2
RETRY_DELAY_MS ?= 3000

.PHONY: check doctor go-live install-apply install-apply-check install-preview install-preview-check probe-engines review self-test setup-searxng setup-searxng-start status uninstall-apply uninstall-preview verify-json verify-search verify-searxng

check:
	npm test

doctor:
	npm run doctor

self-test:
	npm run self-test

status:
	npm run status -- --url "$(URL)"

verify-json:
	npm run verify:searxng -- --url "$(URL)" --min-results 0 --timeout-ms "$(TIMEOUT_MS)"

verify-search:
	npm run verify:searxng -- --url "$(URL)" --min-results 1 --timeout-ms "$(TIMEOUT_MS)" --retries "$(RETRIES)" --retry-delay-ms "$(RETRY_DELAY_MS)"

verify-searxng: verify-search

go-live: status verify-search

probe-engines:
	npm run probe:engines -- --url "$(URL)" --timeout-ms "$(TIMEOUT_MS)"

install-preview:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)"

install-preview-check:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --check-first --timeout-ms "$(TIMEOUT_MS)" --retries "$(RETRIES)" --retry-delay-ms "$(RETRY_DELAY_MS)"

install-apply:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --apply

install-apply-check:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --check-first --timeout-ms "$(TIMEOUT_MS)" --retries "$(RETRIES)" --retry-delay-ms "$(RETRY_DELAY_MS)" --apply

setup-searxng:
	npm run setup:searxng -- --profile "$(PROFILE)"

setup-searxng-start:
	npm run setup:searxng -- --profile "$(PROFILE)" --apply --start

uninstall-preview:
	npm run uninstall:claude-code -- --scope "$(SCOPE)"

uninstall-apply:
	npm run uninstall:claude-code -- --scope "$(SCOPE)" --apply

review:
	npm run review
