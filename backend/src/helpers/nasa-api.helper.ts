// This is a helper file for NASA API calls.
import axios from 'axios'
import {
  APODResponse,
  HistoricWeatherData,
  InSightWeatherData,
  MarsRoverResponse,
  MultiPlanetDashboardResponse,
  PerseveranceWeatherResponse,
  PlanetData,
  RoverManifest,
  TechPortResponse,
  InSightSolData,
  MSLWeatherData,
  MAASWeatherData
} from '../models/nasa.models'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nasaConfig = require('../config/nasa.config')

// Create axios instance with NASA API configuration
const nasaApiClient = axios.create({
  baseURL: nasaConfig.baseUrl,
  timeout: nasaConfig.timeout,
  params: {
    api_key: nasaConfig.apiKey
  }
})

// Fetch APOD data
export const fetchAPODData = async (date?: string): Promise<APODResponse> => {
  const params: { date?: string } = {}
  if (date) {
    params.date = date
  }

  const response = await nasaApiClient.get<APODResponse>(
    nasaConfig.endpoints.apod,
    { params }
  )
  
  return response.data
}

// Fetch Mars Rover photos with dynamic rover support
export const fetchMarsRoverPhotos = async (
  rover: string = 'curiosity', 
  sol?: string
): Promise<MarsRoverResponse> => {
  try {
    let endpoint = `${nasaConfig.endpoints.marsRover}/${rover}/photos`
    const params: { sol?: string } = {}

    if (sol) {
      params.sol = sol
    } else {
      // Use latest photos endpoint if no sol specified
      endpoint = `${nasaConfig.endpoints.marsRover}/${rover}/latest_photos`
    }

    const response = await nasaApiClient.get<MarsRoverResponse>(endpoint, { params })
    
    // Ensure response has valid structure
    if (!response.data || !Array.isArray(response.data.photos)) {
      console.warn(`Invalid response structure for rover ${rover}:`, response.data)
      return { photos: [] }
    }
    
    return response.data
  } catch (error) {
    console.error(`Error fetching photos for rover ${rover}:`, error)
    // Return empty photos array instead of throwing
    return { photos: [] }
  }
}

// Fetch rover manifest (contains mission info and latest sol)
export const fetchRoverManifest = async (
  rover: string
): Promise<RoverManifest> => {
  const endpoint = `${nasaConfig.endpoints.marsRoverManifest}/${rover}`
  const response = await nasaApiClient.get<RoverManifest>(endpoint)
  return response.data
}

// Get the most recently active rover
export const getMostActiveRover = async (): Promise<string> => {
  try {
    const manifests = await Promise.allSettled(
      nasaConfig.rovers.map(async (rover: string) => {
        const manifest = await fetchRoverManifest(rover)
        return {
          rover,
          maxSol: manifest.photo_manifest.max_sol,
          maxDate: manifest.photo_manifest.max_date,
          status: manifest.photo_manifest.status
        }
      })
    )

    // Filter successful responses and active rovers
    const activeRovers = manifests
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          rover: string
          maxSol: number
          maxDate: string
          status: string
        }> => result.status === 'fulfilled'
      )
      .map(result => result.value)
      .filter(rover => rover.status === 'active')

    if (activeRovers.length === 0) {
      return 'curiosity' // Fallback to curiosity
    }

    // Return the rover with the most recent activity
    const mostActive = activeRovers.reduce((prev, current) =>
      new Date(current.maxDate) > new Date(prev.maxDate) ? current : prev
    )

    return mostActive.rover
  } catch (error) {
    console.error('Error finding most active rover:', error)
    return 'curiosity' // Fallback
  }
}

// Fetch Mars weather data from available NASA sources
export const fetchPerseveranceWeatherData = async (): Promise<PerseveranceWeatherResponse> => {
  try {
    // First, try to get current Mars weather data from MAAS API (Curiosity REMS data)
    const maasData = await fetchMAASWeatherData()
    if (maasData && isDataRecent(maasData)) {
      console.log('Using current MAAS weather data from Curiosity REMS')
      return convertMAASToPersevaeranceFormat(maasData)
    }
    
    // Fallback to InSight weather data if MAAS is unavailable
    const insightData = await fetchInSightWeatherData()
    if (insightData && isDataRecent(insightData)) {
      console.log('Using InSight historical weather data')
      return convertInSightToPerseveranceFormat(insightData)
    }
    
    // If InSight data is too old, try MSL weather service
    const mslData = await fetchMSLWeatherData()
    if (mslData && isDataRecent(mslData)) {
      console.log('Using MSL weather data')
      return convertMSLToPerseveranceFormat(mslData)
    }
    
    // Fallback to current realistic simulation with today's date
    console.log('Using current weather simulation due to unavailable/outdated data sources')
    return generateRealisticMarsWeather()
    
  } catch (error) {
    console.error('Error fetching Mars weather data:', error)
    // Return current simulation as fallback
    return generateRealisticMarsWeather()
  }
}

