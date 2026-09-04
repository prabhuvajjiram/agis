# Contributing and release checks

A shared pattern is complete only when its meaning, accessible behavior, responsive states,
CSS reference, catalogue specimen, and verification move together.

## Change checklist

1. Update semantic tokens before adding product-specific values to a pattern.
2. Document when to use the pattern, its keyboard behavior, states, and product boundary.
3. Add or update the framework-neutral CSS and package export.
4. Add a catalogue specimen with native semantics and stable labels.
5. Extend static contract checks and browser tests where behavior changes.
6. Run `npm run snapshot` after release content or version changes.
7. Complete the automated and manual evidence in the
   [accessibility standard](ACCESSIBILITY.md).
8. Run `npm run check` and `npm test` before review.

For a release candidate, add or update its file in `docs/releases/`. Record automated
results separately from human verification, and leave unperformed screen-reader or browser
checks visibly pending. Never convert an automated pass into a claim of WCAG conformance.

Visual baselines cover 375px, 768px, 1024px, and 1440px widths. Update them only after
reviewing the rendered change at every width. Accessibility automation is a regression
guard, not a replacement for keyboard, screen-reader, zoom, contrast, and product-context
review.

Release notes must state whether the change affects tokens, markup contracts, visual
appearance, keyboard behavior, or consumers. Product adoption belongs in a separate change
inside the consuming repository.
