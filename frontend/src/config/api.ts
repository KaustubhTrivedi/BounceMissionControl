/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

// API configuration for both development and production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://bouncemissioncontrol.onrender.com' // Updated with actual Render URL
    : 'http://localhost:3000');

export default API_BASE_URL;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

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
  apod: `${API_BASE_URL}/api/apod`,
  marsPhotos: `${API_BASE_URL}/api/mars-photos`,
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
    API_BASE_URL,
    endpoints,
  })
} 