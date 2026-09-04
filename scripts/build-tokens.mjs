import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'packages/tokens/src/tokens.json')
const outputPath = path.join(root, 'packages/tokens/dist/tokens.css')
const checkOnly = process.argv.includes('--check')

const tokens = JSON.parse(await readFile(sourcePath, 'utf8'))

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
}

function flatten(value, prefix = []) {
  return Object.entries(value).flatMap(([key, child]) => {
    const next = [...prefix, kebab(key)]
    return typeof child === 'object' && child !== null
      ? flatten(child, next)
      : [[next.join('-'), String(child)]]
  })
}

const lines = [
  '/* Generated from packages/tokens/src/tokens.json. Do not edit directly. */',
  ':root {',
  ...flatten(tokens.foundation).map(([name, value]) => `  --as-${name}: ${value};`),
  '}',
]

for (const [themeName, theme] of Object.entries(tokens.themes)) {
  lines.push('', `[data-as-theme="${themeName}"] {`)
  lines.push(...flatten(theme).map(([name, value]) => `  --as-color-${name}: ${value};`))
  lines.push('}')
}

const output = `${lines.join('\n')}\n`

if (checkOnly) {
  const current = await readFile(outputPath, 'utf8').catch(() => '')
  if (current !== output) {
    console.error('Generated tokens are out of date. Run npm run build.')
    process.exit(1)
  }
  console.log('Generated token CSS is current.')
} else {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, output)
  console.log(`Wrote ${path.relative(root, outputPath)}`)
}
