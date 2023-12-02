// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Desktop', () => {
  test('shows title, navbar toggler, and nav menu is closed', async ({ browser }) => {
    const page = await browser.newPage()
    await page.setViewportSize({
      width: 640,
      height: 480
    })
    await page.goto('/')
    await expect(page).toHaveTitle(/Poketeams/i)
    await expect(page.getByRole('heading', { level: 1, name: /Poketeams/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /nav menu toggler/i })).toBeVisible()
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

  test('resizing from small to large screen closes nav menu and hides the toggler', async ({ browser }) => {
    const page = await browser.newPage()
    await page.setViewportSize({
      width: 640,
      height: 480
    })
    await page.goto('/')
    await page.getByRole('button', { name: /nav menu toggler/i }).click()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).toBeVisible()

    await page.setViewportSize({
      width: 1025,
      height: 480
    })
    await expect(page.getByRole('navigation', { name: /site navigation/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /nav menu toggler/i })).not.toBeVisible()
  })
})

test.describe('Mobile', () => {
  test('Clicking navbar toggler button shows the menu and hides the main content, then hides menu and shows main content', async ({ page, isMobile }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Poketeams/i)
    await expect(page.getByRole('heading', { level: 1, name: /Poketeams/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).not.toBeVisible()

    const navMenuToggler = page.getByRole('button', { name: /nav menu toggler/i })
    await expect(navMenuToggler).toBeVisible()
    await navMenuToggler.click()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).toBeVisible()
    await expect(page.getByRole('main')).not.toBeVisible()
    await page.getByRole('button', { name: /nav menu toggler/i }).click()
    await expect(page.getByRole('navigation', { name: /site navigation/i })).not.toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })
})
