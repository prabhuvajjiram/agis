# Adoption plan

Adoption is incremental. Existing products continue to build independently until the
distribution and release process is approved.

## Phase 1 — foundation

- establish ASIG guidance and semantic token names;
- provide operations, CAD, and marketing theme mappings;
- provide framework-neutral form composition styles;
- validate theme completeness and critical color contrast;
- provide a static visual specimen.

Complete in `0.1.0`.

## Phase 2 — controls and actions

- define button hierarchy, sizing, loading, disabled, and destructive behavior;
- distinguish Select, Combobox, multi-select, and command menus;
- define menu, dialog, focus, overlay, and responsive behavior;
- define alerts, live status, loading, empty, and failure states;
- provide framework-neutral CSS and an accessible interactive specimen;
- validate required pattern contracts and expanded theme contrast.

Complete in `0.2.0`.

## Phase 3 — product adapters

### Angelgranites ERP

- map existing semantic variables to the operations theme;
- create or adapt shared `Field`, `FieldGrid`, and `FormSection` components;
- pilot the Manufacturing Vendor form and its Supplier Queue counterpart;
- keep tenant, permission, pricing, and workflow enforcement in the ERP backend;
- verify desktop/mobile layouts, keyboard operation, and lifecycle tests.

### OpenCAD / OpenMonuCAD

- map existing teal, amber, ink, fog, and sand values to the CAD theme;
- adapt the local Button, Input, Select, Card, Label, and section primitives;
- preserve offline operation and avoid runtime font or design-system network calls;
- verify canvas/tool state remains visually unambiguous.

### theangelstones.com

- map the current black/gold CSS variables to the marketing theme;
- apply shared field anatomy first to the contact and inventory experiences;
- preserve the static cPanel build and additive overlay process;
- do not modify or package CRM and other separately deployed operational paths.

Adoption remains unstarted until each product change is reviewed separately.

## Phase 4 — distribution

Choose one reviewed distribution model before adding cross-repository dependencies:

1. a public versioned npm package suitable for the open-source OpenCAD project;
2. a vendored release snapshot with provenance and an update script;
3. separate public tokens/patterns and private company-only adapters.

Do not use unversioned filesystem links in committed application manifests. They make
CI, external contributors, and reproducible builds depend on one developer machine.

## Phase 5 — governance and regression protection

- add a component/specimen catalogue once the pattern set stabilizes;
- add screenshot checks for supported themes and widths;
- add accessibility checks for shared examples and critical product flows;
- add lint or architecture checks for bypassed shared patterns where practical;
- document migration notes and intentional exceptions.

## Current repository state noted during foundation work

- Angelgranites ERP: clean `develop` checkout at inspection time.
- OpenCAD: clean `main` checkout at inspection time.
- newangelstones: existing uncommitted application and dependency changes were present;
  foundation work did not touch that repository.
