import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import axios from 'axios'
import { ErrorResponse } from '../models/nasa.models'

// Global error handling middleware
export const errorHandler: ErrorRequestHandler = (
  error: unknown, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('Global error handler:', error)
  
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500
    const message = error.response?.data?.msg || 
                   error.response?.data?.errors || 
                   'Failed to fetch data from NASA API'
    
    const errorResponse: ErrorResponse = {
      error: message,
      details: 'Unable to retrieve data from NASA API',
      timestamp: new Date().toISOString()
    }
    
    res.status(status).json(errorResponse)
    return
  }

  // Handle generic errors
  const errorResponse: ErrorResponse = {
    error: 'Internal server error',
    details: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  }
  
  res.status(500).json(errorResponse)
}

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  })
} 