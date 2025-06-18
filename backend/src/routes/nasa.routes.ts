import { Router } from 'express'
import { healthCheck, getAPOD, getMarsRoverPhotos } from '../controllers/nasa.controller'
import { asyncHandler } from '../utils/async-handler'

const router = Router()

// Health check endpoint
router.get('/', healthCheck)

// APOD (Astronomy Picture of the Day) endpoint
router.get('/api/apod', asyncHandler(getAPOD))

// Mars Rover Photos endpoint
router.get('/api/mars-photos', asyncHandler(getMarsRoverPhotos))

export default router 