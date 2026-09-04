# Visual expression

ASIG supports a modern premium layer without making every product or workflow visually
heavy. Gradient, glass, gloss, and depth are optional appearance attributes on top of the
same semantic tokens, component behavior, and product themes.

## Shared surface contract

Use `as-surface` for a bounded presentation surface. Appearance and depth are independent:

```html
<article class="as-surface" data-appearance="gradient" data-depth="floating" data-gloss="true">
  <!-- semantic content remains ordinary HTML -->
</article>

<button class="as-button" data-appearance="glossy" type="button">Explore designs</button>
```

- `data-appearance="gradient"` adds a theme-aware, low-intensity gradient.
- `data-appearance="glass"` adds translucent material and backdrop blur with an opaque
  fallback.
- `data-depth="raised"` and `data-depth="floating"` provide two deliberate elevation
  levels.
- `data-gloss="true"` adds a non-interactive highlight. It never communicates state.
- `data-appearance="glossy"` is available for a single prominent button or call to action.

## Where the premium layer belongs

Use stronger expression for a marketing hero, CAD welcome or export panel, executive
dashboard summary, product launch, or another clear focal surface. Prefer one strong focal
surface per view, then use ordinary surfaces to establish hierarchy.

Keep dense ERP forms, data tables, financial review, warnings, destructive confirmations,
and repeated rows opaque and calm. Depth must explain hierarchy; it is not decoration to
apply to every card. Avoid full-page backdrop blur, parallax, continuous shimmer, or motion
that competes with operational work.

## Accessibility and performance guardrails

- WCAG 2.1 Level AA contrast still applies to text, focus, states, and boundaries across
  every product theme. Effects never replace a semantic state or visible label.
- Essential text sits on the controlled ASIG surface color, not directly on photography or
  unpredictable media.
- Forced-colors mode removes gradients, translucency, gloss, and shadows while preserving
  readable boundaries. The reduced-transparency preference replaces glass with an opaque
  surface.
- Reduced-motion mode removes the glossy button press movement. Do not add essential
  animation, automatic parallax, or continuously moving highlights.
- Limit backdrop blur to a small number of bounded surfaces. Consuming products must test
  contrast and performance against their real backgrounds and content.

The premium layer changes appearance only. Product adapters continue to own business
behavior, authorization, workflow state, and application-specific composition.
