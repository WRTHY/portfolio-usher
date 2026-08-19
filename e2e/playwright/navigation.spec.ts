import { test, expect } from '@playwright/test'

test.describe('primary navigation', () => {
  test('each nav link scrolls its section into view', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation')

    await nav.getByRole('link', { name: 'Case Studies' }).click()
    await expect(page.locator('#case-studies')).toBeInViewport()

    await nav.getByRole('link', { name: 'Automation Examples' }).click()
    await expect(page.locator('#code-samples')).toBeInViewport()

    await nav.getByRole('link', { name: 'About' }).click()
    await expect(page.locator('#about')).toBeInViewport()

    await nav.getByRole('link', { name: 'Home' }).click()
    await expect(page.locator('#hero')).toBeInViewport()
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the menu toggle opens and closes the nav', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation')
    const toggle = page.getByRole('button', { name: 'Open menu' })

    await expect(nav.getByRole('link', { name: 'About' })).not.toBeVisible()

    await toggle.click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()

    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'About' })).not.toBeVisible()
  })

  test('choosing a link closes the menu and scrolls to the section', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await nav.getByRole('link', { name: 'About' }).click()

    await expect(page.locator('#about')).toBeInViewport()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  })
})
