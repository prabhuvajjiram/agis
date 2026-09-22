# Navigation, breadcrumbs, tabs, and pagination

Navigation patterns reveal location and available destinations without taking over product
routing. Use native links for destinations and buttons for changes on the current screen.

## Page navigation

- Provide a skip link before repeated navigation.
- Name multiple `nav` landmarks and mark the current page with `aria-current="page"`.
- Breadcrumbs use an ordered list; the current item is text or a non-clickable current link.
- Pagination keeps Previous and Next labels explicit, marks the current page with
  `aria-current="page"`, disables unavailable boundaries, and announces page changes with
  a polite live region.
- Preserve URL, history, focus, and scroll behavior in the consuming product router.

## Application sidebar

Use the ASIG sidebar for persistent application navigation with many peer destinations. The
Angel Stones operations composition uses two coordinated landmarks: a compact product-area
rail and a labelled module panel. Keep authorization, route selection, persistence, and
workspace context in the consuming application.

- Use links for every destination and `aria-current="page"` for the current route.
- Give the product-area rail and module list distinct accessible names. Every icon-only
  rail link requires its own programmatic name. A module button that opens a panel uses
  `aria-expanded` and `aria-controls`; reserve `aria-current` for the actual route link.
- Keep each rail and module destination at least 44 by 44 CSS pixels.
- The optional search filters visible destinations; it does not replace authorization or
  change the current route. Announce the result count with a polite live region.
- Moving active indicators in both the product-area rail and destination panel may transition
  for 150–300ms when route selection changes.
  Update the current state immediately, never delay navigation for animation, and disable
  the transition under `prefers-reduced-motion: reduce`.
- The shared glass surface uses high-opacity theme surfaces, a visible boundary, and a
  reduced-transparency fallback. Decorative transparency must never reduce text, focus, or
  active-state contrast below WCAG 2.1 AA.
- At narrow widths, preserve the icon rail and allow the labelled panel to use the remaining
  width. Product adapters may collapse the panel into an explicitly labelled drawer when
  content space would otherwise fall below 320 CSS pixels.

The catalogue specimen moves both active indicators and swaps representative destination
labels without changing routes. Real adapters
must connect `aria-current`, focus management, browser history, and the indicator position
to their router; ASIG does not own route or permission behavior.

## Labeled module rail

The Operations reference uses `data-rail-style="labeled"` on `as-sidebar`, matching the
ERP module treatment selected in September 2026. Retain the icon-only variant for existing
consumers that deliberately use it; do not silently restyle their rail.

- Show a short visible label below each 18px outline icon in a 32px circular badge.
- Give Home, Sales, Ops, Inventory, Finance, Reports and Admin distinct identity tones.
  These hues identify modules; they are not success, warning or error states.
- Use semantic `navigation*Surface`/`navigation*Ink` pairs from the active theme. Contrast
  validation covers every pair. Keep the selected module strongly contrasted in light/dark.
- Keep each module at least 64px high and the rail 88px wide. Labels may wrap under enlarged
  text; do not truncate away the only visible name.
- Mark the expanded module immediately, update its destination labels **and icons** together,
  and retain one current destination. Filtering must not reveal unused placeholder rows.
- The reference uses the same Heroicons outline paths as the ERP. Attribution ships with
  the local SVG sprite. No CDN is required. Other products may use their existing icon library.
- Real module sets, counts, authorization and customer/vendor workspaces remain product-owned.
  Sample destinations are illustrative; do not copy them over the ERP navigation registry.

Review the actual ERP rail when changing ASIG navigation, and review the ASIG specimen when
changing the ERP adapter. Record intentional differences so a stale icon-only specimen cannot
be mistaken for the required current Operations design.

## Tabs

Use tabs only for peer views within one context. The tab list has `role="tablist"`; each tab
owns one panel through `aria-controls`, and each panel points back with `aria-labelledby`.
Only the active tab is in the normal tab order.

The Angel Stones segmented treatment places peer views in one high-opacity glass track.
Icons may supplement concise text labels but never replace them. A moving active indicator
may transition for 150–300ms; selection and panel visibility update immediately, and both
indicator and panel motion stop under `prefers-reduced-motion: reduce`.

Left and Right Arrow move between horizontal tabs, Home and End reach the boundaries, and
Enter or Space activates when activation is manual. Focus remains visible, and selecting a
tab must not silently discard unsaved work.

At narrow widths, allow the tab list to scroll horizontally without clipping focus. For a
long or deeply nested information architecture, use ordinary navigation instead of tabs.

## Data view switchers

Use a view switcher for a small set of frequently used scopes that update one data workspace,
such as Needs Attention, My Tasks, and Active Orders. These are buttons, not tabs, because they
change a query rather than reveal preloaded tab panels.

- Keep two to four frequent scopes visible and move the longer taxonomy into one searchable
  “More views” picker. Never wrap a dozen peer buttons across multiple rows.
- Put the buttons in a labelled group and expose the selected scope with `aria-pressed="true"`.
- Update the pressed state, URL, and visible description immediately. A 150–300ms surface or
  content transition may reinforce the change but must not delay fetching or navigation.
- On narrow screens, replace the complete switcher with one labelled searchable picker so the
  page retains at least 320 CSS pixels of usable content width.
- Keep permissions and valid scopes in the product. ASIG owns the calm glass track, selection
  styling, responsive contract, focus visibility, and reduced-motion fallback.

## Pagination

Use a compact glass surface to group result context and controls. Previous and Next remain
text-labelled even when directional icons are present. The current page uses
`aria-current="page"`, unavailable boundaries use the native `disabled` state, and a polite
status communicates each page change without moving focus.

The consuming product owns result fetching, URL/history updates, total counts, and error
handling. ASIG supplies presentation and interaction contracts only; pagination must not
delay data or route state to complete an animation.
