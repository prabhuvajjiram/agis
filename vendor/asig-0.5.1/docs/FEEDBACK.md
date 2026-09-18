# Feedback and system state

Every asynchronous or exceptional state must be understandable without relying on color
alone. The application supplies truthful state; shared patterns present it consistently.

## Feedback hierarchy

| Pattern | Use |
| --- | --- |
| Field error | A problem tied to one control |
| Validation summary | Several submission problems, linked to their fields |
| Alert | Persistent page or section information requiring attention |
| Status message | Progress or a non-urgent result of an action |
| Toast | Brief confirmation that does not require a decision |
| Dialog | A decision or blocking consequence, not routine success feedback |

## Announcements

- Use `role="alert"` for urgent errors that must be announced immediately.
- Use a persistent `aria-live="polite"` region for saving, loading, and success messages.
- Create live regions before the operation starts; update their text rather than mounting
  an already-populated region after the fact.
- Do not announce the same message through both a field error and a toast.
- Keep validation messages until corrected. Do not auto-dismiss actionable errors.

## Loading and empty states

- Show a spinner or inline status for local actions and skeletons for initial structured
  content loading.
- Preserve layout to avoid large shifts when content arrives.
- Skeletons are hidden from assistive technology; a nearby live status names the load.
- Empty states explain whether there is no data, no result for current filters, or no
  permission, and offer a relevant next action when one exists.
- A failed request provides an understandable error and retry when retry is safe.

## Visual treatment

- Alerts, loading rows, and empty states use compact high-opacity glass surfaces with a
  visible border, restrained depth, and a semantic icon. Color is supportive; the title
  and message always carry the meaning.
- Keep alert titles specific and messages concise. Place at most one safe next action at
  the trailing edge; stack that action below the message on narrow screens.
- A loading state pairs its visual indicator with persistent `role="status"` text. Motion
  stops under reduced-motion preferences without hiding the loading meaning.
- An empty state uses a calm icon, a precise explanation, and one relevant recovery action.
  It is not an error alert and must not be announced urgently.
- Glass effects fall back to an opaque surface for reduced-transparency and forced-colors
  preferences. Never trade text contrast for transparency.

## Domain truth

Success feedback appears only after the authoritative operation succeeds. A pending UI
state, queued request, or workflow event is not proof that ERP business state committed,
CAD output is valid, or public-site submission was delivered.
