import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Emil/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Emil')
  })

  test('homepage has no critical accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
  })
})
