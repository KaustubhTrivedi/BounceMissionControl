import request from 'supertest'
import express from 'express'
import { getNASAData, getMarsWeather, getMarsRoverPhotos } from '../nasa.controller'

// Create test app
const app = express()
app.use(express.json())
app.get('/api/nasa/apod', getNASAData)
app.get('/api/nasa/mars-weather', getMarsWeather)
app.get('/api/nasa/mars-rover/:rover/photos', getMarsRoverPhotos)

describe('NASA Controller Integration Tests', () => {
  describe('GET /api/nasa/apod', () => {
    it('should return APOD data successfully', async () => {
      const response = await request(app)
        .get('/api/nasa/apod')
        .expect(200)
      
      expect(response.body).toHaveProperty('title')
      expect(response.body).toHaveProperty('explanation')
      expect(response.body).toHaveProperty('url')
      expect(response.body).toHaveProperty('date')
    })

    it('should return APOD data for specific date', async () => {
      const testDate = '2023-12-01'
      const response = await request(app)
        .get(`/api/nasa/apod?date=${testDate}`)
        .expect(200)
      
      expect(response.body).toHaveProperty('date')
      expect(response.body.date).toBe(testDate)
    })

    it('should handle invalid date format', async () => {
      const response = await request(app)
        .get('/api/nasa/apod?date=invalid-date')
        .expect(400)
      
      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/nasa/mars-weather', () => {
    it('should return Mars weather data successfully', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-weather')
        .expect(200)
      
      expect(response.body).toHaveProperty('location')
      expect(response.body).toHaveProperty('sol_data')
      expect(response.body.sol_data).toHaveProperty('sol')
      expect(response.body.sol_data).toHaveProperty('terrestrial_date')
      expect(response.body.sol_data).toHaveProperty('temperature')
    })

    it('should include weather metadata', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-weather')
        .expect(200)
      
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body.location).toHaveProperty('name')
      expect(response.body.sol_data).toHaveProperty('season')
    })

    it('should handle weather data gracefully when API is down', async () => {
      // This test assumes fallback simulation when real API fails
      const response = await request(app)
        .get('/api/nasa/mars-weather')
        .expect(200)
      
      // Should still return structured data even if from simulation
      expect(response.body).toHaveProperty('sol_data')
      expect(response.body.sol_data).toHaveProperty('temperature')
    })
  })

  describe('GET /api/nasa/mars-rover/:rover/photos', () => {
    it('should return rover photos for Curiosity', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-rover/curiosity/photos')
        .expect(200)
      
      expect(response.body).toHaveProperty('photos')
      expect(Array.isArray(response.body.photos)).toBe(true)
    })

    it('should return rover photos for Perseverance', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-rover/perseverance/photos')
        .expect(200)
      
      expect(response.body).toHaveProperty('photos')
      expect(Array.isArray(response.body.photos)).toBe(true)
    })

    it('should return rover photos for specific sol', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-rover/curiosity/photos?sol=1000')
        .expect(200)
      
      expect(response.body).toHaveProperty('photos')
      expect(Array.isArray(response.body.photos)).toBe(true)
    })

    it('should handle invalid rover name gracefully', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-rover/invalid-rover/photos')
        .expect(200) // Should return empty photos array rather than error
      
      expect(response.body).toHaveProperty('photos')
      expect(response.body.photos).toHaveLength(0)
    })

    it('should validate photo response structure', async () => {
      const response = await request(app)
        .get('/api/nasa/mars-rover/curiosity/photos')
        .expect(200)
      
      if (response.body.photos.length > 0) {
        const firstPhoto = response.body.photos[0]
        expect(firstPhoto).toHaveProperty('id')
        expect(firstPhoto).toHaveProperty('img_src')
        expect(firstPhoto).toHaveProperty('earth_date')
        expect(firstPhoto).toHaveProperty('rover')
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle network timeouts gracefully', async () => {
      // This would require mocking the NASA API to timeout
      // For now, we test that our endpoints always return something
      const response = await request(app)
        .get('/api/nasa/mars-weather')
        .timeout(5000)
        .expect(200)
      
      expect(response.body).toBeDefined()
    })

    it('should return proper error structure on failures', async () => {
      // Test with malformed request
      const response = await request(app)
        .get('/api/nasa/apod?date=2099-99-99') // Invalid date
        .expect(400)
      
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('date')
    })
  })

  describe('Performance', () => {
    it('should respond within reasonable time limits', async () => {
      const startTime = Date.now()
      
      await request(app)
        .get('/api/nasa/mars-weather')
        .expect(200)
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      // Should respond within 10 seconds (allowing for external API calls)
      expect(responseTime).toBeLessThan(10000)
    })
  })
}) 