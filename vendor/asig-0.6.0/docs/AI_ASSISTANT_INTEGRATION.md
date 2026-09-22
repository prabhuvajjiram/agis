# AI assistant integration

Start with the repository-owned [DESIGN.md](../DESIGN.md). It routes to canonical guidance
and source tokens; the generated foundations gallery exposes exact values without a second
manually maintained palette. Each product should maintain a small local DESIGN.md mapping
ASIG to its existing components and pinned dependency version.

The Angel Stones company standards skill routes shared UI work to ASIG. It does not copy
component rules into the skill, because duplicated guidance would drift from the versioned
source.

The routing rule is intentionally small:

- inspect the current ASIG version and relevant guidance before shared UI work in ERP,
  OpenCAD/OpenMonuCAD, or an Angel Stones public site;
- keep framework adapters and business behavior in the consuming product;
- record the adopted ASIG version in that repository;
- never add an unversioned dependency on one developer's filesystem.

ASIG documentation, tokens, patterns, catalogue, and release snapshot remain authoritative.
Product source and tests remain authoritative for domain behavior and actual adoption.
