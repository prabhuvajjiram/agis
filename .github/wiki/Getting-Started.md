# Getting started

## Install matching packages

```sh
npm install --save-exact @angelstones/design-tokens@0.6.0 @angelstones/ui-patterns@0.6.0
```

Import tokens first in the CSS entry point handled by your application's bundler:

```css
@import "@angelstones/design-tokens/tokens.css";
@import "@angelstones/ui-patterns/all.css";
```

Use `bundle.css` instead of `all.css` when you prefer a single stylesheet without nested
imports. Individual pattern exports are also available. See the
[package guide](https://github.com/prabhuvajjiram/agis/tree/main/packages/ui-patterns).

## Choose a theme

```html
<main data-as-theme="operations">
  <button class="as-button" type="button">Save order</button>
  <button class="as-button" data-variant="secondary" type="button">Preview</button>
</main>
```

Supported themes: `operations`, `operations-dark`, `cad`, `marketing`. Load your
application font once; ASIG patterns inherit it. The catalogue's self-hosted Inter font
is a specimen choice, not a required package dependency.

## Integrate with your framework

ASIG supplies CSS and behavior guidance. Your application supplies event handlers,
semantic markup, routing, permissions, validation, persistence and domain logic. React,
Vue or another framework can wrap the patterns or implement the same contract through
existing primitives. Preserve labels, focus behavior and accessible states.

Adopt shared primitives first, then test representative product flows. Record the
installed version and verify the result in your product's light, dark and responsive
contexts. See [adoption guidance](https://github.com/prabhuvajjiram/agis/blob/main/docs/ADOPTION.md).

## Run the catalogue locally

```sh
git clone https://github.com/prabhuvajjiram/agis.git
cd agis
nvm use
npm ci
npx playwright install chromium
npm run serve
```

Open `http://127.0.0.1:4173/site/`. Development uses Node.js 26.
