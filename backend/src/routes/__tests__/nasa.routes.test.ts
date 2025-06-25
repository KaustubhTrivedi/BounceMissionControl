import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../../test/utils'

// Mock the helper functions
vi.mock('../../helpers/nasa-api.helper', () => ({
  fetchAPODData: vi.fn(),
  fetchMarsRoverPhotos: vi.fn(),
  fetchRoverManifest: vi.fn(),
  getMostActiveRover: vi.fn(),
  fetchPerseveranceWeatherData: vi.fn()
}))

describe('NASA Routes', () => {
  let app: any

  beforeEach(() => {
    vi.clearAllMocks()
    app = createTestServer()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/', () => {
    it('should return health check information', async () => {
      const response = await request(app)
        .get('/api/')
        .expect(200)

      expect(response.body).toMatchObject({
        message: 'Bounce Mission Control Backend API',
        version: '1.0.0',
        status: 'operational',
        timestamp: expect.any(String),
        nasa_api_key: expect.any(String),
        available_rovers: expect.any(Array),
        available_endpoints: expect.any(Array)
      })
    })
  })

  describe('GET /api/apod', () => {
    it('should return APOD data without date parameter', async () => {
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

      const response = await request(app)
        .get('/api/apod')
        .expect(200)

      expect(response.body).toEqual(mockAPODData)
      expect(fetchAPODData).toHaveBeenCalledWith(undefined)
    })

    it('should return APOD data with valid date parameter', async () => {
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

      const response = await request(app)
        .get('/api/apod?date=2024-01-01')
        .expect(200)

      expect(response.body).toEqual(mockAPODData)
      expect(fetchAPODData).toHaveBeenCalledWith('2024-01-01')
    })

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/apod?date=invalid-date')
        .expect(400)

      expect(response.body).toMatchObject({
        error: 'Invalid date format. Please use YYYY-MM-DD format.',
        timestamp: expect.any(String)
      })
    })
  })

  describe('GET /api/mars-photos', () => {
    it('should return Mars rover photos with valid parameters', async () => {
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

      const response = await request(app)
        .get('/api/mars-photos?sol=1000')
        .expect(200)

      expect(response.body).toMatchObject({
        photos: mockRoverData.photos,
        total_photos: 1,
        rover: mockRoverData.photos[0].rover,
        sol: '1000'
      })
      expect(fetchMarsRoverPhotos).toHaveBeenCalledWith('curiosity', '1000')
    })

    it('should return 400 for invalid sol value', async () => {
      const response = await request(app)
        .get('/api/mars-photos?sol=-1')
        .expect(400)

      expect(response.body).toMatchObject({
        error: 'Invalid sol value. Sol must be a non-negative integer.',
        timestamp: expect.any(String)
      })
    })

    it('should handle API errors gracefully', async () => {
      const { fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchMarsRoverPhotos).mockRejectedValue(new Error('API Error'))

      const response = await request(app)
        .get('/api/mars-photos')
        .expect(500)

      expect(response.body).toMatchObject({
        error: expect.stringContaining('Failed to fetch Mars rover photos'),
        timestamp: expect.any(String)
      })
    })
  })

  describe('GET /api/mars-photos/:rover', () => {
    it('should return photos for specific rover', async () => {
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
              name: 'Perseverance',
              landing_date: '2021-02-18',
              launch_date: '2020-07-30',
              status: 'active'
            }
          }
        ]
      }

      const { fetchMarsRoverPhotos } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchMarsRoverPhotos).mockResolvedValue(mockRoverData)

      const response = await request(app)
        .get('/api/mars-photos/perseverance?sol=1000')
        .expect(200)

      expect(response.body).toMatchObject({
        photos: mockRoverData.photos,
        total_photos: 1,
        rover: mockRoverData.photos[0].rover,
        sol: '1000'
      })
      expect(fetchMarsRoverPhotos).toHaveBeenCalledWith('perseverance', '1000')
    })

    it('should return 400 for invalid rover', async () => {
      const response = await request(app)
        .get('/api/mars-photos/invalid-rover')
        .expect(400)

      expect(response.body).toMatchObject({
        error: expect.stringContaining('Invalid rover'),
        timestamp: expect.any(String)
      })
    })
  })

  describe('GET /api/rover-manifest/:rover', () => {
    it('should return rover manifest for valid rover', async () => {
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

      const response = await request(app)
        .get('/api/rover-manifest/curiosity')
        .expect(200)

      expect(response.body).toEqual(mockManifest)
      expect(fetchRoverManifest).toHaveBeenCalledWith('curiosity')
    })

    it('should return 400 for invalid rover', async () => {
      const response = await request(app)
        .get('/api/rover-manifest/invalid-rover')
        .expect(400)

      expect(response.body).toMatchObject({
        error: expect.stringContaining('Invalid rover'),
        timestamp: expect.any(String)
      })
    })
  })

  describe('GET /api/most-active-rover', () => {
    it('should return the most active rover', async () => {
      const { getMostActiveRover } = await import('../../helpers/nasa-api.helper')
      vi.mocked(getMostActiveRover).mockResolvedValue('perseverance')

      const response = await request(app)
        .get('/api/most-active-rover')
        .expect(200)

      expect(response.body).toMatchObject({
        most_active_rover: 'perseverance',
        timestamp: expect.any(String)
      })
      expect(getMostActiveRover).toHaveBeenCalled()
    })
  })

  describe('GET /api/latest-rover-photos', () => {
    it('should return latest photos from most active rover', async () => {
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

      const response = await request(app)
        .get('/api/latest-rover-photos?sol=1000')
        .expect(200)

      expect(response.body).toMatchObject({
        photos: mockRoverData.photos,
        total_photos: 1,
        rover: mockRoverData.photos[0].rover,
        sol: '1000',
        selected_rover: 'perseverance'
      })
      expect(getMostActiveRover).toHaveBeenCalled()
      expect(fetchMarsRoverPhotos).toHaveBeenCalledWith('perseverance', '1000')
    })

    it('should return 400 for invalid sol value', async () => {
      const response = await request(app)
        .get('/api/latest-rover-photos?sol=invalid')
        .expect(400)

      expect(response.body).toMatchObject({
        error: 'Invalid sol value. Sol must be a non-negative integer.',
        timestamp: expect.any(String)
      })
    })
  })

  describe('GET /api/perseverance-weather', () => {
    it('should return Perseverance weather data', async () => {
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

      const response = await request(app)
        .get('/api/perseverance-weather')
        .expect(200)

      expect(response.body).toEqual(mockWeatherData)
      expect(fetchPerseveranceWeatherData).toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      const { fetchPerseveranceWeatherData } = await import('../../helpers/nasa-api.helper')
      vi.mocked(fetchPerseveranceWeatherData).mockRejectedValue(new Error('API Error'))

      const response = await request(app)
        .get('/api/perseverance-weather')
        .expect(500)

      expect(response.body).toMatchObject({
        error: expect.stringContaining('Failed to fetch Perseverance weather data'),
        timestamp: expect.any(String)
      })
    })
  })

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404)

      expect(response.body).toMatchObject({
        error: 'Route not found',
        timestamp: expect.any(String)
      })
    })
  })
}) 