import { Request, Response } from 'express'
import { fetchAPODData, fetchMarsRoverPhotos } from '../helpers/nasa-api.helper'
import { isValidDate, isValidSol, isNonEmptyString } from '../utils/validators'
import { MarsRoverAPIResponse } from '../models/nasa.models'

// Health check controller
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    message: 'Bounce Mission Control Backend API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    nasa_api_key: process.env.NASA_API_KEY === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Configured'
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

// Mars Rover Photos controller
export const getMarsRoverPhotos = async (req: Request, res: Response) => {
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

  const roverData = await fetchMarsRoverPhotos(sol as string)
  
  // Format response with metadata
  const response: MarsRoverAPIResponse = {
    photos: roverData.photos,
    total_photos: roverData.photos.length,
    rover: roverData.photos[0]?.rover || null,
    sol: (typeof sol === 'string') ? sol : 'latest'
  }

  res.json(response)
} 