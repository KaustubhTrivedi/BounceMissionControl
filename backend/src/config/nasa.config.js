module.exports = {
  apiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  baseUrl: 'https://api.nasa.gov',
  endpoints: {
    apod: '/planetary/apod',
    marsRover: '/mars-photos/api/v1/rovers/curiosity'
  },
  timeout: 10000, // 10 seconds
  retries: 3
} 