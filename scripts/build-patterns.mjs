import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const patternRoot = path.join(root, 'packages/ui-patterns')
const outputPath = path.join(patternRoot, 'dist/all.css')
const checkOnly = process.argv.includes('--check')
// Keep both entry points in the same order; additions to all.css also enter the bundle.
const imports = await readFile(path.join(patternRoot, 'all.css'), 'utf8')
const patternFiles = [...imports.matchAll(/@import "\.\/([a-z-]+\.css)";/g)].map(match => match[1])
if (!patternFiles.length) throw new Error('No pattern imports found in all.css')

const sections = await Promise.all(patternFiles.map(async (file) => {
  const content = await readFile(path.join(patternRoot, file), 'utf8')
  return `/* ${file} */\n${content.trim()}\n`
}))
const output = `/* Generated from packages/ui-patterns/*.css. Do not edit directly. */\n${sections.join('\n')}`

if (checkOnly) {
  const current = await readFile(outputPath, 'utf8').catch(() => '')
  if (current !== output) {
    console.error('Generated pattern bundle is out of date. Run npm run build.')
    process.exit(1)
  }
  console.log('Generated pattern bundle is current.')
} else {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, output)
  console.log(`Wrote ${path.relative(root, outputPath)}`)
}
