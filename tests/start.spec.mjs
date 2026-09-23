import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('quickstart is discoverable and explains all three adapters @a11y', async ({ page }) => {
  await page.goto('/site/')
  await page.getByRole('link', { name: 'Start building', exact: true }).click()
  await expect(page).toHaveURL(/\/site\/start.html$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One design language.Your framework.')
  for (const name of ['JavaScript', 'Next.js', 'Angular']) {
    await expect(page.getByRole('link', { name: `Run the ${name} starter`, exact: false })).toHaveAttribute('href', /github.com\/prabhuvajjiram\/agis\/tree\/main\/starters\//)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('quickstart demo and captions are included in the Pages artifact', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'Media assets do not depend on viewport')
  await page.goto('/dist/pages/site/start.html')
  const video = page.getByLabel('ASIG starter demo', { exact: true })
  await expect(video).toBeVisible()
  await expect(video).toHaveAttribute('preload', 'none')
  for (const path of ['demo.mp4', 'poster.jpg', 'captions.vtt']) {
    const response = await request.get(`/dist/pages/site/assets/adoption/${path}`)
    expect(response.ok()).toBe(true)
  }
  await video.evaluate(element => element.load())
  await expect.poll(() => video.evaluate(element => element.duration)).toBeCloseTo(20, 1)
  expect(await video.evaluate(element => [element.videoWidth, element.videoHeight])).toEqual([1920, 1080])
})
