# @angelstones/design-tokens

Semantic design tokens for Angel Stones operations, CAD, and marketing products.

## Install

```sh
npm install --save-exact @angelstones/design-tokens@0.5.1
```

## Use

Load the generated CSS once at the application boundary:

```css
@import "@angelstones/design-tokens/tokens.css";
```

Apply one supported theme to an application container with `data-as-theme`: `operations`,
`operations-dark`, `cad`, or `marketing`. Consumers may also import the source JSON from
`@angelstones/design-tokens/tokens.json` for build-time adapters.

The JSON export uses the compact ASIG source schema consumed by the repository build scripts;
it does not claim conformance with the DTCG `$value`/`$type` interchange format.

ASIG tokens do not contain application behavior. Consuming products remain responsible for
their framework adapters, domain rules, and accessibility verification in application context.

## License

MIT
