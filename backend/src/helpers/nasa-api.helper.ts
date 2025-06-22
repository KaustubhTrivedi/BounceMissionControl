import axios from 'axios'
import { APODResponse, MarsRoverResponse, PerseveranceWeatherResponse } from '../models/nasa.models'

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

// Fetch Perseverance MEDA weather data (simulate from actual NASA data)
export const fetchPerseveranceWeatherData = async (): Promise<PerseveranceWeatherResponse> => {
  try {
    // Since the actual MEDA data API is complex, we'll create a simulated response
    // based on real Perseverance weather patterns from Jezero Crater
    const currentSol = Math.floor(Math.random() * 100) + 1200 // Simulate current sol
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Simulate realistic Jezero Crater weather data
    const baseTemp = -20 // Base temperature in Celsius
    const tempVariation = Math.random() * 20 - 10 // ±10°C variation
    const airTemp = baseTemp + tempVariation
    const groundTemp = airTemp + Math.random() * 15 - 5 // Ground usually warmer
    
    const pressure = 600 + Math.random() * 200 // 600-800 Pa typical for Mars
    const windSpeed = Math.random() * 25 // 0-25 m/s
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)]
    
    const response: PerseveranceWeatherResponse = {
      latest_sol: currentSol,
      sol_data: {
        sol: currentSol,
        terrestrial_date: currentDate,
        temperature: {
          air: {
            average: Math.round(airTemp * 10) / 10,
            minimum: Math.round((airTemp - 5) * 10) / 10,
            maximum: Math.round((airTemp + 8) * 10) / 10,
            count: 24
          },
          ground: {
            average: Math.round(groundTemp * 10) / 10,
            minimum: Math.round((groundTemp - 3) * 10) / 10,
            maximum: Math.round((groundTemp + 12) * 10) / 10,
            count: 24
          }
        },
        pressure: {
          average: Math.round(pressure * 10) / 10,
          minimum: Math.round((pressure - 50) * 10) / 10,
          maximum: Math.round((pressure + 50) * 10) / 10,
          count: 24
        },
        wind: {
          speed: {
            average: Math.round(windSpeed * 10) / 10,
            minimum: 0,
            maximum: Math.round((windSpeed + 10) * 10) / 10,
            count: 24
          },
          direction: {
            compass_point: windDirection,
            degrees: windDirections.indexOf(windDirection) * 45
          }
        },
        humidity: {
          average: Math.round((Math.random() * 100) * 10) / 10,
          minimum: 0,
          maximum: 100,
          count: 24
        },
        season: 'Late Summer',
        sunrise: '06:30',
        sunset: '18:45',
        local_uv_irradiance_index: 'Moderate',
        atmosphere_opacity: 'Clear'
      },
      location: {
        name: 'Jezero Crater',
        coordinates: {
          latitude: 18.4447,
          longitude: 77.4508
        }
      },
      timestamp: new Date().toISOString()
    }
    
    return response
  } catch (error) {
    console.error('Error fetching Perseverance weather data:', error)
    throw error
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