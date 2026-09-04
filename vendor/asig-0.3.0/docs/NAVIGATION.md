# Navigation, breadcrumbs, tabs, and pagination

Navigation patterns reveal location and available destinations without taking over product
routing. Use native links for destinations and buttons for changes on the current screen.

## Page navigation

- Provide a skip link before repeated navigation.
- Name multiple `nav` landmarks and mark the current page with `aria-current="page"`.
- Breadcrumbs use an ordered list; the current item is text or a non-clickable current link.
- Pagination keeps Previous and Next labels explicit and announces the current page.
- Preserve URL, history, focus, and scroll behavior in the consuming product router.

## Application sidebar

Use the ASIG sidebar for persistent application navigation with many peer destinations. The
Angel Stones operations composition uses two coordinated landmarks: a compact product-area
rail and a labelled module panel. Keep authorization, route selection, persistence, and
workspace context in the consuming application.

- Use links for every destination and `aria-current="page"` for the current route.
- Give the icon rail and module list distinct accessible names. Every icon-only rail link
  requires its own programmatic name.
- Keep each rail and module destination at least 44 by 44 CSS pixels.
- The optional search filters visible destinations; it does not replace authorization or
  change the current route. Announce the result count with a polite live region.
- A moving active indicator may transition for 150–300ms when route selection changes.
  Update the current state immediately, never delay navigation for animation, and disable
  the transition under `prefers-reduced-motion: reduce`.
- The shared glass surface uses high-opacity theme surfaces, a visible boundary, and a
  reduced-transparency fallback. Decorative transparency must never reduce text, focus, or
  active-state contrast below WCAG 2.1 AA.
- At narrow widths, preserve the icon rail and allow the labelled panel to use the remaining
  width. Product adapters may collapse the panel into an explicitly labelled drawer when
  content space would otherwise fall below 320 CSS pixels.

The catalogue specimen moves its active indicator without changing routes. Real adapters
must connect `aria-current`, focus management, browser history, and the indicator position
to their router; ASIG does not own route or permission behavior.

## Tabs

Use tabs only for peer views within one context. The tab list has `role="tablist"`; each tab
owns one panel through `aria-controls`, and each panel points back with `aria-labelledby`.
Only the active tab is in the normal tab order.

Left and Right Arrow move between horizontal tabs, Home and End reach the boundaries, and
Enter or Space activates when activation is manual. Focus remains visible, and selecting a
tab must not silently discard unsaved work.

At narrow widths, allow the tab list to scroll horizontally without clipping focus. For a
long or deeply nested information architecture, use ordinary navigation instead of tabs.
