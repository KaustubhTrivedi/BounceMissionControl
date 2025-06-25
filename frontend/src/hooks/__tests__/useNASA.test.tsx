import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAPOD, useMarsRoverPhotos, useLatestMarsRoverPhotos } from '../useNASA'
import * as nasaApi from '@/services/nasa'

// Mock the NASA API
vi.mock('@/services/nasa', () => ({
  nasaApi: {
    getAPOD: vi.fn(),
    getMarsRoverPhotos: vi.fn(),
    getLatestRoverPhotos: vi.fn(),
  },
  formatDateForNASA: vi.fn((date: Date) => date.toISOString().split('T')[0]),
}))

const mockAPODData = {
  title: 'Cosmic Beauty',
  explanation: 'A beautiful view of the cosmos.',
  url: 'https://example.com/image.jpg',
  media_type: 'image' as const,
  date: '2024-01-01',
}

const mockMarsRoverData = {
  photos: [
    {
      id: 1,
      sol: 1000,
      camera: {
        id: 20,
        name: 'FHAZ',
        rover_id: 5,
        full_name: 'Front Hazard Avoidance Camera',
      },
      img_src: 'https://example.com/rover1.jpg',
      earth_date: '2024-01-01',
      rover: {
        id: 5,
        name: 'Curiosity',
        landing_date: '2012-08-06',
        launch_date: '2011-11-26',
        status: 'active',
      },
    },
  ],
}

// Wrapper component for testing hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useNASA Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAPOD', () => {
    it('fetches APOD data successfully', async () => {
      const mockGetAPOD = vi.mocked(nasaApi.nasaApi.getAPOD)
      mockGetAPOD.mockResolvedValue(mockAPODData)

      const { result } = renderHook(() => useAPOD(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAPODData)
      expect(mockGetAPOD).toHaveBeenCalledWith(undefined)
    })

    it('fetches APOD data for specific date', async () => {
      const mockGetAPOD = vi.mocked(nasaApi.nasaApi.getAPOD)
      mockGetAPOD.mockResolvedValue(mockAPODData)

      const testDate = new Date('2024-01-01')
      const { result } = renderHook(() => useAPOD(testDate), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAPODData)
      expect(mockGetAPOD).toHaveBeenCalledWith('2024-01-01')
    })

    it('handles APOD fetch error', async () => {
      const mockGetAPOD = vi.mocked(nasaApi.nasaApi.getAPOD)
      const error = new Error('API Error')
      mockGetAPOD.mockRejectedValue(error)

      const { result } = renderHook(() => useAPOD(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
    })
  })

  describe('useMarsRoverPhotos', () => {
    it('fetches Mars rover photos successfully', async () => {
      const mockGetMarsRoverPhotos = vi.mocked(nasaApi.nasaApi.getMarsRoverPhotos)
      mockGetMarsRoverPhotos.mockResolvedValue(mockMarsRoverData)

      const { result } = renderHook(() => useMarsRoverPhotos(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockMarsRoverData)
      expect(mockGetMarsRoverPhotos).toHaveBeenCalledWith({})
    })

    it('fetches Mars rover photos with parameters', async () => {
      const mockGetMarsRoverPhotos = vi.mocked(nasaApi.nasaApi.getMarsRoverPhotos)
      mockGetMarsRoverPhotos.mockResolvedValue(mockMarsRoverData)

      const params = { rover: 'curiosity', sol: 1000, camera: 'FHAZ' }
      const { result } = renderHook(() => useMarsRoverPhotos(params), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockMarsRoverData)
      expect(mockGetMarsRoverPhotos).toHaveBeenCalledWith(params)
    })

    it('handles Mars rover photos fetch error', async () => {
      const mockGetMarsRoverPhotos = vi.mocked(nasaApi.nasaApi.getMarsRoverPhotos)
      const error = new Error('API Error')
      mockGetMarsRoverPhotos.mockRejectedValue(error)

      const { result } = renderHook(() => useMarsRoverPhotos(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
    })

    it('can be disabled', () => {
      const mockGetMarsRoverPhotos = vi.mocked(nasaApi.nasaApi.getMarsRoverPhotos)

      const { result } = renderHook(() => useMarsRoverPhotos({}, { enabled: false }), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(mockGetMarsRoverPhotos).not.toHaveBeenCalled()
    })
  })

  describe('useLatestMarsRoverPhotos', () => {
    it('fetches latest Mars rover photos successfully', async () => {
      const mockGetLatestRoverPhotos = vi.mocked(nasaApi.nasaApi.getLatestRoverPhotos)
      mockGetLatestRoverPhotos.mockResolvedValue(mockMarsRoverData)

      const { result } = renderHook(() => useLatestMarsRoverPhotos(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockMarsRoverData)
      expect(mockGetLatestRoverPhotos).toHaveBeenCalledWith({})
    })

    it('fetches latest Mars rover photos with parameters', async () => {
      const mockGetLatestRoverPhotos = vi.mocked(nasaApi.nasaApi.getLatestRoverPhotos)
      mockGetLatestRoverPhotos.mockResolvedValue(mockMarsRoverData)

      const params = { sol: 1000, camera: 'FHAZ' }
      const { result } = renderHook(() => useLatestMarsRoverPhotos(params), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockMarsRoverData)
      expect(mockGetLatestRoverPhotos).toHaveBeenCalledWith(params)
    })

    it('handles latest Mars rover photos fetch error', async () => {
      const mockGetLatestRoverPhotos = vi.mocked(nasaApi.nasaApi.getLatestRoverPhotos)
      const error = new Error('API Error')
      mockGetLatestRoverPhotos.mockRejectedValue(error)

      const { result } = renderHook(() => useLatestMarsRoverPhotos(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
    })
  })
}) 