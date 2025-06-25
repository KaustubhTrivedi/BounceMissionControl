import { vi } from 'vitest'

// Create mock API client
const mockApiClient = { get: vi.fn() }

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockApiClient)
  }
}))

// Mock the NASA config
vi.mock('../../config/nasa.config', () => ({
  default: {
    baseUrl: 'https://api.nasa.gov',
    timeout: 10000,
    apiKey: 'test-key',
    endpoints: {
      apod: '/planetary/apod',
      marsRover: '/mars-photos/api/v1/rovers',
      marsRoverManifest: '/mars-photos/api/v1/manifests',
    },
    rovers: ['curiosity', 'opportunity', 'spirit', 'perseverance']
  }
}))

import { describe, it, expect, beforeEach } from 'vitest'
import {
  fetchAPODData,
  fetchMarsRoverPhotos,
  fetchRoverManifest,
  getMostActiveRover,
  checkNASAApiHealth
} from '../nasa-api.helper'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('NASA API Helper', () => {
  describe('fetchAPODData', () => {
    it('should fetch APOD data without date parameter', async () => {
      const mockResponse = {
        data: {
          date: '2024-01-01',
          explanation: 'Test explanation',
          hdurl: 'https://example.com/hd.jpg',
          media_type: 'image',
          service_version: 'v1',
          title: 'Test APOD',
          url: 'https://example.com/image.jpg'
        }
      }
      mockApiClient.get.mockResolvedValueOnce(mockResponse)
      const result = await fetchAPODData()
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch APOD data with date parameter', async () => {
      const mockResponse = {
        data: {
          date: '2024-01-01',
          explanation: 'Test explanation',
          hdurl: 'https://example.com/hd.jpg',
          media_type: 'image',
          service_version: 'v1',
          title: 'Test APOD',
          url: 'https://example.com/image.jpg'
        }
      }
      mockApiClient.get.mockResolvedValueOnce(mockResponse)
      const result = await fetchAPODData('2024-01-01')
      expect(mockApiClient.get).toHaveBeenCalledWith('/planetary/apod', {
        params: { date: '2024-01-01' }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API errors', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'))
      await expect(fetchAPODData()).rejects.toThrow('API Error')
    })
  })

  describe('fetchMarsRoverPhotos', () => {
    it('should fetch Mars rover photos with sol parameter', async () => {
      const mockResponse = {
        data: {
          photos: [
            {
              id: 1,
              sol: 1000,
              camera: { id: 1, name: 'FHAZ', rover_id: 5, full_name: 'Front Hazard Avoidance Camera' },
              img_src: 'https://example.com/photo1.jpg',
              earth_date: '2024-01-01',
              rover: { id: 5, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' }
            }
          ]
        }
      }
      mockApiClient.get.mockResolvedValueOnce(mockResponse)
      const result = await fetchMarsRoverPhotos('curiosity', '1000')
      expect(mockApiClient.get).toHaveBeenCalledWith('/mars-photos/api/v1/rovers/curiosity/photos', {
        params: { sol: '1000' }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch latest photos when no sol is provided', async () => {
      const mockResponse = {
        data: {
          photos: [
            {
              id: 1,
              sol: 1000,
              camera: { id: 1, name: 'FHAZ', rover_id: 5, full_name: 'Front Hazard Avoidance Camera' },
              img_src: 'https://example.com/photo1.jpg',
              earth_date: '2024-01-01',
              rover: { id: 5, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' }
            }
          ]
        }
      }
      mockApiClient.get.mockResolvedValueOnce(mockResponse)
      const result = await fetchMarsRoverPhotos('curiosity')
      expect(mockApiClient.get).toHaveBeenCalledWith('/mars-photos/api/v1/rovers/curiosity/latest_photos', {
        params: {}
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle invalid response structure', async () => {
      const mockResponse = {
        data: { invalid: 'structure' }
      }
      mockApiClient.get.mockResolvedValueOnce(mockResponse)
      const result = await fetchMarsRoverPhotos('curiosity')
      expect(result).toEqual({ photos: [] })
    })

    it('should handle API errors and return empty photos array', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'))
      const result = await fetchMarsRoverPhotos('curiosity')
      expect(result).toEqual({ photos: [] })
    })
  })

  describe('fetchRoverManifest', () => {
    it('should fetch rover manifest successfully', async () => {
      const mockResponse = {
        data: {
          photo_manifest: {
            name: 'Curiosity',
            landing_date: '2012-08-06',
            launch_date: '2011-11-26',
            status: 'active',
            max_sol: 1000,
            max_date: '2024-01-01',
            total_photos: 5000,
            photos: []
          }
        }
      }
      mockApiClient.get.mockResolvedValueOnce(mockResponse)
      const result = await fetchRoverManifest('curiosity')
      expect(mockApiClient.get).toHaveBeenCalledWith('/mars-photos/api/v1/manifests/curiosity')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API errors', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'))
      await expect(fetchRoverManifest('curiosity')).rejects.toThrow('API Error')
    })
  })

  describe('getMostActiveRover', () => {
    it('should return the most active rover based on manifest data', async () => {
      const mockManifests = [
        {
          photo_manifest: {
            name: 'Curiosity',
            status: 'active',
            max_date: '2024-01-01'
          }
        },
        {
          photo_manifest: {
            name: 'Perseverance',
            status: 'active',
            max_date: '2024-01-02'
          }
        }
      ]
      mockApiClient.get
        .mockResolvedValueOnce({ data: mockManifests[0] })
        .mockResolvedValueOnce({ data: mockManifests[1] })
      const result = await getMostActiveRover()
      expect(result).toBe('perseverance')
    })

    it('should return curiosity as fallback when no active rovers', async () => {
      // Simulate all rovers inactive
      mockApiClient.get
        .mockResolvedValueOnce({ data: { photo_manifest: { status: 'complete' } } })
        .mockResolvedValueOnce({ data: { photo_manifest: { status: 'complete' } } })
      const result = await getMostActiveRover()
      expect(result).toBe('curiosity')
    })

    it('should return curiosity as fallback on error', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'))
      const result = await getMostActiveRover()
      expect(result).toBe('curiosity')
    })
  })

  describe('checkNASAApiHealth', () => {
    it('should return true when API is healthy', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { status: 'ok' } })
      const result = await checkNASAApiHealth()
      expect(result).toBe(true)
    })

    it('should return false when API is unhealthy', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'))
      const result = await checkNASAApiHealth()
      expect(result).toBe(false)
    })
  })
}) 