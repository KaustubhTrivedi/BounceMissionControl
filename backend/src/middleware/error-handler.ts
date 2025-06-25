import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import axios from 'axios'
import { ErrorResponse } from '../models/nasa.models'

// Global error handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  const message = error.message || 'Internal Server Error'
  
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString()
  })
}

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  })
} 