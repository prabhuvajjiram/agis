# Product themes

The Angel Stones product family should feel related without flattening three different
jobs into one visual skin.

## Operations

Used by the ERP and internal operational tools. It prioritizes clarity, scanning,
dense-but-calm workspaces, restrained blue emphasis, and reliable light/dark modes.

## CAD

Used by OpenCAD / OpenMonuCAD. It prioritizes canvas legibility, precise tool state,
offline-safe system fonts, teal primary actions, and amber emphasis for fabrication and
conversion context.

## Marketing

Used by the public Angel Stones website. It preserves the current black, stone, and gold
editorial character while adopting the same focus, form, spacing, and status semantics.

## Theme contract

Every theme supplies these roles:

- background, surface, and muted surface;
- foreground and muted foreground;
- border and input surface;
- primary, primary hover, and content on primary;
- accent and content on accent;
- focus, success, warning, danger, and information.

Components consume roles only. They do not test the active product name or include
product-specific hex values.
