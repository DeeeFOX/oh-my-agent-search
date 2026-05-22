URL ?= https://search.example.org
SCOPE ?= local

.PHONY: check doctor install-apply install-apply-check install-preview install-preview-check review self-test setup-searxng setup-searxng-start uninstall-apply uninstall-preview verify-searxng

check:
	npm test

doctor:
	npm run doctor

self-test:
	npm run self-test

verify-searxng:
	npm run verify:searxng -- --url "$(URL)"

install-preview:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)"

install-preview-check:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --check-first

install-apply:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --apply

install-apply-check:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --check-first --apply

setup-searxng:
	npm run setup:searxng

setup-searxng-start:
	npm run setup:searxng -- --apply --start

uninstall-preview:
	npm run uninstall:claude-code

uninstall-apply:
	npm run uninstall:claude-code -- --apply

review: check doctor
