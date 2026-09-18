import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const themes = ['operations', 'operations-dark', 'cad', 'marketing']
const allowedHiddenRelationshipTargets = new Set([
  JSON.stringify(['#catalog-lookup']),
  JSON.stringify(['#catalog-vendor-search']),
  JSON.stringify(['#menu-trigger']),
])
const allowedScannerOnlyContrastTargets = new Map([
  [JSON.stringify(['#catalog-pagination-current']), new Set(['shortTextContent'])],
  [JSON.stringify(['th[aria-sort="ascending"] > .as-table__sort[data-sort-type="text"] > span[aria-hidden="true"]']), new Set(['nonBmp'])],
  [JSON.stringify(['button[data-view-name="Active Orders"]']), new Set(['elmPartiallyObscured'])],
  [JSON.stringify(['#dialog-description']), new Set(['elmPartiallyObscuring'])],
  [JSON.stringify(['.as-dialog__body > p']), new Set(['elmPartiallyObscuring'])],
])

test.beforeEach(async ({ page }) => {
  await page.goto('/site/')
})

async function settleVisualRendering(page) {
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('400 16px "Inter ASIG"'),
      document.fonts.load('500 16px "Inter ASIG"'),
      document.fonts.load('600 16px "Inter ASIG"'),
      document.fonts.load('700 16px "Inter ASIG"'),
    ])
    await document.fonts.ready
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

function expectAxeScan(results, label, { allowDecorativeEffects = false } = {}) {
  expect(results.violations, `${label} accessibility violations`).toEqual([])

  const unexpectedIncomplete = results.incomplete.flatMap((rule) => rule.nodes
    .filter((node) => {
      const target = JSON.stringify(node.target)
      if (rule.id === 'aria-valid-attr-value' && allowedHiddenRelationshipTargets.has(target)) return false
      if (rule.id !== 'color-contrast') return true

      const messageKeys = node.any.map((check) => check.data?.messageKey).filter(Boolean)
      const allowedMessageKeys = allowedScannerOnlyContrastTargets.get(target)
      if (allowedMessageKeys && messageKeys.length > 0 && messageKeys.every((key) => allowedMessageKeys.has(key))) {
        return false
      }
      return !(allowDecorativeEffects && messageKeys.length > 0 &&
        messageKeys.every((key) => ['bgGradient', 'pseudoContent'].includes(key)))
    })
    .map((node) => ({ rule: rule.id, target: node.target, summary: node.failureSummary })))

  expect(unexpectedIncomplete, `${label} unexpected incomplete Axe checks`).toEqual([])
}

