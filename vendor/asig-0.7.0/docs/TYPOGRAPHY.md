# Typography roles

Use role tokens from `foundation.type` in the token JSON. They reference the existing
font scale so changing a scale value cannot silently leave a second set behind.
`as-text` with `data-role` is an optional reference implementation, not a global reset.
Font family is inherited from the product; CAD must remain offline-safe.

| Role | Purpose | Scale | Weight | Line height |
| --- | --- | --- | --- | --- |
| title | Page identity | 2xl | Semibold | Tight |
| section | Main content group | xl | Semibold | Tight |
| body | Explanations and primary content | md | Normal | Normal |
| label | Control labels and compact headings | sm | Medium | Normal |
| caption | Secondary context, never the only critical instruction | xs | Normal | Normal |
| numeric | Totals and comparable summary values | xl | Semibold | Tight |

```html
<h1 class="as-text" data-role="title">Vendor procurement</h1>
<p class="as-text" data-role="body">Review the selected supplier and receiving location.</p>
<span class="as-text" data-role="numeric">$1,340.00</span>
```

Heading rank follows document structure, not visual size. Use tabular numerals for
comparable amounts and quantities. Keep numeric units visible; formatting, precision,
currency and calculation belong to the consuming product.

Operations may use a compact title treatment through its existing page header adapter.
Marketing may use a larger editorial display style in its own theme. Document these
intentional exceptions locally. Do not globally enlarge existing ERP headings or introduce
a second font download just to match this catalogue.

Test long labels, enlarged text and mixed numeric lengths. Avoid fixed text-container
heights and all-caps business labels. Never reduce font sizes to conceal a layout problem.

## Operational page hierarchy

The six generic roles above remain compatible. `foundation.pageType` adds explicit operational
roles via `.as-page-text[data-role]` in `pages.css`. Inspect the [visual type guide](../site/pages.html).
These values are rem-based; pixel equivalents below assume a 16px root.

| Role | Size | Weight | Line height | Letter spacing | Use |
| --- | --- | --- | --- | --- | --- |
| page-title | 32px; 24px at ≤40rem | 600 | 1.2 | −0.02em; −0.01em on narrow screens | One page identity |
| page-subtitle | 16px | 400 | 1.5 | 0 | Context below the title |
| section-title | 18px | 600 | 1.4 | −0.01em | Major task group |
| card-title | 16px | 600 | 1.5 | 0 | Task or card heading |
| body | 16px | 400 | 1.5 | 0 | Reading and explanatory content |
| label | 14px | 500 | 1.5 | 0 | Controls and compact headings |
| table | 14px | 400 | 1.5 | 0 | Comparable business rows |
| help | 14px | 400 | 1.5 | 0 | Instructions and secondary explanation |
| caption | 12px | 400 | 1.5 | 0 | Dates and supporting metadata |
| metric | 28px | 600 | 1.2 | −0.02em | A few important summary values |
| identifier | 14px | 600 | 1.5 | 0 | Order numbers and references |

Use tabular numerals for metrics, amounts and identifiers. Keep long identifiers readable;
letter spacing is never a workaround for narrow columns. Use sentence case for headings and
labels. Uppercase is reserved for short nonessential location markers. Body and help copy
remain within 70ch. Do not use caption size for errors or essential instructions.

Examples use Inter at weights 400/500/600. Product layout loads the font once and controls
fallbacks; these CSS rules inherit it. A missing font must remain readable with system fallbacks.
The operational roles are an opt-in adoption proposal; they do not silently resize existing
ERP PageSectionHeader, WorkspaceHero or table implementations.