// Check if weather data is recent (within 1 year)
const isDataRecent = (data: unknown): boolean => {
  try {
    let dataDate: Date | null = null
    
    // For MAAS data
    if (data && typeof data === 'object' && 'terrestrial_date' in data && typeof data.terrestrial_date === 'string') {
      dataDate = new Date(data.terrestrial_date)
    }
    // For InSight data
    else if (data && typeof data === 'object' && 'sol_keys' in data && Array.isArray(data.sol_keys) && data.sol_keys.length > 0) {
      const latestSol = data.sol_keys[data.sol_keys.length - 1]
      const solData = (data as InSightWeatherData)[latestSol] as InSightSolData
      if (solData.First_UTC) {
        dataDate = new Date(solData.First_UTC)
      }
    }
    
    if (!dataDate) return false
    
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const isRecent = dataDate > oneYearAgo
    console.log(`Data from ${dataDate.toISOString().split('T')[0]} is ${isRecent ? 'recent' : 'outdated'}`)
    
    return isRecent
  } catch (error) {
    console.warn('Error checking data recency:', error)
    return false
  }
}

// Fetch InSight weather data (historical)
const fetchInSightWeatherData = async (): Promise<InSightWeatherData | null> => {
  try {
    const response = await nasaApiClient.get<InSightWeatherData>(
      nasaConfig.endpoints.insightWeather,
      {
        params: {
          feedtype: 'json',
          ver: '1.0'
        }
      }
    )
    return response.data
  } catch (error) {
    console.warn('InSight weather data not available:', error)
    return null
  }
}

// Fetch MSL (Curiosity) weather data
const fetchMSLWeatherData = async (): Promise<MSLWeatherData | null> => {
  try {
    const response = await axios.get<MSLWeatherData>(nasaConfig.endpoints.marsWeatherService, {
      timeout: nasaConfig.timeout
    })
    return response.data
  } catch (error) {
    console.warn('MSL weather data not available:', error)
    return null
  }
}

// Fetch MAAS weather data (current Curiosity REMS data)
const fetchMAASWeatherData = async (): Promise<MAASWeatherData | null> => {
  try {
    const response = await axios.get<MAASWeatherData>(nasaConfig.endpoints.maasWeather, {
      timeout: nasaConfig.timeout
    })
    return response.data
  } catch (error) {
    console.warn('MAAS weather data not available:', error)
    return null
  }
}

// Convert InSight data to Perseverance format
const convertInSightToPerseveranceFormat = (
  insightData: InSightWeatherData
): PerseveranceWeatherResponse => {
  const currentSol = Math.max(
    ...insightData.sol_keys.map((sol: string) => parseInt(sol))
  )
  const solData = insightData[currentSol.toString()] as InSightSolData
  
  return {
    latest_sol: currentSol,
    sol_data: {
      sol: currentSol,
      terrestrial_date: solData.First_UTC?.split('T')[0] || new Date().toISOString().split('T')[0],
      temperature: {
        air: {
          average: solData.AT?.av || -60,
          minimum: solData.AT?.mn || -80,
          maximum: solData.AT?.mx || -40,
          count: solData.AT?.ct || 24
        },
        ground: {
          average: (solData.AT?.av || -60) + 10,
          minimum: (solData.AT?.mn || -80) + 5,
          maximum: (solData.AT?.mx || -40) + 15,
          count: 24
        }
      },
      pressure: {
        average: solData.PRE?.av || 700,
        minimum: solData.PRE?.mn || 650,
        maximum: solData.PRE?.mx || 750,
        count: solData.PRE?.ct || 24
      },
      wind: {
        speed: {
          average: solData.HWS?.av || 5,
          minimum: 0,
          maximum: solData.HWS?.mx || 15,
          count: solData.HWS?.ct || 24
        },
        direction: {
          compass_point: solData.WD?.most_common?.compass_point || 'SW',
          degrees: solData.WD?.most_common?.compass_degrees || 225
        }
      },
      humidity: {
        average: Math.random() * 100,
        minimum: 0,
        maximum: 100,
        count: 24
      },
      season: solData.Season || 'Unknown',
      sunrise: '06:30',
      sunset: '18:45',
      local_uv_irradiance_index: 'Moderate',
      atmosphere_opacity: 'Clear'
    },
    location: {
      name: 'Elysium Planitia (InSight Historical Data)',
      coordinates: {
        latitude: 4.5024,
        longitude: 135.6234
      }
    },
    timestamp: new Date().toISOString()
  }
}

