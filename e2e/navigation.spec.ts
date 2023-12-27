import { test, expect } from '@playwright/test'

test.describe('404 page', () => {
  test('Navigating to nonexistent path shows custom 404 page', async ({ browser, baseURL }) => {
    const page = await browser.newPage()
    await page.goto('/')
    await expect(page.getByRole('img', { name: /not found/i })).not.toBeVisible()
    await page.goto('/fakepath')
    await expect(page.getByRole('img', { name: /not found/i })).toBeVisible()
    const backToHomeLink = page.getByRole('link', { name: /back/i })
    await expect(backToHomeLink).toBeVisible()

    await backToHomeLink.click()
    await page.waitForURL(baseURL + '/')
    expect(page.url()).toBe(baseURL + '/')
  })
})