for (const theme of themes) {
  test(`@a11y ${theme} theme has no automatically detectable violations`, async ({ page }) => {
    await page.locator('#theme-select').selectOption(theme)
    await expect(page.locator('body')).toHaveAttribute('data-as-theme', theme)
    await settleVisualRendering(page)
    const results = await new AxeBuilder({ page }).analyze()
    expectAxeScan(results, `${theme} theme`, { allowDecorativeEffects: true })

    await page.addStyleTag({ content: `
      *, *::before, *::after {
        background-image: none !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
      }
    ` })
    const solidResults = await new AxeBuilder({ page }).analyze()
    expectAxeScan(solidResults, `${theme} solid fallback`)
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

test('@a11y catalogue compacts its navigation at intermediate laptop widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'One intermediate-width layout run is sufficient')
  await page.setViewportSize({ width: 1254, height: 877 })
  const layout = await page.evaluate(() => {
    const shell = document.querySelector('.catalog-shell')
    const navigation = document.querySelector('.catalog-nav')
    const navigationDemo = document.querySelector('#navigation .catalog-demo')
    const demoRect = navigationDemo.getBoundingClientRect()
    return {
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      shellColumns: getComputedStyle(shell).gridTemplateColumns.trim().split(/\s+/).length,
      navigationDisplay: getComputedStyle(navigation).display,
      demoWidth: demoRect.width,
      demoRight: demoRect.right,
      viewportWidth: document.documentElement.clientWidth,
    }
  })

  expect(layout.pageOverflow).toBeLessThanOrEqual(0)
  expect(layout.shellColumns).toBe(1)
  expect(layout.navigationDisplay).toBe('flex')
  expect(layout.demoWidth).toBeGreaterThan(800)
  expect(layout.demoRight).toBeLessThanOrEqual(layout.viewportWidth)
})

test('@a11y catalogue supports 200 percent text without clipped controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'One 200 percent text run is sufficient')
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const result = await page.evaluate(() => ({
    pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    clippedControls: [...document.querySelectorAll('button:not([hidden]), label')]
      .filter((element) => element.checkVisibility())
      .filter((element) => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
      .map((element) => element.getAttribute('aria-label') || element.textContent?.trim() || element.id),
  }))
  expect(result.pageOverflow).toBeLessThanOrEqual(0)
  expect(result.clippedControls).toEqual([])
})

test('@a11y standard controls meet the shared hit-target contract', async ({ page }) => {
  const undersized = await page.locator([
    'button:not([data-size="compact"]):not([hidden])',
    'select:not([hidden])',
    'input:not([type="checkbox"]):not([type="radio"]):not([hidden])',
    'a.as-pagination__button:not([hidden])',
    'a.as-sidebar__rail-link:not([hidden])',
    'a.as-sidebar__link:not([hidden])',
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

test('@a11y data view switcher exposes immediate pressed state and status', async ({ page }) => {
  const group = page.getByRole('group', { name: 'Frequent workbench views' })
  const needsAttention = group.getByRole('button', { name: 'Needs Attention' })
  const activeOrders = group.getByRole('button', { name: 'Active Orders' })
  await expect(needsAttention).toHaveAttribute('aria-pressed', 'true')
  await activeOrders.focus()
  await page.keyboard.press('Enter')
  await expect(activeOrders).toHaveAttribute('aria-pressed', 'true')
  await expect(needsAttention).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('#catalog-view-status')).toHaveText('Active Orders is the current workbench view.')
})

test('@a11y tabs support roving keyboard focus and reduced-motion-safe transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const tablist = page.getByRole('tablist', { name: 'Order views' })
  const indicator = tablist.locator('.as-tab__indicator')
  const first = page.getByRole('tab', { name: 'Summary' })

  const expectIndicatorToMatch = async (tab) => {
    await expect.poll(async () => {
      const tabBox = await tab.boundingBox()
      const indicatorBox = await indicator.boundingBox()
      return Math.abs(tabBox.x - indicatorBox.x) < 1
        && Math.abs(tabBox.width - indicatorBox.width) < 1
    }).toBe(true)
  }

  await expectIndicatorToMatch(first)
  await page.evaluate(() => { document.documentElement.style.fontSize = '125%' })
  await expectIndicatorToMatch(first)

  const initialOffset = await tablist.evaluate((element) => getComputedStyle(element).getPropertyValue('--as-tab-active-offset'))
  await first.focus()
  await first.press('ArrowRight')
  const activity = page.getByRole('tab', { name: 'Activity' })
  await expect(activity).toBeFocused()
  await expect(activity).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Activity' })).toBeVisible()
  await expectIndicatorToMatch(activity)
  const movedOffset = await tablist.evaluate((element) => getComputedStyle(element).getPropertyValue('--as-tab-active-offset'))
  expect(movedOffset).not.toBe(initialOffset)
  expect(await indicator.evaluate((element) => getComputedStyle(element).transitionDuration)).not.toBe('0s')

  await activity.press('ArrowLeft')
  await expect(first).toBeFocused()
  await expect(first).toHaveAttribute('aria-selected', 'true')
  await expectIndicatorToMatch(first)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await indicator.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s')
})

test('@a11y pagination announces changes and disables unavailable boundaries', async ({ page }) => {
  const previous = page.getByRole('button', { name: 'Previous page' })
  const next = page.getByRole('button', { name: 'Next page' })
  const current = page.locator('#catalog-pagination-current')

  await expect(previous).toBeDisabled()
  await expect(next).toBeEnabled()
  await next.click()
  await expect(current).toHaveText('2')
  await expect(current).toHaveAttribute('aria-label', 'Current page, 2')
  await expect(page.locator('#catalog-pagination-summary')).toHaveText('Showing 21–40 of 84')
  await expect(page.locator('#catalog-pagination-status')).toHaveText('Page 2 of 5.')
  await expect(previous).toBeEnabled()
})

test('@a11y sidebar exposes current navigation, filtering, and reduced-motion behavior', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const sidebar = page.getByRole('complementary', { name: 'Commercial workspace navigation' })
  const menu = page.locator('#catalog-sidebar-menu')
  const indicator = menu.locator('.as-sidebar__indicator')
  const rail = page.locator('#catalog-sidebar-rail')
  const railIndicator = rail.locator('.as-sidebar__rail-indicator')
  const commercial = rail.getByRole('link', { name: 'Commercial' })
  const operations = rail.getByRole('link', { name: 'Operations' })
  const teamQuotes = sidebar.getByRole('link', { name: 'Team Quotes' })
  const orderDesk = sidebar.getByRole('link', { name: 'Order Desk' })

  await expect(commercial).toHaveAttribute('aria-current', 'page')
  await expect(teamQuotes).toHaveAttribute('aria-current', 'page')
  const initialOffset = await menu.evaluate((element) => getComputedStyle(element).getPropertyValue('--as-sidebar-active-offset'))
  await orderDesk.click()
  await expect(orderDesk).toHaveAttribute('aria-current', 'page')
  await expect(teamQuotes).not.toHaveAttribute('aria-current')
  await expect(page.locator('#catalog-sidebar-status')).toHaveText('Order Desk is the current destination.')
  const movedOffset = await menu.evaluate((element) => getComputedStyle(element).getPropertyValue('--as-sidebar-active-offset'))
  expect(movedOffset).not.toBe(initialOffset)
  expect(await indicator.evaluate((element) => getComputedStyle(element).transitionDuration)).not.toBe('0s')

  const search = page.getByRole('searchbox', { name: 'Search Commercial navigation' })
  await search.fill('service')
  await expect(sidebar.getByRole('link', { name: 'Service Orders' })).toBeVisible()
  await expect(orderDesk).toBeHidden()
  await expect(page.locator('#catalog-sidebar-status')).toHaveText('1 destination available.')
  const results = await new AxeBuilder({ page }).include('.as-sidebar').analyze()
  expectAxeScan(results, 'filtered sidebar', { allowDecorativeEffects: true })

  await search.fill('')
  const initialRailOffset = await rail.evaluate((element) => getComputedStyle(element).getPropertyValue('--as-sidebar-rail-active-offset'))
  await operations.click()
  await expect(operations).toHaveAttribute('aria-current', 'page')
  await expect(commercial).not.toHaveAttribute('aria-current')
  await expect(page.locator('#catalog-sidebar-title')).toHaveText('Operations')
  await expect(sidebar.getByRole('link', { name: 'Production Dashboard' })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('#catalog-sidebar-status')).toHaveText('Operations: Production Dashboard is the current destination.')
  const movedRailOffset = await rail.evaluate((element) => getComputedStyle(element).getPropertyValue('--as-sidebar-rail-active-offset'))
  expect(movedRailOffset).not.toBe(initialRailOffset)
  expect(await railIndicator.evaluate((element) => getComputedStyle(element).transitionDuration)).not.toBe('0s')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await indicator.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s')
  expect(await railIndicator.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s')
})

test('@a11y checkbox and radio cards retain native keyboard behavior', async ({ page }) => {
  const orderUpdates = page.getByRole('checkbox', { name: /Order updates/ })
  await expect(orderUpdates).toBeChecked()
  await orderUpdates.focus()
  await orderUpdates.press('Space')
  await expect(orderUpdates).not.toBeChecked()

  const inches = page.getByRole('radio', { name: /Inches/ })
  const millimetres = page.getByRole('radio', { name: /Millimetres/ })
  await expect(inches).toBeChecked()
  await inches.focus()
  await inches.press('ArrowDown')
  await expect(millimetres).toBeFocused()
  await expect(millimetres).toBeChecked()
})

test('@a11y switch exposes and announces its state', async ({ page }) => {
  const control = page.getByRole('switch', { name: 'Grid snapping' })
  await expect(control).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('#catalog-switch-state')).toHaveText('On')
  await control.click()
  await expect(control).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('#catalog-switch-state')).toHaveText('Off')
  await expect(page.locator('#switch-status')).toHaveText('Grid snapping is off.')
})

test('@a11y feedback states keep meaning, recovery actions, and reduced-motion behavior', async ({ page }) => {
  const feedback = page.locator('#feedback')
  await expect(feedback.getByRole('status', { name: /Changes saved/ })).toBeVisible()
  await expect(feedback.getByRole('alert')).toContainText('Upload failed')
  await expect(feedback.getByRole('status', { name: /Syncing vendor updates/ })).toBeVisible()

  await feedback.getByRole('button', { name: 'Try again' }).click()
  await expect(page.locator('#feedback-action-status')).toHaveText('Retry requested. The product would now repeat the upload.')
  await feedback.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.locator('#feedback-action-status')).toHaveText('Filters cleared. The product would now refresh the results.')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const spinner = feedback.locator('.as-loading-state__spinner')
  expect(await spinner.evaluate((element) => getComputedStyle(element).animationName)).toBe('as-feedback-spin')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await spinner.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
})

test('@a11y confirmation keeps danger on the final decision and restores focus in light and dark themes', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Review archive' })
  await expect(trigger).toHaveAttribute('data-variant', 'secondary')

  for (const theme of ['operations', 'operations-dark']) {
    await page.locator('#theme-select').selectOption(theme)
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Archive this example?' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Archive example' })).toHaveAttribute('data-variant', 'destructive')
    const results = await new AxeBuilder({ page }).include('#catalog-dialog').analyze()
    expectAxeScan(results, `${theme} open confirmation dialog`, { allowDecorativeEffects: true })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  }

  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Archive this example?' })
  await dialog.getByRole('button', { name: 'Keep active' }).click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('@a11y menu dismisses outside and supports the complete keyboard contract', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'More actions' })
  const menu = page.getByRole('menu', { name: 'More actions' })
  const duplicate = menu.getByRole('menuitem', { name: 'Duplicate' })
  const archive = menu.getByRole('menuitem', { name: 'Archive' })
  const outside = page.locator('#overlays .catalog-section__intro h2')

  await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
  await expect(trigger).toHaveAttribute('aria-controls', 'catalog-menu')
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(menu).toBeVisible()
  const openResults = await new AxeBuilder({ page }).include('#overlays').analyze()
  expectAxeScan(openResults, 'open command menu', { allowDecorativeEffects: true })

  await outside.click()
  await expect(menu).toBeHidden()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.focus()
  await trigger.press('ArrowDown')
  await expect(duplicate).toBeFocused()
  await duplicate.press('ArrowDown')
  await expect(archive).toBeFocused()
  await archive.press('Home')
  await expect(duplicate).toBeFocused()
  await duplicate.press('End')
  await expect(archive).toBeFocused()
  await archive.press('Escape')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.press('Enter')
  await expect(duplicate).toBeFocused()
  await duplicate.press('Enter')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.locator('#overlay-status')).toHaveText('Duplicate selected for this example.')

  await trigger.press('ArrowUp')
  await expect(archive).toBeFocused()
  await archive.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Archive this example?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Keep active' }).click()
  await expect(trigger).toBeFocused()

  await trigger.press('ArrowDown')
  await expect(duplicate).toBeFocused()
  await outside.click()
  await expect(menu).toBeHidden()
  expect(await page.locator('#catalog-menu').evaluate((element) => element.contains(document.activeElement))).toBe(false)
})

