# Contributing

Documentation, accessible interaction improvements, reproducible bug reports and focused
pattern fixes are welcome. Discuss broad API or visual changes in an issue first.

1. Fork the repository and create a focused branch.
2. Install with Node.js 26 and `npm ci`.
3. Update guidance, implementation and examples together.
4. Run `npm run snapshot`, `npm run check` and `npm test`.
5. Open a pull request with the problem, resulting behavior and validation evidence.

Include before/after screenshots for visual changes and identify human checks still
pending. Use invented data and preserve unrelated work. Read the full
[contribution guide](https://github.com/prabhuvajjiram/agis/blob/main/docs/CONTRIBUTING.md).

- [Report a bug or propose an improvement](https://github.com/prabhuvajjiram/agis/issues/new/choose)
- [Read the code of conduct](https://github.com/prabhuvajjiram/agis/blob/main/CODE_OF_CONDUCT.md)
- [Report a security vulnerability privately](https://github.com/prabhuvajjiram/agis/security/advisories/new)

## Keeping the wiki current

Wiki source lives in [.github/wiki/](https://github.com/prabhuvajjiram/agis/tree/main/.github/wiki) so updates can be
reviewed with the repository. Maintainers publish those Markdown pages to the separate
GitHub wiki repository after reviewing the change. Canonical implementation guidance
remains in `docs/`; link to it instead of copying entire specifications into the wiki.
