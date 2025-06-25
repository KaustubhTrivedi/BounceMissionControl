/**
 * NASA API Service
 * Service functions for NASA API endpoints
 */

import { api } from './api'

// APOD (Astronomy Picture of the Day) Types
export interface APODData {
  title: string
  explanation: string
  url: string
  media_type: 'image' | 'video'
  date: string
  hdurl?: string
  copyright?: string
  service_version?: string
}

// Mars Rover Types
export interface MarsRoverPhoto {
  id: number
  sol: number
  camera: {
    id: number
    name: string
    rover_id: number
    full_name: string
  }
  img_src: string
  earth_date: string
  rover: {
    id: number
    name: string
    landing_date: string
    launch_date: string
    status: string
  }
}

export interface MarsRoverResponse {
  photos: MarsRoverPhoto[]
  total_photos?: number
  rover?: MarsRoverPhoto['rover']
  sol?: string | number
  selected_rover?: string
}

export interface RoverManifest {
  photo_manifest: {
    name: string
    landing_date: string
    launch_date: string
    status: string
    max_sol: number
    max_date: string
    total_photos: number
    photos: Array<{
      sol: number
      earth_date: string
      total_photos: number
      cameras: string[]
    }>
  }
}

export interface MostActiveRoverResponse {
  most_active_rover: string
  timestamp: string
}

// Perseverance MEDA Weather Data Types
export interface PerseveranceWeatherSensor {
  average?: number | null
  minimum?: number | null
  maximum?: number | null
  count?: number | null
}

export interface PerseveranceWindData {
  speed?: PerseveranceWeatherSensor
  direction?: {
    compass_point?: string
    degrees?: number
  }
}

export interface PerseveranceSolWeatherData {
  sol: number
  terrestrial_date: string
  temperature: {
    air?: PerseveranceWeatherSensor
    ground?: PerseveranceWeatherSensor
  }
  pressure?: PerseveranceWeatherSensor
  wind?: PerseveranceWindData
  humidity?: PerseveranceWeatherSensor
  season?: string
  sunrise?: string
  sunset?: string
  local_uv_irradiance_index?: string
  atmosphere_opacity?: string
}

