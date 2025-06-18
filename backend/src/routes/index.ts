import { Express } from 'express'
import nasaRoutes from './nasa.routes'

// Configure all application routes
export const configureRoutes = (app: Express): void => {
  // Mount NASA routes
  app.use('/', nasaRoutes)
} 