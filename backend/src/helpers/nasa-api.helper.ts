import axios from 'axios'
import { APODResponse, MarsRoverResponse } from '../models/nasa.models'

const nasaConfig = require('../config/nasa.config')

// Create axios instance with NASA API configuration
const nasaApiClient = axios.create({
  baseURL: nasaConfig.baseUrl,
  timeout: nasaConfig.timeout,
  params: {
    api_key: nasaConfig.apiKey
  }
})

// Fetch APOD data
export const fetchAPODData = async (date?: string): Promise<APODResponse> => {
  const params: any = {}
  if (date) {
    params.date = date
  }

  const response = await nasaApiClient.get<APODResponse>(
    nasaConfig.endpoints.apod,
    { params }
  )
  
  return response.data
}

// Fetch Mars Rover photos
export const fetchMarsRoverPhotos = async (sol?: string): Promise<MarsRoverResponse> => {
  let endpoint = `${nasaConfig.endpoints.marsRover}/photos`
  const params: any = {}

  if (sol) {
    params.sol = sol
  } else {
    // Use latest photos endpoint if no sol specified
    endpoint = `${nasaConfig.endpoints.marsRover}/latest_photos`
  }

  const response = await nasaApiClient.get<MarsRoverResponse>(endpoint, { params })
  return response.data
}

// Check NASA API health
export const checkNASAApiHealth = async (): Promise<boolean> => {
  try {
    await nasaApiClient.get(nasaConfig.endpoints.apod, {
      timeout: 5000,
      params: { date: '2024-01-01' } // Use a specific date for health check
    })
    return true
  } catch (error) {
    console.error('NASA API health check failed:', error)
    return false
  }
} 