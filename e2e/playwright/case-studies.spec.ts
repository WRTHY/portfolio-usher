import { test, expect } from '@playwright/test'

test.describe('case study modal', () => {
  test('clicking a tile opens the modal with that case study', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /Placeholder case study one/ }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Placeholder case study one' })).toBeVisible()
    await expect(dialog.getByText('Placeholder', { exact: false }).first()).toBeVisible()
  })

  test('Escape closes the modal and returns focus to the trigger', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: /Placeholder case study one/ })

    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('the close button closes the modal and returns focus to the trigger', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: /Placeholder case study one/ })

    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})
