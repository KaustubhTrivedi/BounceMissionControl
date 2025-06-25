/**
 * NASA API React Query Hooks
 * Custom hooks for fetching NASA data using React Query
 */

import { useQuery } from '@tanstack/react-query'
import { nasaApi, type RoverName } from '@/services/nasa'

// Query Keys
const QUERY_KEYS = {
  apod: 'apod',
  marsRoverPhotos: 'marsRoverPhotos',
  marsRoverPhotosByRover: 'marsRoverPhotosByRover',
  latestMarsRoverPhotos: 'latestMarsRoverPhotos',
  roverManifest: 'roverManifest',
  mostActiveRover: 'mostActiveRover',
  perseveranceWeather: 'perseveranceWeather',
  marsWeather: 'marsWeather',
  multiPlanetaryDashboard: 'multiPlanetaryDashboard',
  historicMarsWeather: 'historicMarsWeather',
} as const

// APOD Hook
export const useAPOD = (date?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.apod, date],
    queryFn: () => nasaApi.getAPOD(date),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  })
}

// Mars Rover Photos Hook
export const useMarsRoverPhotos = (
  params: {
    rover?: string
    sol?: number
    camera?: string
    page?: number
  } = {},
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.marsRoverPhotos, params],
    queryFn: () => nasaApi.getMarsRoverPhotos(params),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60 * 2,
    ...options,
  })
}

// Mars Rover Photos by Specific Rover Hook
export const useMarsRoverPhotosByRover = (rover: RoverName, params: {
  sol?: number
  camera?: string
  page?: number
} = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.marsRoverPhotosByRover, rover, params],
    queryFn: () => nasaApi.getMarsRoverPhotosByRover(rover, params),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60 * 2,
  })
}

// Latest Mars Rover Photos Hook
export const useLatestMarsRoverPhotos = (params: {
  sol?: number
  camera?: string
  page?: number
} = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.latestMarsRoverPhotos, params],
    queryFn: () => nasaApi.getLatestRoverPhotos(params),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60 * 2,
  })
}

// Rover Manifest Hook
export const useRoverManifest = (rover: RoverName) => {
  return useQuery({
    queryKey: [QUERY_KEYS.roverManifest, rover],
    queryFn: () => nasaApi.getRoverManifest(rover),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  })
}

// Most Active Rover Hook
export const useMostActiveRover = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.mostActiveRover],
    queryFn: () => nasaApi.getMostActiveRover(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 12,
  })
}

// Combined Hook: Get Most Active Rover + Its Latest Photos
export const useMostActiveRoverWithPhotos = (params: {
  sol?: number
  camera?: string
  page?: number
} = {}) => {
  const { data: mostActiveRover, ...roverQuery } = useMostActiveRover()
  const { data: photos, ...photosQuery } = useLatestMarsRoverPhotos(params)

  return {
    data: { rover: mostActiveRover, photos },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...roverQuery,
    ...photosQuery,
  }
}

// Hook to get Perseverance MEDA weather data
export const usePerseveranceWeather = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.perseveranceWeather],
    queryFn: () => nasaApi.getPerseveranceWeather(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
  })
}

// Hook to get the latest sol weather data from Perseverance
export const useLatestPerseveranceWeather = () => {
  const { data: weatherData, ...rest } = usePerseveranceWeather()
  
  const latestSolData = weatherData?.sol_data

  return {
    data: latestSolData,
    latestSol: weatherData?.latest_sol,
    location: weatherData?.location,
    timestamp: weatherData?.timestamp,
    ...rest
  }
}

// Hook to get multi-planetary dashboard data
export const useMultiPlanetaryDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.multiPlanetaryDashboard],
    queryFn: () => nasaApi.getMultiPlanetaryDashboard(),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60 * 2,
  })
}

// Hook to get historic Mars weather data
export const useHistoricMarsWeather = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.historicMarsWeather],
    queryFn: () => nasaApi.getHistoricMarsWeather(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  })
}

// Export available rovers for components
export const AVAILABLE_ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'] as const 