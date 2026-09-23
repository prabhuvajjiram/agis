# File upload and date/time inputs

Specialized inputs keep native browser behavior wherever it is reliable. Styling must not
hide the real input, its accessible name, accepted formats, limits, or validation state.

## File upload

- Keep a visible native file input; drag and drop is an enhancement, not the only path.
- State accepted file types and size limits before selection.
- List selected files with name, size, status, and a clearly named remove or retry action.
- Announce upload progress and failures without clearing successfully selected files.
- Treat file extension and client MIME type as hints. The receiving product owns permission,
  authoritative validation, malware scanning, storage, and audit behavior.

## Date and time

Use native `date`, `time`, or `datetime-local` inputs unless the product has a tested reason
to provide a custom picker. Keep the visible label explicit about the requested value and
show format guidance when locale behavior may be unclear.

Store and transmit values according to the product's domain rules. Display the relevant time
zone when a time represents a real instant, and never silently convert a local business date
into a different calendar day. Minimum, maximum, unavailable, and validation states must be
both visible and programmatically exposed.

## Inputs, outputs and state

This is a framework-neutral **adapter contract**, not a JavaScript API exported by ASIG.
Names below describe values and notifications a product adapter should support. See
[the contract conventions](COMPONENT_CONTRACTS.md) for types, defaults, native events,
controlled state and React/Next.js/Angular mappings.

| Pattern | Inputs (type; requirement/default) | Outputs / events and payload | State and behavior owner |
| --- | --- | --- | --- |
| File input / upload | id and label: string, required; accept: MIME/extensions string, optional; multiple and disabled: boolean, default false; size/count limits: explicit product values; upload status: per-file product data | Native `change`: Event, read currentTarget.files (FileList or null); recommended files-selected {files: File[]}, remove/retry {fileId: string} | Product owns upload, cancellation, validation and storage. Selection is not upload completion; accept is a hint, not enforcement |
| Date | id and label: string, required; value: YYYY-MM-DD or empty string, default empty; min/max: same format, optional; required/disabled/readOnly: boolean, default false | Native input/change events; adapter value-change {value: string or null}, null for cleared | Product validates business dates; do not convert a date-only value through UTC implicitly |
| Time | Date-like inputs; value: HH:mm with optional seconds; step: seconds, native default 60 | Native input/change; adapter value-change {value: string or null} | Product owns precision and domain validation |
| Local date-time | Date-like inputs; value: YYYY-MM-DDTHH:mm with optional seconds; timezone: explicit product context when representing an instant | Native input/change; adapter value-change {value: string or null, timeZone: string} when zone is required | datetime-local contains no offset. Product resolves zone and daylight-saving ambiguity before persisting an instant |

Do not set a file input's value to a saved path or remote URL. Keep existing attachments
separate from newly selected File objects. Clearing the native file input requires an empty
value; cancellation must not be treated as a successful upload. Revoke temporary object URLs
when no longer needed. Disabled controls are excluded from native form submission.
