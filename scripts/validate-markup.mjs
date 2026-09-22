import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = ['examples/forms.html', 'examples/controls.html', 'site/index.html', 'site/foundations.html', 'examples/operations.html', 'examples/orders.html', 'examples/workbench.html', 'examples/order-detail.html', 'site/pages.html', 'site/document.html']
const failures = []
const patternCss = (
  await Promise.all([
    'forms.css',
    'pages.css',
    'typography.css',
    'actions.css',
    'selection.css',
    'overlays.css',
    'feedback.css',
    'choices.css',
    'navigation.css',
    'data-display.css',
    'disclosure.css',
    'specialized-inputs.css',
    'surfaces.css',
  ].map((file) => readFile(path.join(root, 'packages/ui-patterns', file), 'utf8')))
).join('\n')
const definedPatternClasses = new Set(
  [...patternCss.matchAll(/\.(as-[a-z0-9_-]+)/gi)].map((match) => match[1])
)

for (const relativePath of files) {
  const html = await readFile(path.join(root, relativePath), 'utf8')

  if (!html.startsWith('<!DOCTYPE html>')) failures.push(`${relativePath} must use the canonical HTML5 doctype`)

  const selfClosingVoid = html.match(/<(?:meta|link|input|hr)\b[^>]*\/>/gi) ?? []
  if (selfClosingVoid.length) failures.push(`${relativePath} contains XHTML-style void elements`)

  for (const match of html.matchAll(/<input\b([^>]*)>/gi)) {
    if (!/\btype\s*=/.test(match[1])) failures.push(`${relativePath} contains an input without an explicit type`)
  }

  if (/<button\b[^>]*\brole="combobox"/i.test(html)) {
    failures.push(`${relativePath} must not use the invalid button-combobox hybrid focus model`)
  }

  for (const match of html.matchAll(/<(\w+)\b([^>]*)\brole="combobox"([^>]*)>/gi)) {
    if (match[1].toLowerCase() !== 'input') {
      failures.push(`${relativePath} searchable combobox must use an input that retains DOM focus`)
    }
    const attributes = `${match[2]} ${match[3]}`
    if (!/\baria-controls="[^"]+"/.test(attributes)) {
      failures.push(`${relativePath} combobox must identify its controlled listbox`)
    }
  }

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length) failures.push(`${relativePath} contains duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`)
  const idSet = new Set(ids)

  for (const match of html.matchAll(/\bclass="([^"]+)"/g)) {
    for (const className of match[1].split(/\s+/).filter((name) => name.startsWith('as-'))) {
      if (!definedPatternClasses.has(className)) failures.push(`${relativePath} uses undefined pattern class: ${className}`)
    }
  }

  for (const match of html.matchAll(/\baria-labelledby="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      if (!idSet.has(id)) failures.push(`${relativePath} aria-labelledby references missing ID: ${id}`)
    }
  }

  for (const attribute of ['aria-describedby', 'aria-controls']) {
    for (const match of html.matchAll(new RegExp(`\\b${attribute}="([^"]+)"`, 'g'))) {
      for (const id of match[1].split(/\s+/)) {
        if (!idSet.has(id)) failures.push(`${relativePath} ${attribute} references missing ID: ${id}`)
      }
    }
  }

  for (const match of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)) {
    if (!idSet.has(match[1])) failures.push(`${relativePath} label references missing control ID: ${match[1]}`)
  }

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1]
    if (reference.startsWith('#')) {
      if (!idSet.has(reference.slice(1))) failures.push(`${relativePath} links to missing ID: ${reference}`)
      continue
    }
    if (/^(?:https?:|mailto:|data:)/.test(reference) || reference.startsWith('/')) continue
    const localReference = reference.split(/[?#]/)[0]
    const resolved = path.resolve(path.dirname(path.join(root, relativePath)), localReference)
    await access(resolved).catch(() => failures.push(`${relativePath} references missing local asset: ${reference}`))
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated HTML structure and accessible references in ${files.length} specimens.`)
