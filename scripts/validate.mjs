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
  'borderStrong',
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
  'dangerStrong',
  'onDangerStrong',
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
const actionGloss = Number(tokens.foundation.effect.actionGloss)
const destructiveActionGloss = Number(tokens.foundation.effect.destructiveActionGloss)
const destructiveActionHoverGloss = Number(tokens.foundation.effect.destructiveActionHoverGloss)

for (const [name, value] of [
  ['actionGloss', actionGloss],
  ['destructiveActionGloss', destructiveActionGloss],
  ['destructiveActionHoverGloss', destructiveActionHoverGloss],
]) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    failures.push(`foundation effect ${name} must be a number from 0 through 1`)
  }
}

for (const [name, theme] of Object.entries(tokens.themes)) {
  for (const role of requiredRoles) {
    if (!theme[role]) failures.push(`${name} is missing ${role}`)
  }

  for (const [label, foreground, background] of [
    ['body text', theme.foreground, theme.background],
    ['muted text', theme.foregroundMuted, theme.background],
    ['surface text', theme.foreground, theme.surface],
    ['muted surface text', theme.foregroundMuted, theme.surface],
    ['muted-surface text', theme.foreground, theme.surfaceMuted],
    ['muted text on muted surface', theme.foregroundMuted, theme.surfaceMuted],
    ['input text', theme.foreground, theme.input],
    ['primary action text', theme.onPrimary, theme.primary],
    ['primary hover action text', theme.onPrimary, theme.primaryHover],
    ['dimensional primary action text', theme.onPrimary, blend(theme.primary, '#ffffff', actionGloss)],
    ['dimensional hover action text', theme.onPrimary, blend(theme.primaryHover, '#ffffff', actionGloss)],
    ['accent text', theme.onAccent, theme.accent],
    ['destructive action text', theme.onDanger, theme.danger],
    ['strong destructive action text', theme.onDangerStrong, theme.dangerStrong],
    ['dimensional destructive text', theme.onDangerStrong, blend(theme.dangerStrong, '#ffffff', destructiveActionGloss)],
    ['dimensional destructive hover text', theme.onDangerStrong, blend(theme.dangerStrong, '#ffffff', destructiveActionHoverGloss)],
  ]) {
    const ratio = contrast(foreground, background)
    if (ratio < 4.5) failures.push(`${name} ${label} contrast is ${ratio.toFixed(2)}:1`)
  }

  for (const [label, boundary, adjacent] of [
    ['control boundary against surface', theme.borderStrong, theme.surface],
    ['control boundary against input', theme.borderStrong, theme.input],
  ]) {
    const ratio = contrast(boundary, adjacent)
    if (ratio < 3) failures.push(`${name} ${label} non-text contrast is ${ratio.toFixed(2)}:1`)
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated ${Object.keys(tokens.themes).length} complete themes and critical text and non-text AA contrast pairs.`)
