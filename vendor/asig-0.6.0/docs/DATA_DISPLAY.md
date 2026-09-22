# Cards, descriptions, tables, and data grids

Choose the lightest structure that communicates the data. Cards group related content,
description lists pair labels with values, and tables compare records across shared columns.
A data grid is an application component with selection, editing, virtualization, or complex
keyboard behavior; ASIG supplies its visual and accessibility contract, not its data engine.

## Visual hierarchy

- Give summary cards a clear identity block, one concise state badge, and a short explanation
  before the details. A card is not implicitly clickable; add a named link or button when it
  has an action.
- Description-list tiles are an optional compact treatment for a few high-value facts. Keep
  the native `dl`, `dt`, and `dd` relationships and return to the standard stacked treatment
  when values are long or the viewport is narrow.
- State badges pair readable text with shape and icon or dot treatment. Color reinforces the
  state but never carries its meaning alone.
- Use restrained glass and depth to separate a data workspace from its surroundings. Provide
  opaque reduced-transparency, unsupported-browser, and forced-colors fallbacks.

## Tables

- Use native `table`, `caption`, `thead`, `tbody`, and scoped header cells.
- Make every meaningful data column sortable by default. Selection checkboxes, row numbers,
  expansion toggles, and action-menu columns are controls rather than data and must not offer
  a meaningless sort.
- Keep sortable headers as native buttons and expose direction with `aria-sort` on the header.
  Only the active sort has `ascending` or `descending`; other sortable headers use `none`.
- Use type-aware comparators for text, localized numbers, currency, dates, and domain status
  order. Put missing values last and keep equal values stable.
- Put the table in a labelled, focusable overflow region only when horizontal scrolling is
  actually required.
- A compact table toolbar may expose the dataset title, scope, result count, and safe global
  actions. Keep the native table caption available to assistive technology even when the same
  title is presented visually in the toolbar.
- Within rows, emphasize the record's primary identity, keep secondary context quieter, align
  numeric values for scanning, and use status badges with explicit text.
- Keep row actions named for their record; do not make an entire dense row one ambiguous
  click target.
- Loading, empty, partial, and failure states remain inside the data context and preserve
  the user's filters and sort where possible.

Sticky headers and compact density are enhancements for large datasets. They do not reduce
the default 44px target for interactive controls. Product adapters own pagination queries,
record identity, permissions, selection state, and virtualization. For server-side tables,
the adapter sends the sort key and direction to the backend, preserves them across pages, and
announces the updated result order. On card-based mobile layouts, expose an equivalent named
sort-by control and direction control instead of removing sorting.

On small screens, retain a scrollable comparison table when columns must be compared. Use
cards only when each record can stand alone without losing header meaning.
