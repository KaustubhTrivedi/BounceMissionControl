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
  getHistoricMarsWeather
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

// Multi-planetary dashboard endpoint
router.get('/multi-planetary-dashboard', asyncHandler(getMultiPlanetaryDashboardData))

export default router 