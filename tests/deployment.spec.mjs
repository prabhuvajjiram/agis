import { expect, test } from '@playwright/test'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'

test('Pages artifact works under a project prefix without escaping its assets', async ({ page }) => {
  const failures = []
  page.on('response', response => {
    if (response.status() >= 400 || !new URL(response.url()).pathname.startsWith('/dist/pages/')) failures.push(response.url())
  })
  page.on('requestfailed', request => failures.push(request.url()))
  await page.goto('/dist/pages/')
  await expect(page).toHaveURL(/\/dist\/pages\/site\/$/)
  await expect(page.locator('body')).toHaveCSS('font-family', /Inter ASIG/)
  await page.getByRole('link', { name: 'Complete page examples', exact: true }).click()
  await page.getByRole('link', { name: 'Implementation guidance', exact: true }).click()
  await expect(page.locator('#document-body')).toContainText('# Operational page design')
  await page.getByRole('link', { name: 'Page design guide', exact: true }).click()
  await page.getByRole('link', { name: 'Explore orders', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Orders', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Order detail', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'SO-1042', exact: true })).toBeVisible()
  expect(failures).toEqual([])
})

test('release gate rejects misaligned tags and routes prereleases away from latest', async ({}, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'One release gate check is sufficient')
  const root = await mkdtemp(path.join(tmpdir(), 'asig-release-test-'))
  try {
    await mkdir(path.join(root, 'scripts'), { recursive: true })
    await cp('scripts/verify-release-tag.mjs', path.join(root, 'scripts/verify-release-tag.mjs'))
    const output = path.join(root, 'outputs')
    for (const [version, tag] of [['0.6.0-dev.0', 'next'], ['0.6.0', 'latest']]) {
      for (const file of ['package.json', 'packages/tokens/package.json', 'packages/ui-patterns/package.json', 'packages/tokens/src/tokens.json']) {
        await mkdir(path.dirname(path.join(root, file)), { recursive: true })
        await writeFile(path.join(root, file), JSON.stringify({ version, peerDependencies: { '@angelstones/design-tokens': version } }))
      }
      await writeFile(output, '')
      const env = { ...process.env, RELEASE_TAG: `v${version}`, GITHUB_OUTPUT: output }
      execFileSync(process.execPath, [path.join(root, 'scripts/verify-release-tag.mjs')], { env, stdio: 'pipe' })
      expect(await readFile(output, 'utf8')).toBe(`dist-tag=${tag}\n`)
      expect(() => execFileSync(process.execPath, [path.join(root, 'scripts/verify-release-tag.mjs')], {
        env: { ...env, RELEASE_TAG: 'v0.1.0' }, stdio: 'pipe',
      })).toThrow()
      await writeFile(path.join(root, 'packages/tokens/package.json'), JSON.stringify({ version: '0.1.0' }))
      expect(() => execFileSync(process.execPath, [path.join(root, 'scripts/verify-release-tag.mjs')], { env, stdio: 'pipe' })).toThrow()
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
