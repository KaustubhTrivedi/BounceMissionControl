import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { configureRoutes } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import appConfig from './config/app.config'

// Load environment variables
dotenv.config()

// Import configurations
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
  // Server started successfully
})

export default app