// Convert MSL data to Perseverance format
const convertMSLToPerseveranceFormat = (
  mslData: MSLWeatherData
): PerseveranceWeatherResponse => {
  const currentSol = mslData.sol || Math.floor(Math.random() * 100) + 3000
  
  return {
    latest_sol: currentSol,
    sol_data: {
      sol: currentSol,
      terrestrial_date: mslData.terrestrial_date || new Date().toISOString().split('T')[0],
      temperature: {
        air: {
          average: mslData.min_temp ? (mslData.min_temp + mslData.max_temp) / 2 : -50,
          minimum: mslData.min_temp || -70,
          maximum: mslData.max_temp || -30,
          count: 24
        },
        ground: {
          average: mslData.min_temp ? (mslData.min_temp + mslData.max_temp) / 2 : -40,
          minimum: mslData.min_temp || -60,
          maximum: mslData.max_temp || -20,
          count: 24
        }
      },
      pressure: {
        average: mslData.pressure || 750,
        minimum: (mslData.pressure || 750) - 50,
        maximum: (mslData.pressure || 750) + 50,
        count: 24
      },
      wind: {
        speed: {
          average: Math.random() * 20,
          minimum: 0,
          maximum: Math.random() * 30,
          count: 24
        },
        direction: {
          compass_point: 'SW',
          degrees: 225
        }
      },
      humidity: {
        average: Math.random() * 100,
        minimum: 0,
        maximum: 100,
        count: 24
      },
      season: mslData.season || 'Unknown',
      sunrise: '06:30',
      sunset: '18:45',
      local_uv_irradiance_index: 'Moderate',
      atmosphere_opacity: mslData.atmo_opacity || 'Clear'
    },
    location: {
      name: 'Gale Crater (MSL/Curiosity Data)',
      coordinates: {
        latitude: -5.4,
        longitude: 137.8
      }
    },
    timestamp: new Date().toISOString()
  }
}

// Convert MAAS data to Perseverance format
const convertMAASToPersevaeranceFormat = (
  maasData: MAASWeatherData
): PerseveranceWeatherResponse => {
  const currentSol = maasData.sol || 0
  const terrestrialDate = maasData.terrestrial_date || new Date().toISOString().split('T')[0]
  
  // Convert temperatures from Celsius to match our format
  const minTemp = maasData.min_gts_temp || -70
  const maxTemp = maasData.max_gts_temp || -30
  const avgTemp = (minTemp + maxTemp) / 2
  
  // Convert pressure from hPa to Pa (MAAS uses different units)
  const pressure = (maasData.pressure || 7.5) * 100 // Convert hPa to Pa
  
  // Parse wind data
  const windSpeed = maasData.wind_speed || 5
  const windDirection = maasData.wind_direction || 'SW'
  const windDegrees = getWindDegrees(windDirection)
  
  return {
    latest_sol: currentSol,
    sol_data: {
      sol: currentSol,
      terrestrial_date: terrestrialDate,
      temperature: {
        air: {
          average: Math.round(avgTemp * 10) / 10,
          minimum: Math.round(minTemp * 10) / 10,
          maximum: Math.round(maxTemp * 10) / 10,
          count: 24
        },
        ground: {
          average: Math.round((avgTemp + 10) * 10) / 10,
          minimum: Math.round((minTemp + 5) * 10) / 10,
          maximum: Math.round((maxTemp + 15) * 10) / 10,
          count: 24
        }
      },
      pressure: {
        average: Math.round(pressure * 10) / 10,
        minimum: Math.round((pressure - 30) * 10) / 10,
        maximum: Math.round((pressure + 30) * 10) / 10,
        count: 24
      },
      wind: {
        speed: {
          average: Math.round(windSpeed * 10) / 10,
          minimum: 0,
          maximum: Math.round((windSpeed + 10) * 10) / 10,
          count: 24
        },
        direction: {
          compass_point: windDirection,
          degrees: windDegrees
        }
      },
      humidity: {
        average: maasData.abs_humidity || Math.round((Math.random() * 50 + 10) * 10) / 10,
        minimum: 0,
        maximum: 100,
        count: 24
      },
      season: maasData.season || 'Unknown',
      sunrise: maasData.sunrise ? new Date(maasData.sunrise).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '06:30',
      sunset: maasData.sunset ? new Date(maasData.sunset).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '18:45',
      local_uv_irradiance_index: maasData.atmo_opacity === 'Sunny' ? 'High' : 'Moderate',
      atmosphere_opacity: maasData.atmo_opacity || 'Clear'
    },
    location: {
      name: 'Gale Crater (Curiosity REMS - Current Data)',
      coordinates: {
        latitude: -5.4,
        longitude: 137.8
      }
    },
    timestamp: new Date().toISOString()
  }
}

// Helper function to convert wind direction to degrees
const getWindDegrees = (direction: string): number => {
  const windMap: { [key: string]: number } = {
    'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
    'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
    'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
    'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
  }
  return windMap[direction.toUpperCase()] || 225
}

