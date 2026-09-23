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

## Inputs, outputs and state

This is a framework-neutral **adapter contract**, not a JavaScript API exported by ASIG.
Names below describe values and notifications a product adapter should support. See
[the contract conventions](COMPONENT_CONTRACTS.md) for types, defaults, native events,
controlled state and React/Next.js/Angular mappings.

| Pattern | Inputs (type; requirement/default) | Outputs / events and payload | State and behavior owner |
| --- | --- | --- | --- |
| Checkbox | Label and id: string, required; checked, indeterminate and disabled: boolean, default false; name/value: strings when submitted | Native `change`: Event, read currentTarget.checked; adapter checked-change: {checked: boolean} | Product owns checked state; set native indeterminate as a DOM property. It describes partial selection, not a third stored value |
| Radio group | Legend and name: string, required; options: list of {value: string, label: string, disabled?: boolean}, required; selected value: string or null, default null; required: boolean, default false | Native `change` on the newly checked radio; adapter value-change: {value: string} | Product owns selected ID; shared name enforces native exclusivity |
| Switch | Label: string, required; checked, disabled and busy: boolean, default false | Native checkbox `change` or custom switch activation; adapter checked-change request: {checked: boolean} | Product saves an immediate setting, prevents duplicate requests and restores confirmed state on failure |

Unchecked native checkboxes do not appear in FormData. Map absence deliberately rather than
assuming a string "false". Native radio deselection does not fire a second change event.
For a custom switch, the adapter implements keyboard activation and accurate `aria-checked`;
CSS does not implement toggling. Never emit a success event just because checked changed.