export interface PerseveranceWeatherResponse {
  latest_sol: number
  sol_data: PerseveranceSolWeatherData
  location: {
    name: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  timestamp: string
}

// Multi-Planetary Dashboard Types
export interface PlanetMission {
  name: string
  status: 'active' | 'planned' | 'completed' | 'en-route'
  launch_date?: string
  arrival_date?: string
  mission_type: 'orbiter' | 'rover' | 'lander' | 'flyby' | 'sample-return'
  description: string
}

export interface PlanetConditions {
  temperature: {
    average: number
    min: number
    max: number
    unit: string
  }
  atmosphere?: {
    composition: string
    pressure?: number
    pressure_unit?: string
  }
  gravity: number // in Earth gravities
  day_length: string
  radiation_level?: 'low' | 'moderate' | 'high' | 'extreme'
}

export interface PlanetData {
  id: string
  name: string
  type: 'planet' | 'moon' | 'asteroid' | 'dwarf-planet'
  active_missions: PlanetMission[]
  mission_count: number
  surface_conditions: PlanetConditions
  last_activity: {
    date: string
    description: string
    days_ago: number
  }
  next_event?: {
    date: string
    description: string
    days_until: number
  }
  notable_fact: string
  data_freshness: {
    last_updated: string
    hours_ago: number
  }
  image_url?: string
}

export interface MultiPlanetDashboardResponse {
  planets: PlanetData[]
  total_active_missions: number
  timestamp: string
  last_updated: string
}

// Historic Mars Weather Types
export interface HistoricWeatherData {
  mission_info: {
    name: string
    location: string
    coordinates: { latitude: number; longitude: number }
    mission_duration: string
    earth_dates: { start: string; end: string }
    status: string
    total_sols: number
  }
  temperature_data: Array<{
    sol: number
    earth_date: string
    min_temp: number | null
    max_temp: number | null
    avg_temp: number | null
    temp_range: number | null
    season: string
    sample_count: number
  }>
  pressure_data: Array<{
    sol: number
    earth_date: string
    pressure: number | null
    pressure_min: number | null
    pressure_max: number | null
    season: string
    sample_count: number
  }>
  wind_data: Array<{
    sol: number
    earth_date: string
    wind_speed?: number | null
    wind_speed_min?: number | null
    wind_speed_max?: number | null
    wind_direction?: string | null
    wind_direction_degrees?: number | null
    season: string
  }>
  atmospheric_conditions: Array<{
    sol: number
    earth_date: string
    season: string
    has_temperature: boolean
    has_pressure: boolean
    has_wind_speed: boolean
    has_wind_direction: boolean
    data_quality: number
  }>
}

export interface HistoricMarsWeatherResponse {
  data: HistoricWeatherData
  timestamp: string
}

// Available rovers
export const AVAILABLE_ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'] as const
export type RoverName = typeof AVAILABLE_ROVERS[number]

// API endpoints
const endpoints = {
  apod: '/api/apod',
  marsPhotos: '/api/mars-photos',
  marsPhotosRover: (rover: string) => `/api/mars-photos/${rover}`,
  roverManifest: (rover: string) => `/api/rover-manifest/${rover}`,
  mostActiveRover: '/api/most-active-rover',
  latestRoverPhotos: '/api/latest-rover-photos',
  perseveranceWeather: '/api/perseverance-weather',
  marsWeather: '/api/mars-weather',
  multiPlanetaryDashboard: '/api/multi-planetary-dashboard',
}

// NASA API Service Functions
export const nasaApi = {
  // Get Astronomy Picture of the Day
  getAPOD: async (date?: string): Promise<APODData> => {
    const params = date ? { date } : undefined
    return api.get<APODData>(endpoints.apod, params)
  },

  // Get Mars Rover photos (default rover)
  getMarsRoverPhotos: async (params: {
    rover?: string
    sol?: number
    camera?: string
    page?: number
  } = {}): Promise<MarsRoverResponse> => {
    return api.get<MarsRoverResponse>(endpoints.marsPhotos, params)
  },

  // Get Mars Rover photos from specific rover
  getMarsRoverPhotosByRover: async (
    rover: RoverName,
    params: {
      sol?: number
      camera?: string
      page?: number
    } = {}
  ): Promise<MarsRoverResponse> => {
    return api.get<MarsRoverResponse>(endpoints.marsPhotosRover(rover), params)
  },

  // Get rover manifest (mission info and available sols)
  getRoverManifest: async (rover: RoverName): Promise<RoverManifest> => {
    return api.get<RoverManifest>(endpoints.roverManifest(rover))
  },

  // Get the most active rover
  getMostActiveRover: async (): Promise<MostActiveRoverResponse> => {
    return api.get<MostActiveRoverResponse>(endpoints.mostActiveRover)
  },

  // Get photos from the most active rover
  getLatestRoverPhotos: async (params: {
    sol?: number
    camera?: string
    page?: number
  } = {}): Promise<MarsRoverResponse> => {
    return api.get<MarsRoverResponse>(endpoints.latestRoverPhotos, params)
  },

  // Get Perseverance MEDA weather data
  getPerseveranceWeather: async (): Promise<PerseveranceWeatherResponse> => {
    return api.get<PerseveranceWeatherResponse>(endpoints.perseveranceWeather)
  },

  // Get multi-planetary dashboard data
  getMultiPlanetaryDashboard: async (): Promise<MultiPlanetDashboardResponse> => {
    return api.get<MultiPlanetDashboardResponse>(endpoints.multiPlanetaryDashboard)
  },

  // Get historic Mars weather data (InSight legacy data)
  getHistoricMarsWeather: async (): Promise<HistoricMarsWeatherResponse> => {
    return api.get<HistoricMarsWeatherResponse>(endpoints.marsWeather)
  },
}

// Helper function to format date for NASA API (YYYY-MM-DD)
export const formatDateForNASA = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper function to normalize date to midnight
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

// Helper function to get rover display name
export const getRoverDisplayName = (rover: string): string => {
  const names: Record<string, string> = {
    curiosity: 'Curiosity',
    opportunity: 'Opportunity',
    spirit: 'Spirit',
    perseverance: 'Perseverance'
  }
  return names[rover.toLowerCase()] || rover
}

// Constants
export const APOD_START_DATE = new Date('1995-06-16')
export const TODAY = normalizeDate(new Date()) 