// Generate realistic Mars weather simulation based on actual Mars conditions
const generateRealisticMarsWeather = (): PerseveranceWeatherResponse => {
  // Calculate current Perseverance Sol (Perseverance landed Feb 18, 2021)
  const landingDate = new Date('2021-02-18')
  const currentDate = new Date()
  const daysSinceLanding = Math.floor((currentDate.getTime() - landingDate.getTime()) / (1000 * 60 * 60 * 24))
  const currentSol = Math.floor(daysSinceLanding * 1.027) // Mars sol is 1.027 Earth days
  
  const currentDateString = currentDate.toISOString().split('T')[0]
  
  // Use realistic seasonal variations for Jezero Crater
  const dayOfYear = currentDate.getDayOfYear()
  const seasonalTempOffset = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 15 // ±15°C seasonal variation
  
  // Realistic Jezero Crater weather patterns
  const baseTemp = -20 + seasonalTempOffset // Base temperature with seasonal variation
  const dailyTempVariation = Math.random() * 15 - 7.5 // ±7.5°C daily variation
  const airTemp = baseTemp + dailyTempVariation
  const groundTemp = airTemp + Math.random() * 10 + 5 // Ground typically warmer
  
  // Realistic pressure variations (Mars atmospheric pressure varies with season)
  const basePressure = 650 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 150 // 500-800 Pa seasonal variation
  const pressure = basePressure + (Math.random() * 50 - 25) // Daily variation
  
  // Wind patterns based on Mars meteorology
  const windSpeed = Math.random() * 20 + 2 // 2-22 m/s (typical Mars winds)
  const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)]
  
  // Seasonal determination based on current date
  const seasons = ['Early Spring', 'Late Spring', 'Early Summer', 'Late Summer', 'Early Autumn', 'Late Autumn', 'Early Winter', 'Late Winter']
  const season = seasons[Math.floor((dayOfYear / 365) * 8)]
  
  // Atmospheric opacity varies with dust storms (more likely in certain seasons)
  const dustStormSeason = dayOfYear > 60 && dayOfYear < 150 // Martian dust storm season
  const opacityLevels = dustStormSeason 
    ? ['Clear', 'Slightly Hazy', 'Hazy', 'Hazy', 'Dusty', 'Very Dusty']
    : ['Clear', 'Clear', 'Clear', 'Slightly Hazy', 'Hazy']
  const atmosphereOpacity = opacityLevels[Math.floor(Math.random() * opacityLevels.length)]
  
  // Calculate sunrise/sunset times (simplified for Jezero Crater)
  const hourOffset = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 1.5 // Seasonal daylight variation
  const sunrise = `${String(Math.floor(6.5 - hourOffset)).padStart(2, '0')}:${String(Math.floor((0.5 - hourOffset % 1) * 60)).padStart(2, '0')}`
  const sunset = `${String(Math.floor(18.5 + hourOffset)).padStart(2, '0')}:${String(Math.floor((0.5 + hourOffset % 1) * 60)).padStart(2, '0')}`
  
  const response: PerseveranceWeatherResponse = {
    latest_sol: currentSol,
    sol_data: {
      sol: currentSol,
      terrestrial_date: currentDateString,
      temperature: {
        air: {
          average: Math.round(airTemp * 10) / 10,
          minimum: Math.round((airTemp - 8) * 10) / 10,
          maximum: Math.round((airTemp + 12) * 10) / 10,
          count: 24
        },
        ground: {
          average: Math.round(groundTemp * 10) / 10,
          minimum: Math.round((groundTemp - 5) * 10) / 10,
          maximum: Math.round((groundTemp + 15) * 10) / 10,
          count: 24
        }
      },
      pressure: {
        average: Math.round(pressure * 10) / 10,
        minimum: Math.round((pressure - 30) * 10) / 10,
        maximum: Math.round((pressure + 30) * 10) / 10,
        count: 24
      },
      wind: {
        speed: {
          average: Math.round(windSpeed * 10) / 10,
          minimum: 0,
          maximum: Math.round((windSpeed + 8) * 10) / 10,
          count: 24
        },
        direction: {
          compass_point: windDirection,
          degrees: windDirections.indexOf(windDirection) * 45
        }
      },
      humidity: {
        average: Math.round((Math.random() * 50 + 10) * 10) / 10, // Mars humidity is typically low
        minimum: 0,
        maximum: Math.round((Math.random() * 80 + 20) * 10) / 10,
        count: 24
      },
      season: season,
      sunrise: sunrise,
      sunset: sunset,
      local_uv_irradiance_index: atmosphereOpacity === 'Clear' ? 'High' : 'Moderate',
      atmosphere_opacity: atmosphereOpacity
    },
    location: {
      name: 'Jezero Crater (Current Simulated Data)',
      coordinates: {
        latitude: 18.4447,
        longitude: 77.4508
      }
    },
    timestamp: currentDate.toISOString()
  }
  
  return response
}

// Helper to add getDayOfYear method to Date prototype if not exists
declare global {
  interface Date {
    getDayOfYear(): number
  }
}

