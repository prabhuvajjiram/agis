# Distribution

ASIG uses versioned vendored snapshots as its internal distribution model. The current
`0.7.0` release lives at `vendor/asig-0.7.0/` and contains the generated design tokens,
framework-neutral pattern CSS, guidance, package metadata, README, changelog, and a SHA-256
manifest.

Released snapshots are immutable. The `0.3.0` and `0.4.0` directories remain available for
existing consumers; building `0.7.0` creates a new directory and must not rewrite an older
snapshot.

## Build and verify

```sh
npm run snapshot
npm run check
```

`npm run snapshot` rebuilds tokens and produces the snapshot from tracked source. The
manifest deliberately has no timestamp, so the output is deterministic. `npm run check`
rebuilds a temporary candidate and fails when the committed snapshot is missing or stale.

CI also uploads the exact checked snapshot as the versioned
`asig-<version>-vendored-snapshot` workflow artifact.

## Consumer contract

- Adopt one explicit ASIG version and record that version in the consuming repository.
- Copy the complete snapshot or automate a checksum-verified copy; do not copy individual
  declarations by hand.
- Load `packages/design-tokens/dist/tokens.css` before
  `packages/ui-patterns/all.css` or selected pattern files.
- Direct-browser consumers may use the additive `bundle.css` export to avoid the `all.css`
  import chain. Existing consumers, including ERP, may retain `all.css` unchanged.
- Keep product adapters and business behavior in the consuming repository.
- Verify locally after copying; do not make production builds depend on this developer
  machine or a runtime network request.

The same framework-neutral packages are published publicly under MIT. Install exact aligned
versions so application upgrades stay deliberate:

```sh
npm install --save-exact @angelstones/design-tokens@0.7.0 @angelstones/ui-patterns@0.7.0
```

Products may continue using the checksum-verified snapshot when offline or
registry-independent builds are required.
