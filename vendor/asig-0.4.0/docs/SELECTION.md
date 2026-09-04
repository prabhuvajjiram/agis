# Selection controls

Selection controls choose values. They do not execute commands. The application owns the
available values, authorization, validation, persistence, and any domain consequences.

## Choose the control by task

| Need | Control |
| --- | --- |
| A short, stable list | Native Select or product Select adapter |
| A long, growing, or remote list | Searchable Combobox |
| Several independent choices | Checkbox group |
| One visible choice from a small set | Radio group |
| Immediate binary setting | Switch |
| Commands such as Edit, Export, or Delete | Dropdown menu, not Select |
| More than one selected value | Explicit multi-select pattern, not a disguised Select |

A list should normally become searchable around 15–20 items, earlier when labels are
similar or users know the value they want. Prefer a native Select for small public-site
forms because platform behavior, mobile pickers, and offline operation are valuable.

## Field and state contract

- Every control has a stable visible label. Placeholder text is not a label.
- Connect help and error text with `aria-describedby`; set `aria-invalid="true"` when
  invalid.
- Display loading, no-results, failure, disabled, and cleared states explicitly.
- Preserve the selected value and user query after recoverable failures.
- Long values truncate only in the closed trigger; the option list exposes the full text.
- A required placeholder is not a valid submitted value.

## Select behavior

Product adapters should preserve the native or underlying accessible primitive behavior:
opening, typeahead, Arrow keys, Home, End, Enter, Space, Escape, and returning focus to
the trigger. Options have a 44px touch target where touch is expected.

Do not add a generic fallback label such as “Select option” to hide a missing business
label. A purposeful `aria-label` is acceptable for compact controls whose visual context
already communicates the field.

## Combobox behavior

- Choose one established ARIA pattern and keep its focus model intact. Do not put
  `role="combobox"` on a button and then move DOM focus into a separate search field.
- In a select-only combobox, the combobox itself retains DOM focus while
  `aria-activedescendant` identifies the active option.
- The results container is a named listbox and each result is an option with accurate
  selected state.
- Arrow keys move through results; Home and End reach the boundaries; Enter selects;
  Escape closes; Tab follows normal focus order.
- Search input and active option behavior follow one consistent ARIA combobox pattern.
- In the trigger-plus-picker pattern used by the catalogue, use a native button with
  `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`. The popup is a labelled
  dialog containing the visibly labelled input combobox and its controlled listbox. Keep the
  search field sticky while results scroll and focus it when the trigger opens the picker.
- While the picker is open, DOM focus remains on the input combobox. Arrow keys update
  `aria-activedescendant`; options do not become separate Tab stops. Do not render a detached
  page-level search field that loses the selection context.
- Filter across the visible label plus useful secondary identifiers, announce the result count
  or no-results state, and never silently select the first filtered result.
- Escape closes without changing the current value and restores trigger focus. After selection,
  close the popup, reset the temporary query, retain the authoritative value, and restore focus.
- Debounced remote results expose loading and failure states without erasing the current
  selection.
- Portal positioning responds to viewport changes, zoom, nested scrolling, and available
  space. A mobile adapter may use a dialog or sheet when a popover is too constrained.

## Data and product boundaries

ERP adapters recheck tenant and permission scope and use authoritative backend IDs.
OpenCAD adapters must remain offline-safe and preserve precise units or tool state.
Public-site adapters should prefer native HTML unless a custom control materially improves
the task. Shared controls never infer or persist business values by themselves.

Checkbox, radio, and switch behavior is documented separately in
[Checkbox, radio, and switch](CHOICES.md).
