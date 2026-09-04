# Changelog

## 0.4.0

- Extended the application sidebar specimen with interactive product areas, a second smooth
  rail indicator, and immediate destination-panel updates.
- Modernized tabs as an ERP-inspired segmented glass control with labelled icons, an
  animated active indicator, immediate panel updates, and reduced-motion fallbacks.
- Modernized pagination with dimensional Previous, current-page, and Next controls plus
  disabled boundaries and live result/page announcements.
- Modernized checkbox and radio choices as native, glass-backed selection cards and upgraded
  switches with larger illuminated tracks, visible state text, and accessible motion fallbacks.
- Modernized alerts, async status, loading, and empty states with compact semantic iconography,
  restrained glass depth, responsive recovery actions, and accessible preference fallbacks.
- Rebalanced confirmation flows so neutral review triggers lead to modern glass dialogs and
  deep-red, contrast-safe final destructive actions across light and dark themes.
- Completed the menu-button interaction contract with outside pointer and focus dismissal,
  Arrow/Home/End navigation, Escape restoration, command selection, and safe dialog handoff.
- Corrected the searchable picker to use a native dialog trigger and an input-based ARIA
  combobox whose DOM focus remains stable while `aria-activedescendant` tracks results.
- Added solid fallbacks for glass-based navigation, choices, feedback, and overlay patterns
  when backdrop filtering is unavailable.
- Expanded accessibility regression coverage for 200 percent text, focus restoration, open
  light and dark dialogs, and deterministic cross-platform visual rendering.
- Moved catalogue navigation into its compact horizontal mode at intermediate laptop widths
  so nested navigation and pagination specimens retain useful space without page overflow.
- Kept the segmented tab indicator aligned on first render, restored pages, font completion,
  viewport changes, and text resizing rather than waiting for a tab interaction to correct it.
- Modernized data display with identity-led summary cards, semantic description tiles, compact
  status badges, and glass table workspaces with explicit titles, counts, and scan-friendly rows.

Product adapters and the Manufacturing Vendor pilot remain intentionally outside this
release.

## 0.3.0

- Added guidelines and framework-neutral CSS for checkbox, radio, switch, navigation,
  breadcrumbs, tabs, pagination, cards, description lists, tables, disclosure, tooltips,
  popovers, file upload, and date/time inputs.
- Added a responsive component catalogue covering the shared pattern families and all four
  product themes.
- Added Playwright interaction and responsive screenshot coverage at 375px, 768px, 1024px,
  and 1440px, plus Axe checks across every product theme.
- Added a deterministic, checksummed vendored distribution snapshot and CI artifact.
- Connected the company standards skill to ASIG without duplicating component guidance.
- Established WCAG 2.1 Level AA as the minimum release gate for every component, with a
  dedicated automated and manual evidence standard.
- Standardized local and GitHub Actions project commands on Node.js 26.
- Added interactive, type-aware sorting to every meaningful data-table column and completed
  the searchable selection specimen with in-popup filtering and keyboard support.
- Added an opt-in premium visual layer for theme-aware gradients, glass, gloss, and depth,
  including forced-colors, reduced-transparency, and reduced-motion fallbacks.
- Applied the dimensional material language to the complete button family while preserving
  semantic hierarchy, contrast, forced-colors behavior, and reduced motion.
- Strengthened Secondary and Ghost action contrast and elevation without competing with the
  primary action.
- Added a glass, two-rail application sidebar patterned after Angel Stones navigation, with
  searchable destinations and a smooth reduced-motion-safe active indicator.
- Self-hosted the catalogue's Inter variable font for deterministic cross-platform visual
  baselines; the font remains licensed under SIL Open Font License 1.1.

Product adapters and the Manufacturing Vendor pilot remain intentionally outside this
release.

## 0.2.0

- Added action, selection, overlay, and feedback guidelines.
- Added framework-neutral CSS for buttons, Select and Combobox building blocks, menus,
  dialogs, alerts, status messages, toasts, skeletons, and empty states.
- Added an interactive cross-theme control specimen with keyboard menu behavior and a
  native confirmation dialog.
- Added semantic hit-target, elevation, layer, motion, icon-size, and destructive-content
  tokens.
- Added pattern, markup, package-export, and destructive contrast validation.

Product adapters and package publication remain intentionally outside this release.

## 0.1.0

- Established ASIG foundations and product boundaries.
- Added operations, operations-dark, CAD, and marketing semantic themes.
- Added framework-neutral form anatomy and responsive field layout.
- Added theme completeness and critical contrast validation.
