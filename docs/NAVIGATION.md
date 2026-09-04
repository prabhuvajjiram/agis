# Navigation, breadcrumbs, tabs, and pagination

Navigation patterns reveal location and available destinations without taking over product
routing. Use native links for destinations and buttons for changes on the current screen.

## Page navigation

- Provide a skip link before repeated navigation.
- Name multiple `nav` landmarks and mark the current page with `aria-current="page"`.
- Breadcrumbs use an ordered list; the current item is text or a non-clickable current link.
- Pagination keeps Previous and Next labels explicit and announces the current page.
- Preserve URL, history, focus, and scroll behavior in the consuming product router.

## Tabs

Use tabs only for peer views within one context. The tab list has `role="tablist"`; each tab
owns one panel through `aria-controls`, and each panel points back with `aria-labelledby`.
Only the active tab is in the normal tab order.

Left and Right Arrow move between horizontal tabs, Home and End reach the boundaries, and
Enter or Space activates when activation is manual. Focus remains visible, and selecting a
tab must not silently discard unsaved work.

At narrow widths, allow the tab list to scroll horizontally without clipping focus. For a
long or deeply nested information architecture, use ordinary navigation instead of tabs.
