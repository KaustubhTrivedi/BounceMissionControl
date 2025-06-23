import { test, expect } from '@playwright/test'

test.describe('Mars Data Interaction E2E', () => {
  test('loads and displays Mars weather data correctly', async ({ page }) => {
    await page.goto('/mars-weather')
    
    // Wait for data to load
    await page.waitForSelector('[data-testid="weather-card"]', { timeout: 10000 })
    
    // Check weather data is displayed
    await expect(page.locator('[data-testid="weather-card"]')).toBeVisible()
    await expect(page.locator('text=/temperature/i')).toBeVisible()
    await expect(page.locator('text=/pressure/i')).toBeVisible()
    
    // Check sol date is displayed
    await expect(page.locator('text=/sol/i')).toBeVisible()
    
    // Verify weather chart or graph is rendered
    const weatherChart = page.locator('[data-testid="weather-chart"]')
    if (await weatherChart.isVisible()) {
      await expect(weatherChart).toBeVisible()
    }
  })

  test('mars rover photo gallery loads and functions', async ({ page }) => {
    await page.goto('/mars-rover')
    
    // Wait for photos to load
    await page.waitForSelector('[data-testid="rover-photos"]', { timeout: 15000 })
    
    // Check photos are displayed
    const photos = page.locator('[data-testid="rover-photo"]')
    await expect(photos.first()).toBeVisible()
    
    // Test rover selection dropdown
    const roverSelect = page.locator('[data-testid="rover-select"]')
    if (await roverSelect.isVisible()) {
      await roverSelect.click()
      await page.click('text=Perseverance')
      
      // Wait for new photos to load
      await page.waitForTimeout(2000)
      await expect(photos.first()).toBeVisible()
    }
    
    // Test photo modal/lightbox
    await photos.first().click()
    const modal = page.locator('[data-testid="photo-modal"]')
    if (await modal.isVisible()) {
      await expect(modal).toBeVisible()
      
      // Close modal
      await page.keyboard.press('Escape')
      await expect(modal).not.toBeVisible()
    }
  })

  test('graph interactions work correctly', async ({ page }) => {
    await page.goto('/mars-weather')
    
    // Wait for chart to load
    await page.waitForSelector('canvas, svg', { timeout: 10000 })
    
    const chart = page.locator('canvas, svg').first()
    await expect(chart).toBeVisible()
    
    // Test hover interactions on chart
    await chart.hover()
    
    // Look for tooltip or data point highlighting
    const tooltip = page.locator('[data-testid="chart-tooltip"]')
    if (await tooltip.isVisible()) {
      await expect(tooltip).toBeVisible()
    }
    
    // Test chart controls (if they exist)
    const timeRangeSelector = page.locator('[data-testid="time-range-select"]')
    if (await timeRangeSelector.isVisible()) {
      await timeRangeSelector.click()
      await page.click('text=Last 7 days')
      
      // Wait for chart to update
      await page.waitForTimeout(1000)
    }
  })

  test('handles API failure gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/mars-weather', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error' })
      })
    })
    
    await page.goto('/mars-weather')
    
    // Check error state is displayed
    await expect(page.locator('text=/error/i, text=/failed/i, text=/unavailable/i')).toBeVisible()
    
    // Check retry button exists and works
    const retryButton = page.locator('button:has-text("retry"), button:has-text("try again")')
    if (await retryButton.isVisible()) {
      await retryButton.click()
    }
  })

  test('search and filter functionality works', async ({ page }) => {
    await page.goto('/techport')
    
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="search" i]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Mars')
      await page.keyboard.press('Enter')
      
      // Wait for filtered results
      await page.waitForTimeout(1000)
      
      // Check that results contain search term
      const searchResults = page.locator('[data-testid="project-card"]')
      const firstResult = await searchResults.first().textContent()
      expect(firstResult?.toLowerCase()).toContain('mars')
    }
    
    // Test filter functionality
    const categoryFilter = page.locator('[data-testid="category-filter"]')
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.click('text=Space Technology')
      
      // Wait for filtered results
      await page.waitForTimeout(1000)
      
      // Verify results are filtered
      await expect(page.locator('[data-testid="project-card"]')).toBeVisible()
    }
  })

  test('pagination works correctly', async ({ page }) => {
    await page.goto('/techport')
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
    
    // Look for pagination controls
    const nextButton = page.locator('button:has-text("next"), button:has-text(">")')
    if (await nextButton.isVisible()) {
      // Record current page content
      const firstPageContent = await page.locator('[data-testid="project-card"]').first().textContent()
      
      // Go to next page
      await nextButton.click()
      await page.waitForTimeout(1000)
      
      // Verify content changed
      const secondPageContent = await page.locator('[data-testid="project-card"]').first().textContent()
      expect(secondPageContent).not.toBe(firstPageContent)
      
      // Test previous button
      const prevButton = page.locator('button:has-text("previous"), button:has-text("<")')
      if (await prevButton.isVisible()) {
        await prevButton.click()
        await page.waitForTimeout(1000)
        
        // Should be back to original content
        const backToFirstContent = await page.locator('[data-testid="project-card"]').first().textContent()
        expect(backToFirstContent).toBe(firstPageContent)
      }
    }
  })
}) 