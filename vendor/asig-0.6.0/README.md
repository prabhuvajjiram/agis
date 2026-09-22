# Angel Stones Interface Guidelines

**A shared design language for focused, accessible product interfaces.**

[![ASIG checks](https://github.com/prabhuvajjiram/agis/actions/workflows/ci.yml/badge.svg)](https://github.com/prabhuvajjiram/agis/actions/workflows/ci.yml)
[![npm tokens](https://img.shields.io/npm/v/%40angelstones%2Fdesign-tokens?label=tokens)](https://www.npmjs.com/package/@angelstones/design-tokens)
[![npm patterns](https://img.shields.io/npm/v/%40angelstones%2Fui-patterns?label=patterns)](https://www.npmjs.com/package/@angelstones/ui-patterns)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Explore the catalogue](https://prabhuvajjiram.github.io/agis/) · [Read the wiki](https://github.com/prabhuvajjiram/agis/wiki) · [Contribute](docs/CONTRIBUTING.md) · [Release history](https://github.com/prabhuvajjiram/agis/releases)

ASIG brings semantic tokens, typography, framework-neutral CSS and interaction guidance
together. Built for Angel Stones products and open to everyone, it helps teams carry a
consistent design language from individual controls to complete working pages.

## Explore the system

| Resource | What you will find |
| --- | --- |
| [Component catalogue](https://prabhuvajjiram.github.io/agis/site/) | Interactive controls, navigation, tables, overlays and feedback |
| [Foundations](https://prabhuvajjiram.github.io/agis/site/foundations.html) | Color roles, type scales, spacing, elevation and copyable tokens |
| [Complete pages](https://prabhuvajjiram.github.io/agis/site/pages.html) | Orders, Workbench and detail examples with responsive layouts and state previews |
| [Design brief](DESIGN.md) | A compact starting point for designers, developers and coding assistants |
| [Getting started](https://github.com/prabhuvajjiram/agis/wiki/Getting-Started) | Installation, themes and application integration |

## Install

Install the stable 0.6 release:

```sh
npm install --save-exact @angelstones/design-tokens@0.6.0 @angelstones/ui-patterns@0.6.0
```

Keep both package versions aligned. Stable releases use npm's `latest` distribution tag;
future prereleases use `next`. The catalogue follows `main` and may show features ahead
of the latest published package.

Load tokens before patterns in your application's CSS entry point:

```css
@import "@angelstones/design-tokens/tokens.css";
@import "@angelstones/ui-patterns/all.css";
```

Set a theme at the application boundary:

```html
<main data-as-theme="operations">
  <button class="as-button" type="button">Save order</button>
  <button class="as-button" data-variant="secondary" type="button">Preview</button>
</main>
```

Use `bundle.css` instead of `all.css` for a single stylesheet without nested imports.
Individual exports such as `forms.css`, `navigation.css`, `typography.css` and `pages.css`
are available when you need only part of the system. Applications load and license their
own fonts; the catalogue uses self-hosted Inter.

## One foundation, distinct products

| Theme | Designed for |
| --- | --- |
| `operations` | Dense business workspaces, forms and operational data |
| `operations-dark` | The same operational language on dark surfaces |
| `cad` | Editor panels, tools and precision workflows |
| `marketing` | Public presentation and content surfaces |

Themes share semantic meaning, control behavior, spacing and accessibility expectations.
Applications own routing, permissions, data, persistence and business rules. The examples
use invented data and demonstrate interface behavior only.

## Documentation

- **Foundations:** [Principles](docs/ASIG.md), [typography](docs/TYPOGRAPHY.md), [page design](docs/PAGE_DESIGN.md), [themes](docs/PRODUCT_THEMES.md), [visual expression](docs/VISUAL_EXPRESSION.md).
- **Components:** [Forms](docs/FORMS.md), [actions](docs/ACTIONS.md), [selection](docs/SELECTION.md), [choices](docs/CHOICES.md), [navigation](docs/NAVIGATION.md), [data display](docs/DATA_DISPLAY.md).
- **Interaction:** [Disclosure](docs/DISCLOSURE.md), [specialized inputs](docs/SPECIALIZED_INPUTS.md), [overlays](docs/OVERLAYS.md), [feedback](docs/FEEDBACK.md).
- **Integration:** [Coverage](docs/COMPONENT_STATUS.md), [adoption](docs/ADOPTION.md), [distribution](docs/DISTRIBUTION.md), [AI assistants](docs/AI_ASSISTANT_INTEGRATION.md).
- **Quality and delivery:** [Accessibility](docs/ACCESSIBILITY.md), [contributing](docs/CONTRIBUTING.md), [automation](docs/AUTOMATION.md), [changelog](CHANGELOG.md).

## Accessibility and quality

WCAG 2.1 AA is the minimum design and release target. Automated checks cover keyboard
behavior, contrast, responsive reflow, component states and visual regressions. Manual
screen-reader and platform checks remain explicit in the [release evidence](docs/releases/0.6.0-accessibility-evidence.md).
A passing test suite is not a claim of complete accessibility conformance.

## Contribute locally

```sh
git clone https://github.com/prabhuvajjiram/agis.git
cd agis
nvm use
npm ci
npx playwright install chromium
npm run serve
```

Open `http://127.0.0.1:4173/site/`. Before submitting a change:

```sh
npm run snapshot
npm run check
npm test
npm run build:site
```

Node.js 26 is the repository baseline. Start with a [bug report or proposal](https://github.com/prabhuvajjiram/agis/issues/new/choose),
and follow the [contribution guide](docs/CONTRIBUTING.md). Documentation, accessibility
improvements and focused fixes are welcome.

## License

ASIG is [MIT licensed](LICENSE). The catalogue's Inter font and Heroicons retain their
[font license](https://github.com/prabhuvajjiram/agis/blob/main/site/assets/fonts/INTER-OFL.txt) and [icon license](https://github.com/prabhuvajjiram/agis/blob/main/site/assets/icons/HEROICONS-LICENSE.txt).
