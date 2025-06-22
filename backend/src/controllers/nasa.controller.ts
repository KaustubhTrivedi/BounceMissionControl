import { Request, Response } from 'express'
import { 
  fetchAPODData, 
  fetchMarsRoverPhotos, 
  fetchRoverManifest, 
  getMostActiveRover 
} from '../helpers/nasa-api.helper'
import { isValidDate, isValidSol, isNonEmptyString } from '../utils/validators'
import { MarsRoverAPIResponse } from '../models/nasa.models'

const nasaConfig = require('../config/nasa.config')

// Health check controller
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    message: 'Bounce Mission Control Backend API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    nasa_api_key: process.env.NASA_API_KEY === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Configured',
    available_rovers: nasaConfig.rovers
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
  const roverData = await fetchMarsRoverPhotos(selectedRover, sol as string)
  
  // Format response with metadata
  const response: MarsRoverAPIResponse = {
    photos: roverData.photos,
    total_photos: roverData.photos.length,
    rover: roverData.photos[0]?.rover || null,
    sol: (typeof sol === 'string') ? sol : 'latest'
  }

  res.json(response)
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

  const mostActiveRover = await getMostActiveRover()
  const roverData = await fetchMarsRoverPhotos(mostActiveRover, sol as string)
  
  // Format response with metadata
  const response: MarsRoverAPIResponse = {
    photos: roverData.photos,
    total_photos: roverData.photos.length,
    rover: roverData.photos[0]?.rover || null,
    sol: (typeof sol === 'string') ? sol : 'latest',
    selected_rover: mostActiveRover
  }

  res.json(response)
} 