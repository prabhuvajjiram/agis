# Angel Stones Interface Guidelines

This repository is the company-wide design-system foundation for Angel Stones products.
It provides shared semantic tokens, interaction and accessibility rules, and reusable
layout patterns without forcing every product to look identical.

## Product family

- **Operations** — Angelgranites ERP and related internal operational tools.
- **CAD** — OpenCAD / OpenMonuCAD editor and conversion workflows.
- **Marketing** — theangelstones.com and other public presentation surfaces.

All products share semantic roles, spacing, form behavior, focus treatment, and
accessibility expectations. Each product theme maps those roles to an appropriate
visual expression.

## Packages

- `@angelstones/design-tokens` — generated CSS custom properties and source JSON.
- `@angelstones/ui-patterns` — framework-neutral CSS patterns for forms, actions,
  choices, selection, navigation, data display, disclosure, specialized inputs,
  overlays, and feedback.

The repository deliberately does not contain domain behavior or application shells. ERP
lifecycle controls, CAD canvas tools, and marketing sections remain owned by their
applications.

## Using the patterns

Load tokens before either the complete pattern bundle or individual pattern files:

```css
@import "@angelstones/design-tokens/tokens.css";
@import "@angelstones/ui-patterns/all.css";
```

Apply one product theme at an application boundary and use semantic variants inside it:

```html
<main data-as-theme="operations">
  <button class="as-button" type="button">Save order</button>
  <button class="as-button" data-variant="secondary" type="button">Preview</button>
</main>
```

Applications may import `forms.css`, `actions.css`, `choices.css`, `selection.css`,
`navigation.css`, `data-display.css`, `disclosure.css`, `specialized-inputs.css`,
`overlays.css`, or `feedback.css` individually. An adapter may reproduce the same
contract with local framework primitives instead of using these classes directly.

## Documentation

- [ASIG foundations](docs/ASIG.md)
- [Form guidelines](docs/FORMS.md)
- [Actions and buttons](docs/ACTIONS.md)
- [Selection controls](docs/SELECTION.md)
- [Checkbox, radio, and switch](docs/CHOICES.md)
- [Navigation, breadcrumbs, tabs, and pagination](docs/NAVIGATION.md)
- [Cards, descriptions, tables, and data grids](docs/DATA_DISPLAY.md)
- [Disclosure, tooltip, and popover](docs/DISCLOSURE.md)
- [File upload and date/time](docs/SPECIALIZED_INPUTS.md)
- [Menus, dialogs, and overlays](docs/OVERLAYS.md)
- [Feedback and system state](docs/FEEDBACK.md)
- [Component coverage](docs/COMPONENT_STATUS.md)
- [Adoption plan](docs/ADOPTION.md)
- [Distribution](docs/DISTRIBUTION.md)
- [Contributing and release checks](docs/CONTRIBUTING.md)
- [AI assistant integration](docs/AI_ASSISTANT_INTEGRATION.md)
- [Product themes](docs/PRODUCT_THEMES.md)
- [Changelog](CHANGELOG.md)

## Local commands

```sh
npm run build
npm run check
npm test
```

Run `npm run serve` and open `http://127.0.0.1:4173/site/` for the browsable catalogue.
The focused `examples/forms.html` and `examples/controls.html` specimens remain available.

## Current status

Version `0.3.0` broadens the global component contract, adds the browsable catalogue,
commits a deterministic internal distribution snapshot, and protects shared behavior with
responsive screenshot, accessibility, interaction, and source validation. Registry
publication, licensing, and application integration still require separate reviewed
decisions. No product currently depends on this repository.
