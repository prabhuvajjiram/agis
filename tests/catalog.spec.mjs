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

test('@a11y catalogue reflows at the WCAG 320 CSS pixel width', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-375', 'One 320px reflow run is sufficient')
  await page.setViewportSize({ width: 320, height: 812 })
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

test('@a11y searchable selection filters and chooses an option from inside the popup', async ({ page }) => {
  const trigger = page.getByRole('combobox', { name: /searchable selection/i })
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  const search = page.getByRole('searchbox', { name: 'Search suppliers' })
  await expect(search).toBeFocused()
  await search.fill('heritage')
  await expect(page.locator('#catalog-vendor-results')).toHaveText('1 supplier available.')
  const listbox = page.locator('#catalog-vendor-options')
  await expect(listbox.getByRole('option', { name: 'Heritage Memorial Supply' })).toBeVisible()
  const openResults = await new AxeBuilder({ page }).include('#catalog-vendor-popover').analyze()
  expect(openResults.violations, 'open searchable selection accessibility violations').toEqual([])

  await search.press('ArrowDown')
  const option = listbox.getByRole('option', { name: 'Heritage Memorial Supply' })
  await expect(option).toBeFocused()
  await option.press('Enter')

  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toContainText('Heritage Memorial Supply')
  await expect(trigger).toBeFocused()
})

test('@a11y every meaningful specimen table column supports announced sorting', async ({ page }) => {
  const headers = page.locator('#data-display .as-table th')
  await expect(headers).toHaveCount(4)
  for (let index = 0; index < 4; index += 1) {
    await expect(headers.nth(index).getByRole('button')).toBeVisible()
  }

  const amountHeader = page.getByRole('columnheader', { name: /amount/i })
  await amountHeader.getByRole('button').click()
  await expect(amountHeader).toHaveAttribute('aria-sort', 'ascending')
  await expect(page.locator('#data-display tbody tr').first()).toContainText('$1,280.00')
  await expect(page.locator('#catalog-table-sort-status')).toHaveText('Vendor quotes sorted by Amount, ascending.')

  await amountHeader.getByRole('button').click()
  await expect(amountHeader).toHaveAttribute('aria-sort', 'descending')
  await expect(page.locator('#data-display tbody tr').first()).toContainText('$1,340.00')
})

test('@a11y premium effects retain semantic fallbacks in forced colors', async ({ page }) => {
  const gradient = page.locator('.as-surface[data-appearance="gradient"]')
  const glass = page.locator('.as-surface[data-appearance="glass"]')
  const glossy = page.locator('.as-button[data-appearance="glossy"]')

  await expect(gradient).toBeVisible()
  await expect(glass).toBeVisible()
  await expect(glossy).toBeVisible()
  expect(await gradient.evaluate((element) => getComputedStyle(element).backgroundImage)).not.toBe('none')
  expect(await glass.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')

  await page.emulateMedia({ forcedColors: 'active' })
  expect(await gradient.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe('none')
  expect(await glass.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await glossy.evaluate((element) => getComputedStyle(element).boxShadow)).toBe('none')
})

test('@a11y representative interactive patterns expose visible keyboard focus', async ({ page }) => {
  const controls = [
    '.catalog-demo .as-button',
    '.as-button[data-appearance="glossy"]',
    '#catalog-vendor',
    '#catalog-po',
    '#catalog-lookup',
    '.as-choice input[type="checkbox"]',
    '#catalog-switch',
    '#tab-summary',
    '.as-pagination__button[aria-current="page"]',
    '.as-table__sort',
    '.as-disclosure__summary',
    '#catalog-file',
  ]

  for (const selector of controls) {
    const control = page.locator(selector).first()
    await control.focus()
    const focusIsVisible = await control.evaluate((element) => {
      const indicatorElement = element.matches('input[type="checkbox"], input[type="radio"]')
        ? element.closest('.as-choice')
        : element
      const style = getComputedStyle(indicatorElement)
      return (Number.parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== 'none')
        || style.boxShadow !== 'none'
    })
    expect(focusIsVisible, `${selector} must expose a visible focus indicator`).toBe(true)
  }
})

test('@visual catalogue matches the reviewed reference', async ({ page }) => {
  await expect(page).toHaveScreenshot('catalog.png', {
    animations: 'disabled',
    fullPage: true,
    timeout: 20_000,
  })
})
