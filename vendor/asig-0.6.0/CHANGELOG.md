# Changelog

## 0.6.0

- Added page typography, layout and density tokens, complete Orders/Workbench/order-detail examples and a page design guide.
- Fixed combined CSS bundle coverage for typography and included the new page pattern.
- Restored focused skip-link contrast on page compositions and added keyboard regression checks.
- Added an HTML reading view for canonical Markdown guidance, including in-app browser navigation.
- Fixed preview-server directory redirects so `/site` and `/` retain catalogue styles and scripts.

- Added DESIGN.md, semantic typography roles and a generated foundations gallery with
  copyable token references and values. Existing component defaults remain unchanged.
- Added a complete sample-only Operations composition with editable draft and failure recovery.
- Allowed native form controls to shrink within narrow grid tracks at enlarged text sizes.
- Added an opt-in labeled module rail with ERP-aligned outline icons, identity-tone tokens,
  expanded-panel semantics and coordinated destination icons. Existing icon-only rails remain available.
- Added component guidance links, generated catalogue version and expanded theme verification.
- Separated implementation coverage from manual accessibility verification.
- Added a public documentation hub, contributor templates, GitHub Pages delivery and token-free npm trusted publishing.
- ERP adoption is a separate product change; this release does not update installed consumers.

## 0.5.1

- Added contrast-safe solid backgrounds underneath Primary and Destructive button gradients so
  labels remain readable when managed browsers, accessibility modes, printing, or product
  adapters suppress background images.
- Added browser regression coverage that removes button gradients and verifies the solid
  Operations-theme colors and readable foregrounds, including the Primary hover state.
- Added a strong-border semantic role with validated 3:1 non-text contrast for form-control
  boundaries in every theme; adjusted the CAD primary by the minimum needed to clear a
  newly exposed 4.5:1 solid-fallback contrast edge case.
- Made Axe incomplete results explicit, added a second accessibility scan with decorative
  effects disabled, and added runtime coverage for the standalone form specimen.
- Moved action gloss weights into shared tokens so CSS and contrast validation use one source.
- Added an optional concatenated `bundle.css` export while retaining the existing `all.css`
  import and every existing class/export used by ERP.
- Added a gated tag-release workflow for aligned npm packages with provenance, release-tag
  verification, and full validation before publication.
- Improved RTL-safe logical properties, catalogue-server MIME/method/path handling, local-font
  rendering, and defensive catalogue event handling without moving product behavior into ASIG.

## 0.5.0

- Restored clear action hierarchy: Primary, Secondary, and Destructive retain restrained
  dimensional depth; Outline provides a quiet bounded utility; Ghost and Link stay flat.
- Added a dense-workspace view-switcher contract with two to four frequent scopes, searchable
  progressive disclosure for specialized views, immediate state updates, and reduced-motion-safe
  transitions.
- Prepared the token and framework-neutral pattern packages for public npm distribution under
  the MIT license with explicit package metadata and dry-run package validation.
- Added release-specific WCAG 2.1 AA evidence covering responsive reflow, text spacing,
  keyboard state, focus behavior, accessibility preferences, and cross-platform visuals.

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
