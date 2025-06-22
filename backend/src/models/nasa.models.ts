// APOD (Astronomy Picture of the Day) Response
export interface APODResponse {
  date: string
  explanation: string
  hdurl?: string
  media_type: string
  service_version: string
  title: string
  url: string
  copyright?: string
  thumbnail_url?: string
}

// Mars Rover Camera Interface
export interface MarsRoverCamera {
  id: number
  name: string
  rover_id: number
  full_name: string
}

// Mars Rover Info Interface
export interface MarsRoverInfo {
  id: number
  name: string
  landing_date: string
  launch_date: string
  status: string
}

// Mars Rover Photo Interface
export interface MarsRoverPhoto {
  id: number
  sol: number
  camera: MarsRoverCamera
  img_src: string
  earth_date: string
  rover: MarsRoverInfo
}

// Mars Rover API Response
export interface MarsRoverResponse {
  photos: MarsRoverPhoto[]
}

// Custom API Response for Mars Rover with metadata
export interface MarsRoverAPIResponse {
  photos: MarsRoverPhoto[]
  total_photos: number
  rover: MarsRoverInfo | null
  sol: string | number
  selected_rover?: string
}

// Error Response Interface
export interface ErrorResponse {
  error: string
  details?: string
  timestamp?: string
}

// Perseverance MEDA Weather Data Interfaces
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