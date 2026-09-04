# Adoption plan

Adoption is incremental. Existing products continue to build independently until each
product adapter is separately reviewed.

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

## Phase 3 — extended shared patterns and regression protection

- cover choices, navigation, data display, disclosure, file upload, and date/time;
- provide a browsable, responsive component catalogue;
- run static contract, markup, accessibility, interaction, and screenshot checks in CI;
- create a deterministic, checksummed vendored release snapshot;
- route Angel Stones UI work to ASIG from the company standards skill.

Complete in `0.3.0`.

## Phase 4 — product adapters

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

Adoption remains unstarted until each product change is reviewed separately. The
Manufacturing Vendor form remains a proposed pilot, not part of `0.3.0`.

## Phase 5 — distribution evolution

The first reviewed distribution model is a committed, deterministic vendored snapshot
with a checksum manifest. Consuming repositories can copy an exact release without a
registry or runtime network dependency. Future options remain:

1. a public versioned npm package suitable for the open-source OpenCAD project;
2. separate public tokens/patterns and private company-only adapters.

Do not use unversioned filesystem links in committed application manifests. They make
CI, external contributors, and reproducible builds depend on one developer machine.

## Phase 6 — governance evolution

- add critical product-flow checks after adapters are introduced;
- add lint or architecture checks for bypassed shared patterns where practical;
- document migration notes and intentional exceptions.
