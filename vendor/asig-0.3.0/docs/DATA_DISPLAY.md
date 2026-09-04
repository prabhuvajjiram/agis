# Cards, descriptions, tables, and data grids

Choose the lightest structure that communicates the data. Cards group related content,
description lists pair labels with values, and tables compare records across shared columns.
A data grid is an application component with selection, editing, virtualization, or complex
keyboard behavior; ASIG supplies its visual and accessibility contract, not its data engine.

## Tables

- Use native `table`, `caption`, `thead`, `tbody`, and scoped header cells.
- Keep sortable headers as buttons and expose direction with `aria-sort` on the header.
- Put the table in a labelled, focusable overflow region only when horizontal scrolling is
  actually required.
- Keep row actions named for their record; do not make an entire dense row one ambiguous
  click target.
- Loading, empty, partial, and failure states remain inside the data context and preserve
  the user's filters and sort where possible.

Sticky headers and compact density are enhancements for large datasets. They do not reduce
the default 44px target for interactive controls. Product adapters own pagination queries,
record identity, permissions, selection state, and virtualization.

On small screens, retain a scrollable comparison table when columns must be compared. Use
cards only when each record can stand alone without losing header meaning.
