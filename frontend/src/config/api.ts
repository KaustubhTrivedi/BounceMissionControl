/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  return import.meta.env[key] || fallback
}

// Base URLs
export const BACKEND_URL = getEnvVar('VITE_BACKEND_URL', 'http://localhost:3000')
export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', `${BACKEND_URL}/api`)

// API Configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const

// API Endpoints
export const endpoints = {
  apod: `${API_BASE_URL}/apod`,
  marsPhotos: `${API_BASE_URL}/mars-photos`,
  // Add more endpoints as needed
} as const

// Helper function to build URLs with query parameters
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number | undefined>): string => {
  const url = new URL(endpoint)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

// Environment info
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

// Debug helper
if (isDevelopment) {
  console.log('API Configuration:', {
    BACKEND_URL,
    API_BASE_URL,
    endpoints,
  })
} 