Date.prototype.getDayOfYear = function() {
  const start = new Date(this.getFullYear(), 0, 0)
  const diff = this.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

// Check NASA API health
export const checkNASAApiHealth = async (): Promise<boolean> => {
  try {
    const response = await nasaApiClient.get(nasaConfig.endpoints.apod)
    return response.status === 200
  } catch (error) {
    return false
  }
}

// Multi-Planetary Dashboard Data Generator
export const getMultiPlanetaryDashboard = async (): Promise<MultiPlanetDashboardResponse> => {
  const currentDate = new Date()
  const timestamp = currentDate.toISOString()
  
  // Calculate days difference
  const daysDiff = (date1: Date, date2: Date) => Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24))
  
  const planetsData: PlanetData[] = [
    {
      id: 'mars',
      name: 'Mars',
      type: 'planet',
      active_missions: [
        {
          name: 'Perseverance Rover',
          status: 'active',
          launch_date: '2020-07-30',
          arrival_date: '2021-02-18',
          mission_type: 'rover',
          description: 'Searching for signs of ancient microbial life and collecting rock samples'
        },
        {
          name: 'Ingenuity Helicopter',
          status: 'active',
          launch_date: '2020-07-30',
          arrival_date: '2021-02-18',
          mission_type: 'rover',
          description: 'First powered flight on another planet'
        },
        {
          name: 'Curiosity Rover',
          status: 'active',
          launch_date: '2011-11-26',
          arrival_date: '2012-08-05',
          mission_type: 'rover',
          description: 'Assessing Mars past and present habitability'
        },
        {
          name: 'MAVEN Orbiter',
          status: 'active',
          launch_date: '2013-11-18',
          arrival_date: '2014-09-21',
          mission_type: 'orbiter',
          description: 'Studying Mars atmosphere and climate evolution'
        }
      ],
      mission_count: 4,
      surface_conditions: {
        temperature: {
          average: -63,
          min: -125,
          max: 20,
          unit: '°C'
        },
        atmosphere: {
          composition: '95% CO₂, 3% N₂',
          pressure: 600,
          pressure_unit: 'Pa'
        },
        gravity: 0.38,
        day_length: '24h 37m',
        radiation_level: 'high'
      },
      last_activity: {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Perseverance collected rock sample "Berea"',
        days_ago: 2
      },
      next_event: {
        date: '2025-07-15',
        description: 'Sample Return Mission launch window',
        days_until: daysDiff(new Date('2025-07-15'), currentDate)
      },
      notable_fact: 'Mars has the largest dust storms in the solar system, which can cover the entire planet.',
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      },
      image_url: 'https://science.nasa.gov/wp-content/uploads/2023/10/pia26099-marssimulatedcolor-jpeg.webp'
    },
    {
      id: 'moon',
      name: 'Moon',
      type: 'moon',
      active_missions: [
        {
          name: 'Lunar Reconnaissance Orbiter',
          status: 'active',
          launch_date: '2009-06-18',
          arrival_date: '2009-06-23',
          mission_type: 'orbiter',
          description: 'High-resolution mapping of the Moon'
        },
        {
          name: 'Artemis Program',
          status: 'planned',
          launch_date: '2026-09-00',
          mission_type: 'lander',
          description: 'Return humans to the Moon'
        }
      ],
      mission_count: 2,
      surface_conditions: {
        temperature: {
          average: -20,
          min: -173,
          max: 127,
          unit: '°C'
        },
        atmosphere: {
          composition: 'No atmosphere',
          pressure: 0,
          pressure_unit: 'Pa'
        },
        gravity: 0.16,
        day_length: '708 hours',
        radiation_level: 'extreme'
      },
      last_activity: {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'LRO captured new images of Apollo landing sites',
        days_ago: 7
      },
      next_event: {
        date: '2026-09-01',
        description: 'Artemis III lunar landing',
        days_until: daysDiff(new Date('2026-09-01'), currentDate)
      },
      notable_fact: 'The Moon is moving away from Earth at 3.8 cm per year',
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      }
    },
    {
      id: 'venus',
      name: 'Venus',
      type: 'planet',
      active_missions: [
        {
          name: 'Akatsuki (Venus Climate Orbiter)',
          status: 'active',
          launch_date: '2010-05-20',
          arrival_date: '2015-12-07',
          mission_type: 'orbiter',
          description: 'Studying Venus atmosphere and weather'
        }
      ],
      mission_count: 1,
      surface_conditions: {
        temperature: {
          average: 464,
          min: 450,
          max: 470,
          unit: '°C'
        },
        atmosphere: {
          composition: '96% CO₂, 3.5% N₂',
          pressure: 9200000,
          pressure_unit: 'Pa'
        },
        gravity: 0.91,
        day_length: '5832 hours',
        radiation_level: 'moderate'
      },
      last_activity: {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Akatsuki observed atmospheric waves',
        days_ago: 30
      },
      next_event: {
        date: '2029-06-01',
        description: 'VERITAS mission planned launch',
        days_until: daysDiff(new Date('2029-06-01'), currentDate)
      },
      notable_fact: 'Venus rotates backwards and has days longer than its years',
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      }
    },
    {
      id: 'europa',
      name: 'Europa',
      type: 'moon',
      active_missions: [
        {
          name: 'Europa Clipper',
          status: 'en-route',
          launch_date: '2024-10-14',
          arrival_date: '2030-04-11',
          mission_type: 'orbiter',
          description: 'Investigating Europa\'s subsurface ocean'
        }
      ],
      mission_count: 1,
      surface_conditions: {
        temperature: {
          average: -160,
          min: -220,
          max: -130,
          unit: '°C'
        },
        atmosphere: {
          composition: 'Thin oxygen atmosphere',
          pressure: 0.1,
          pressure_unit: 'Pa'
        },
        gravity: 0.134,
        day_length: '85 hours',
        radiation_level: 'extreme'
      },
      last_activity: {
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Europa Clipper trajectory correction',
        days_ago: 45
      },
      next_event: {
        date: '2030-04-11',
        description: 'Europa Clipper arrives at Jupiter system',
        days_until: daysDiff(new Date('2030-04-11'), currentDate)
      },
      notable_fact: "Europa's subsurface ocean may contain more than twice the amount of water of all of Earth's oceans.",
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      },
      image_url: 'https://science.nasa.gov/wp-content/uploads/2023/11/europa-5-jpeg.webp'
    },
    {
      id: 'titan',
      name: 'Titan',
      type: 'moon',
      active_missions: [
        {
          name: 'Dragonfly',
          status: 'planned',
          launch_date: '2028-07-01',
          arrival_date: '2034-07-01',
          mission_type: 'lander',
          description: 'Nuclear-powered rotorcraft to explore Titan\'s surface'
        }
      ],
      mission_count: 1,
      surface_conditions: {
        temperature: {
          average: -179,
          min: -190,
          max: -170,
          unit: '°C'
        },
        atmosphere: {
          composition: '98% N₂, 2% CH₄',
          pressure: 146700,
          pressure_unit: 'Pa'
        },
        gravity: 0.14,
        day_length: '382 hours',
        radiation_level: 'low'
      },
      last_activity: {
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Dragonfly mission design review completed',
        days_ago: 60
      },
      next_event: {
        date: '2028-07-01',
        description: 'Dragonfly launch',
        days_until: daysDiff(new Date('2028-07-01'), currentDate)
      },
      notable_fact: 'Titan is the only moon known to have a dense atmosphere and the only celestial body other than Earth with clear evidence of stable bodies of surface liquid.',
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      },
      image_url: 'https://science.nasa.gov/wp-content/uploads/2023/08/titan-color-2023.png'
    },
    {
      id: 'asteroid-belt',
      name: 'Asteroid Belt',
      type: 'asteroid',
      active_missions: [
        {
          name: 'Dawn (Completed)',
          status: 'completed',
          launch_date: '2007-09-27',
          arrival_date: '2015-03-06',
          mission_type: 'orbiter',
          description: 'Studied Vesta and Ceres'
        },
        {
          name: 'OSIRIS-REx Sample Analysis',
          status: 'active',
          launch_date: '2016-09-08',
          arrival_date: '2023-09-24',
          mission_type: 'sample-return',
          description: 'Analyzing samples from asteroid Bennu'
        }
      ],
      mission_count: 2,
      surface_conditions: {
        temperature: {
          average: -73,
          min: -143,
          max: -3,
          unit: '°C'
        },
        atmosphere: {
          composition: 'No atmosphere'
        },
        gravity: 0.00001,
        day_length: 'Varies by asteroid',
        radiation_level: 'high'
      },
      last_activity: {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'OSIRIS-REx sample analysis reveals new findings',
        days_ago: 14
      },
      next_event: {
        date: '2025-10-01',
        description: 'Next asteroid sample return mission planning',
        days_until: daysDiff(new Date('2025-10-01'), currentDate)
      },
      notable_fact: 'The asteroid belt contains 4% of the Moon\'s mass',
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      }
    },
    {
      id: 'bennu',
      name: 'Bennu',
      type: 'asteroid',
      active_missions: [
        {
          name: 'OSIRIS-REx Sample Analysis',
          status: 'active',
          launch_date: '2016-09-08',
          arrival_date: '2023-09-24',
          mission_type: 'sample-return',
          description: 'Analyzing samples from asteroid Bennu'
        }
      ],
      mission_count: 1,
      surface_conditions: {
        temperature: {
          average: -73,
          min: -143,
          max: -3,
          unit: '°C'
        },
        atmosphere: {
          composition: 'No atmosphere'
        },
        gravity: 0.00001,
        day_length: 'Varies by asteroid',
        radiation_level: 'high'
      },
      last_activity: {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'OSIRIS-REx sample analysis reveals new findings',
        days_ago: 14
      },
      next_event: {
        date: '2025-10-01',
        description: 'Next asteroid sample return mission planning',
        days_until: daysDiff(new Date('2025-10-01'), currentDate)
      },
      notable_fact: 'Samples returned from Bennu by OSIRIS-REx contain abundant water and carbon, key ingredients for life.',
      data_freshness: {
        last_updated: timestamp,
        hours_ago: 0
      },
      image_url: 'https://solarsystem.nasa.gov/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBb3djIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4ea1c8b74289873a64b9af87823e51f8a29a4b3e/bennu_1600.jpg'
    }
  ]

  const total_active_missions = planetsData.reduce(
    (acc, p) => acc + p.active_missions.length,
    0
  )

  return {
    planets: planetsData,
    total_active_missions,
    timestamp,
    last_updated: timestamp
  }
}

