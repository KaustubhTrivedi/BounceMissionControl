module.exports = {
  apiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  baseUrl: 'https://api.nasa.gov',
  endpoints: {
    apod: '/planetary/apod',
    marsRover: '/mars-photos/api/v1/rovers', // Base endpoint for all rovers
    marsRoverManifest: '/mars-photos/api/v1/manifests', // For rover info and latest sol
    perseveranceWeather: 'https://mars.nasa.gov/layout/embed/image/m20weather/' // Perseverance MEDA weather data
  },
  // Available Mars rovers
  rovers: ['curiosity', 'opportunity', 'spirit', 'perseverance'],
  timeout: 10000, // 10 seconds
  retries: 3
} 