test('@a11y menu and feedback reflow under enhanced text spacing', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-375', 'One narrow enhanced-spacing run is sufficient')
  await page.setViewportSize({ width: 320, height: 812 })
  await page.addStyleTag({ content: `
    * { letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
    p { line-height: 1.5 !important; margin-bottom: 2em !important; }
  ` })
  await page.getByRole('button', { name: 'More actions' }).click()
  await expect(page.getByRole('menu', { name: 'More actions' })).toBeVisible()
  const sizes = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth)
  const results = await new AxeBuilder({ page }).include('#feedback').include('#overlays').analyze()
  expectAxeScan(results, 'enhanced text-spacing', { allowDecorativeEffects: true })
})

test('@a11y searchable selection filters and chooses an option from inside the popup', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /searchable selection/i })
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  const search = page.getByRole('combobox', { name: 'Search suppliers' })
  await expect(search).toBeFocused()
  await search.fill('heritage')
  await expect(page.locator('#catalog-vendor-results')).toHaveText('1 supplier available.')
  const listbox = page.locator('#catalog-vendor-options')
  await expect(listbox.getByRole('option', { name: 'Heritage Memorial Supply' })).toBeVisible()
  const openResults = await new AxeBuilder({ page }).include('#catalog-vendor-popover').analyze()
  expectAxeScan(openResults, 'open searchable selection', { allowDecorativeEffects: true })

  await search.press('ArrowDown')
  const option = listbox.getByRole('option', { name: 'Heritage Memorial Supply' })
  await expect(search).toBeFocused()
  await expect(search).toHaveAttribute('aria-activedescendant', 'catalog-vendor-option-heritage')
  await expect(option).toHaveAttribute('data-active', 'true')
  await search.press('Enter')

  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toContainText('Heritage Memorial Supply')
  await expect(trigger).toBeFocused()
})

