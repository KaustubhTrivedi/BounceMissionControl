/**
 * API Service
 * Centralized service for making HTTP requests to the backend
 */

import { getApiUrl } from '@/config/api'

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ApiResponse interface removed - not used in the current implementation

// HTTP request options
interface RequestOptions extends RequestInit {
  timeout?: number
}

// Default configuration
const defaultConfig = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Helper function to build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, unknown>): string {
  // Handle absolute URLs
  const fullUrl = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint)
  
  if (!params) return fullUrl
  
  const url = new URL(fullUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })
  
  return url.toString()
}

// Generic request function
async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = defaultConfig.timeout,
    headers = {},
    ...fetchOptions
  } = options

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...defaultConfig.headers,
        ...headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new ApiError(
        `Request failed: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText,
        url
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof ApiError) {
      throw error
    }
    
    if ((error instanceof DOMException && error.name === 'AbortError') || (typeof error === 'object' && error !== null && 'name' in error && (error as { name?: string }).name === 'AbortError')) {
      throw new ApiError(
        'Request timeout',
        408,
        'Request Timeout',
        url
      )
    }
    
    if (typeof error === 'object' && error !== null && 'status' in error && 'statusText' in error) {
      throw new ApiError(
        error instanceof Error ? error.message : 'Request failed',
        (error as { status: number }).status,
        (error as { statusText: string }).statusText,
        url
      )
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0,
      'Unknown Error',
      url
    )
  }
}

// HTTP methods
export const api = {
  get: <T = unknown>(endpoint: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, params)
    return request<T>(url, { ...options, method: 'GET' })
  },

  post: <T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  put: <T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  patch: <T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  delete: <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'DELETE' })
  },
}

// Export for backward compatibility
export default api 