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
