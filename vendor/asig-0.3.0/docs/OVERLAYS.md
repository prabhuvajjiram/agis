# Menus, dialogs, and overlays

Overlays temporarily place content above the current surface. Use them sparingly: they add
focus, positioning, scrolling, and mobile-layout responsibilities.

## Dropdown menus

A dropdown menu contains commands, not form values. The trigger communicates that it opens
a menu and exposes its expanded state.

- Arrow Down or Enter opens the menu and moves focus to an item.
- Arrow keys move between enabled items; Home and End move to the boundaries.
- Enter or Space invokes an item; Escape closes and returns focus to the trigger.
- Disabled items remain visibly distinct and cannot execute.
- Destructive items are visually identified, placed away from common actions, and use a
  confirmation dialog when the consequence is irreversible.
- Items use at least a 44px touch target and menus stay within available viewport space.
- Click or pointer interaction outside closes a non-modal menu.

Use a tested accessible primitive for application adapters. CSS supplies appearance but
cannot provide focus management, collision detection, or keyboard behavior.

## Dialogs

Use a dialog for a focused decision or short task that should interrupt the current flow.
Use a full page, drawer, or dedicated workspace for long, reference-heavy, or multi-step
work.

- A dialog has a visible title and a useful description where context is needed.
- Opening moves focus inside. Tab stays inside while modal. Closing returns focus to the
  invoking control.
- Escape closes ordinary dialogs. A genuinely non-dismissible operation explains why.
- The close icon has an accessible name and a 44px target.
- The body scrolls independently while the title and actions remain discoverable.
- Default width is 36rem; small confirmation dialogs use 28rem; complex forms may use up
  to 56rem when the content justifies it.
- Dialog form columns respond to dialog width, not browser viewport width.
- On narrow screens, actions stack and the dialog stays within the visible viewport.

Native `dialog` can satisfy many static-site needs. ERP and CAD adapters may use their
existing tested primitives. In every case the implementation must provide focus trapping,
focus restoration, accessible naming, background inertness, and scroll containment.

## Layer order

Shared tokens reserve layers for dropdowns, dialog backdrops, dialogs, and toast regions.
Product-owned canvas overlays or application shells may define additional documented
layers, but should not use arbitrary ever-increasing z-index values.
