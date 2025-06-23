import { Express } from 'express'
import nasaRoutes from './nasa.routes'

// Configure all application routes
export const configureRoutes = (app: Express): void => {
  // Mount NASA routes under /api prefix
  app.use('/api', nasaRoutes)
} 