import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Request, Response } from 'express'
import { 
  healthCheck, 
  getAPOD, 
  getMarsRoverPhotos, 
  getRoverManifest, 
  getMostActiveRoverEndpoint, 
  getLatestRoverPhotos,
  getPerseveranceWeatherData
} from '../nasa.controller'

// Mock the helper functions
vi.mock('../../helpers/nasa-api.helper', () => ({
  fetchAPODData: vi.fn(),
  fetchMarsRoverPhotos: vi.fn(),
  fetchRoverManifest: vi.fn(),
  getMostActiveRover: vi.fn(),
  fetchPerseveranceWeatherData: vi.fn()
}))

// Mock the NASA config
vi.mock('../../config/nasa.config', () => ({
  default: {
    rovers: ['curiosity', 'opportunity', 'spirit', 'perseverance']
  }
}))

describe('NASA Controllers', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockJson: ReturnType<typeof vi.fn>
  let mockStatus: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockJson = vi.fn()
    mockStatus = vi.fn().mockReturnValue({ json: mockJson })
    
    mockReq = {
      query: {},
      params: {}
    }
    
    mockRes = {
      json: mockJson,
      status: mockStatus
    }
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('healthCheck', () => {
    it('should return health check information', () => {
      healthCheck(mockReq as Request, mockRes as Response)

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Bounce Mission Control Backend API',
          version: '1.0.0',
          status: 'operational',
          timestamp: expect.any(String),
          nasa_api_key: expect.any(String),
          available_rovers: expect.any(Array),
          available_endpoints: expect.any(Array)
        })
      )
    })
  })

  describe('getAPOD', () => {
    it('should fetch APOD data without date parameter', async () => {
      const mockAPODData = {
        copyright: 'Test Copyright',
        date: '2024-01-01',
        explanation: 'Test explanation',
        hdurl: 'https://example.com/hd.jpg',
        media_type: 'image',
        service_version: 'v1',
        title: 'Test APOD',
        url: 'https://example.com/test.jpg'
      }

      const { fetchAPODData } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchAPODData).mockResolvedValue(mockAPODData)

      await getAPOD(mockReq as Request, mockRes as Response)

      expect(fetchAPODData).toHaveBeenCalledWith(undefined)
      expect(mockJson).toHaveBeenCalledWith(mockAPODData)
    })

    it('should fetch APOD data with valid date parameter', async () => {
      mockReq.query = { date: '2024-01-01' }
      
      const mockAPODData = {
        copyright: 'Test Copyright',
        date: '2024-01-01',
        explanation: 'Test explanation',
        hdurl: 'https://example.com/hd.jpg',
        media_type: 'image',
        service_version: 'v1',
        title: 'Test APOD',
        url: 'https://example.com/test.jpg'
      }

      const { fetchAPODData } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchAPODData).mockResolvedValue(mockAPODData)

      await getAPOD(mockReq as Request, mockRes as Response)

      expect(fetchAPODData).toHaveBeenCalledWith('2024-01-01')
      expect(mockJson).toHaveBeenCalledWith(mockAPODData)
    })

    it('should return 400 for invalid date format', async () => {
      mockReq.query = { date: 'invalid-date' }

      await getAPOD(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid date format. Please use YYYY-MM-DD format.',
          timestamp: expect.any(String)
        })
      )
    })

    it('should return 400 for invalid date values', async () => {
      mockReq.query = { date: '2024-13-01' } // Invalid month

      await getAPOD(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid date format. Please use YYYY-MM-DD format.',
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('getMarsRoverPhotos', () => {
    it('should fetch Mars rover photos with valid parameters', async () => {
      mockReq.query = { sol: '1000' }
      mockReq.params = { rover: 'curiosity' }

      const mockRoverData = {
        photos: [
          {
            id: 1,
            sol: 1000,
            camera: {
              id: 1,
              name: 'FHAZ',
              rover_id: 5,
              full_name: 'Front Hazard Avoidance Camera'
            },
            img_src: 'https://example.com/photo1.jpg',
            earth_date: '2024-01-01',
            rover: {
              id: 5,
              name: 'Curiosity',
              landing_date: '2012-08-06',
              launch_date: '2011-11-26',
              status: 'active'
            }
          }
        ]
      }

      const { fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchMarsRoverPhotos).mockResolvedValue(mockRoverData)

      await getMarsRoverPhotos(mockReq as Request, mockRes as Response)

      expect(fetchMarsRoverPhotos).toHaveBeenCalledWith('curiosity', '1000')
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          photos: mockRoverData.photos,
          total_photos: 1,
          rover: mockRoverData.photos[0].rover,
          sol: '1000'
        })
      )
    })

    it('should use default rover when no rover specified', async () => {
      mockReq.query = { sol: '1000' }

      const mockRoverData = { photos: [] }
      const { fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchMarsRoverPhotos).mockResolvedValue(mockRoverData)

      await getMarsRoverPhotos(mockReq as Request, mockRes as Response)

      expect(fetchMarsRoverPhotos).toHaveBeenCalledWith('curiosity', '1000')
    })

    it('should return 400 for invalid rover', async () => {
      mockReq.params = { rover: 'invalid-rover' }

      await getMarsRoverPhotos(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Invalid rover'),
          timestamp: expect.any(String)
        })
      )
    })

    it('should return 400 for invalid sol value', async () => {
      mockReq.query = { sol: '-1' }

      await getMarsRoverPhotos(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid sol value. Sol must be a non-negative integer.',
          timestamp: expect.any(String)
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      mockReq.params = { rover: 'curiosity' }
      
      const { fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchMarsRoverPhotos).mockRejectedValue(new Error('API Error'))

      await getMarsRoverPhotos(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Error fetching Mars rover photos'),
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('getRoverManifest', () => {
    it('should fetch rover manifest successfully', async () => {
      mockReq.params = { rover: 'curiosity' }

      const mockManifest = {
        photo_manifest: {
          name: 'Curiosity',
          landing_date: '2012-08-06',
          launch_date: '2011-11-26',
          status: 'active',
          max_sol: 4000,
          max_date: '2024-01-01',
          total_photos: 1000,
          photos: []
        }
      }

      const { fetchRoverManifest } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchRoverManifest).mockResolvedValue(mockManifest)

      await getRoverManifest(mockReq as Request, mockRes as Response)

      expect(fetchRoverManifest).toHaveBeenCalledWith('curiosity')
      expect(mockJson).toHaveBeenCalledWith(mockManifest)
    })

    it('should return 400 for invalid rover', async () => {
      mockReq.params = { rover: 'invalid-rover' }

      await getRoverManifest(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Invalid rover'),
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('getMostActiveRoverEndpoint', () => {
    it('should return the most active rover', async () => {
      const { getMostActiveRover } = await import('../../helpers/nasa-api.helper')
      vi.mocked(getMostActiveRover).mockResolvedValue('perseverance')

      await getMostActiveRoverEndpoint(mockReq as Request, mockRes as Response)

      expect(getMostActiveRover).toHaveBeenCalled()
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          most_active_rover: 'perseverance',
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('getLatestRoverPhotos', () => {
    it('should fetch latest photos from most active rover', async () => {
      mockReq.query = { sol: '1000' }

      const { getMostActiveRover, fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(getMostActiveRover).mockResolvedValue('perseverance')
      
      const mockRoverData = {
        photos: [
          {
            id: 1,
            sol: 1000,
            camera: { id: 1, name: 'FHAZ', rover_id: 5, full_name: 'Front Hazard Avoidance Camera' },
            img_src: 'https://example.com/photo1.jpg',
            earth_date: '2024-01-01',
            rover: {
              id: 5,
              name: 'Perseverance',
              landing_date: '2021-02-18',
              launch_date: '2020-07-30',
              status: 'active'
            }
          }
        ]
      }

      vi.mocked(fetchMarsRoverPhotos).mockResolvedValue(mockRoverData)

      await getLatestRoverPhotos(mockReq as Request, mockRes as Response)

      expect(getMostActiveRover).toHaveBeenCalled()
      expect(fetchMarsRoverPhotos).toHaveBeenCalledWith('perseverance', '1000')
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          photos: mockRoverData.photos,
          total_photos: 1,
          rover: mockRoverData.photos[0].rover,
          sol: '1000',
          selected_rover: 'perseverance'
        })
      )
    })

    it('should return 400 for invalid sol value', async () => {
      mockReq.query = { sol: 'invalid' }

      await getLatestRoverPhotos(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid sol value. Sol must be a non-negative integer.',
          timestamp: expect.any(String)
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      const { getMostActiveRover, fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(getMostActiveRover).mockResolvedValue('curiosity')
      vi.mocked(fetchMarsRoverPhotos).mockRejectedValue(new Error('API Error'))

      await getLatestRoverPhotos(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Error fetching latest rover photos'),
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('getPerseveranceWeatherData', () => {
    it('should fetch weather data successfully', async () => {
      const mockWeatherData = {
        latest_sol: 1000,
        sol_data: {
          sol: 1000,
          terrestrial_date: '2024-01-01',
          temperature: {
            air: {
              average: -50,
              minimum: -80,
              maximum: -20,
              count: 24
            },
            ground: {
              average: -30,
              minimum: -60,
              maximum: 0,
              count: 24
            }
          },
          pressure: {
            average: 700,
            minimum: 650,
            maximum: 750,
            count: 24
          },
          wind: {
            speed: {
              average: 5,
              minimum: 0,
              maximum: 15,
              count: 24
            },
            direction: {
              compass_point: 'N',
              degrees: 0
            }
          },
          humidity: {
            average: 0.1,
            minimum: 0,
            maximum: 0.5,
            count: 24
          },
          season: 'winter',
          sunrise: '06:00',
          sunset: '18:00',
          local_uv_irradiance_index: 'Low',
          atmosphere_opacity: 'Clear'
        },
        location: {
          name: 'Jezero Crater',
          coordinates: {
            latitude: 18.4447,
            longitude: 77.4508
          }
        },
        timestamp: '2024-01-01T12:00:00Z'
      }

      const { fetchPerseveranceWeatherData } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchPerseveranceWeatherData).mockResolvedValue(mockWeatherData)

      await getPerseveranceWeatherData(mockReq as Request, mockRes as Response)

      expect(fetchPerseveranceWeatherData).toHaveBeenCalled()
      expect(mockJson).toHaveBeenCalledWith(mockWeatherData)
    })

    it('should handle API errors gracefully', async () => {
      const { fetchPerseveranceWeatherData } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchPerseveranceWeatherData).mockRejectedValue(new Error('API Error'))

      await getPerseveranceWeatherData(mockReq as Request, mockRes as Response)

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Error fetching Perseverance weather data'),
          timestamp: expect.any(String)
        })
      )
    })
  })
}) 