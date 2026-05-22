# Claude Code Search Instruction

Use the configured SearXNG MCP search tool only when local repository context is insufficient or current public information is required.

Before searching:

- rewrite the task into a narrow public-safe query
- remove private code, private issue text, local absolute paths, private hostnames, credentials, cookies, session data, and customer data
- ask for approval if the query may reveal private project intent

When searching:

- prefer official documentation, release notes, primary repositories, standards, advisories, and vendor pages
- use small result limits
- open relevant public URLs before citing external facts
- state uncertainty when sources conflict
- do not use URL reading for private services or authenticated pages
