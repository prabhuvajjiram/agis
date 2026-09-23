# @angelstones/ui-patterns

Framework-neutral CSS patterns from the Angel Stones Interface Guidelines.

## Install

```sh
npm install --save-exact @angelstones/design-tokens@0.7.0 @angelstones/ui-patterns@0.7.0
```

## Use

Load tokens before the pattern bundle:

```css
@import "@angelstones/design-tokens/tokens.css";
@import "@angelstones/ui-patterns/all.css";
```

Applications may instead import individual exports such as `actions.css`, `forms.css`,
`navigation.css`, `data-display.css`, or `overlays.css`. Keep the token and pattern package
versions aligned.

`@angelstones/ui-patterns/bundle.css` is the concatenated, request-efficient equivalent of
`all.css`. The existing `all.css` import-chain export remains stable for current consumers.

These patterns define appearance and interaction contracts, not product behavior. ERP
lifecycle logic, permissions, tenant isolation, CAD state, and website behavior remain owned
by the consuming application.

## License

MIT

## Page patterns

The 0.6 release adds opt-in operational page composition through
`pages.css` and `.as-workspace` / `.as-page-*` classes. Both `all.css` and `bundle.css` include
typography and page styles. The application loads its font once; the package inherits it.
See the repository's `docs/PAGE_DESIGN.md` and `site/pages.html` for exact geometry, type
roles, responsive examples and adapter mappings. Stable releases use the `latest` channel.

## Component integration contracts

Read the [framework-neutral contracts](https://github.com/prabhuvajjiram/agis/blob/v0.7.0/docs/COMPONENT_CONTRACTS.md)
for input types/defaults, native events, recommended adapter outputs and state ownership.
React/Next.js, Angular and plain HTML can use the same CSS. Callbacks, outputs, signals,
focus management and business operations are implemented by the consuming application;
this package does not export JavaScript components or an event runtime.
