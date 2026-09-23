import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("production starter supports search, combined filters, reset and keyboard access", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Orders", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("3 of 3 orders");
  await page.getByRole("searchbox").fill("  CEDAR  ");
  await expect(page.getByRole("status")).toHaveText("1 of 3 orders");
  await expect(page.getByRole("cell", { name: "SO-1043" })).toBeVisible();
  await page.getByLabel("Stage", { exact: true }).selectOption("review");
  await expect(page.getByRole("status")).toHaveText("0 of 3 orders");
  await expect(
    page.getByText("No orders match.", { exact: false }),
  ).toBeVisible();
  const reset = page.getByRole("button", { name: "Reset filters" });
  await reset.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("3 of 3 orders");
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByLabel("Stage", { exact: true })).toHaveValue("all");
  await page.getByRole("searchbox").fill("SO-1042");
  await page.getByRole("searchbox").press("Enter");
  await expect(page.getByRole("status")).toHaveText("1 of 3 orders");
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("3 of 3 orders");
  expect(errors).toEqual([]);
});

test("themes load real package styles without losing state or overflowing the page", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const field = page.getByRole("searchbox");
  // Guards against a typo in the opt-in class leaving an unstyled native input.
  expect(
    await field.evaluate((el) => parseFloat(getComputedStyle(el).minHeight)),
  ).toBeGreaterThanOrEqual(40);
  await page.getByLabel("Stage", { exact: true }).selectOption("ready");
  const backgrounds = [];
  for (const theme of ["operations", "operations-dark", "cad", "marketing"]) {
    await page.getByLabel("Theme", { exact: true }).selectOption(theme);
    await expect(page.getByRole("status")).toHaveText("2 of 3 orders");
    await expect(page.locator(".as-workspace")).toHaveAttribute(
      "data-as-theme",
      theme,
    );
    backgrounds.push(
      await page
        .locator(".as-workspace")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    // Theme tokens change immediately; control backgrounds have short CSS transitions.
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {}))));
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  }
  expect(backgrounds[0]).not.toBe(backgrounds[1]);
  if (testInfo.project.name.endsWith("mobile")) {
    const region = page.getByRole("region", { name: "Scrollable order table" });
    await region.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => region.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0);
  }
});

// Reproducible, real UI evidence for the local adoption demo; never uses ERP data.
test('capture demo states', async ({ page }, testInfo) => {
  test.skip(process.env.ASIG_CAPTURE_DEMO !== '1' || testInfo.project.name !== 'vanilla-desktop', 'Opt-in local demo capture')
  await page.goto('/')
  const screen = page.locator('.as-workspace__main')
  await screen.screenshot({ path: 'output/adoption-demo/assets/orders-all.png' })
  await page.getByLabel('Stage', { exact: true }).selectOption('ready')
  await expect(page.getByRole('status')).toHaveText('2 of 3 orders')
  await screen.screenshot({ path: 'output/adoption-demo/assets/orders-ready.png' })
  await page.getByLabel('Theme', { exact: true }).selectOption('operations-dark')
  await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {}))));
  await screen.screenshot({ path: 'output/adoption-demo/assets/orders-dark.png' })
})
