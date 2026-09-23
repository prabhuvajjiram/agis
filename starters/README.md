# Start building with ASIG

Use the same design tokens and CSS patterns with the framework you already know. These independent starters use the published **0.7.0** packages, not local workspaces.

| Starter | Behavior owned by | Start here |
| --- | --- | --- |
| Plain JavaScript + Vite | Native DOM events | [Run the JavaScript starter](./vanilla/README.md) |
| Next.js + React | Controlled props and callbacks | [Run the Next.js starter](./nextjs/README.md) |
| Angular | Signal inputs, outputs and computed state | [Run the Angular starter](./angular/README.md) |

Every starter has the same fictional Orders screen, four themes, search, stage filtering, reset and an empty state. Each includes its own lockfile and MIT license. Node.js 26 is required for the tested dependency versions.

ASIG supplies **styling and implementation guidance**. The starter supplies the small amount of application behavior. This distinction lets you adopt ASIG without replacing your framework, router or data layer.

For an existing app, install both packages together:

```sh
npm install @angelstones/design-tokens@0.7.0 @angelstones/ui-patterns@0.7.0
```

Import the styles once in your application's global CSS entry:

```css
@import "@angelstones/design-tokens/tokens.css";
@import "@angelstones/ui-patterns/all.css";
```

Apply `data-as-theme="operations"` to the page or a wrapper. ASIG classes are opt-in; installing the packages does not restyle existing markup. Start with one shared component, then validate its behavior and accessibility before expanding.

## Help shape the next example

[Open an issue](https://github.com/prabhuvajjiram/agis/issues/new/choose) with your framework, a reproducible example and the workflow you are trying to build. Useful contributions include clearer instructions, keyboard fixes and examples of real component state. Please use invented or anonymized data.

## Maintainer verification

From the repository root, run `npm ci`, install Chromium with `npx playwright install chromium`, then install and build each starter with `npm --prefix starters/NAME ci` and `npm --prefix starters/NAME run build`. Run `npx playwright test --config playwright.starters.config.mjs` to exercise all three production builds. The dedicated CI workflow runs the same checks on desktop and mobile.