test('@a11y standalone menu confirmation restores focus to its visible trigger', async ({ page }) => {
  await page.goto('/examples/controls.html')
  const trigger = page.getByRole('button', { name: 'More order actions' })
  await trigger.focus()
  await trigger.press('ArrowDown')
  const deleteItem = page.getByRole('menuitem', { name: 'Delete template' })
  await deleteItem.press('End')
  await deleteItem.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Delete order template?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Keep template' }).click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('@a11y standalone form specimen passes automated checks', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'One focused form specimen run is sufficient')
  await page.goto('/examples/forms.html')
  const results = await new AxeBuilder({ page }).analyze()
  expectAxeScan(results, 'standalone form specimen', { allowDecorativeEffects: true })
})

test('@a11y local catalogue server handles fonts, HEAD, and unsupported methods safely', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'One server contract run is sufficient')
  const fontResponse = await page.request.get('/site/assets/fonts/inter-latin-wght-normal.woff2')
  expect(fontResponse.status()).toBe(200)
  expect(fontResponse.headers()['content-type']).toBe('font/woff2')

  const headResponse = await page.request.head('/site/index.html')
  expect(headResponse.status()).toBe(200)
  expect(await headResponse.body()).toHaveLength(0)

  const postResponse = await page.request.post('/site/index.html')
  expect(postResponse.status()).toBe(405)
  expect(postResponse.headers().allow).toBe('GET, HEAD')
})

