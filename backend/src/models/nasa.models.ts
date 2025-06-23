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

// Historic Mars Weather Data
export interface TemperatureDataPoint {
  sol: number
  earth_date: string
  min_temp: number | null
  max_temp: number | null
  avg_temp: number | null
  temp_range: number | null
  season: string
  sample_count: number
}

export interface PressureDataPoint {
  sol: number
  earth_date: string
  pressure: number | null
  pressure_min: number | null
  pressure_max: number | null
  season: string
  sample_count: number
}

export interface WindDataPoint {
  sol: number
  earth_date: string
  season: string
  wind_speed?: number | null
  wind_speed_min?: number | null
  wind_speed_max?: number | null
  wind_speed_samples?: number
  wind_direction?: string | null
  wind_direction_degrees?: number | null
  wind_direction_samples?: number
}

export interface AtmosphericCondition {
  sol: number
  earth_date: string
  season: string
  has_temperature: boolean
  has_pressure: boolean
  has_wind_speed: boolean
  has_wind_direction: boolean
  data_quality: number
}

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
  temperature_data: TemperatureDataPoint[]
  pressure_data: PressureDataPoint[]
  wind_data: WindDataPoint[]
  atmospheric_conditions: AtmosphericCondition[]
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
    photos: {
      sol: number
      earth_date: string
      total_photos: number
      cameras: string[]
    }[]
  }
}

export interface InSightSolData {
  AT: { av: number; mn: number; mx: number; ct: number }
  PRE: { av: number; mn: number; mx: number; ct: number }
  HWS: { av: number; mn: number; mx: number; ct: number }
  WD: {
    most_common: { compass_point: string; compass_degrees: number; ct: number }
  }
  First_UTC: string
  Last_UTC: string
  Season: string
}

export interface InSightWeatherData {
  sol_keys: string[]
  [key: string]: unknown
}

export interface TechPortProject {
  id: string; // or number
  title: string;
  description: string;
  status: string;
  category?: string;
  trl?: number;
  technologyAreas?: { name: string; code: string }[];
}

export interface TechPortResponse {
    projects: TechPortProject[];
}

export interface MSLWeatherData {
  sol: number;
  terrestrial_date: string;
  min_temp: number;
  max_temp: number;
  pressure: number;
  wind_speed: number;
  wind_direction_compass: string;
  season: string;
  sunrise: string;
  sunset: string;
  atmo_opacity: string;
}

export interface MAASWeatherData {
  sol: number;
  terrestrial_date: string;
  min_gts_temp: number;
  max_gts_temp: number;
  pressure: number;
  wind_speed: number;
  wind_direction: string;
  season: string;
  sunrise: string;
  sunset: string;
  local_uv_irradiance_index: string;
  atmo_opacity: string;
  abs_humidity?: number;
} 