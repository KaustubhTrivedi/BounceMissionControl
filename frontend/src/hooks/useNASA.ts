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
  type RoverName,
  AVAILABLE_ROVERS
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
export const useMostActiveRoverWithPhotos = (
  params: {
    sol?: number
    camera?: string
    page?: number
  } = {},
  options?: Omit<UseQueryOptions<MarsRoverResponse>, 'queryKey' | 'queryFn'>
) => {
  // First get the most active rover
  const { data: mostActiveRoverData, isLoading: isLoadingRover } = useMostActiveRover()
  
  // Then get photos from that rover
  const { data: photosData, isLoading: isLoadingPhotos, error } = useLatestMarsRoverPhotos(
    params,
    {
      enabled: !!mostActiveRoverData?.most_active_rover,
      ...options,
    }
  )

  return {
    data: photosData,
    isLoading: isLoadingRover || isLoadingPhotos,
    error,
    mostActiveRover: mostActiveRoverData?.most_active_rover,
  }
}

// Export available rovers for components
export { AVAILABLE_ROVERS } 