# Actions and buttons

Buttons express an action, not a destination or a business state. Shared button patterns
own presentation and interaction feedback; the consuming application owns permission,
confirmation, idempotency, validation, and the operation itself.

## Choose the correct element

- Use a `button` for an action in the current context.
- Use an `a` element or framework link for navigation, including when it is styled as a
  button.
- Do not attach navigation to a button or mutations to a link.
- Icon-only actions require a programmatic name such as `aria-label="Close"`.

## Hierarchy

| Variant | Use |
| --- | --- |
| Primary | The preferred next action. Usually one per action group. |
| Secondary | A safe alternative with comparable importance. |
| Ghost | A low-emphasis local action. |
| Destructive | An action that deletes, cancels, revokes, or irreversibly changes data. |
| Link | A navigational element rendered with button-like spacing. |

Success, warning, and information colors communicate state. They are not general-purpose
button variants. A completed operation may show success feedback without turning its next
unrelated action green.

Every ASIG button uses the shared dimensional material: a restrained theme-aware gradient,
top-edge highlight, border, and elevation. Hierarchy still comes from the semantic variant,
not from removing finish quality from secondary or destructive actions. Secondary uses a
clear theme-tinted border and raised surface; Ghost uses a quieter but still visible neutral
surface. Link intentionally stays flat because it communicates navigation rather than
elevation.

## Size and placement

- The standard interactive height and icon-button width are at least 44px.
- Compact 36px controls are allowed only in genuinely dense pointer-first workspaces.
  They return to a 44px hit target for coarse pointers.
- Controls in one horizontal action group use the same height and at least 8px spacing.
- On narrow screens, dialog actions stack with the primary action last in source and
  visual order, nearest the bottom edge.
- Do not use hover movement or scale as the only interaction signal.

## Loading and disabled behavior

- Use `aria-busy="true"` while an action is running and prevent duplicate submission.
- Preserve the button's width while its label changes to loading text.
- Keep the action label meaningful: `Saving order…` is better than `Please wait`.
- A disabled action has an adjacent explanation connected with `aria-describedby` when
  the reason is not otherwise obvious.
- Use `aria-disabled="true"` instead of native `disabled` only when the control must stay
  focusable so the user can discover its explanation. The handler must then block the
  action explicitly.

## Destructive actions

- Confirm irreversible or difficult-to-recover actions in a dialog.
- Keep the action that opens a confirmation neutral; danger styling belongs on the final
  destructive decision, not on the invitation to review it.
- Name the affected object and consequence; avoid a generic “Are you sure?” message.
- The confirmation action repeats the destructive verb, such as `Delete template`.
- Do not confirm routine reversible actions merely because they update data.
- Authorization and lifecycle checks run again when the application executes the action.

## Adapter contract

Product button adapters must provide semantic variants, standard and compact sizes,
icon-only naming, visible focus, disabled and busy states, reduced-motion behavior, and
the shared dimensional finish. They also provide an escape hatch for product-owned
composition without accepting product-specific colors.
