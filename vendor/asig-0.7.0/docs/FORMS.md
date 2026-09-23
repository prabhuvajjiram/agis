# Form guidelines

Forms are the first shared pattern because inconsistent form composition is currently
visible across operational interfaces and is relevant to CAD settings and public forms.

## Field anatomy

Every field has one stable structure:

1. visible label;
2. short requirement status when useful;
3. control;
4. persistent help when the business meaning is not obvious;
5. error message when invalid.

Place lifecycle explanations in help text rather than extending the label until it
wraps. For example:

```text
Buying final amount        Required later
[ Vendor cost                         ]
Required when the status becomes Ordered to Vendor.
```

## Requirement language

- **Required** — needed for the current submission.
- **Optional** — never required for this operation.
- **Required later** — optional now but required by a named future transition.

The application supplies the requirement state. Shared form components display it but
do not decide it. The backend remains responsible for enforcing business transitions.

## Layout

- Begin with one column.
- Use two columns only when the form container is at least 40rem wide.
- Use three columns only for compact, closely related values in a container at least
  60rem wide.
- A long reference, address, note, upload, or validation summary spans the full row.
- Do not use viewport breakpoints to determine columns inside a constrained dialog.
- Keep labels and controls vertically aligned by using the shared field anatomy.

## Controls

- Default minimum height: 44px.
- Inputs, selects, comboboxes, and buttons in one row use the same height.
- Meaningful control boundaries use the strong border role and retain at least 3:1 contrast
  against both the control surface and its surrounding surface. Decorative dividers continue
  to use the quieter border role.
- Use a searchable selection control when the option list is long or expected to grow.
- Use a dropdown menu for commands and a Select or Combobox for values; they are not
  interchangeable.
- Use the correct input mode and autocomplete metadata.
- Placeholder text is an example or format hint, never the only label.

## Validation and feedback

- Validate most fields on blur and all fields on submission.
- Connect errors to their controls and announce submission summaries.
- Keep user-entered values after a failed submission.
- Explain disabled actions in text; do not rely on a grey appearance alone.
- Show progress for operations that take perceptible time and prevent accidental
  duplicate submission.

## Composition boundary

Shared form patterns own layout and accessible relationships. Product adapters own
their form library integration. Domain compositions may package repeated field groups,
but business validation, authorization, persistence, and workflow state remain in the
owning application.

See [Selection controls](SELECTION.md) for the Select and Combobox decision and
[Actions and buttons](ACTIONS.md) for submission behavior.

## Inputs, outputs and state

This is a framework-neutral **adapter contract**, not a JavaScript API exported by ASIG.
Names below describe values and notifications a product adapter should support. See
[the contract conventions](COMPONENT_CONTRACTS.md) for types, defaults, native events,
controlled state and React/Next.js/Angular mappings.

| Pattern | Inputs (type; requirement/default) | Outputs / events and payload | State and behavior owner |
| --- | --- | --- | --- |
| Field wrapper | id and visible label: string, required; requirement: required/optional/required-later, product supplied; help and error: string, default absent | None; layout and accessible relationships only | Product supplies requirement and validation; connect help/error IDs to the control |
| Text input / textarea | id, name and label: string, required for form use; value: string, default empty; disabled, readOnly and invalid: boolean, default false; required: boolean, default false; autocomplete/inputMode: explicit when appropriate | Native `input`: Event, read currentTarget.value on edits; `change`: Event on commit; `blur`: FocusEvent on losing focus | Product owns draft and errors; retain input after failed saves. Programmatic value assignment does not emit native input/change |
| Form / validation summary | Fields: labelled controls, required; busy: boolean, default false; errors: list of {fieldId, message}, default empty | Native `submit`: SubmitEvent after native validation; native `reset`: Event if a reset control is provided; adapter submit request carries the validated draft | Product prevents navigation for asynchronous submission, validates, saves and focuses the summary/invalid field. Disabled fields are omitted from native FormData |

Read number fields using an explicit parser or `valueAsNumber`; blank/invalid is not zero.
`required-later` is displayed guidance, not a native HTML requirement. Set native `required`
only when the current operation requires the value. A controlled adapter must reset both
its stored draft and the DOM when handling reset; do not silently discard unsaved work.
