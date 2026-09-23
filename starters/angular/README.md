# ASIG starter · Angular

A runnable Orders screen using **ASIG 0.7.0**: search, stage filtering, an empty state, reset, a responsive table and four themes. All customer records are invented.

## Run it

Install Node.js 26 and Git, then run:

```sh
git clone https://github.com/prabhuvajjiram/agis.git
cd agis/starters/angular
npm ci
npm run dev
```

Open http://127.0.0.1:4200. Use `npm run build` to check the production build. This directory is self-contained: copy it into a new project without its `node_modules` or build output, then run `npm ci`. Its lockfile is independent of the repository workspaces.

## What belongs to ASIG?

`@angelstones/design-tokens` supplies CSS variables; `@angelstones/ui-patterns` supplies opt-in CSS classes. Both are pinned to **0.7.0**. Import tokens before patterns; see `src/styles.css`. Update the two packages together.

`src/main.ts` owns Angular signals and the computed filtered list. Its standalone `OrderFilters` adapter receives `query` and `stage` signal inputs and emits `queryChange`, `stageChange` and `resetRequested` outputs. `src/app.html` composes the page.

These adapters are starter code, not exports from ASIG. ASIG does not ship a React or Angular component runtime. The page uses system fonts; choose and load your product's font in its global stylesheet.

## Try the behavior

1. Search for `cedar`: only SO-1043 remains.
2. Select `Needs review`: no matching orders remain.
3. Reset filters: all three orders return.
4. Switch the theme; data and filters stay intact.
5. Try keyboard navigation and a narrow viewport; the table scrolls inside its named region.

## Before using real data

This is a small client-side learning example, with no persistence, authentication, routing, sorting, pagination or API. Connect your application's data layer and add its loading, error, authorization and server-side filtering behavior before using it in production. Validate keyboard and screen-reader behavior in your application.

Read [component contracts](https://prabhuvajjiram.github.io/agis/site/document.html?file=docs/COMPONENT_CONTRACTS.md), explore the [catalogue](https://prabhuvajjiram.github.io/agis/), or compare the [other starters](../README.md).

## License

MIT; see [LICENSE](./LICENSE).
