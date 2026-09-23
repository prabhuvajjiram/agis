import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destination = path.join(root, 'dist/pages')
await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })

// Preserve relative paths under a GitHub project URL. Never upload the checkout.
const sources = [
  'site', 'examples', 'docs', 'DESIGN.md', 'README.md', 'CHANGELOG.md', 'LICENSE',
  'SECURITY.md', 'CODE_OF_CONDUCT.md',
  'packages/tokens/dist/tokens.css', 'packages/tokens/LICENSE',
  'packages/ui-patterns/dist/all.css', 'packages/ui-patterns/LICENSE',
  ...(await readdir(path.join(root, 'packages/ui-patterns')))
    .filter(file => file.endsWith('.css')).map(file => `packages/ui-patterns/${file}`),
]
for (const source of sources) {
  await cp(path.join(root, source), path.join(destination, source), {
    recursive: true,
    filter: file => !file.endsWith('package.json'),
  })
}
await writeFile(path.join(destination, '.nojekyll'), '')
await writeFile(path.join(destination, 'index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=./site/"><link rel="icon" type="image/png" sizes="512x512" href="./site/assets/brand/favicon.png"><title>Angel Stones Interface Guidelines</title></head><body><a href="./site/">Open the ASIG catalogue</a></body></html>
`)
console.log('Built GitHub Pages artifact in dist/pages.')
