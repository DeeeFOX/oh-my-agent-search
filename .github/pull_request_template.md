## Summary

- Describe the change and why it is needed.

## Safety

- [ ] No secrets, credentials, cookies, session material, private endpoints, private proxy values, personal emails, customer data, or local absolute paths are included.
- [ ] Installer behavior remains dry-run by default unless this PR explicitly explains why it changes.
- [ ] MCP config changes still require `--apply`.
- [ ] Uninstall apply still requires an explicit `--scope`.

## Checks

- [ ] `make review`

For endpoint-specific changes:

- [ ] `make verify-search URL="https://search.example.org"` or equivalent sanitized test
