# Checkbox, radio, and switch

Use the control whose meaning matches the decision. A checkbox selects any number of
independent options. A radio group selects exactly one option from a visible set. A switch
changes one setting immediately; it is not a substitute for a checkbox in a form that is
submitted later.

## Structure and labels

- Wrap related checkboxes or radios in `fieldset` with a visible `legend`.
- Give every control a visible label and make the full label row clickable.
- Put help or error text after the group and connect it with `aria-describedby`.
- Use the native input whenever possible. Visual decoration must not replace its semantics.
- Keep interactive rows at least 44px high where touch input is expected.

The Angel Stones visual treatment presents each option as a bounded, high-opacity glass
row. A selected row combines a stronger border and surface tint with a checked control, so
color is never the only state cue. Checkbox corners remain rounded, radios remain circular,
and neither should resemble a push button.

## State and interaction

Native checkbox and radio inputs retain their browser keyboard behavior: Tab reaches the
group, Space toggles a checkbox, and Arrow keys move within a radio group. Disabled state
must be visible and exposed with the native `disabled` attribute.

A switch uses a native checkbox or an element with `role="switch"` and accurate
`aria-checked`. Space toggles it. If changing the switch starts an authoritative operation,
show progress, prevent duplicate requests, and restore the confirmed state after failure.

Place the switch at the trailing edge of a labelled settings row and expose a visible On/Off
state when it improves scanning. Use a short 150–300ms thumb transition, never animate the
label or change layout, and remove the transition under `prefers-reduced-motion: reduce`.
Glass styling requires a solid reduced-transparency fallback and native-looking controls in
forced-colors mode.

Indeterminate checkboxes are for partial selection summaries, not a third submitted value.
The application owns how that state maps to selected records.
