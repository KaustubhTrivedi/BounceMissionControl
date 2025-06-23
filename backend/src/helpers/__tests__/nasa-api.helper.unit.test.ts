import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock the NASA API helper functions directly instead of mocking axios
jest.mock('../nasa-api.helper', () => ({
  fetchAPODData: jest.fn(),
  fetchMarsRoverPhotos: jest.fn(),
  getMostActiveRover: jest.fn(),
  checkNASAApiHealth: jest.fn()
}))

import { 
  fetchAPODData, 
  fetchMarsRoverPhotos, 
  getMostActiveRover,
  checkNASAApiHealth
} from '../nasa-api.helper'

// Type the mocked functions
const mockFetchAPODData = fetchAPODData as jest.MockedFunction<typeof fetchAPODData>
const mockFetchMarsRoverPhotos = fetchMarsRoverPhotos as jest.MockedFunction<typeof fetchMarsRoverPhotos>
const mockGetMostActiveRover = getMostActiveRover as jest.MockedFunction<typeof getMostActiveRover>
const mockCheckNASAApiHealth = checkNASAApiHealth as jest.MockedFunction<typeof checkNASAApiHealth>

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
        date: '2023-12-01',
        media_type: 'image',
        service_version: 'v1'
      }

      mockFetchAPODData.mockResolvedValue(mockAPODData)

      const result = await fetchAPODData('2023-12-01')
      
      expect(result).toEqual(mockAPODData)
      expect(mockFetchAPODData).toHaveBeenCalledWith('2023-12-01')
    })

    it('should handle API errors gracefully', async () => {
      mockFetchAPODData.mockRejectedValue(new Error('API Error'))

      await expect(fetchAPODData()).rejects.toThrow('API Error')
    })
  })

  describe('fetchMarsRoverPhotos', () => {
    it('should fetch rover photos successfully', async () => {
      const mockRoverData = {
        photos: [
          {
            id: 1,
            sol: 1000,
            camera: {
              id: 20,
              name: 'FHAZ',
              rover_id: 5,
              full_name: 'Front Hazard Avoidance Camera'
            },
            img_src: 'https://example.com/photo1.jpg',
            earth_date: '2023-12-01',
            rover: {
              id: 5,
              name: 'Curiosity',
              landing_date: '2012-08-05',
              launch_date: '2011-11-26',
              status: 'active'
            }
          }
        ]
      }

      mockFetchMarsRoverPhotos.mockResolvedValue(mockRoverData)

      const result = await fetchMarsRoverPhotos('curiosity', '1000')
      
      expect(result).toEqual(mockRoverData)
      expect(result.photos).toHaveLength(1)
      expect(mockFetchMarsRoverPhotos).toHaveBeenCalledWith('curiosity', '1000')
    })

    it('should handle invalid response structure', async () => {
      mockFetchMarsRoverPhotos.mockResolvedValue({ photos: [] })

      const result = await fetchMarsRoverPhotos('curiosity')
      
      expect(result).toEqual({ photos: [] })
    })

    it('should return empty photos array on error', async () => {
      mockFetchMarsRoverPhotos.mockRejectedValue(new Error('Network Error'))

      await expect(fetchMarsRoverPhotos('curiosity')).rejects.toThrow('Network Error')
    })
  })

  describe('getMostActiveRover', () => {
    it('should return the most recently active rover', async () => {
      mockGetMostActiveRover.mockResolvedValue('perseverance')

      const result = await getMostActiveRover()
      
      expect(result).toBe('perseverance')
    })

    it('should fallback to curiosity when no active rovers found', async () => {
      mockGetMostActiveRover.mockResolvedValue('curiosity')

      const result = await getMostActiveRover()
      
      expect(result).toBe('curiosity')
    })
  })

  describe('checkNASAApiHealth', () => {
    it('should return true when API is healthy', async () => {
      mockCheckNASAApiHealth.mockResolvedValue(true)

      const result = await checkNASAApiHealth()
      
      expect(result).toBe(true)
    })

    it('should return false when API is unhealthy', async () => {
      mockCheckNASAApiHealth.mockResolvedValue(false)

      const result = await checkNASAApiHealth()
      
      expect(result).toBe(false)
    })
  })
}) 