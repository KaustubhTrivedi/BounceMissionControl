import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api, ApiError } from '../api'
import * as configModule from '@/config/api'

// Mock the config module
vi.mock('@/config/api', () => ({
  getApiUrl: vi.fn(),
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockGetApiUrl = vi.mocked(configModule.getApiUrl)

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockGetApiUrl.mockImplementation((endpoint) => `http://localhost:3000${endpoint}`)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('api.get', () => {
    it('makes successful GET request without parameters', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await api.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('makes successful GET request with parameters', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const params = { key: 'value', number: 123 }
      await api.get('/test', params)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test?key=value&number=123',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })

    it('handles undefined and null parameters', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const params = { key: 'value', undefined: undefined, null: null }
      await api.get('/test', params)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test?key=value',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })

    it('handles absolute URLs', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.get('https://api.example.com/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })
  })

  describe('api.post', () => {
    it('makes successful POST request with data', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const data = { name: 'test' }
      const result = await api.post('/test', data)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('makes successful POST request without data', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.post('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })
  })

  describe('api.put', () => {
    it('makes successful PUT request', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const data = { name: 'test' }
      await api.put('/test', data)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })
  })

  describe('api.patch', () => {
    it('makes successful PATCH request', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const data = { name: 'test' }
      await api.patch('/test', data)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })
  })

  describe('api.delete', () => {
    it('makes successful DELETE request', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.delete('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })
  })

  describe('Error handling', () => {
    it('throws ApiError for HTTP error responses', async () => {
      const errorResponse = new Response(JSON.stringify({}), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
      })
      mockFetch.mockResolvedValueOnce(errorResponse)

      const promise = api.get('/test')
      await expect(promise).rejects.toThrow(ApiError)
      await expect(promise).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
        url: 'http://localhost:3000/test',
      })
    })

    it('throws ApiError for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(api.get('/test')).rejects.toThrow(ApiError)
      await expect(api.get('/test')).rejects.toMatchObject({
        status: 0,
        statusText: 'Unknown Error',
      })
    })

    it('throws ApiError for timeout', async () => {
      // Mock AbortController
      const mockAbort = vi.fn()
      const mockSignal = { aborted: false }
      
      global.AbortController = vi.fn().mockImplementation(() => ({
        signal: mockSignal,
        abort: mockAbort,
      }))

      // Mock setTimeout to immediately trigger abort
      const originalSetTimeout = global.setTimeout
      const mockSetTimeout = vi.fn().mockImplementation((callback: () => void) => {
        callback()
        return 1
      })
      global.setTimeout = mockSetTimeout as any

      // Simulate fetch abort due to timeout
      mockFetch.mockImplementationOnce(() => Promise.reject(Object.assign(new Error('Request timeout'), { name: 'AbortError' })))

      const promise = api.get('/test')
      await expect(promise).rejects.toThrow(ApiError)
      await expect(promise).rejects.toMatchObject({
        status: 408,
        statusText: 'Request Timeout',
      })

      // Restore setTimeout
      global.setTimeout = originalSetTimeout
    })

    it('handles custom timeout', async () => {
      // Mock AbortController
      const mockAbort = vi.fn()
      const mockSignal = { aborted: false }
      
      global.AbortController = vi.fn().mockImplementation(() => ({
        signal: mockSignal,
        abort: mockAbort,
      }))

      // Mock setTimeout to immediately trigger abort
      const originalSetTimeout = global.setTimeout
      const mockSetTimeout = vi.fn().mockImplementation((callback: () => void) => {
        callback()
        return 1
      })
      global.setTimeout = mockSetTimeout as any

      mockFetch.mockRejectedValueOnce(new DOMException('AbortError', 'AbortError'))

      await expect(api.get('/test', undefined, { timeout: 1000 })).rejects.toThrow(ApiError)

      // Restore setTimeout
      global.setTimeout = originalSetTimeout
    })
  })

  describe('Custom headers', () => {
    it('includes custom headers in request', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const customHeaders = { 'Authorization': 'Bearer token' }
      await api.get('/test', undefined, { headers: customHeaders })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token',
          },
        })
      )
    })
  })
}) 