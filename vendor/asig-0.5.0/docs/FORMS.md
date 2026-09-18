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
