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
