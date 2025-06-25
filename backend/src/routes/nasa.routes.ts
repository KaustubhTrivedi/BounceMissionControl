import { Router } from 'express'
import { 
  healthCheck, 
  getAPOD, 
  getMarsRoverPhotos, 
  getRoverManifest, 
  getMostActiveRoverEndpoint, 
  getLatestRoverPhotos,
  getPerseveranceWeatherData,
  getMultiPlanetaryDashboardData,
  getHistoricMarsWeather,
  getSimulatedMarsWeather,
  getTechPortProjects,
  getTechPortProject,
  getTechPortCategoriesEndpoint,
  getTechPortAnalyticsEndpoint
} from '../controllers/nasa.controller'
import { asyncHandler } from '../utils/async-handler'

const router = Router()

// Health check endpoint
router.get('/', healthCheck)

// APOD (Astronomy Picture of the Day) endpoint
router.get('/apod', asyncHandler(getAPOD))

// Mars Rover Photos endpoints
router.get('/mars-photos', asyncHandler(getMarsRoverPhotos)) // Default rover (curiosity)
router.get('/mars-photos/:rover', asyncHandler(getMarsRoverPhotos)) // Specific rover

// Rover manifest endpoints
router.get('/rover-manifest/:rover', asyncHandler(getRoverManifest))

// Most active rover endpoints
router.get('/most-active-rover', asyncHandler(getMostActiveRoverEndpoint))
router.get('/latest-rover-photos', asyncHandler(getLatestRoverPhotos)) // Photos from most active rover

// Perseverance MEDA weather route
router.get('/perseverance-weather', asyncHandler(getPerseveranceWeatherData))

// Mars weather endpoint
router.get('/mars-weather', getHistoricMarsWeather)

// Simulated Mars weather endpoint
router.get('/mars-weather/simulated', getSimulatedMarsWeather)

// Multi-planetary dashboard endpoint
router.get('/multi-planetary-dashboard', asyncHandler(getMultiPlanetaryDashboardData))

// TechPort API endpoints
router.get('/techport/projects', asyncHandler(getTechPortProjects))
router.get('/techport/projects/:projectId', asyncHandler(getTechPortProject))
router.get('/techport/categories', asyncHandler(getTechPortCategoriesEndpoint))
router.get('/techport/analytics', asyncHandler(getTechPortAnalyticsEndpoint))

export default router 