test('@a11y every meaningful specimen table column supports announced sorting', async ({ page }) => {
  await expect(page.getByRole('region', { name: 'Vendor quotes' })).toBeVisible()
  await expect(page.locator('#data-display .as-table-toolbar__count')).toHaveText('2 quotes')
  await expect(page.locator('#data-display .as-description-list')).toHaveAttribute('data-layout', 'tiles')
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

test('@a11y premium effects and action hierarchy retain forced-colors fallbacks', async ({ page }) => {
  const gradient = page.locator('.as-surface[data-appearance="gradient"]')
  const glass = page.locator('.as-surface[data-appearance="glass"]')
  const sidebar = page.locator('.as-sidebar')
  const tablist = page.locator('.as-tablist')
  const pagination = page.locator('.as-pagination')
  const choice = page.locator('.as-choice').first()
  const switchControl = page.locator('.as-switch')
  const alert = page.locator('.as-alert').first()
  const loading = page.locator('.as-loading-state')
  const empty = page.locator('.as-empty-state')
  const dataCard = page.locator('#data-display .as-card')
  const dataTable = page.locator('#data-display .as-table-wrap')
  const buttons = page.locator('#actions .as-button')

  await expect(gradient).toBeVisible()
  await expect(glass).toBeVisible()
  await expect(buttons.first()).toBeVisible()
  await expect(sidebar).toBeVisible()
  expect(await gradient.evaluate((element) => getComputedStyle(element).backgroundImage)).not.toBe('none')
  expect(await glass.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await sidebar.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await tablist.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await pagination.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await choice.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await switchControl.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await alert.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await loading.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await empty.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await dataCard.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  expect(await dataTable.evaluate((element) => getComputedStyle(element).backdropFilter)).not.toBe('none')
  const dimensionalButtons = page.locator('#actions .as-button:not([data-variant="ghost"]):not([data-variant="link"]):not([data-variant="outline"])')
  expect(await dimensionalButtons.evaluateAll((elements) => elements
    .filter((element) => getComputedStyle(element).backgroundImage === 'none')
    .map((element) => element.textContent?.trim()))).toEqual([])
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toHaveCSS('background-image', 'none')
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toHaveCSS('box-shadow', 'none')
  await expect(page.getByRole('button', { name: 'Refresh', exact: true })).toHaveCSS('background-image', 'none')

  await page.emulateMedia({ forcedColors: 'active' })
  expect(await gradient.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe('none')
  expect(await glass.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await sidebar.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await tablist.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await pagination.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await choice.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await switchControl.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await alert.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await loading.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await empty.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await dataCard.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await dataTable.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none')
  expect(await buttons.evaluateAll((elements) => elements
    .filter((element) => getComputedStyle(element).boxShadow !== 'none')
    .map((element) => element.textContent?.trim()))).toEqual([])
})

test('@a11y solid action fallbacks remain readable when gradients are unavailable', async ({ page }) => {
  const primary = page.getByRole('button', { name: 'Save changes', exact: true })
  const destructive = page.getByRole('button', { name: 'Delete', exact: true })

  await page.addStyleTag({ content: '#actions .as-button { background-image: none !important; }' })

  await expect(primary).toHaveCSS('background-image', 'none')
  await expect(primary).toHaveCSS('background-color', 'rgb(31, 93, 152)')
  await expect(primary).toHaveCSS('color', 'rgb(255, 255, 255)')
  await primary.hover()
  await expect(primary).toHaveCSS('background-color', 'rgb(23, 75, 125)')

  await expect(destructive).toHaveCSS('background-image', 'none')
  await expect(destructive).toHaveCSS('background-color', 'rgb(153, 27, 27)')
  await expect(destructive).toHaveCSS('color', 'rgb(255, 255, 255)')
})

test('@a11y representative interactive patterns expose visible keyboard focus', async ({ page }) => {
  const controls = [
    '.catalog-demo .as-button',
    '.catalog-visual-card--feature .as-button',
    '#catalog-vendor',
    '#catalog-po',
    '#catalog-lookup',
    '.as-choice input[type="checkbox"]',
    '#catalog-switch',
    '#tab-summary',
    '#catalog-sidebar-search',
    '.as-sidebar__rail-link[aria-current="page"]',
    '.as-sidebar__link[aria-current="page"]',
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
  await settleVisualRendering(page)
  await expect(page).toHaveScreenshot('catalog.png', {
    animations: 'disabled',
    fullPage: true,
    // Native GitHub runners can vary by a few anti-aliased pixels around the
    // table sort glyphs. This remains below any complete UI detail or control.
    maxDiffPixels: 50,
    timeout: 40_000,
  })
})

for (const theme of ['operations', 'operations-dark']) {
  test(`@visual ${theme} confirmation dialog matches the reviewed reference`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1440', 'One focused dialog reference per theme is sufficient')
    await page.locator('#theme-select').selectOption(theme)
    await settleVisualRendering(page)
    await page.locator('#overlays').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Review archive' }).click()
    const dialog = page.getByRole('dialog', { name: 'Archive this example?' })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveScreenshot(`confirmation-dialog-${theme}.png`, {
      animations: 'disabled',
      // Chromium produces two visually equivalent gradient/shadow rasterizations on macOS.
      // Keep this below the area of any complete dialog control or content region.
      maxDiffPixelRatio: 0.06,
      timeout: 40_000,
    })
  })
}
