/**
 * NASA API React Query Hooks
 * Custom hooks for fetching NASA data using React Query
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { nasaApi, formatDateForNASA } from '@/services/nasa'
import type { APODData, MarsRoverResponse } from '@/services/nasa'

// Query Keys
export const nasaQueryKeys = {
  apod: (date?: string) => ['nasa', 'apod', date] as const,
  marsRover: (params: Record<string, any>) => ['nasa', 'mars-rover', params] as const,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
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
  options?: Omit<UseQueryOptions<MarsRoverResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: nasaQueryKeys.marsRover(params),
    queryFn: () => nasaApi.getMarsRoverPhotos(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: Object.keys(params).length > 0 || params.rover !== undefined,
    ...options,
  })
}

// Prefetch helpers for better UX
export const prefetchAPOD = (queryClient: any, date?: Date) => {
  const dateString = date ? formatDateForNASA(date) : undefined
  
  return queryClient.prefetchQuery({
    queryKey: nasaQueryKeys.apod(dateString),
    queryFn: () => nasaApi.getAPOD(dateString),
    staleTime: 5 * 60 * 1000,
  })
}

export const prefetchMarsRoverPhotos = (
  queryClient: any,
  params: {
    rover?: string
    sol?: number
    camera?: string
    page?: number
  } = {}
) => {
  return queryClient.prefetchQuery({
    queryKey: nasaQueryKeys.marsRover(params),
    queryFn: () => nasaApi.getMarsRoverPhotos(params),
    staleTime: 10 * 60 * 1000,
  })
} 