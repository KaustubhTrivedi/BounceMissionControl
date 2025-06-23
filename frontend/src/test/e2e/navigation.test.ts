import { test, expect } from '@playwright/test'

test.describe('BounceMissionControl - Navigation E2E', () => {
  test('user can navigate from home to visualization pages', async ({ page }) => {
    // Go to the home page
    await page.goto('/')
    
    // Check that we're on the home page
    await expect(page).toHaveURL('/')
    await expect(page).toHaveTitle(/Bounce Mission Control/)
    
    // Navigation to Mars Weather page
    await page.click('text=Mars Weather')
    await expect(page).toHaveURL('/mars-weather')
    await expect(page.locator('h1')).toContainText(/Mars Weather/)
    
    // Navigation to Mars Rover page
    await page.click('text=Mars Rover')
    await expect(page).toHaveURL('/mars-rover')
    await expect(page.locator('h1')).toContainText(/Mars Rover/)
    
    // Navigation to APOD page
    await page.click('text=APOD')
    await expect(page).toHaveURL('/apod')
    await expect(page.locator('h1')).toContainText(/Astronomy Picture/)
    
    // Navigation to TechPort page
    await page.click('text=TechPort')
    await expect(page).toHaveURL('/techport')
    await expect(page.locator('h1')).toContainText(/Technology Portfolio/)
    
    // Navigation to About page
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toContainText(/About/)
  })

  test('responsive navigation works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Mobile menu should be visible (hamburger icon)
    const mobileMenuButton = page.locator('[aria-label="Toggle menu"]')
    await expect(mobileMenuButton).toBeVisible()
    
    // Click to open mobile menu
    await mobileMenuButton.click()
    
    // Navigation items should be visible in mobile menu
    await expect(page.locator('text=Mars Weather')).toBeVisible()
    await expect(page.locator('text=Mars Rover')).toBeVisible()
    
    // Navigate to a page via mobile menu
    await page.click('text=Mars Weather')
    await expect(page).toHaveURL('/mars-weather')
  })

  test('back button navigation works correctly', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to Mars Weather
    await page.click('text=Mars Weather')
    await expect(page).toHaveURL('/mars-weather')
    
    // Navigate to Mars Rover
    await page.click('text=Mars Rover')
    await expect(page).toHaveURL('/mars-rover')
    
    // Use browser back button
    await page.goBack()
    await expect(page).toHaveURL('/mars-weather')
    
    // Use browser back button again
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('navigation persists user preferences', async ({ page }) => {
    await page.goto('/')
    
    // Set a preference (if theme toggle exists)
    const themeToggle = page.locator('[aria-label="Toggle theme"]')
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      
      // Navigate to another page
      await page.click('text=Mars Weather')
      await expect(page).toHaveURL('/mars-weather')
      
      // Theme preference should persist (check for dark mode class)
      await expect(page.locator('html')).toHaveClass(/dark/)
    }
  })

  test('handles 404 navigation gracefully', async ({ page }) => {
    // Try to navigate to a non-existent page
    await page.goto('/non-existent-page')
    
    // Should show 404 page or redirect to home
    const pageContent = await page.textContent('body')
    expect(pageContent).toMatch(/(404|Not Found|Home)/i)
  })
}) 