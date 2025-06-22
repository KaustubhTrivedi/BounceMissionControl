module.exports = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  cors: {
    origin: [
      'http://localhost:5173',          // Vite dev server
      'http://localhost:3000',          // Alternative dev server
      'https://localhost:5173',         // HTTPS dev server
      process.env.FRONTEND_URL,         // Environment variable
      /\.netlify\.app$/,                // All Netlify apps
      /netlify\.app$/,                  // Alternative Netlify pattern
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  },
  requestLimits: {
    json: '10mb',
    urlencoded: '10mb'
  }
} 