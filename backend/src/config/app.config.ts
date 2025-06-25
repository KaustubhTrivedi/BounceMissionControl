import dotenv from 'dotenv'

dotenv.config()

interface AppConfig {
  port: number;
  environment: string;
  cors: {
    origin: (string | RegExp)[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    optionsSuccessStatus: number;
  };
  requestLimits: {
    json: string;
    urlencoded: string;
  };
  nasaApiKey: string;
  frontendUrl: string;
  allowedOrigins: (string | RegExp)[];
  corsOptions: {
    origin: boolean;
    credentials: boolean;
    optionsSuccessStatus: number;
  };
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  nasaApiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedOrigins: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
    'https://bouncemissioncontrolfe.kaustubhsstuff.com',
    /\.netlify\.app$/,
    /netlify\.app$/,
    /\.kaustubhsstuff\.com$/,
  ].filter(Boolean) as (string | RegExp)[],
  corsOptions: {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
  },
  cors: {
    origin: [
      process.env.FRONTEND_URL,         // Environment variable
      'http://localhost:5173',          // Vite dev server
      'http://localhost:3000',          // Alternative dev server
      'https://localhost:5173',         // HTTPS dev server
      'https://bouncemissioncontrolfe.kaustubhsstuff.com', // Production frontend domain
      /\.netlify\.app$/,                // All Netlify apps
      /netlify\.app$/,                  // Alternative Netlify pattern
      /\.kaustubhsstuff\.com$/,         // Allow all subdomains of kaustubhsstuff.com
    ].filter(Boolean) as (string | RegExp)[], // Remove any undefined values
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

export default appConfig 