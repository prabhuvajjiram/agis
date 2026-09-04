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
- `@angelstones/ui-patterns` — framework-neutral CSS patterns for forms and sections.

The first release deliberately does not contain domain behavior or application shells.
ERP lifecycle controls, CAD canvas tools, and marketing sections remain owned by their
applications.

## Documentation

- [ASIG foundations](docs/ASIG.md)
- [Form guidelines](docs/FORMS.md)
- [Adoption plan](docs/ADOPTION.md)
- [Product themes](docs/PRODUCT_THEMES.md)

## Local commands

```sh
npm run build
npm run check
```

Open `examples/forms.html` after building to compare the same form pattern under all
three product themes.

## Current status

Version `0.1.0` is a local foundation and design contract. Package publication,
licensing, and application integration require an explicit reviewed decision. No
product currently depends on this repository.
