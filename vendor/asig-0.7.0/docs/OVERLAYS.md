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
- Moving focus outside, including with Tab, closes the menu without disrupting the user's
  next focus target. If outside pointer dismissal would strand focus on a hidden item,
  return focus to the trigger.

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
- A destructive trigger remains neutral until the user reaches the confirmation decision.
  Reserve the strong danger fill for the final destructive action inside the dialog.
- Confirmation dialogs use a semantic icon, a high-opacity glass surface, and restrained
  entry motion. Reduced-motion and reduced-transparency preferences remove those effects.

Native `dialog` can satisfy many static-site needs. ERP and CAD adapters may use their
existing tested primitives. In every case the implementation must provide focus trapping,
focus restoration, accessible naming, background inertness, and scroll containment.

## Layer order

Shared tokens reserve layers for dropdowns, dialog backdrops, dialogs, and toast regions.
Product-owned canvas overlays or application shells may define additional documented
layers, but should not use arbitrary ever-increasing z-index values.

## Inputs, outputs and state

This is a framework-neutral **adapter contract**, not a JavaScript API exported by ASIG.
Names below describe values and notifications a product adapter should support. See
[the contract conventions](COMPONENT_CONTRACTS.md) for types, defaults, native events,
controlled state and React/Next.js/Angular mappings.

| Pattern | Inputs (type; requirement/default) | Outputs / events and payload | State and behavior owner |
| --- | --- | --- | --- |
| Dropdown menu | Trigger label: string, required; items: {id, label, disabled?, destructive?}[], required; open: boolean, default false | Recommended action request {actionId: string}; open-change {open: boolean, reason: trigger/escape/outside/select/focus-out} | Adapter owns focus, keyboard behavior and dismissal; product executes authorized commands |
| Dialog | Title and content: required; description: string, optional; open, busy: boolean, default false; dismissible: boolean, default true | Native dialog `cancel`: cancelable Event on a close request such as Escape; `close`: Event after closing, read returnValue. Recommended open-change request {open: boolean, reason: trigger/escape/close/cancel/confirm} | Call showModal()/close() for native modal behavior; setting open alone does not make a modal. Product owns accepted visibility; adapter owns focus restoration |
| Confirmation | Dialog inputs plus target description and confirmation label: string, required; destructive: boolean, default false | Recommended confirm request {actionId: string, targetId: string}; cancel request {reason: escape/close/cancel} | Product performs permission and lifecycle checks, sets busy and closes only after accepted completion; failure keeps context and exposes an error |

Recommended requests are not native events or exported ASIG callbacks. A native close event
has no business-success meaning, and cancel is not emitted for every way of closing a dialog.
Do not infer confirmation solely from an empty/non-empty returnValue without an explicit
mapping. Use preventDefault() on a cancel request only when a justified non-dismissible state
requires it. Busy and aria-disabled do not enforce that policy by themselves.
