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
    '[data-variant="destructive"]',
    '--as-control-hit-target',
    ':focus-visible',
    'prefers-reduced-motion',
  ],
  'packages/ui-patterns/selection.css': [
    '.as-select',
    '.as-selection-trigger',
    '.as-option',
    '[aria-selected="true"]',
    '--as-control-hit-target',
  ],
  'packages/ui-patterns/overlays.css': [
    '.as-menu-item',
    '.as-dialog',
    '--as-layer-dropdown',
    '--as-layer-dialog',
    'prefers-reduced-motion',
  ],
  'packages/ui-patterns/feedback.css': [
    '.as-alert',
    '.as-toast',
    '.as-skeleton',
    'prefers-reduced-motion',
  ],
  'packages/ui-patterns/all.css': [
    '@import "./forms.css"',
    '@import "./actions.css"',
    '@import "./selection.css"',
    '@import "./overlays.css"',
    '@import "./feedback.css"',
  ],
  'docs/ACTIONS.md': ['Icon-only actions require', 'aria-busy="true"', 'Destructive actions'],
  'docs/SELECTION.md': ['Combobox behavior', 'Dropdown menu, not Select', 'role="combobox"'],
  'docs/OVERLAYS.md': ['focus trapping', 'Escape closes', '44px'],
  'docs/FEEDBACK.md': ['role="alert"', 'aria-live="polite"', 'authoritative operation'],
  'docs/COMPONENT_STATUS.md': ['Product adapters', 'Product-owned'],
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
]
const patternCss = (await Promise.all(patternPaths.map(load))).join('\n')
const generatedTokens = await load('packages/tokens/dist/tokens.css')
const definedCustomProperties = new Set(
  [...generatedTokens.matchAll(/(--as-[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
)
const referencedCustomProperties = new Set(
  [...patternCss.matchAll(/var\((--as-[a-z0-9-]+)/gi)].map((match) => match[1])
)
for (const property of referencedCustomProperties) {
  if (!definedCustomProperties.has(property)) failures.push(`Pattern CSS references undefined token ${property}`)
}

const tokens = JSON.parse(await load('packages/tokens/src/tokens.json'))
const rootPackage = JSON.parse(await load('package.json'))
const tokenPackage = JSON.parse(await load('packages/tokens/package.json'))
const expectedVersion = rootPackage.version
if (tokens.version !== expectedVersion) failures.push('Token source version must match the ASIG package version')
if (tokenPackage.version !== expectedVersion) failures.push('design-tokens package version must match the ASIG package version')
if (tokens.foundation?.control?.height !== '2.75rem') failures.push('Default control height must remain 44px')
if (tokens.foundation?.control?.hitTarget !== '2.75rem') failures.push('Touch hit target must remain 44px')

const packageDefinition = JSON.parse(await load('packages/ui-patterns/package.json'))
if (packageDefinition.version !== expectedVersion) failures.push('ui-patterns package version must match the ASIG package version')
if (packageDefinition.peerDependencies?.['@angelstones/design-tokens'] !== expectedVersion) {
  failures.push('ui-patterns must require the matching design-tokens version')
}
for (const exportPath of ['./all.css', './actions.css', './forms.css', './selection.css', './overlays.css', './feedback.css']) {
  if (!packageDefinition.exports?.[exportPath]) failures.push(`ui-patterns package is missing export ${exportPath}`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated ${Object.keys(requiredFiles).length} shared pattern files, documentation contracts, and accessible specimen markers.`)
