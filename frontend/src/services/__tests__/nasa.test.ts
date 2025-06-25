import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nasaApi, formatDateForNASA, normalizeDate, getRoverDisplayName } from '../nasa'
import * as apiModule from '../api'

// Mock the API module
vi.mock('../api', () => ({
  api: {
    get: vi.fn(),
  },
}))

const mockApi = vi.mocked(apiModule.api)

describe('NASA Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('nasaApi.getAPOD', () => {
    it('fetches APOD without date parameter', async () => {
      const mockData = {
        title: 'Cosmic Beauty',
        explanation: 'A beautiful view of the cosmos.',
        url: 'https://example.com/image.jpg',
        media_type: 'image' as const,
        date: '2024-01-01',
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getAPOD()

      expect(mockApi.get).toHaveBeenCalledWith('/api/apod', undefined)
      expect(result).toEqual(mockData)
    })

    it('fetches APOD with date parameter', async () => {
      const mockData = {
        title: 'Cosmic Beauty',
        explanation: 'A beautiful view of the cosmos.',
        url: 'https://example.com/image.jpg',
        media_type: 'image' as const,
        date: '2024-01-01',
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getAPOD('2024-01-01')

      expect(mockApi.get).toHaveBeenCalledWith('/api/apod', { date: '2024-01-01' })
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getMarsRoverPhotos', () => {
    it('fetches Mars rover photos without parameters', async () => {
      const mockData = {
        photos: [],
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getMarsRoverPhotos()

      expect(mockApi.get).toHaveBeenCalledWith('/api/mars-photos', {})
      expect(result).toEqual(mockData)
    })

    it('fetches Mars rover photos with parameters', async () => {
      const mockData = {
        photos: [],
      }

      mockApi.get.mockResolvedValue(mockData)

      const params = {
        rover: 'curiosity',
        sol: 1000,
        camera: 'FHAZ',
        page: 1,
      }

      const result = await nasaApi.getMarsRoverPhotos(params)

      expect(mockApi.get).toHaveBeenCalledWith('/api/mars-photos', params)
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getMarsRoverPhotosByRover', () => {
    it('fetches Mars rover photos for specific rover', async () => {
      const mockData = {
        photos: [],
      }

      mockApi.get.mockResolvedValue(mockData)

      const params = {
        sol: 1000,
        camera: 'FHAZ',
        page: 1,
      }

      const result = await nasaApi.getMarsRoverPhotosByRover('curiosity', params)

      expect(mockApi.get).toHaveBeenCalledWith('/api/mars-photos/curiosity', params)
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getRoverManifest', () => {
    it('fetches rover manifest', async () => {
      const mockData = {
        photo_manifest: {
          name: 'Curiosity',
          landing_date: '2012-08-06',
          launch_date: '2011-11-26',
          status: 'active',
          max_sol: 1000,
          max_date: '2024-01-01',
          total_photos: 1000000,
          photos: [],
        },
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getRoverManifest('curiosity')

      expect(mockApi.get).toHaveBeenCalledWith('/api/rover-manifest/curiosity')
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getMostActiveRover', () => {
    it('fetches most active rover', async () => {
      const mockData = {
        most_active_rover: 'curiosity',
        timestamp: '2024-01-01T12:00:00Z',
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getMostActiveRover()

      expect(mockApi.get).toHaveBeenCalledWith('/api/most-active-rover')
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getLatestRoverPhotos', () => {
    it('fetches latest rover photos without parameters', async () => {
      const mockData = {
        photos: [],
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getLatestRoverPhotos()

      expect(mockApi.get).toHaveBeenCalledWith('/api/latest-rover-photos', {})
      expect(result).toEqual(mockData)
    })

    it('fetches latest rover photos with parameters', async () => {
      const mockData = {
        photos: [],
      }

      mockApi.get.mockResolvedValue(mockData)

      const params = {
        sol: 1000,
        camera: 'FHAZ',
        page: 1,
      }

      const result = await nasaApi.getLatestRoverPhotos(params)

      expect(mockApi.get).toHaveBeenCalledWith('/api/latest-rover-photos', params)
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getPerseveranceWeather', () => {
    it('fetches Perseverance weather data', async () => {
      const mockData = {
        latest_sol: 1000,
        sol_data: {
          sol: 1000,
          terrestrial_date: '2024-01-01',
          temperature: {},
          season: 'winter',
        },
        location: {
          name: 'Jezero Crater',
          coordinates: {
            latitude: 18.4447,
            longitude: 77.4508,
          },
        },
        timestamp: '2024-01-01T12:00:00Z',
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getPerseveranceWeather()

      expect(mockApi.get).toHaveBeenCalledWith('/api/perseverance-weather')
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getMultiPlanetaryDashboard', () => {
    it('fetches multi-planetary dashboard data', async () => {
      const mockData = {
        planets: [],
        total_active_missions: 10,
        timestamp: '2024-01-01T12:00:00Z',
        last_updated: '2024-01-01T12:00:00Z',
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getMultiPlanetaryDashboard()

      expect(mockApi.get).toHaveBeenCalledWith('/api/multi-planetary-dashboard')
      expect(result).toEqual(mockData)
    })
  })

  describe('nasaApi.getHistoricMarsWeather', () => {
    it('fetches historic Mars weather data', async () => {
      const mockData = {
        data: {
          mission_info: {
            name: 'InSight',
            location: 'Elysium Planitia',
            coordinates: {
              latitude: 4.5,
              longitude: 135.6,
            },
            mission_duration: '2 years',
            earth_dates: {
              start: '2018-11-26',
              end: '2022-12-21',
            },
            status: 'completed',
            total_sols: 1440,
          },
          temperature_data: [],
          pressure_data: [],
          wind_data: [],
          atmospheric_conditions: [],
        },
        timestamp: '2024-01-01T12:00:00Z',
      }

      mockApi.get.mockResolvedValue(mockData)

      const result = await nasaApi.getHistoricMarsWeather()

      expect(mockApi.get).toHaveBeenCalledWith('/api/mars-weather')
      expect(result).toEqual(mockData)
    })
  })

  describe('formatDateForNASA', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const result = formatDateForNASA(date)
      expect(result).toBe('2024-01-15')
    })

    it('handles single digit month and day', () => {
      const date = new Date('2024-03-05')
      const result = formatDateForNASA(date)
      expect(result).toBe('2024-03-05')
    })
  })

  describe('normalizeDate', () => {
    it('normalizes date to midnight', () => {
      const date = new Date('2024-01-15T14:30:45.123Z')
      const result = normalizeDate(date)
      
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
    })

    it('preserves the date part', () => {
      const date = new Date('2024-01-15T14:30:45.123Z')
      const result = normalizeDate(date)
      
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(15)
    })
  })

  describe('getRoverDisplayName', () => {
    it('returns correct display name for known rovers', () => {
      expect(getRoverDisplayName('curiosity')).toBe('Curiosity')
      expect(getRoverDisplayName('opportunity')).toBe('Opportunity')
      expect(getRoverDisplayName('spirit')).toBe('Spirit')
      expect(getRoverDisplayName('perseverance')).toBe('Perseverance')
    })

    it('handles case insensitive input', () => {
      expect(getRoverDisplayName('CURIOSITY')).toBe('Curiosity')
      expect(getRoverDisplayName('Curiosity')).toBe('Curiosity')
    })

    it('returns original input for unknown rovers', () => {
      expect(getRoverDisplayName('unknown-rover')).toBe('unknown-rover')
    })
  })
}) 