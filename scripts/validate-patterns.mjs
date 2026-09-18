import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []

async function load(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8').catch(() => {
    failures.push(`Missing required file: ${relativePath}`)
    return ''
  })
}

function requireText(relativePath, content, values) {
  for (const value of values) {
    if (!content.includes(value)) {
      failures.push(`${relativePath} is missing required contract marker: ${value}`)
    }
  }
}

const requiredFiles = {
  'packages/ui-patterns/actions.css': [
    '.as-button',
    '[data-wrap="never"]',
    '[data-layout="equal"]',
    '[data-variant="destructive"]',
    'linear-gradient',
    '[data-variant="outline"]',
    '--as-control-hit-target',
    ':focus-visible',
    'prefers-reduced-motion',
  ],
  'packages/ui-patterns/selection.css': [
    '.as-select',
    '.as-selection-trigger',
    '.as-selection-popover__search',
    '.as-combobox-search',
    '.as-option',
    '[aria-selected="true"]',
    '[data-active="true"]',
    '--as-control-hit-target',
  ],
  'packages/ui-patterns/overlays.css': [
    '.as-menu-item',
    '.as-dialog',
    '.as-dialog__heading',
    '[data-intent="destructive"]',
    '--as-layer-dropdown',
    '--as-layer-dialog',
    'prefers-reduced-motion',
    'prefers-reduced-transparency',
    '@supports not',
  ],
  'packages/ui-patterns/feedback.css': [
    '.as-alert',
    '.as-alert__icon',
    '.as-loading-state',
    '.as-empty-state__actions',
    '.as-toast',
    '.as-skeleton',
    'prefers-reduced-motion',
    'prefers-reduced-transparency',
    'forced-colors',
    '@supports not',
  ],
  'packages/ui-patterns/choices.css': [
    '.as-choice',
    '.as-switch',
    '.as-switch__state',
    'appearance: none',
    '[aria-checked="true"]',
    '--as-control-hit-target',
    'prefers-reduced-transparency',
    'forced-colors',
    '@supports not',
  ],
  'packages/ui-patterns/navigation.css': [
    '.as-skip-link',
    '.as-sidebar',
    '.as-sidebar__rail',
    '.as-sidebar__rail-indicator',
    '.as-sidebar__indicator',
    '.as-breadcrumbs',
    '.as-tablist',
    '.as-tab__indicator',
    '.as-view-switcher',
    '.as-view-switcher__item',
    '[aria-pressed="true"]',
    '.as-pagination',
    '.as-pagination__status',
    '--as-control-hit-target',
    'prefers-reduced-transparency',
    '@supports not',
  ],
  'packages/ui-patterns/data-display.css': [
    '.as-card',
    '.as-data-status',
    '.as-table-toolbar',
    '.as-table-scroll',
    '.as-table',
    '.as-table__sort',
    '.as-table__sort-status',
    '.as-description-list',
    'prefers-reduced-transparency',
    '@supports not',
  ],
  'packages/ui-patterns/disclosure.css': [
    '.as-disclosure',
    '.as-tooltip',
    '.as-popover',
    '--as-layer-tooltip',
    'prefers-reduced-motion',
  ],
  'packages/ui-patterns/specialized-inputs.css': [
    '.as-file-input',
    '.as-upload-zone',
    '.as-file-list',
    '.as-date-time-grid',
  ],
  'packages/ui-patterns/surfaces.css': [
    '.as-surface',
    '[data-appearance="gradient"]',
    '[data-appearance="glass"]',
    '[data-depth="floating"]',
    '[data-gloss="true"]',
    'prefers-reduced-transparency',
    'forced-colors',
  ],
  'packages/ui-patterns/all.css': [
    '@import "./forms.css"',
    '@import "./actions.css"',
    '@import "./selection.css"',
    '@import "./overlays.css"',
    '@import "./feedback.css"',
    '@import "./choices.css"',
    '@import "./navigation.css"',
    '@import "./data-display.css"',
    '@import "./disclosure.css"',
    '@import "./specialized-inputs.css"',
    '@import "./surfaces.css"',
  ],
  'packages/ui-patterns/dist/all.css': [
    'Generated from packages/ui-patterns/*.css',
    '/* forms.css */',
    '/* actions.css */',
    '/* surfaces.css */',
  ],
  'docs/ACTIONS.md': ['Icon-only actions require', 'aria-busy="true"', 'Destructive actions', 'shared dimensional material'],
  'docs/SELECTION.md': ['Combobox behavior', 'Dropdown menu, not Select', 'aria-activedescendant', 'aria-haspopup="dialog"', 'result count'],
  'docs/OVERLAYS.md': ['focus trapping', 'Escape closes', '44px', 'final destructive action'],
  'docs/FEEDBACK.md': ['role="alert"', 'aria-live="polite"', 'authoritative operation', 'reduced-transparency'],
  'docs/COMPONENT_STATUS.md': ['Product adapters', 'Product-owned'],
  'docs/ACCESSIBILITY.md': [
    'WCAG 2.1 Level AA',
    '4.5:1 contrast',
    '320 CSS pixels',
    'screen-reader/browser combination',
    'Automation cannot prove WCAG conformance',
  ],
  'docs/CHOICES.md': ['fieldset', 'role="switch"', 'authoritative operation'],
  'docs/NAVIGATION.md': ['aria-current="page"', 'role="tablist"', 'Arrow', 'Application sidebar', 'Data view switchers', 'aria-pressed="true"', 'prefers-reduced-motion'],
  'docs/DATA_DISPLAY.md': ['aria-sort', 'meaningful data column', 'type-aware comparators', '44px', 'virtualization'],
  'docs/DISCLOSURE.md': ['aria-describedby', 'Escape', 'native Popover'],
  'docs/SPECIALIZED_INPUTS.md': ['native file input', 'malware scanning', 'silently convert'],
  'docs/DISTRIBUTION.md': ['vendored snapshot', 'SHA-256', 'runtime network request'],
  'docs/VISUAL_EXPRESSION.md': ['one strong focal', 'Forced-colors mode', 'reduced-transparency'],
  'docs/releases/0.4.0-accessibility-evidence.md': [
    'Automated evidence',
    'Manual verification',
    'Screen reader',
    'Pending human review',
  ],
  'docs/releases/0.5.0-accessibility-evidence.md': [
    'Automated evidence',
    'Manual verification',
    'Screen reader',
    'Pending human review',
    'data view switcher',
  ],
  'docs/releases/0.5.1-accessibility-evidence.md': [
    'Automated evidence',
    'Manual verification',
    'Screen reader',
    'Pending human review',
    'solid action fallback',
  ],
  'site/assets/catalog.css': ['@font-face', 'Inter ASIG', 'inter-latin-wght-normal.woff2'],
  'site/assets/catalog.js': ['aria-activedescendant', 'dataset.active', 'scrollIntoView'],
  'site/assets/fonts/INTER-OFL.txt': ['SIL OPEN FONT LICENSE Version 1.1'],
  'site/assets/fonts/README.md': ['@fontsource-variable/inter@5.3.0', '3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62'],
  'site/assets/fonts/inter-latin-wght-normal.woff2': [],
  'site/index.html': [
    'id="theme-select"',
    'data-variant="outline"',
    'role="switch"',
    'role="tablist"',
    'aria-sort="ascending"',
    'id="catalog-vendor-search"',
    'role="dialog" aria-modal="false"',
    'data-sort-type="number"',
    'type="file"',
    '<dialog',
    'id="visual-expression"',
    'id="catalog-sidebar-menu"',
    'id="catalog-sidebar-rail"',
    'id="catalog-sidebar-search"',
    'id="catalog-switch-state"',
    'aria-label="Frequent workbench views"',
    'id="catalog-view-status"',
    'class="as-tab__indicator"',
    'id="catalog-pagination-status"',
    'id="feedback-retry"',
    'id="feedback-clear"',
    'data-intent="destructive"',
    'id="overlay-status"',
    'data-open-dialog',
    'data-appearance="glass"',
    'inter-latin-wght-normal.woff2',
  ],
  'examples/controls.html': [
    'aria-label="More order actions"',
    'aria-haspopup="menu"',
    'role="menuitem"',
    'aria-live="polite"',
    'role="alert"',
    '<dialog',
    'aria-labelledby="confirm-title"',
  ],
}

