import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('guidance reader keeps source inert and handles unavailable documents', async ({ page }) => {
  const source = '# Sample guidance\n<img src="missing" onerror="alert(1)">\n'
  await page.route('**/docs/REVIEW.md', route => route.fulfill({ contentType: 'text/plain', body: source }))
  await page.goto('/site/document.html?file=docs/REVIEW.md')
  await expect(page.locator('#document-body')).toHaveText(source)
  await expect(page.locator('#document-body img')).toHaveCount(0)
  await page.route('**/docs/REVIEW.md', route => route.fulfill({ status: 503, body: 'Unavailable' }))
  await page.reload()
  await expect(page.locator('#document-status')).toContainText('Unable to load')
  await expect(page.locator('#document-body')).toBeHidden()
  await expect(page.getByRole('link', { name: 'Component catalogue', exact: true })).toBeVisible()
})

test('foundations filter, theme values and clipboard recovery', async ({ page, context }) => {
  await page.goto('/site/foundations.html')
  await page.getByLabel('Find a color token').fill('primary')
  await expect(page.locator('[data-token-name]:visible')).toHaveCount(3)
  await page.getByLabel('Product theme').selectOption('marketing')
  await expect(page.locator('[data-token-theme="marketing"]')).toContainText('#d6b772')
  await expect(page.locator('[data-token-theme="operations"]')).toBeHidden()
  await page.getByLabel('Find a color token').fill('no-such-token')
  await expect(page.locator('#token-empty')).toBeVisible()
  await page.getByLabel('Find a color token').fill('')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const copy = page.getByRole('button', { name: 'Copy --as-color-primary', exact: true }).filter({ visible: true })
  await copy.click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('var(--as-color-primary)')
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied for test') } })
  await copy.click()
  await expect(page.locator('#copy-status')).toContainText('Select and copy this text: var(--as-color-primary)')
})

test('operations sample retains input through validation, failure and retry', async ({ page }) => {
  await page.goto('/examples/operations.html')
  await page.getByLabel('Vendor PO reference').fill('REVIEW-123')
  const instructions = page.getByLabel('Receiving instructions')
  await instructions.fill('')
  await page.getByRole('button', { name: 'Save sample draft' }).click()
  await expect(instructions).toBeFocused()
  await expect(instructions).toHaveAccessibleDescription(/Enter receiving instructions/)
  await instructions.fill('Preserve this draft through the failure.')
  await page.getByLabel('Simulate one failed save').check()
  await page.getByRole('button', { name: 'Save sample draft' }).click()
  await expect(page.getByRole('alert')).toContainText('Your values are preserved')
  await expect(page.getByLabel('Vendor PO reference')).toHaveValue('REVIEW-123')
  await expect(instructions).toHaveValue('Preserve this draft through the failure.')
  await page.getByRole('button', { name: 'Save sample draft' }).click()
  await expect(page.locator('#save-status')).toContainText('saved in this page only')
  await page.getByRole('button', { name: 'Reset sample' }).click()
  await expect(page.getByLabel('Vendor PO reference')).toHaveValue('NG-2026-18')
})

for (const [route, themes] of [
  ['/site/foundations.html', ['operations', 'operations-dark', 'cad', 'marketing']],
  ['/examples/operations.html', ['operations', 'operations-dark']],
]) {
  for (const theme of themes) {
    test(`@a11y ${route} ${theme} reflows and remains accessible`, async ({ page }) => {
      await page.goto(route)
      await page.locator('#theme-select').selectOption(theme)
      await page.addStyleTag({ content: '*, *::before, *::after { background-image: none !important; backdrop-filter: none !important; }' })
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))) })
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      expect(await page.evaluate(() => [...document.querySelectorAll('main, main *')].filter(element => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && element.getBoundingClientRect().width > 0).map(element => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width, right: element.getBoundingClientRect().right })).slice(0, 8))).toEqual([])
      await page.setViewportSize({ width: 320, height: 812 })
      await page.addStyleTag({ content: 'html { font-size: 200%; }' })
      expect(await page.evaluate(() => [...document.querySelectorAll('main, main *')].filter(element => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && element.getBoundingClientRect().width > 0).map(element => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width, right: element.getBoundingClientRect().right })).slice(0, 8))).toEqual([])
    })
  }
}

for (const theme of ['operations', 'operations-dark', 'cad', 'marketing']) {
  test(`@visual foundations ${theme}`, async ({ page }, testInfo) => {
    test.skip(!['mobile-375', 'desktop-1440'].includes(testInfo.project.name), 'Theme references at narrow and wide endpoints')
    await page.goto('/site/foundations.html')
    await page.locator('#theme-select').selectOption(theme)
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot(`foundations-${theme}.png`, { fullPage: true, animations: 'disabled', maxDiffPixels: 50, timeout: 40_000 })
  })
}

test('@visual operations composition', async ({ page }) => {
  await page.goto('/examples/operations.html')
  await page.evaluate(() => document.fonts.ready)
  await expect(page).toHaveScreenshot('operations-composition.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 50, timeout: 40_000 })
})

test('component contracts are reachable from usage guidance without implying a runtime API', async ({ page }) => {
  await page.goto('/site/document.html?file=docs/ACTIONS.md')
  await expect(page.locator('#document-body')).toContainText('## Inputs, outputs and state')
  await page.getByRole('link', { name: 'Inputs, outputs and state', exact: true }).click()
  await expect(page.locator('#document-title')).toHaveText('Component contracts: inputs, outputs and state')
  await expect(page.locator('#document-body')).toContainText('not events dispatched by ASIG')
  await expect(page.locator('#document-body')).toContainText('Angular')
  await expect(page.locator('#document-body')).toContainText('React / Next.js')
})
