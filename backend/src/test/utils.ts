import request from 'supertest'
import express from 'express'
import { configureRoutes } from '../routes'
import { errorHandler, notFoundHandler } from '../middleware/error-handler'

// Create a test server instance
export const createTestServer = () => {
  const app = express()
  
  // Configure routes
  configureRoutes(app)
  
  // Error handling middleware (must be last)
  app.use(errorHandler)
  app.use(notFoundHandler)
  
  return app
}

// Helper to make authenticated requests (if needed in the future)
export const makeRequest = (app: express.Application) => {
  return request(app)
}

// Mock data helpers
export const mockAPODResponse = {
  copyright: 'Test Copyright',
  date: '2024-01-01',
  explanation: 'Test explanation',
  hdurl: 'https://example.com/hd.jpg',
  media_type: 'image',
  service_version: 'v1',
  title: 'Test APOD',
  url: 'https://example.com/test.jpg'
}

export const mockMarsRoverResponse = {
  photos: [
    {
      id: 1,
      sol: 1000,
      camera: {
        id: 1,
        name: 'FHAZ',
        rover_id: 5,
        full_name: 'Front Hazard Avoidance Camera'
      },
      img_src: 'https://example.com/photo1.jpg',
      earth_date: '2024-01-01',
      rover: {
        id: 5,
        name: 'Curiosity',
        landing_date: '2012-08-06',
        launch_date: '2011-11-26',
        status: 'active'
      }
    }
  ]
}

export const mockRoverManifest = {
  photo_manifest: {
    name: 'Curiosity',
    landing_date: '2012-08-06',
    launch_date: '2011-11-26',
    status: 'active',
    max_sol: 4000,
    max_date: '2024-01-01',
    total_photos: 1000,
    photos: [
      {
        sol: 1000,
        earth_date: '2024-01-01',
        total_photos: 10,
        cameras: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM']
      }
    ]
  }
} 