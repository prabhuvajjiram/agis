import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const loadJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'))
const [rootPackage, tokensPackage, patternsPackage, tokens] = await Promise.all([
  loadJson('package.json'),
  loadJson('packages/tokens/package.json'),
  loadJson('packages/ui-patterns/package.json'),
  loadJson('packages/tokens/src/tokens.json'),
])

const expectedVersion = rootPackage.version
const releaseTag = process.env.RELEASE_TAG
const failures = []

if (releaseTag !== `v${expectedVersion}`) failures.push(`Release tag must be v${expectedVersion}; received ${releaseTag ?? 'none'}`)
if (tokensPackage.version !== expectedVersion) failures.push('design-tokens version is not aligned')
if (patternsPackage.version !== expectedVersion) failures.push('ui-patterns version is not aligned')
if (patternsPackage.peerDependencies?.['@angelstones/design-tokens'] !== expectedVersion) failures.push('ui-patterns peer dependency is not aligned')
if (tokens.version !== expectedVersion) failures.push('token source version is not aligned')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Verified aligned ASIG release tag ${releaseTag}.`)
