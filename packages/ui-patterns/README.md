# @angelstones/ui-patterns

Framework-neutral CSS patterns from the Angel Stones Interface Guidelines.

## Install

```sh
npm install --save-exact @angelstones/design-tokens@0.5.1 @angelstones/ui-patterns@0.5.1
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
