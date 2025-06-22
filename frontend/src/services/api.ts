/**
 * API Service
 * Centralized service for making HTTP requests to the backend
 */

import { apiConfig, buildApiUrl } from '@/config/api'

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

// API Response type
export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

// HTTP request options
interface RequestOptions extends RequestInit {
  timeout?: number
}

// Generic request function
async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = apiConfig.timeout,
    headers = {},
    ...fetchOptions
  } = options

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...apiConfig.headers,
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
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'Request timeout',
        408,
        'Request Timeout',
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
  get: <T = any>(url: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> => {
    const finalUrl = params ? buildApiUrl(url, params) : url
    return request<T>(finalUrl, { ...options, method: 'GET' })
  },

  post: <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  put: <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  patch: <T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  delete: <T = any>(url: string, options?: RequestOptions): Promise<T> => {
    return request<T>(url, { ...options, method: 'DELETE' })
  },
}

// Export for backward compatibility
export default api 