import { defineConfig } from '@playwright/test'
const starters = [
  { name: 'vanilla', port: 5181, command: 'node starters/tests/serve.mjs starters/vanilla/dist 5181' },
  { name: 'nextjs', port: 5182, command: 'npm --prefix starters/nextjs run start -- --port 5182' },
  { name: 'angular', port: 5183, command: 'node starters/tests/serve.mjs starters/angular/dist/asig-starter/browser 5183' },
]
export default defineConfig({
  testDir: './starters/tests',
  testMatch: '*.spec.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: starters.map(({ port, command }) => ({ command, url: `http://127.0.0.1:${port}`, reuseExistingServer: !process.env.CI })),
  projects: starters.flatMap(({ name, port }) => [
    { name: `${name}-desktop`, use: { baseURL: `http://127.0.0.1:${port}`, viewport: { width: 1280, height: 800 } } },
    { name: `${name}-mobile`, use: { baseURL: `http://127.0.0.1:${port}`, viewport: { width: 375, height: 812 } } },
  ]),
})
