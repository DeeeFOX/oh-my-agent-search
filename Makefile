URL ?= https://search.example.org
SCOPE ?= local

.PHONY: check doctor install-apply install-preview review verify-searxng

check:
	npm test

doctor:
	npm run doctor

verify-searxng:
	npm run verify:searxng -- --url "$(URL)"

install-preview:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)"

install-apply:
	npm run install:claude-code -- --url "$(URL)" --scope "$(SCOPE)" --apply

review: check doctor
