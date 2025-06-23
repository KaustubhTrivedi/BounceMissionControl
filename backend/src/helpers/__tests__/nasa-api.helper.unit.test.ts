import { describe, it, expect } from '@jest/globals'

describe('NASA API Helper - Unit Tests', () => {
  describe('Module imports and exports', () => {
    it('should export all required functions', () => {
      const {
        fetchAPODData,
        fetchMarsRoverPhotos,
        getMostActiveRover,
        checkNASAApiHealth,
        fetchRoverManifest,
        fetchPerseveranceWeatherData
      } = require('../nasa-api.helper')

      expect(typeof fetchAPODData).toBe('function')
      expect(typeof fetchMarsRoverPhotos).toBe('function')
      expect(typeof getMostActiveRover).toBe('function')
      expect(typeof checkNASAApiHealth).toBe('function')
      expect(typeof fetchRoverManifest).toBe('function')
      expect(typeof fetchPerseveranceWeatherData).toBe('function')
    })

    it('should load NASA config correctly', () => {
      const config = require('../../config/nasa.config')
      
      expect(config).toBeDefined()
      expect(config.baseUrl).toBeDefined()
      expect(config.apiKey).toBeDefined()
      expect(config.endpoints).toBeDefined()
      expect(config.rovers).toBeDefined()
      expect(Array.isArray(config.rovers)).toBe(true)
      expect(config.rovers).toContain('curiosity')
      expect(config.rovers).toContain('perseverance')
    })

    it('should have proper endpoint configuration', () => {
      const config = require('../../config/nasa.config')
      
      expect(config.endpoints.apod).toBe('/planetary/apod')
      expect(config.endpoints.marsRover).toBe('/mars-photos/api/v1/rovers')
      expect(config.endpoints.marsRoverManifest).toBe('/mars-photos/api/v1/manifests')
    })
  })

  describe('Error handling functionality', () => {
    it('should handle network errors gracefully', async () => {
      const { fetchMarsRoverPhotos } = require('../nasa-api.helper')
      
      // This will actually make a request and handle errors
      const result = await fetchMarsRoverPhotos('invalid-rover')
      
      // Should return empty photos array on error
      expect(result).toHaveProperty('photos')
      expect(Array.isArray(result.photos)).toBe(true)
    })

    it('should provide fallback for most active rover', async () => {
      const { getMostActiveRover } = require('../nasa-api.helper')
      
      // This will either return a real rover or fallback to curiosity
      const result = await getMostActiveRover()
      
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle API health check', async () => {
      const { checkNASAApiHealth } = require('../nasa-api.helper')
      
      const result = await checkNASAApiHealth()
      
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Weather data functionality', () => {
    it('should return weather data structure', async () => {
      const { fetchPerseveranceWeatherData } = require('../nasa-api.helper')
      
      const result = await fetchPerseveranceWeatherData()
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('sol_data')
      expect(result).toHaveProperty('location')
      expect(result).toHaveProperty('timestamp')
    })
  })
}) 