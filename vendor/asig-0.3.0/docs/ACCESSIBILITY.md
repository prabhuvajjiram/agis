# Accessibility standard

WCAG 2.1 Level AA is the minimum release standard for every ASIG token, pattern, specimen,
and product adapter. A component is not complete merely because it looks correct or passes
one automated scanner.

ASIG also requires an approximately 44-by-44 CSS-pixel target for primary touch controls.
That company requirement is deliberately stronger than the WCAG 2.1 AA baseline.

## Requirements for every component

### Structure and names

- Use native HTML semantics first. Custom widgets expose an accurate accessible name, role,
  value, state, and relationships.
- Visible labels remain programmatically connected. Placeholder text is never the only
  label, and the accessible name contains the visible action label.
- DOM and focus order preserve the meaningful reading and operating sequence.
- Instructions never depend only on color, shape, position, sound, or motion.

### Keyboard and focus

- Every action works with a keyboard using the expected native or documented widget keys.
- There are no keyboard traps. Overlays support Escape where dismissal is allowed and
  restore focus to a sensible location.
- Every keyboard-focusable element has a persistent visible focus indicator that is not
  hidden by sticky content or an overlay.
- Hover or focus content is dismissible, hoverable where needed, and persistent long enough
  to use.

### Visual presentation and reflow

- Normal text has at least 4.5:1 contrast; large text has at least 3:1.
- Meaningful component boundaries, states, icons, and focus indicators have at least 3:1
  non-text contrast against adjacent colors.
- Text can resize to 200 percent without losing content or function.
- Content reflows at 320 CSS pixels without two-dimensional page scrolling, except for
  essential two-dimensional content such as a comparison table or CAD canvas. Exceptions
  use a labelled local scroll region rather than widening the page.
- User text-spacing overrides do not clip, overlap, or hide content.
- Reduced-motion preferences remove non-essential motion. Information is never conveyed by
  animation alone.

### Gradient, glass, gloss, and depth

- Premium surface effects are optional presentation; the shared dimensional button finish
  is the default. Neither replaces a label, boundary, selected state, validation message,
  warning, or other semantic communication.
- Text and controls retain the required contrast against the rendered surface at every
  point in a gradient. Essential text is not placed directly on uncontrolled photography.
- Glass surfaces provide an opaque fallback for unsupported browsers and the user's
  reduced-transparency preference. Forced-colors mode removes gradients, translucency,
  gloss, and decorative shadows while retaining visible semantic boundaries.
- Gloss and depth do not create additional focus stops. Reduced-motion mode removes
  non-essential press movement, parallax, shimmer, and continuously animated highlights.
- Consuming products test effects over their real content and backgrounds; catalogue
  conformance cannot prove product-level contrast or rendering performance.

### Forms, errors, and changing state

- Inputs provide visible labels and any format, requirement, or constraint before entry.
- Errors identify the affected field in text and offer a correction when one is known.
- Legal, financial, destructive, and other consequential submissions provide review,
  confirmation, or reversal appropriate to the risk.
- Loading, saved, changed, and failed states are programmatically announced without moving
  focus unnecessarily. Urgent errors use assertive announcements sparingly.
- Disabled, read-only, selected, expanded, busy, invalid, and current states are exposed to
  assistive technology and are not communicated by color alone.

## Evidence required before release

Each shared component change must include:

1. documented semantics, keyboard behavior, responsive behavior, states, and product
   boundaries;
2. an accessible catalogue or focused specimen;
3. automated markup and Axe checks with no serious WCAG 2.1 A or AA violations across all
   ASIG themes;
4. keyboard and visible-focus checks, plus 320px reflow and supported-width checks;
5. manual review at 200 percent text size, 400 percent browser zoom or equivalent 320px
   reflow, high-contrast or forced-colors mode, reduced motion, and at least one supported
   screen-reader/browser combination when semantics or interaction changes.

Automation cannot prove WCAG conformance. The reviewer records manual evidence in the pull
request or consuming product change. Any exception must identify the failed criterion,
affected users, owner, mitigation, and removal date; it cannot silently lower the ASIG
release target.

## Product responsibility

Passing ASIG checks establishes the shared primitive baseline only. ERP, CAD, and Marketing
adapters must re-run accessibility checks in their real layouts, routes, validation,
permissions, zoom conditions, and data states before claiming adoption. Domain behavior and
its accessible communication remain owned by the consuming product.
