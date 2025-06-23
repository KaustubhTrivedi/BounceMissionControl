import { Request, Response } from 'express'
import { 
  fetchAPODData, 
  fetchMarsRoverPhotos, 
  fetchRoverManifest, 
  getMostActiveRover,
  fetchPerseveranceWeatherData,
  fetchHistoricMarsWeatherData,
  getMultiPlanetaryDashboard
} from '../helpers/nasa-api.helper'
import { isValidDate, isValidSol, isNonEmptyString } from '../utils/validators'
import { MarsRoverAPIResponse } from '../models/nasa.models'
import { asyncHandler } from '../utils/async-handler'

const nasaConfig = require('../config/nasa.config')

// Health check controller
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    message: 'Bounce Mission Control Backend API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    nasa_api_key: process.env.NASA_API_KEY === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Configured',
    available_rovers: nasaConfig.rovers,
    available_endpoints: [
      'GET /',
      'GET /api/apod?date=YYYY-MM-DD',
      'GET /api/mars-photos?sol=NUMBER',
      'GET /api/mars-photos/:rover?sol=NUMBER',
      'GET /api/rover-manifest/:rover',
      'GET /api/most-active-rover',
      'GET /api/latest-rover-photos?sol=NUMBER',
      'GET /api/perseverance-weather',
      'GET /api/multi-planetary-dashboard'
    ]
  })
}

// APOD controller
export const getAPOD = async (req: Request, res: Response) => {
  const { date } = req.query

  // Validate date parameter if provided
  if (date && isNonEmptyString(date)) {
    if (!isValidDate(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Please use YYYY-MM-DD format.',
        timestamp: new Date().toISOString()
      })
    }
  }

  const apodData = await fetchAPODData(date as string)
  res.json(apodData)
}

// Mars Rover Photos controller with dynamic rover support
export const getMarsRoverPhotos = async (req: Request, res: Response) => {
  const { sol } = req.query
  const { rover } = req.params

  // Validate rover parameter
  if (rover && !nasaConfig.rovers.includes(rover.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid rover. Available rovers: ${nasaConfig.rovers.join(', ')}`,
      timestamp: new Date().toISOString()
    })
  }

  // Validate sol parameter if provided
  if (sol && isNonEmptyString(sol)) {
    if (!isValidSol(sol)) {
      return res.status(400).json({
        error: 'Invalid sol value. Sol must be a non-negative integer.',
        timestamp: new Date().toISOString()
      })
    }
  }

  const selectedRover = rover || 'curiosity'
  
  try {
    const roverData = await fetchMarsRoverPhotos(selectedRover, sol as string)
    
    // Ensure photos array exists and is valid
    const photos = roverData?.photos || []
    
    // Format response with metadata
    const response: MarsRoverAPIResponse = {
      photos: photos,
      total_photos: photos.length,
      rover: photos[0]?.rover || null,
      sol: (typeof sol === 'string') ? sol : 'latest'
    }

    res.json(response)
  } catch (error) {
    console.error(`Error fetching Mars rover photos for ${selectedRover}:`, error)
    res.status(500).json({
      error: `Failed to fetch Mars rover photos for ${selectedRover}. The rover may be inactive or data temporarily unavailable.`,
      timestamp: new Date().toISOString()
    })
  }
}

// Get rover manifest (mission info and latest sol)
export const getRoverManifest = async (req: Request, res: Response) => {
  const { rover } = req.params

  // Validate rover parameter
  if (!rover || !nasaConfig.rovers.includes(rover.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid rover. Available rovers: ${nasaConfig.rovers.join(', ')}`,
      timestamp: new Date().toISOString()
    })
  }

  const manifest = await fetchRoverManifest(rover.toLowerCase())
  res.json(manifest)
}

// Get the most active rover
export const getMostActiveRoverEndpoint = async (req: Request, res: Response) => {
  const mostActiveRover = await getMostActiveRover()
  res.json({
    most_active_rover: mostActiveRover,
    timestamp: new Date().toISOString()
  })
}

// Get photos from the most active rover
export const getLatestRoverPhotos = async (req: Request, res: Response) => {
  const { sol } = req.query
  
  // Validate sol parameter if provided
  if (sol && isNonEmptyString(sol)) {
    if (!isValidSol(sol)) {
      return res.status(400).json({
        error: 'Invalid sol value. Sol must be a non-negative integer.',
        timestamp: new Date().toISOString()
      })
    }
  }

  try {
    const mostActiveRover = await getMostActiveRover()
    const roverData = await fetchMarsRoverPhotos(mostActiveRover, sol as string)
    
    // Ensure photos array exists and is valid
    const photos = roverData?.photos || []
    
    // Format response with metadata
    const response: MarsRoverAPIResponse = {
      photos: photos,
      total_photos: photos.length,
      rover: photos[0]?.rover || null,
      sol: (typeof sol === 'string') ? sol : 'latest',
      selected_rover: mostActiveRover
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching latest rover photos:', error)
    res.status(500).json({
      error: 'Failed to fetch latest rover photos. Data may be temporarily unavailable.',
      timestamp: new Date().toISOString()
    })
  }
}

// Get Perseverance MEDA weather data
export const getPerseveranceWeatherData = async (req: Request, res: Response) => {
  try {
    const weatherData = await fetchPerseveranceWeatherData()
    res.json(weatherData)
  } catch (error) {
    console.error('Error fetching Perseverance weather data:', error)
    res.status(500).json({
      error: 'Failed to fetch Perseverance weather data. Data may be temporarily unavailable.',
      timestamp: new Date().toISOString()
    })
  }
}

// Get Mars weather data (alias for Perseverance weather)
export const getMarsWeather = async (req: Request, res: Response) => {
  try {
    const weatherData = await fetchPerseveranceWeatherData()
    res.json(weatherData)
  } catch (error) {
    console.error('Error fetching Mars weather data:', error)
    res.status(500).json({
      error: 'Failed to fetch Mars weather data. Data may be temporarily unavailable.',
      timestamp: new Date().toISOString()
    })
  }
}

// Get multi-planetary dashboard data
export const getMultiPlanetaryDashboardData = async (req: Request, res: Response) => {
  try {
    const dashboardData = await getMultiPlanetaryDashboard()
    res.json(dashboardData)
  } catch (error) {
    console.error('Error fetching multi-planetary dashboard data:', error)
    res.status(500).json({
      error: 'Failed to fetch multi-planetary dashboard data',
      timestamp: new Date().toISOString()
    })
  }
}

// Get historic Mars weather data for visualization
export const getHistoricMarsWeather = asyncHandler(async (req: Request, res: Response) => {
  const historicData = await fetchHistoricMarsWeatherData()
  
  res.status(200).json({
    success: true,
    data: historicData,
    message: 'Historic Mars weather data retrieved successfully'
  })
}) 