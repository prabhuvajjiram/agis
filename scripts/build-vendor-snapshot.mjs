import { createHash } from 'node:crypto'
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rootPackage = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const snapshotName = `asig-${rootPackage.version}`
const target = path.join(root, 'vendor', snapshotName)
const checkOnly = process.argv.includes('--check')

const sources = [
  ['README.md', 'README.md'],
  ['CHANGELOG.md', 'CHANGELOG.md'],
  ['packages/tokens/package.json', 'packages/design-tokens/package.json'],
  ['packages/tokens/src/tokens.json', 'packages/design-tokens/src/tokens.json'],
  ['packages/tokens/dist/tokens.css', 'packages/design-tokens/dist/tokens.css'],
  ['packages/ui-patterns/package.json', 'packages/ui-patterns/package.json'],
]

async function filesBelow(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) files.push(...await filesBelow(path.join(directory, entry.name), relative))
    else files.push(relative)
  }
  return files
}

async function buildSnapshot(destination) {
  await mkdir(destination, { recursive: true })
  for (const [source, output] of sources) {
    const outputPath = path.join(destination, output)
    await mkdir(path.dirname(outputPath), { recursive: true })
    await cp(path.join(root, source), outputPath)
  }
  await cp(path.join(root, 'docs'), path.join(destination, 'docs'), { recursive: true })

  const patternDirectory = path.join(root, 'packages/ui-patterns')
  for (const file of (await readdir(patternDirectory)).filter((name) => name.endsWith('.css')).sort()) {
    const outputPath = path.join(destination, 'packages/ui-patterns', file)
    await mkdir(path.dirname(outputPath), { recursive: true })
    await cp(path.join(patternDirectory, file), outputPath)
  }

  const files = await filesBelow(destination)
  const hashes = {}
  for (const file of files) {
    const content = await readFile(path.join(destination, file))
    hashes[file] = createHash('sha256').update(content).digest('hex')
  }
  const manifest = {
    name: 'Angel Stones Interface Guidelines vendored snapshot',
    version: rootPackage.version,
    packages: ['@angelstones/design-tokens', '@angelstones/ui-patterns'],
    files: hashes,
  }
  await writeFile(
    path.join(destination, 'snapshot-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  )
}

async function compareDirectories(first, second) {
  const [firstFiles, secondFiles] = await Promise.all([filesBelow(first), filesBelow(second)])
  if (JSON.stringify(firstFiles) !== JSON.stringify(secondFiles)) return false
  for (const file of firstFiles) {
    const [firstContent, secondContent] = await Promise.all([
      readFile(path.join(first, file)),
      readFile(path.join(second, file)),
    ])
    if (!firstContent.equals(secondContent)) return false
  }
  return true
}

if (checkOnly) {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'asig-snapshot-'))
  const candidate = path.join(temporaryRoot, snapshotName)
  try {
    await buildSnapshot(candidate)
    if (!await compareDirectories(candidate, target).catch(() => false)) {
      console.error(`Vendored snapshot vendor/${snapshotName} is missing or stale. Run npm run snapshot.`)
      process.exitCode = 1
    } else {
      console.log(`Verified deterministic vendored snapshot vendor/${snapshotName}.`)
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
} else {
  await rm(target, { recursive: true, force: true })
  await buildSnapshot(target)
  console.log(`Built vendored snapshot vendor/${snapshotName}.`)
}
