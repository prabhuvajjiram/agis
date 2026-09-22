# Operational page design

Use this contract to compose Angel Stones workspaces. The [page design guide](../site/pages.html)
shows typography at its actual size and links to Orders, Workbench and order-detail examples.
These are proposals for deliberate ERP adapter adoption, not proof that existing routes have changed.

## Visual character

Create calm, readable operational pages. The title identifies the task; the subtitle supplies
context; one primary action names the next useful step. Keep navigation, content and record
context visually distinct. Use opaque surfaces for forms, worklists and financial review.
Module icon colors identify work areas. Status always includes readable text.

The catalogue and these examples load a local Inter font. The ERP already loads Inter through
its application layout. Shared CSS inherits the product font and does not download another
font. CAD retains its offline font strategy. Marketing may define its own editorial hierarchy;
these operational sizes do not establish its hero or campaign typography.

## Page anatomy

1. **Location:** persistent workspace navigation with one current destination, plus a breadcrumb
   when deeper hierarchy needs explanation. Navigation stays outside the main landmark.
2. **Identity:** one h1, a concise subtitle, visible record state when relevant and one primary
   action. Put related secondary actions alongside it; allow wrapping rather than clipping.
3. **Controls:** search, filters and result count immediately above the content they affect.
   Preserve query state through failure and retry. Do not displace the title with a large toolbar.
4. **Content:** group by the operator's task. Use section headings, restrained borders and
   a consistent vertical rhythm. Avoid a card around every individual field.
5. **Context:** totals, ownership, next checkpoint and related records sit beside long forms
   on wide screens, then follow them in DOM order on narrow screens.
6. **Feedback:** show loading, empty, error, retry and restricted messages inside the relevant
   content region. Keep the page identity and navigation visible when content is unavailable.

## Geometry and responsive behavior

Use `foundation.layout` tokens; pixel equivalents assume a 16px root.

| Property | Contract |
| --- | --- |
| Workspace maximum | 90rem / 1440px for content; centered on wider displays |
| Page gutter | `clamp(1rem, 2vw, 2rem)` / 16–32px |
| Workspace navigation | 13rem / 208px in these compositions; existing ERP module rail remains its own adapter |
| Section gap | 1.5rem / 24px |
| Panel padding | 1.5rem / 24px; 1rem / 16px at 40rem and below |
| Reading measure | Maximum 70ch for explanatory paragraphs |
| Focused form measure | Up to 48rem / 768px when the form is the sole task; workspaces can remain wider |
| Context column | 16–20rem beside the main record above 64rem |
| At or below 64rem / 1024px | Navigation wraps into a row; record context moves below main sections |
| At or below 40rem / 640px | Page title becomes 24px; actions wrap; panel padding reduces |

Breakpoints use rem and must also work with enlarged text. Never fix text container heights.
The example navigation is a compact workspace list, not a replacement for ERP's labeled module
rail. A production drawer must retain an accessible trigger, dismissal and focus restoration.

Field groups still use the existing container queries: one column below 40rem, two when their
container permits, three only for closely related compact values above 60rem. Long references,
notes and growing-list selectors span the row. A wide monitor does not imply a wide dialog.

Tables preserve comparison columns in a named, keyboard-focusable horizontal scrolling region.
The page itself must not overflow. Preserve full identifiers and business names, and make
numeric amounts tabular and right-aligned with visible units/currency. A narrow viewport is
not a reason to remove essential columns silently. Product table adapters retain sticky
headers, pagination, server sorting and authorized result counts.

## Density

Comfortable table cells have 14px vertical padding; compact cells have 8px. Compact density
changes whitespace, not font size, labels or minimum 44px interactive targets. Dense ERP
worklists may use compact mode while forms retain comfortable spacing. The example selector
only changes its local table; a product preference and persistence belong to the application.

Avoid making dense pages airy by enlarging every title or adding oversized cards. Use 24px
between sections, 16px between groups and 8px between closely related text elements. Favor
wrapping and meaningful grouping over truncation or progressively smaller text.

## Composition recipes

| Page | Reference | ERP adapter mapping |
| --- | --- | --- |
| Orders | [Worklist](../examples/orders.html): identity, search/status filters, count, comparable rows, empty and retry states | `WorkspaceCollectionPage` + existing toolbar + `DataTable`; preserve controlled server sorting |
| Workbench | [Task workspace](../examples/workbench.html): a few scoped counts, task scopes, clear next actions with record identity | Existing Workbench route and queue components; counts and ownership remain backend-projected |
| Order detail | [Record workspace](../examples/order-detail.html): overview, grouped receiving form, activity, adjacent order context | `WorkspaceDetailPage`, `WorkspaceSidebarPanel`, `FormSection`, `FieldGrid`, `Field` and current mutation callbacks |

The sample sidebar links these three compositions. Each reference has light/dark and
loading/empty/error/restricted previews. Orders searches and sorts only three explicitly loaded
sample rows. Workbench counts match its sample task scopes. Detail validation and failed-save
recovery preserve local notes. None represents a real ERP approval, save or inventory action.

## Import and adoption

```css
@import "@angelstones/design-tokens/tokens.css";
@import "@angelstones/ui-patterns/all.css";
/* Or import pages.css with the existing primitives used by the page. */
```

Both `all.css` and `bundle.css` include the page and typography rules. The page pattern is
opt-in through `.as-workspace`, `.as-page-*` and semantic type roles. It does not globally
reset product headings. The complete JSON export includes `foundation.pageType` and
`foundation.layout`; product adapters can consume the same CSS variables.

Map type roles to existing ERP headers, table cells and Field primitives in one reviewed flow
at a time. Do not introduce a second shell or replace route behavior to imitate the specimen.
The ERP stays pinned to its adopted release until a separate package upgrade is reviewed.

Before product adoption, verify actual route screenshots at 375/768/1024/1440px; light/dark;
long customer names; 320px reflow and enlarged text; keyboard navigation; errors and retry;
permission boundaries; and save/reopen behavior for changed forms. Reference tests establish
presentation and sample interactions only. Human screen-reader and product UAT remain separate.
