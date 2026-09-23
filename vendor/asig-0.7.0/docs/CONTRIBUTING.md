# Contributing and release checks

A shared pattern is complete only when its meaning, accessible behavior, responsive states,
CSS reference, catalogue specimen, and verification move together.

## Start contributing

Fork the public repository, create a branch for your change, then run `nvm use` and `npm ci`.
Use `npm run serve` to inspect the catalogue at `http://127.0.0.1:4173/site/`. Contributions
to accessible behavior, reusable patterns, documentation and focused bug fixes are welcome.
Discuss larger API or visual changes in an issue before implementing them. Follow the
[community code of conduct](../CODE_OF_CONDUCT.md).

Open a pull request describing the problem, the resulting behavior and the checks performed.
Include before/after screenshots for visible changes and record any manual checks still
pending. Use invented sample data; never include customer records, credentials or private
application screenshots. Report vulnerabilities through [SECURITY.md](../SECURITY.md).
Maintainers review and merge contributions; publication follows the
[automatic delivery workflow](AUTOMATION.md).

## Change checklist

1. Update semantic tokens before adding product-specific values to a pattern.
2. Document when to use the pattern, its keyboard behavior, states, and product boundary.
   Include input types/defaults, output payloads/timing and state ownership following
   [component contract conventions](COMPONENT_CONTRACTS.md).
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

## Visual reference environment

Linux release references target GitHub's Ubuntu 24.04 runner and the locked Playwright
version. A local emulated Linux container can render native select labels and fallback
glyphs differently. Inspect expected/actual/diff images from the hosted browser report
before accepting a baseline update; verify the result in a subsequent native CI run.
Do not increase pixel tolerances to hide an unexplained rendering change.
