import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import axios from 'axios'
import { 
  fetchAPODData, 
  fetchMarsRoverPhotos, 
  getMostActiveRover,
  checkNASAApiHealth
} from '../nasa-api.helper'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock the config
jest.mock('../../config/nasa.config', () => ({
  baseUrl: 'https://api.nasa.gov',
  apiKey: 'test_api_key',
  timeout: 10000,
  endpoints: {
    apod: '/planetary/apod',
    marsRover: '/mars-photos/api/v1/rovers',
    marsRoverManifest: '/mars-photos/api/v1/manifests',
    insightWeather: '/insight_weather',
    marsWeatherService: '/mars-weather'
  },
  rovers: ['curiosity', 'opportunity', 'spirit', 'perseverance']
}))

describe('NASA API Helper - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchAPODData', () => {
    it('should fetch APOD data successfully', async () => {
      const mockAPODData = {
        title: 'Test Astronomy Picture',
        explanation: 'Test explanation',
        url: 'https://example.com/image.jpg',
        date: '2023-12-01'
      }

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockAPODData })
      })

      const result = await fetchAPODData('2023-12-01')
      
      expect(result).toEqual(mockAPODData)
    })

    it('should handle API errors gracefully', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('API Error'))
      })

      await expect(fetchAPODData()).rejects.toThrow('API Error')
    })
  })

  describe('fetchMarsRoverPhotos', () => {
    it('should fetch rover photos successfully', async () => {
      const mockRoverData = {
        photos: [
          {
            id: 1,
            img_src: 'https://example.com/photo1.jpg',
            earth_date: '2023-12-01',
            rover: { name: 'Curiosity' }
          }
        ]
      }

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockRoverData })
      })

      const result = await fetchMarsRoverPhotos('curiosity', '1000')
      
      expect(result).toEqual(mockRoverData)
      expect(result.photos).toHaveLength(1)
    })

    it('should handle invalid response structure', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { invalid: 'structure' } })
      })

      const result = await fetchMarsRoverPhotos('curiosity')
      
      expect(result).toEqual({ photos: [] })
    })

    it('should return empty photos array on error', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Network Error'))
      })

      const result = await fetchMarsRoverPhotos('curiosity')
      
      expect(result).toEqual({ photos: [] })
    })
  })

  describe('getMostActiveRover', () => {
    it('should return the most recently active rover', async () => {
      const mockManifests = [
        {
          photo_manifest: {
            name: 'Curiosity',
            max_sol: 3000,
            max_date: '2023-12-01',
            status: 'active'
          }
        },
        {
          photo_manifest: {
            name: 'Perseverance',
            max_sol: 1000,
            max_date: '2023-12-02',
            status: 'active'
          }
        }
      ]

      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn()
          .mockResolvedValueOnce({ data: mockManifests[0] })
          .mockResolvedValueOnce({ data: mockManifests[1] })
      })

      const result = await getMostActiveRover()
      
      expect(result).toBe('perseverance') // Most recent date
    })

    it('should fallback to curiosity when no active rovers found', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('API Error'))
      })

      const result = await getMostActiveRover()
      
      expect(result).toBe('curiosity')
    })
  })

  describe('checkNASAApiHealth', () => {
    it('should return true when API is healthy', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ status: 200 })
      })

      const result = await checkNASAApiHealth()
      
      expect(result).toBe(true)
    })

    it('should return false when API is unhealthy', async () => {
      mockedAxios.create = jest.fn().mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('API Down'))
      })

      const result = await checkNASAApiHealth()
      
      expect(result).toBe(false)
    })
  })
}) 