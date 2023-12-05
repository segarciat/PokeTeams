// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Desktop', () => {
  test('shows title, navbar open button, and nav menu is closed', async ({ browser }) => {
    const page = await browser.newPage()
    await page.setViewportSize({
      width: 640,
      height: 480
    })
    await page.goto('/')
    await expect(page).toHaveTitle(/Poketeams/i)
    await expect(page.getByRole('heading', { level: 1, name: /Poketeams/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /open nav/i })).toBeVisible()
  })

  test('current navbar link changes according to pathname', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /home/i })).toHaveAttribute('aria-current', 'page')
    const aboutLink = page.getByRole('link', { name: /about/i })
    await expect(aboutLink).toHaveAttribute('aria-current', 'false')
    await aboutLink.click()
    await expect(page.getByRole('link', { name: /home/i })).toHaveAttribute('aria-current', 'false')
    await expect(page.getByRole('link', { name: /about/i })).toHaveAttribute('aria-current', 'page')
  })

  test('resizing from small to large screen closes nav menu and hides the open button', async ({ browser }) => {
    const page = await browser.newPage()
    await page.setViewportSize({
      width: 640,
      height: 480
    })
    await page.goto('/')
    await page.getByRole('button', { name: /open nav/i }).click()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).toBeVisible()

    await page.setViewportSize({
      width: 1025,
      height: 480
    })
    await expect(page.getByRole('navigation', { name: /site navigation/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /open nav/i })).not.toBeVisible()
  })
})

test.describe('Mobile', () => {
  test('Clicking navbar open button shows the menu and hides the main content, then hides menu and shows main content', async ({ page, isMobile }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Poketeams/i)
    await expect(page.getByRole('heading', { level: 1, name: /Poketeams/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).not.toBeVisible()

    const openNavbarButton = page.getByRole('button', { name: /open nav/i })
    await expect(openNavbarButton).toBeVisible()
    await openNavbarButton.click()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).toBeVisible()
    await expect(page.getByRole('main')).not.toBeVisible()
    await page.getByRole('button', { name: /close nav/i }).click()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).not.toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })
})
