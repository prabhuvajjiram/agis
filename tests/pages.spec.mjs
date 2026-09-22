import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
const routes = ['/site/pages.html', '/examples/orders.html', '/examples/workbench.html', '/examples/order-detail.html']
async function openControls(page) {
  const disclosure = page.locator('.sample-controls')
  if (await disclosure.count()) await disclosure.locator('summary').click()
}
const settle = page => page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.getAnimations().filter(a => a.effect?.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))) })
for (const route of routes) for (const theme of ['operations', 'operations-dark']) {
  test(`@a11y page ${route} ${theme}`, async ({ page }, info) => {
    await page.goto(route)
    const skipLink = page.locator('.as-skip-link')
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeFocused()
    await openControls(page)
    await page.locator('#theme-select').selectOption(theme)
    await page.addStyleTag({ content: '*, *::before, *::after { background-image: none !important; backdrop-filter: none !important; }' })
    await settle(page)
    await skipLink.focus()
    const skipAudit = await new AxeBuilder({ page }).include('.as-skip-link').withRules(['color-contrast']).analyze()
    expect(skipAudit.violations).toEqual([])
    expect(skipAudit.incomplete).toEqual([])
    await skipLink.press('Enter')
    await expect(page.locator('main')).toBeFocused()
    const audit = await new AxeBuilder({ page }).analyze()
    expect(audit.violations).toEqual([])
    // Axe cannot sample columns clipped by the intentional horizontal table viewport.
    // Full-width runs check those same cells; all other uncertain contrast fails here.
    const uncertain = []
    for (const rule of audit.incomplete.filter(rule => rule.id === 'color-contrast')) {
      for (const node of rule.nodes) {
        const clippedTableCell = node.any.every(check => check.data?.messageKey === 'elmPartiallyObscured') && await page.evaluate(selector => {
          const element = document.querySelector(selector)
          const table = element?.closest('.as-page-table')
          return Boolean(table && table.scrollWidth > table.parentElement.clientWidth)
        }, node.target[0])
        if (!clippedTableCell) uncertain.push(node.target)
      }
    }
    expect(uncertain).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    for (const state of route.includes('/examples/') ? ['loading', 'empty', 'error', 'restricted'] : []) {
      await page.locator('#state-select').selectOption(state)
      await expect(page.locator('#page-content')).toBeHidden()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
    if (route.includes('/examples/')) await page.locator('#state-select').selectOption('ready')
    if (info.project.name === 'mobile-375') {
      await page.setViewportSize({ width: 320, height: 812 })
      await page.addStyleTag({ content: 'html { font-size: 200%; }' })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    }
  })
  test(`@visual page ${route} ${theme}`, async ({ page }, info) => {
    test.skip(!['mobile-375','desktop-1440'].includes(info.project.name),'Narrow and wide theme references')
    await page.goto(route)
    await openControls(page)
    await page.locator('#theme-select').selectOption(theme)
    await settle(page)
    if (await page.locator('.sample-controls').count()) await page.locator('.sample-controls summary').click()
    await expect(page).toHaveScreenshot(`${route.split('/').pop().replace('.html','')}-${theme}.png`, { fullPage: true, animations: 'disabled', maxDiffPixels: 50, timeout: 40_000 })
  })
}
test('order filters, sort and retry preserve context', async ({ page }) => {
  await page.goto('/examples/orders.html')
  await openControls(page)
  expect(await page.locator('.as-page-table th').first().evaluate(el => el.getBoundingClientRect().width)).toBeGreaterThan(64)
  await page.getByLabel('Search orders').fill('Heritage')
  await expect(page.locator('[data-order]:visible')).toHaveCount(1)
  await page.getByLabel('Preview state').selectOption('error')
  await page.getByRole('button',{name:'Try again',exact:true}).click()
  await expect(page.getByLabel('Search orders')).toHaveValue('Heritage')
  await expect(page.locator('[data-order]:visible')).toHaveCount(1)
  await page.getByRole('button',{name:'Clear filters'}).click()
  await page.locator('#sort-orders').click()
  await expect(page.locator('[data-order]').first()).toContainText('SO-1044')
  await page.getByLabel('Search orders').fill('missing')
  await expect(page.locator('#orders-empty')).toBeVisible()
})
test('workbench scopes agree with sample counts', async ({ page }) => {
  await page.goto('/examples/workbench.html')
  await openControls(page)
  await expect(page.locator('[data-task]:visible')).toHaveCount(2)
  await page.getByRole('button',{name:'All tasks',exact:true}).click()
  await expect(page.locator('[data-task]:visible')).toHaveCount(3)
  await page.getByRole('button',{name:'My tasks',exact:true}).click()
  await expect(page.locator('[data-task]:visible')).toHaveCount(2)
  await expect(page.locator('#task-count')).toHaveText('2 sample tasks')
})
test('detail validation and failed save retain notes', async ({ page }) => {
  await page.goto('/examples/order-detail.html')
  await openControls(page)
  const notes = page.getByLabel('Receiving instructions', { exact: false })
  await notes.fill('')
  await page.getByRole('button',{name:'Save sample notes'}).click()
  await expect(notes).toBeFocused()
  await expect(notes).toHaveAccessibleDescription(/Enter receiving instructions/)
  await notes.fill('Keep this note through errors.')
  await page.getByLabel('Simulate one failed save').check()
  await page.getByRole('button',{name:'Save sample notes'}).click()
  await expect(page.locator('#save-error')).toContainText('preserved')
  await page.getByLabel('Preview state').selectOption('error')
  await page.getByRole('button',{name:'Try again',exact:true}).click()
  await expect(notes).toHaveValue('Keep this note through errors.')
  await page.getByRole('button',{name:'Save sample notes'}).click()
  await expect(page.locator('#save-status')).toContainText('saved in this page only')
})
test('bundle and import-chain expose the same page typography', async ({ page }) => {
  await page.goto('/examples/orders.html')
  await openControls(page)
  const before = await page.locator('h1').evaluate(el => { const s = getComputedStyle(el); return [s.fontSize,s.fontWeight,s.lineHeight,s.letterSpacing] })
  await page.evaluate(() => new Promise((resolve, reject) => {
    const stylesheet = document.querySelector('link[href$="ui-patterns/all.css"]')
    stylesheet.addEventListener('load', resolve, { once: true })
    stylesheet.addEventListener('error', () => reject(new Error('Bundle failed to load')), { once: true })
    stylesheet.href = '../packages/ui-patterns/dist/all.css'
  }))
  await expect.poll(() => page.locator('h1').evaluate(el => { const s = getComputedStyle(el); return [s.fontSize,s.fontWeight,s.lineHeight,s.letterSpacing] })).toEqual(before)
  expect(before[1]).toBe('600')
})
