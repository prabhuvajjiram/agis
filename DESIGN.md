# Angel Stones design brief

Read this before designing a page. ASIG is the shared visual and interaction contract;
the consuming product owns its framework adapters, data, permissions and business rules.
Use the version pinned by that product. A local candidate is not an adopted release.

## Visual character

- **Operations:** calm, compact workspaces. Lead with record identity, current state and
  the next useful action. Keep forms and financial tables opaque and easy to scan.
- **CAD:** a clear canvas, precise tool states, teal actions and amber context. Preserve
  offline fonts, units and geometry ownership.
- **Marketing:** stone, black and gold; generous editorial spacing and purposeful
  photography. Use expressive surfaces at a focal point, then quieter supporting sections.

Choose one [product theme](docs/PRODUCT_THEMES.md) at the application boundary. Status
colors retain their meaning across products and must always accompany readable labels.

## Tokens and hierarchy

[Token JSON](packages/tokens/src/tokens.json) owns exact values. Load tokens before
patterns. Use semantic variables; do not copy colors from an inspiration site.
The [foundations gallery](site/foundations.html) is generated from that JSON.

Use [typography roles](docs/TYPOGRAPHY.md) for title, section, body, label, caption and
numeric hierarchy. Keep the product's existing font family unless a deliberate font
change is in scope. A type role does not change the semantic heading level.

Use the spacing scale for related fields, section gaps and surface padding. Let a
constrained form respond to its container: one column below 40rem, two above 40rem,
and three only for closely related compact values above 60rem. Long names, references,
notes and growing-list pickers need generous width. Never shrink controls to fit columns.

## Compose before adding components

1. Reuse the product's collection, detail or report shell.
2. Put the title, state and primary action together; keep optional guidance collapsed.
3. Group fields by the operator's task, with help and errors attached to each control.
4. Use a Select for short enums, a Combobox for growing datasets, and a menu for commands.
5. Use a table when comparing columns; retain counts, sort meaning and recovery states.
6. Show loading, empty, error, retry and restricted states in the relevant content area.

See the [Operations example](examples/operations.html) for a complete task composition
and [component catalogue](site/index.html) for behavior. These are sample-only specimens,
not executable ERP workflows. Framework adapters remain in each consuming repository.

## Whole-page contract

Use [page design](docs/PAGE_DESIGN.md) for exact typography, content widths, gutters, density,
responsive behavior and ERP component mappings. Review the [visual page guide](site/pages.html)
and its complete Orders, Workbench and order-detail examples before composing a new workspace.
The generic type roles stay compatible; page-specific roles are opt-in. Package installation
alone does not migrate existing application headers, tables or layouts.

## Navigation identity

Operations uses the [labeled module rail](docs/NAVIGATION.md#labeled-module-rail): visible names,
colored circular outline icons and a strongly contrasted active area. Keep module identity tones
separate from status colors. Review the current product adapter when changing the reference.

## Guardrails

- One primary action per task; destructive emphasis belongs at the final confirmation.
- Preserve readable identifiers and long business values. Avoid unexplained truncation.
- Preserve 44px touch targets, visible keyboard focus and labelled controls.
- Treat glass, gradient and depth as optional [visual expression](docs/VISUAL_EXPRESSION.md).
- Never replace server sorting with sorting only one downloaded page.
- Never invent client-side approval, stock, pricing or lifecycle rules to complete a design.
- Check narrow containers, mobile, dark mode, forced colors and reduced motion.
- Keep automated test evidence distinct from human accessibility and product UAT evidence.

## Agent starting prompt

“Read DESIGN.md and the affected product's shared components. Identify the existing shell,
theme and field/table adapters. Implement the smallest reusable change. Preserve authorized
data sources and domain callbacks. Verify the real page at narrow and wide widths, keyboard
interaction, validation, retry and existing business tests. Report what remains unverified.”

Use [ASIG foundations](docs/ASIG.md), [forms](docs/FORMS.md),
[data display](docs/DATA_DISPLAY.md) and [accessibility](docs/ACCESSIBILITY.md) for detail.
Keep this brief as a routing layer; update canonical rules instead of duplicating them here.
