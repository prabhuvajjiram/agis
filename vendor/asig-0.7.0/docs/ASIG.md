# Angel Stones Interface Guidelines (ASIG)

## Purpose

ASIG is the durable interface contract for Angel Stones software. It is broader than a
component catalogue: it defines the language, hierarchy, behavior, accessibility, and
quality bar that components must implement.

## Shared versus product-owned

### Shared globally

- semantic color roles rather than hard-coded product colors;
- spacing, control size, focus, disabled, error, loading, and reduced-motion behavior;
- form hierarchy and requirement language;
- keyboard operation and WCAG 2.1 AA expectations;
- naming and versioning of reusable patterns;
- visual and accessibility verification expectations.

### Owned by each product

- ERP permissions, lifecycle transitions, workflow state, tables, and dense workspaces;
- CAD canvas behavior, units, precision, geometry, toolbars, and offline operation;
- public-site editorial layouts, merchandising, SEO, and conversion content;
- domain-specific components whose meaning does not transfer to another product.

Global components may present state. They must never become the authority for business
rules, tenant access, CAD geometry, pricing, workflow transitions, or persisted data.

## Interface principles

1. **Meaning before decoration.** Hierarchy and wording must make the next action clear.
2. **One semantic role, many themes.** Use `surface`, `foreground`, `primary`, `danger`,
   and similar roles; do not copy a product hex value into shared patterns.
3. **Responsive to the container.** A form inside a narrow dialog remains one column
   even when the browser viewport is wide.
4. **Accessible by default.** Keyboard access, visible focus, associated labels,
   announced errors, contrast, and 44px touch targets are component requirements.
5. **Progressive disclosure.** Keep frequent actions visible and move exceptional or
   advanced settings behind an explicit disclosure.
6. **No silent state.** Loading, saving, success, failure, and disabled reasons must be
   visible and understandable.
7. **Product truth stays local.** Shared UI accepts state and callbacks; the owning
   application remains responsible for permissions and domain validation.
8. **Use the control that matches the intent.** Links navigate, buttons act, selection
   controls choose values, menus expose commands, and dialogs focus a decision.

## Layers

```text
ASIG guidance
  -> design tokens
      -> framework-neutral patterns
          -> application adapters and primitives
              -> product and domain compositions
```

Changes should enter at the lowest layer that can express the requirement without
leaking product-specific behavior upward.

## Accessibility baseline

- WCAG 2.1 AA is the minimum.
- Normal text contrast is at least 4.5:1.
- Focus is never removed without a visible replacement.
- Controls have accessible names and errors are connected with `aria-describedby`.
- Touch targets are at least 44 by 44 CSS pixels where touch interaction is expected.
- Color is never the sole carrier of status or validation.
- Motion honors `prefers-reduced-motion`.
- Critical workflows are tested with keyboard-only navigation.
- Interactive controls expose loading, disabled, empty, invalid, and failure states where
  those states apply.
- Overlay implementations manage focus, Escape behavior, viewport collision, and focus
  restoration; CSS alone is not an accessible overlay implementation.

## Governance

- Tokens and reusable patterns use semantic versioning after publication begins.
- A breaking token rename or behavior change requires migration notes.
- A shared pattern needs at least two credible consumers or a clear cross-product
  foundation role.
- Product-specific exceptions are documented locally rather than added as global
  variants.
- Design guidance must live here or in the consuming repository, not only in an AI
  prompt or personal skill.
- AI skills may point to ASIG but must not duplicate it as a second source of truth.
