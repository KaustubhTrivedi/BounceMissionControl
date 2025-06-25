import { config } from 'dotenv'
import path from 'path'

// Load environment variables for testing
config({ path: path.resolve(__dirname, '../../.env.test') })

// Set test environment
process.env.NODE_ENV = 'test' 