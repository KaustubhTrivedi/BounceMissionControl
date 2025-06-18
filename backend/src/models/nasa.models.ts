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
}

// Error Response Interface
export interface ErrorResponse {
  error: string
  details?: string
  timestamp?: string
} 