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

// Fetch Mars Rover photos with dynamic rover support
export const fetchMarsRoverPhotos = async (
  rover: string = 'curiosity', 
  sol?: string
): Promise<MarsRoverResponse> => {
  let endpoint = `${nasaConfig.endpoints.marsRover}/${rover}/photos`
  const params: any = {}

  if (sol) {
    params.sol = sol
  } else {
    // Use latest photos endpoint if no sol specified
    endpoint = `${nasaConfig.endpoints.marsRover}/${rover}/latest_photos`
  }

  const response = await nasaApiClient.get<MarsRoverResponse>(endpoint, { params })
  return response.data
}

// Fetch rover manifest (contains mission info and latest sol)
export const fetchRoverManifest = async (rover: string): Promise<any> => {
  const endpoint = `${nasaConfig.endpoints.marsRoverManifest}/${rover}`
  const response = await nasaApiClient.get(endpoint)
  return response.data
}

// Get the most recently active rover
export const getMostActiveRover = async (): Promise<string> => {
  try {
    const manifests = await Promise.allSettled(
      nasaConfig.rovers.map(async (rover: string) => {
        const manifest = await fetchRoverManifest(rover)
        return {
          rover,
          maxSol: manifest.photo_manifest.max_sol,
          maxDate: manifest.photo_manifest.max_date,
          status: manifest.photo_manifest.status
        }
      })
    )

    // Filter successful responses and active rovers
    const activeRovers = manifests
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(rover => rover.status === 'active')

    if (activeRovers.length === 0) {
      return 'curiosity' // Fallback to curiosity
    }

    // Return the rover with the most recent activity
    const mostActive = activeRovers.reduce((prev, current) => 
      new Date(current.maxDate) > new Date(prev.maxDate) ? current : prev
    )

    return mostActive.rover
  } catch (error) {
    console.error('Error finding most active rover:', error)
    return 'curiosity' // Fallback
  }
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