/**
 * NASA API Service
 * Service functions for NASA API endpoints
 */

import { api } from './api'
import { endpoints } from '@/config/api'

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
}

// NASA API Service Functions
export const nasaApi = {
  // Get Astronomy Picture of the Day
  getAPOD: async (date?: string): Promise<APODData> => {
    const params = date ? { date } : undefined
    return api.get<APODData>(endpoints.apod, params)
  },

  // Get Mars Rover photos
  getMarsRoverPhotos: async (params: {
    rover?: string
    sol?: number
    camera?: string
    page?: number
  } = {}): Promise<MarsRoverResponse> => {
    return api.get<MarsRoverResponse>(endpoints.marsPhotos, params)
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

// Constants
export const APOD_START_DATE = new Date('1995-06-16')
export const TODAY = normalizeDate(new Date()) 