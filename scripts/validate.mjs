import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'packages/tokens/src/tokens.json')
const tokens = JSON.parse(await readFile(sourcePath, 'utf8'))

const requiredRoles = [
  'background',
  'surface',
  'surfaceMuted',
  'foreground',
  'foregroundMuted',
  'border',
  'input',
  'primary',
  'primaryHover',
  'onPrimary',
  'accent',
  'onAccent',
  'focus',
  'success',
  'warning',
  'danger',
  'onDanger',
  'info',
]

function rgb(hex) {
  const normalized = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error(`Expected a six-digit hex color, received ${hex}`)
  }
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255)
}

function luminance(hex) {
  return rgb(hex)
    .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

function blend(first, second, secondWeight) {
  const secondChannels = rgb(second)
  const channels = rgb(first).map((channel, index) => Math.round(
    (channel * (1 - secondWeight) + secondChannels[index] * secondWeight) * 255
  ).toString(16).padStart(2, '0'))
  return `#${channels.join('')}`
}

const failures = []

for (const [name, theme] of Object.entries(tokens.themes)) {
  for (const role of requiredRoles) {
    if (!theme[role]) failures.push(`${name} is missing ${role}`)
  }

  for (const [label, foreground, background] of [
    ['body text', theme.foreground, theme.background],
    ['muted text', theme.foregroundMuted, theme.background],
    ['primary action text', theme.onPrimary, theme.primary],
    ['primary hover action text', theme.onPrimary, theme.primaryHover],
    ['glossy primary action text', theme.onPrimary, blend(theme.primary, '#ffffff', 0.08)],
    ['glossy hover action text', theme.onPrimary, blend(theme.primaryHover, '#ffffff', 0.08)],
    ['accent text', theme.onAccent, theme.accent],
    ['destructive action text', theme.onDanger, theme.danger],
  ]) {
    const ratio = contrast(foreground, background)
    if (ratio < 4.5) failures.push(`${name} ${label} contrast is ${ratio.toFixed(2)}:1`)
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated ${Object.keys(tokens.themes).length} complete themes and critical AA contrast pairs.`)
