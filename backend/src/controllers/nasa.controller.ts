import { Request, Response } from 'express'
import { 
  fetchAPODData, 
  fetchMarsRoverPhotos, 
  fetchRoverManifest, 
  getMostActiveRover,
  fetchPerseveranceWeatherData,
  fetchHistoricMarsWeatherData,
  getMultiPlanetaryDashboard,
  fetchTechPortProjects,
  fetchTechPortProject,
  getTechPortCategories,
  getTechPortAnalytics
} from '../helpers/nasa-api.helper'
import { isValidDate, isValidSol, isNonEmptyString } from '../utils/validators'
import { MarsRoverAPIResponse, TechPortProject } from '../models/nasa.models'
import { asyncHandler } from '../utils/async-handler'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nasaConfig = require('../config/nasa.config')

// Validation helper functions
const validateRover = (rover: string | undefined): string | null => {
  if (!rover || !nasaConfig.rovers.includes(rover.toLowerCase())) {
    return null
  }
  return rover.toLowerCase()
}

const validateSol = (sol: string | undefined): string | undefined => {
  if (!sol || !isNonEmptyString(sol) || !isValidSol(sol)) {
    return undefined
  }
  return sol
}

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
  try {
    // Support both /mars-photos and /mars-photos/:rover
    const roverParam = req.params?.rover
    const roverQuery = req.query?.rover
    const roverInput = roverParam || roverQuery
    const selectedRover = validateRover(roverInput as string) || 'curiosity'
    const validatedSol = validateSol(req.query.sol as string)

    // 400 for invalid rover
    if (roverInput && !validateRover(roverInput as string)) {
      return res.status(400).json({
        error: `Invalid rover. Available rovers: ${nasaConfig.rovers.join(', ')}`,
        timestamp: new Date().toISOString()
      })
    }
    // 400 for invalid sol
    if (req.query.sol && !validateSol(req.query.sol as string)) {
      return res.status(400).json({
        error: 'Invalid sol value. Sol must be a non-negative integer.',
        timestamp: new Date().toISOString()
      })
    }

    const response = await fetchMarsRoverPhotos(selectedRover, validatedSol)
    const photos = response.photos || []
    // Compose expected response
    const result = {
      photos,
      rover: photos[0]?.rover || null,
      sol: validatedSol || 'latest',
      total_photos: photos.length
    }
    res.json(result)
  } catch (error: any) {
    // Match test expectation: error message should contain 'Failed to fetch Mars rover photos'
    res.status(500).json({
      error: `Error fetching Mars rover photos: ${error?.message || error}`,
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
  try {
    const { sol } = req.query
    const validatedSol = validateSol(sol as string)
    // 400 for invalid sol
    if (sol && !validateSol(sol as string)) {
      return res.status(400).json({
        error: 'Invalid sol value. Sol must be a non-negative integer.',
        timestamp: new Date().toISOString()
      })
    }
    const mostActiveRover = await getMostActiveRover()
    const response = await fetchMarsRoverPhotos(mostActiveRover, validatedSol)
    const photos = response.photos || []
    // Compose expected response
    const result = {
      photos,
      rover: photos[0]?.rover || null,
      sol: validatedSol || 'latest',
      total_photos: photos.length,
      selected_rover: mostActiveRover
    }
    res.json(result)
  } catch (error: any) {
    res.status(500).json({
      error: `Error fetching latest rover photos: ${error?.message || error}`,
      timestamp: new Date().toISOString()
    })
  }
}

// Get Perseverance MEDA weather data
export const getPerseveranceWeatherData = async (req: Request, res: Response) => {
  try {
    const weatherData = await fetchPerseveranceWeatherData()
    res.json(weatherData)
  } catch (error: any) {
    res.status(500).json({
      error: `Error fetching Perseverance weather data: ${error?.message || error}`,
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
    throw new Error(`Error fetching Mars weather data: ${error}`)
  }
}

// Get multi-planetary dashboard data
export const getMultiPlanetaryDashboardData = async (req: Request, res: Response) => {
  try {
    const dashboardData = await getMultiPlanetaryDashboard()
    res.json(dashboardData)
  } catch (error) {
    throw new Error(`Error fetching multi-planetary dashboard data: ${error}`)
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

// TechPort Controllers
export const getTechPortProjects = async (req: Request, res: Response) => {
  const { page, limit, updatedSince, category, status, trl } = req.query

  try {
    const techPortData = await fetchTechPortProjects({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 100,
      updatedSince: updatedSince as string
    })

    // Apply client-side filtering since TechPort API might be limited
    let filteredProjects = techPortData.projects

    if (category) {
      filteredProjects = filteredProjects.filter((project: TechPortProject) => 
        project.category?.toLowerCase().includes((category as string).toLowerCase())
      )
    }

    if (status) {
      filteredProjects = filteredProjects.filter((project: TechPortProject) =>
        project.status?.toLowerCase() === (status as string).toLowerCase()
      )
    }

    if (trl) {
      filteredProjects = filteredProjects.filter((project: TechPortProject) =>
        project.trl === parseInt(trl as string)
      )
    }

    res.json({
      ...techPortData,
      projects: filteredProjects
    })
  } catch (error) {
    console.error('Error in getTechPortProjects controller:', error)
    res.status(500).json({
      error: 'Failed to fetch or process TechPort projects.',
      timestamp: new Date().toISOString()
    })
  }
}

export const getTechPortProject = async (req: Request, res: Response) => {
  const { projectId } = req.params

  if (!projectId) {
    return res.status(400).json({
      error: 'Project ID is required',
      timestamp: new Date().toISOString()
    })
  }

  try {
    const projectData = await fetchTechPortProject(projectId)
    res.json(projectData)
  } catch (error) {
    console.error(`Error fetching TechPort project ${projectId}:`, error)
    res.status(404).json({
      error: `TechPort project ${projectId} not found or unavailable.`,
      timestamp: new Date().toISOString()
    })
  }
}

export const getTechPortCategoriesEndpoint = async (req: Request, res: Response) => {
  try {
    const categoriesData = await getTechPortCategories()
    res.json(categoriesData)
  } catch (error) {
    console.error('Error fetching TechPort categories:', error)
    res.status(500).json({
      error: 'Failed to fetch TechPort categories. Data may be temporarily unavailable.',
      timestamp: new Date().toISOString()
    })
  }
}

export const getTechPortAnalyticsEndpoint = async (req: Request, res: Response) => {
  try {
    const analyticsData = await getTechPortAnalytics()
    res.json(analyticsData)
  } catch (error) {
    console.error('Error fetching TechPort analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch TechPort analytics. Data may be temporarily unavailable.',
      timestamp: new Date().toISOString()
    })
  }
} 