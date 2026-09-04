import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const themes = ['operations', 'operations-dark', 'cad', 'marketing']

test.beforeEach(async ({ page }) => {
  await page.goto('/site/')
})

for (const theme of themes) {
  test(`@a11y ${theme} theme has no automatically detectable violations`, async ({ page }) => {
    await page.locator('#theme-select').selectOption(theme)
    await expect(page.locator('body')).toHaveAttribute('data-as-theme', theme)
    await page.waitForTimeout(350)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, `${theme} theme accessibility violations`).toEqual([])
  })
}

test('@a11y catalogue has no page-level horizontal overflow', async ({ page }) => {
  const sizes = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth)
})

test('@a11y standard controls meet the shared hit-target contract', async ({ page }) => {
  const undersized = await page.locator([
    'button:not([data-size="compact"]):not([hidden])',
    'select:not([hidden])',
    'input:not([type="checkbox"]):not([type="radio"]):not([hidden])',
    'a.as-pagination__button:not([hidden])',
  ].join(',')).evaluateAll((elements) => elements
    .filter((element) => element.checkVisibility())
    .map((element) => ({
      name: element.getAttribute('aria-label') || element.textContent?.trim() || element.id,
      height: element.getBoundingClientRect().height,
      width: element.getBoundingClientRect().width,
    }))
    .filter(({ height, width }) => height < 44 || width < 44))

  expect(undersized).toEqual([])
})

test('@a11y tabs support roving keyboard focus', async ({ page }) => {
  const first = page.getByRole('tab', { name: 'Summary' })
  await first.focus()
  await first.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused()
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Activity' })).toBeVisible()
})

test('@a11y switch exposes and announces its state', async ({ page }) => {
  const control = page.getByRole('switch', { name: 'Show grid snapping' })
  await expect(control).toHaveAttribute('aria-checked', 'true')
  await control.click()
  await expect(control).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('#switch-status')).toHaveText('Grid snapping is off.')
})

test('@visual catalogue matches the reviewed reference', async ({ page }) => {
  await expect(page).toHaveScreenshot('catalog.png', {
    animations: 'disabled',
    fullPage: true,
    timeout: 20_000,
  })
})
