/**
 * NASA API React Query Hooks
 * Custom hooks for fetching NASA data using React Query
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { 
  nasaApi, 
  formatDateForNASA, 
  type APODData, 
  type MarsRoverResponse, 
  type RoverManifest, 
  type MostActiveRoverResponse,
  type RoverName
} from '@/services/nasa'

// Query Keys
export const nasaQueryKeys = {
  apod: (date?: string) => ['nasa', 'apod', date] as const,
  marsRover: (params: Record<string, any>) => ['nasa', 'mars-rover', params] as const,
  marsRoverByRover: (rover: string, params: Record<string, any>) => ['nasa', 'mars-rover', rover, params] as const,
  marsRoverLatest: (rover?: string) => ['nasa', 'mars-rover', 'latest', rover] as const,
  roverManifest: (rover: string) => ['nasa', 'rover-manifest', rover] as const,
  mostActiveRover: () => ['nasa', 'most-active-rover'] as const,
  latestRoverPhotos: (params: Record<string, any>) => ['nasa', 'latest-rover-photos', params] as const,
}

// APOD Hook
export const useAPOD = (
  date?: Date,
  options?: Omit<UseQueryOptions<APODData>, 'queryKey' | 'queryFn'>
) => {
  const dateString = date ? formatDateForNASA(date) : undefined
  
  return useQuery({
    queryKey: nasaQueryKeys.apod(dateString),
    queryFn: () => nasaApi.getAPOD(dateString),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    ...options,
  })
}

// Mars Rover Photos Hook (with optional parameters)
export const useMarsRoverPhotos = (
  params: {
    rover?: string
    sol?: number
    camera?: string
    page?: number
  } = {},
  options?: Omit<UseQueryOptions<MarsRoverResponse>, 'queryKey' | 'queryFn'>
) => {
  // Only enable the query if we have some parameters or want default behavior
  const enabled = options?.enabled ?? true
  
  return useQuery({
    queryKey: nasaQueryKeys.marsRover(params),
    queryFn: () => nasaApi.getMarsRoverPhotos(params),
    enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    ...options,
  })
}

// Mars Rover Photos by Specific Rover Hook
export const useMarsRoverPhotosByRover = (
  rover: RoverName,
  params: {
    sol?: number
    camera?: string
    page?: number
  } = {},
  options?: Omit<UseQueryOptions<MarsRoverResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: nasaQueryKeys.marsRoverByRover(rover, params),
    queryFn: () => nasaApi.getMarsRoverPhotosByRover(rover, params),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    ...options,
  })
}

// Latest Mars Rover Photos Hook (uses most active rover)
export const useLatestMarsRoverPhotos = (
  params: {
    sol?: number
    camera?: string
    page?: number
  } = {},
  options?: Omit<UseQueryOptions<MarsRoverResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: nasaQueryKeys.latestRoverPhotos(params),
    queryFn: () => nasaApi.getLatestRoverPhotos(params),
    staleTime: 1000 * 60 * 10, // 10 minutes (more frequent updates for latest data)
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    ...options,
  })
}

// Rover Manifest Hook
export const useRoverManifest = (
  rover: RoverName,
  options?: Omit<UseQueryOptions<RoverManifest>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: nasaQueryKeys.roverManifest(rover),
    queryFn: () => nasaApi.getRoverManifest(rover),
    staleTime: 1000 * 60 * 60, // 1 hour (manifests don't change often)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    ...options,
  })
}

// Most Active Rover Hook
export const useMostActiveRover = (
  options?: Omit<UseQueryOptions<MostActiveRoverResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: nasaQueryKeys.mostActiveRover(),
    queryFn: () => nasaApi.getMostActiveRover(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
    ...options,
  })
}

// Combined Hook: Get Most Active Rover + Its Latest Photos
export const useMostActiveRoverWithPhotos = (params: {
  sol?: number
  camera?: string
  page?: number
} = {}) => {
  return useQuery({
    queryKey: ['most-active-rover-photos', params],
    queryFn: () => nasaApi.getLatestRoverPhotos(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get Perseverance MEDA weather data
export const usePerseveranceWeather = () => {
  return useQuery({
    queryKey: ['perseverance-weather'],
    queryFn: () => nasaApi.getPerseveranceWeather(),
    staleTime: 30 * 60 * 1000, // 30 minutes - weather data doesn't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2, // Retry twice in case of temporary failures
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

// Export available rovers for components
export const AVAILABLE_ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'] as const 