for (const [relativePath, markers] of Object.entries(requiredFiles)) {
  const content = await load(relativePath)
  requireText(relativePath, content, markers)
}

const patternPaths = [
  'packages/ui-patterns/forms.css',
  'packages/ui-patterns/actions.css',
  'packages/ui-patterns/selection.css',
  'packages/ui-patterns/overlays.css',
  'packages/ui-patterns/feedback.css',
  'packages/ui-patterns/choices.css',
  'packages/ui-patterns/navigation.css',
  'packages/ui-patterns/data-display.css',
  'packages/ui-patterns/disclosure.css',
  'packages/ui-patterns/specialized-inputs.css',
  'packages/ui-patterns/surfaces.css',
]
const patternCss = (await Promise.all(patternPaths.map(load))).join('\n')

for (const relativePath of [
  'packages/ui-patterns/forms.css',
  'packages/ui-patterns/actions.css',
  'packages/ui-patterns/selection.css',
  'packages/ui-patterns/overlays.css',
  'packages/ui-patterns/choices.css',
  'packages/ui-patterns/navigation.css',
  'packages/ui-patterns/data-display.css',
  'packages/ui-patterns/disclosure.css',
  'packages/ui-patterns/specialized-inputs.css',
]) {
  const content = await load(relativePath)
  if (!content.includes(':focus-visible')) failures.push(`${relativePath} must define a visible keyboard focus state`)
  const physicalDirection = content.match(/^\s*(?:(?:left|right|margin-left|margin-right|padding-left|padding-right|border-left(?:-color)?|border-right(?:-color)?)\s*:|text-align\s*:\s*(?:left|right)\b)/m)
  if (physicalDirection) failures.push(`${relativePath} must use logical CSS direction properties instead of ${physicalDirection[0].trim()}`)
}

