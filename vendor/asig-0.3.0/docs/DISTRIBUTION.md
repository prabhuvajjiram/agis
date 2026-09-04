# Distribution

ASIG `0.3.0` uses a versioned vendored snapshot as its first internal distribution model.
The snapshot lives at `vendor/asig-0.3.0/` and contains the generated design tokens,
framework-neutral pattern CSS, guidance, package metadata, README, changelog, and a SHA-256
manifest.

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
- Keep product adapters and business behavior in the consuming repository.
- Verify locally after copying; do not make production builds depend on this developer
  machine or a runtime network request.

This is an internal source distribution, not a published npm release. Public registry
publication and licensing remain separate decisions, especially for an open-source CAD
consumer.