// Historic Mars Weather Data Aggregator
// This function attempts to fetch from InSight first, then falls back to a realistic simulation.
export const fetchHistoricMarsWeatherData = async (): Promise<HistoricWeatherData> => {
  try {
    // Try to fetch real InSight data first
    const insightData = await fetchInSightWeatherData()
    if (insightData && Object.keys(insightData).length > 0) {
      console.log('Processing historic data from InSight mission...')
      return processInsightDataForCharts(insightData)
    }
  } catch (error) {
    console.warn(
      'Could not fetch or process InSight historic data, falling back to simulation.',
      error
    )
  }

  console.log('Generating simulated historic Mars weather data...')
  return generateHistoricalSimulationData()
}

// Fetch simulated Mars weather data only
export const fetchSimulatedMarsWeatherData = async (): Promise<HistoricWeatherData> => {
  console.log('Generating simulated historic Mars weather data...')
  return generateHistoricalSimulationData()
}

const processInsightDataForCharts = (
  insightData: InSightWeatherData
): HistoricWeatherData => {
  const missionInfo = {
    name: 'InSight Mars Lander',
    location: 'Elysium Planitia',
    coordinates: { latitude: 4.5024, longitude: 135.6234 },
    mission_duration: `Sol ${insightData.sol_keys[0]} - Sol ${insightData.sol_keys[insightData.sol_keys.length - 1]}`,
    earth_dates: {
      start: (insightData[insightData.sol_keys[0]] as InSightSolData)?.First_UTC?.split('T')[0] || '2018-11-26',
      end: (insightData[insightData.sol_keys[insightData.sol_keys.length - 1]] as InSightSolData)?.Last_UTC?.split('T')[0] || '2022-12-15'
    },
    status: 'Mission Completed',
    total_sols: insightData.sol_keys.length
  }

  const chartData: HistoricWeatherData = {
    mission_info: missionInfo,
    temperature_data: [],
    pressure_data: [],
    wind_data: [],
    atmospheric_conditions: []
  }

  insightData.sol_keys.forEach((sol: string) => {
    const solData = insightData[sol] as InSightSolData
    const earth_date = new Date(solData.First_UTC).toISOString().split('T')[0]
    const season = solData.Season

    // Temperature data
    if (solData.AT) {
      chartData.temperature_data.push({
        sol: Number(sol),
        earth_date,
        min_temp: solData.AT.mn || null,
        max_temp: solData.AT.mx || null,
        avg_temp: solData.AT.av || null,
        temp_range: solData.AT.mx && solData.AT.mn ? solData.AT.mx - solData.AT.mn : null,
        season,
        sample_count: solData.AT.ct || 0
      })
    }

    // Pressure data
    if (solData.PRE) {
      chartData.pressure_data.push({
        sol: parseInt(sol),
        earth_date,
        pressure: solData.PRE.av,
        pressure_min: solData.PRE.mn,
        pressure_max: solData.PRE.mx,
        season,
        sample_count: solData.PRE.ct
      })
    }

    // Wind data
    if (solData.HWS || solData.WD) {
      const windData = {
        sol: Number(sol),
        earth_date,
        season,
        wind_speed: solData.HWS?.av || null,
        wind_speed_min: solData.HWS?.mn || null,
        wind_speed_max: solData.HWS?.mx || null,
        wind_speed_samples: solData.HWS?.ct || 0,
        wind_direction: solData.WD?.most_common?.compass_point || null,
        wind_direction_degrees: solData.WD?.most_common?.compass_degrees || null,
        wind_direction_samples: solData.WD?.most_common?.ct || 0
      }
      chartData.wind_data.push(windData)
    }

    // Atmospheric conditions summary
    chartData.atmospheric_conditions.push({
      sol: Number(sol),
      earth_date,
      season,
      has_temperature: !!solData.AT,
      has_pressure: !!solData.PRE,
      has_wind_speed: !!solData.HWS,
      has_wind_direction: !!solData.WD,
      data_quality: calculateDataQuality(solData)
    })
  })

  return chartData
}

