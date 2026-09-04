# Component coverage

ASIG grows from repeated cross-product needs. “Covered” means more than a CSS class: the
pattern needs guidance, tokens, an implementation reference, verification, and eventually
adoption evidence.

| Family | Guidance | CSS pattern | Specimen | Product adapters |
| --- | --- | --- | --- | --- |
| Tokens and product themes | Complete | Complete | Forms and controls | Not yet adopted |
| Form anatomy and responsive layout | Complete | Complete | Complete | Planned |
| Buttons and action hierarchy | Complete | Complete | Complete | Planned |
| Native Select | Complete | Complete | Complete | Planned |
| Combobox | Behavior contract | Visual building blocks | Not yet | Product-owned |
| Dropdown menu | Behavior contract | Visual building blocks | Keyboard example | Product-owned |
| Dialog and confirmation | Complete | Complete | Native dialog example | Product-owned |
| Alerts, status, toast, loading, empty | Complete | Complete | Representative states | Planned |
| Checkbox, radio, and switch | Complete | Complete | Complete | Product-owned |
| Tabs | Complete | Complete | Complete | Product-owned |
| Segmented controls | Use buttons or tabs by meaning | Existing action/tab patterns | Not separate | Product-owned |
| Disclosure, tooltips, and popovers | Complete | Complete | Complete | Product-owned |
| Cards and description lists | Complete | Complete | Complete | Product-owned |
| Tables and pagination | Complete | Complete | Complete | Product-owned |
| Data grids | Behavior boundary | Visual foundations | Table specimen | Product-owned |
| Navigation and breadcrumbs | Complete | Complete | Complete | Product-owned |
| File upload and date/time | Complete | Complete | Complete | Product-owned |
| Premium surfaces and depth | Complete | Complete | Complete | Planned |

## Global versus product-owned

Global coverage should include meaning, states, sizing, focus, keyboard interaction,
contrast, motion, responsive behavior, and visual tokens. Product adapters own framework
integration. Domain compositions and business authority stay in the consuming product.

ERP DataTable behavior, workflow controls, and permissions stay in ERP. CAD canvas tools,
precision controls, and geometry state stay in OpenCAD. Marketing heroes, galleries, and
conversion content stay in the public site.

The catalogue demonstrates shared structure and interaction, but it is not adoption
evidence. A family remains product-owned until a consuming repository deliberately maps
its framework and domain behavior to the documented contract.

## Accessibility conformance

WCAG 2.1 Level AA is a release gate for every family in this table, including patterns
marked product-owned. “Complete” means that shared guidance, CSS, and specimens pass the
automated ASIG suite and have the manual evidence required by the
[accessibility standard](ACCESSIBILITY.md). Product adapters must repeat the checks in their
actual application context; shared-component results alone are not product conformance.
