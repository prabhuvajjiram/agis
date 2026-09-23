# Disclosure, tooltip, and popover

Use native `details` for content that expands in document flow. Use a tooltip for a short,
non-essential explanation. Use a popover for supplemental interactive content that can be
closed without completing the page task.

## Disclosure

The `summary` remains visible, keyboard reachable, and descriptive while collapsed. The
expanded content follows it in the reading order. Do not hide validation errors or required
instructions inside a collapsed disclosure.

## Tooltip

A tooltip contains no interactive controls and never carries information required to finish
the task. It appears on both hover and keyboard focus, is connected with `aria-describedby`,
does not cover its trigger, and can be dismissed with Escape. Touch-only users need the same
information in persistent text or another explicit control.

## Popover

The trigger exposes its expanded state and relationship to the popover. The popover has a
clear accessible name, sensible initial focus when needed, Escape dismissal, outside-click
behavior that does not lose data, and focus return to the trigger. Prefer the native Popover
API where supported and provide a tested fallback for the consuming product's browser range.

## Inputs, outputs and state

This is a framework-neutral **adapter contract**, not a JavaScript API exported by ASIG.
Names below describe values and notifications a product adapter should support. See
[the contract conventions](COMPONENT_CONTRACTS.md) for types, defaults, native events,
controlled state and React/Next.js/Angular mappings.

| Pattern | Inputs (type; requirement/default) | Outputs / events and payload | State and behavior owner |
| --- | --- | --- | --- |
| Disclosure | summary: text, required; content: markup, required; open: boolean, default false | Native details `toggle`: Event, read currentTarget.open after state changes | Browser owns native open state; controlled adapter reconciles accepted state. Toggle events may coalesce rapid changes |
| Tooltip | Content: non-interactive text, required; trigger and description ID: required; disabled: boolean, default false | No value output; adapter may expose visibility-change {open: boolean} for focus/hover/Escape | Adapter owns visibility and dismissal. Do not add required information or interactive content |
| Popover | Trigger, accessible name and content: required; mode: auto/manual, default auto; open: boolean, default false | Native popover `beforetoggle` / `toggle`: ToggleEvent with oldState/newState; adapter open-change {open: boolean, reason: trigger/escape/outside} | Browser supplies native behavior when used; adapter synchronizes aria-expanded and focus, and implements its supported-browser fallback |

Native details and popover events also follow programmatic state changes, so avoid feedback
loops when synchronizing a controlled wrapper. Native popover events do not provide an
application dismissal reason: the adapter must track it, or report an explicit unknown reason.
Do not pretend the CSS emits visibility events.