const calculateDataQuality = (solData: InSightSolData): number => {
  let quality = 0
  if (solData.AT?.av) quality += 25
  if (solData.PRE?.av) quality += 25
  if (solData.HWS?.av) quality += 25
  if (solData.WD?.most_common?.compass_point) quality += 25
  return quality
}

// Generate realistic historical simulation data for demonstration
const generateHistoricalSimulationData = (): HistoricWeatherData => {
  const startSol = 10
  const endSol = 800
  const chartData: HistoricWeatherData = {
    mission_info: {
      name: 'Simulated Mars Weather Station',
      location: 'Elysium Planitia (Simulated)',
      coordinates: { latitude: 4.5024, longitude: 135.6234 },
      mission_duration: `Sol ${startSol} - Sol ${endSol}`,
      earth_dates: {
        start: '2018-12-06',
        end: '2021-02-18'
      },
      status: 'Simulated Data',
      total_sols: endSol - startSol
    },
    temperature_data: [],
    pressure_data: [],
    wind_data: [],
    atmospheric_conditions: []
  }

  for (let sol = startSol; sol <= endSol; sol++) {
    // Create Earth date based on sol
    const landingDate = new Date('2018-11-26')
    const earthDate = new Date(landingDate.getTime() + (sol * 24.6 * 60 * 60 * 1000))
    const earthDateString = earthDate.toISOString().split('T')[0]
    
    // Seasonal variation based on sol (Mars year is ~687 sols)
    const seasonalPhase = (sol / 687) * 2 * Math.PI
    const seasonalTempOffset = Math.sin(seasonalPhase) * 20 // ±20°C seasonal variation
    
    // Daily variation
    const baseTemp = -50 + seasonalTempOffset
    const dailyVariation = (Math.random() - 0.5) * 15
    const avgTemp = baseTemp + dailyVariation
    const minTemp = avgTemp - 8 - Math.random() * 12
    const maxTemp = avgTemp + 12 + Math.random() * 15
    
    // Pressure with seasonal variation
    const basePressure = 650 + Math.sin(seasonalPhase + Math.PI/4) * 100
    const pressure = basePressure + (Math.random() - 0.5) * 50
    
    // Wind data
    const windSpeed = Math.random() * 15 + 2
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)]
    
    // Determine season
    const seasonIndex = Math.floor(((sol % 687) / 687) * 4)
    const seasons = ['Northern Spring', 'Northern Summer', 'Northern Autumn', 'Northern Winter']
    const season = seasons[seasonIndex]

    chartData.temperature_data.push({
      sol: sol,
      earth_date: earthDateString,
      min_temp: Math.round(minTemp * 10) / 10,
      max_temp: Math.round(maxTemp * 10) / 10,
      avg_temp: Math.round(avgTemp * 10) / 10,
      temp_range: Math.round((maxTemp - minTemp) * 10) / 10,
      season: season,
      sample_count: 24 * (18 + Math.floor(Math.random() * 6))
    })

    chartData.pressure_data.push({
      sol: sol,
      earth_date: earthDateString,
      pressure: Math.round(pressure * 10) / 10,
      pressure_min: Math.round((pressure - 20) * 10) / 10,
      pressure_max: Math.round((pressure + 20) * 10) / 10,
      season: season,
      sample_count: 24 * (18 + Math.floor(Math.random() * 6))
    })

    chartData.wind_data.push({
      sol: sol,
      earth_date: earthDateString,
      wind_speed: Math.round(windSpeed * 10) / 10,
      wind_speed_min: 0,
      wind_speed_max: Math.round((windSpeed + 10) * 10) / 10,
      wind_direction: windDirection,
      wind_direction_degrees: windDirections.indexOf(windDirection) * 45,
      season: season,
      wind_speed_samples: 24 * (15 + Math.floor(Math.random() * 9))
    })

    chartData.atmospheric_conditions.push({
      sol: sol,
      earth_date: earthDateString,
      season: season,
      has_temperature: true,
      has_pressure: true,
      has_wind_speed: true,
      has_wind_direction: true,
      data_quality: 85 + Math.floor(Math.random() * 15)
    })
  }

  return chartData
}

