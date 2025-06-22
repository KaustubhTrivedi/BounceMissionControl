import { Router } from 'express'
import { 
  healthCheck, 
  getAPOD, 
  getMarsRoverPhotos, 
  getRoverManifest, 
  getMostActiveRoverEndpoint, 
  getLatestRoverPhotos 
} from '../controllers/nasa.controller'
import { asyncHandler } from '../utils/async-handler'

const router = Router()

// Health check endpoint
router.get('/', healthCheck)

// APOD (Astronomy Picture of the Day) endpoint
router.get('/api/apod', asyncHandler(getAPOD))

// Mars Rover Photos endpoints
router.get('/api/mars-photos', asyncHandler(getMarsRoverPhotos)) // Default rover (curiosity)
router.get('/api/mars-photos/:rover', asyncHandler(getMarsRoverPhotos)) // Specific rover

// Rover manifest endpoints
router.get('/api/rover-manifest/:rover', asyncHandler(getRoverManifest))

// Most active rover endpoints
router.get('/api/most-active-rover', asyncHandler(getMostActiveRoverEndpoint))
router.get('/api/latest-rover-photos', asyncHandler(getLatestRoverPhotos)) // Photos from most active rover

export default router 