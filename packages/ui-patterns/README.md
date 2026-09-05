# @angelstones/ui-patterns

Framework-neutral CSS patterns from the Angel Stones Interface Guidelines.

## Install

```sh
npm install --save-exact @angelstones/design-tokens@0.5.0 @angelstones/ui-patterns@0.5.0
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

These patterns define appearance and interaction contracts, not product behavior. ERP
lifecycle logic, permissions, tenant isolation, CAD state, and website behavior remain owned
by the consuming application.

## License

MIT
