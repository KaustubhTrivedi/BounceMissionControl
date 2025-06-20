import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { configureRoutes } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'

// Load environment variables
dotenv.config()

// Import configurations
const appConfig = require('./config/app.config')

// Create Express application
const app = express()

// Configure CORS
app.use(cors(appConfig.cors))

// Configure JSON parsing
app.use(express.json({ limit: appConfig.requestLimits.json }))
app.use(express.urlencoded({ 
  extended: true, 
  limit: appConfig.requestLimits.urlencoded 
}))

// Configure routes
configureRoutes(app)

// Error handling middleware (must be last)
app.use(errorHandler)
app.use(notFoundHandler)

// Start server
app.listen(appConfig.port, () => {
  console.log(`🚀 Bounce Mission Control Backend listening on port ${appConfig.port}`)
  console.log(`Environment: ${appConfig.environment}`)
  console.log(`NASA API Key: ${process.env.NASA_API_KEY === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Configured'}`)
  
  if (appConfig.environment === 'development') {
    console.log(`Available endpoints:`)
    console.log(`  GET http://localhost:${appConfig.port}/`)
    console.log(`  GET http://localhost:${appConfig.port}/api/apod?date=YYYY-MM-DD`)
    console.log(`  GET http://localhost:${appConfig.port}/api/mars-photos?sol=NUMBER`)
  }
})

export default app