const generatedTokens = await load('packages/tokens/dist/tokens.css')
const definedCustomProperties = new Set(
  [...generatedTokens.matchAll(/(--as-[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
)
const locallyDefinedCustomProperties = new Set(
  [...patternCss.matchAll(/(--as-[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
)
const referencedCustomProperties = new Set(
  [...patternCss.matchAll(/var\((--as-[a-z0-9-]+)/gi)].map((match) => match[1])
)
for (const property of referencedCustomProperties) {
  if (!definedCustomProperties.has(property) && !locallyDefinedCustomProperties.has(property)) {
    failures.push(`Pattern CSS references undefined token or component property ${property}`)
  }
}

const tokens = JSON.parse(await load('packages/tokens/src/tokens.json'))
const rootPackage = JSON.parse(await load('package.json'))
const tokenPackage = JSON.parse(await load('packages/tokens/package.json'))
const expectedVersion = rootPackage.version
if (rootPackage.engines?.node !== '>=26 <27') failures.push('ASIG must use the Node.js 26 major-version baseline')
if (tokens.version !== expectedVersion) failures.push('Token source version must match the ASIG package version')
if (tokenPackage.version !== expectedVersion) failures.push('design-tokens package version must match the ASIG package version')
if (tokens.foundation?.control?.height !== '2.75rem') failures.push('Default control height must remain 44px')
if (tokens.foundation?.control?.hitTarget !== '2.75rem') failures.push('Touch hit target must remain 44px')
if (tokens.foundation?.effect?.glassBlur !== '18px') failures.push('Glass surfaces must use the bounded shared blur token')
if (!tokens.foundation?.elevation?.floating) failures.push('Premium surfaces require the shared floating elevation token')
if (!generatedTokens.includes('--as-font-size-2xl:')) failures.push('Generated numeric token names must use kebab case')
if (!generatedTokens.includes('--as-color-border-strong:')) failures.push('Generated themes must expose the strong control-boundary token')
if (!generatedTokens.includes('--as-effect-action-gloss:')) failures.push('Generated foundations must expose action gloss tokens')

const packageDefinition = JSON.parse(await load('packages/ui-patterns/package.json'))
if (packageDefinition.version !== expectedVersion) failures.push('ui-patterns package version must match the ASIG package version')
if (packageDefinition.peerDependencies?.['@angelstones/design-tokens'] !== expectedVersion) {
  failures.push('ui-patterns must require the matching design-tokens version')
}
for (const exportPath of [
  './all.css',
  './bundle.css',
  './actions.css',
  './choices.css',
  './data-display.css',
  './disclosure.css',
  './feedback.css',
  './forms.css',
  './navigation.css',
  './overlays.css',
  './selection.css',
  './specialized-inputs.css',
  './surfaces.css',
]) {
  if (!packageDefinition.exports?.[exportPath]) failures.push(`ui-patterns package is missing export ${exportPath}`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated ${Object.keys(requiredFiles).length} shared pattern files, documentation contracts, and accessible specimen markers.`)