// Tech Transfer (TechPort) API
// Fetch a list of TechPort projects
export const fetchTechPortProjects = async (
  params: {
    page?: number
    limit?: number
    updatedSince?: string
  } = {}
): Promise<TechPortResponse> => {
  try {
    const response = await nasaApiClient.get<{ projects: TechPortResponse }>(
      nasaConfig.endpoints.techport,
      {
        params: {
          ...params
        }
      }
    )
    return response.data.projects
  } catch (error) {
    console.error('Error fetching TechPort projects:', error)
    return { projects: [] } // Return empty structure on error
  }
}

// Fetch a single TechPort project by ID
export const fetchTechPortProject = async (
  projectId: string
): Promise<unknown> => {
  try {
    const response = await axios.get(`https://techport.nasa.gov/api/projects/${projectId}`, {
      timeout: 10000
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching TechPort project ${projectId}:`, error)
    return null
  }
}

// Aggregate and return a list of technology categories
export const getTechPortCategories = async (): Promise<
  { code: string; name: string }[]
> => {
  try {
    // In a real scenario, this might be a separate endpoint or aggregated from projects
    const projectsResponse = (await fetchTechPortProjects({ limit: 500 })) as {
      projects: { technologyAreas: { name: string; code: string }[] }[]
    }
    const categories = new Map<string, string>()
    projectsResponse.projects.forEach(project => {
      project.technologyAreas.forEach(area => {
        categories.set(area.code, area.name)
      })
    })
    return Array.from(categories.entries()).map(([code, name]) => ({ code, name }))
  } catch (error) {
    console.error('Error getting TechPort categories:', error)
    return []
  }
}

export const getTechPortAnalytics = async (): Promise<{
  statusCounts: Record<string, number>
  categoryCounts: Record<string, number>
  totalProjects: number
}> => {
  try {
    const projectsResponse = (await fetchTechPortProjects({
      limit: 1000
    })) as {
      projects: { status: string; technologyAreas: { name: string }[] }[]
    }

    const statusCounts = projectsResponse.projects.reduce(
      (acc, project) => {
        project.status === 'active' ? acc.active++ : project.status === 'completed' ? acc.completed++ : project.status === 'planned' ? acc.planned++ : acc.cancelled++
        return acc
      },
      { active: 0, completed: 0, planned: 0, cancelled: 0 }
    )

    const categoryCounts = projectsResponse.projects.reduce(
      (acc, project) => {
        project.technologyAreas.forEach(area => {
          acc[area.name] = (acc[area.name] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>
    )

    return {
      statusCounts,
      categoryCounts,
      totalProjects: projectsResponse.projects.length
    }
  } catch (error) {
    console.error('Error getting TechPort analytics:', error)
    return { statusCounts: {}, categoryCounts: {}, totalProjects: 0 }
  }
} 