# Cards, descriptions, tables, and data grids

Choose the lightest structure that communicates the data. Cards group related content,
description lists pair labels with values, and tables compare records across shared columns.
A data grid is an application component with selection, editing, virtualization, or complex
keyboard behavior; ASIG supplies its visual and accessibility contract, not its data engine.

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
