import { createFileRoute, Link } from '@tanstack/react-router'
import { useMostActiveRoverWithPhotos, useLatestPerseveranceWeather } from '@/hooks/useNASA'
import { getRoverDisplayName } from '@/services/nasa'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data: roverData, isLoading, error } = useMostActiveRoverWithPhotos({ sol: undefined })
  const { 
    data: weatherData, 
    isLoading: isWeatherLoading, 
    error: weatherError,
    latestSol: weatherSol
  } = useLatestPerseveranceWeather()

  const mostActiveRover = roverData?.selected_rover
  const roverDisplayName = mostActiveRover ? getRoverDisplayName(mostActiveRover) : 'Unknown'
  const currentSol = roverData?.sol || 'Unknown'

  // Format temperature for display
  const formatTemperature = (temp: number | null | undefined) => {
    if (temp === null || temp === undefined) return 'N/A'
    return `${Math.round(temp)}°C`
  }

  // Format pressure for display  
  const formatPressure = (pressure: number | null | undefined) => {
    if (pressure === null || pressure === undefined) return 'N/A'
    return `${Math.round(pressure)} Pa`
  }

  // Format wind speed for display
  const formatWindSpeed = (speed: number | null | undefined) => {
    if (speed === null || speed === undefined) return 'N/A'
    return `${Math.round(speed)} m/s`
  }

  return (
    <>
      {/* Animated star field background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          
          {/* Live Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">Live from NASA APIs</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-6 tracking-tight">
              SPACE
            </h1>
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent mb-8 tracking-tight">
              EXPLORER
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real-time data from NASA's Mars missions, astronomical observations, and deep space discoveries
            </p>
          </div>

          {/* Mars Weather Station */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 text-orange-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Mars Weather Station</h2>
                  {weatherData && weatherSol ? (
                    <p className="text-blue-300/70 text-sm mt-1">
                      Perseverance MEDA Data • Sol {weatherSol} • {weatherData.season || 'Unknown Season'}
                    </p>
                  ) : mostActiveRover && (
                    <p className="text-blue-300/70 text-sm mt-1">
                      Data from {roverDisplayName} Rover
                    </p>
                  )}
                </div>
              </div>
              {isLoading || isWeatherLoading ? (
                <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full">
                  <span className="text-yellow-300 text-sm font-medium">Loading Sol...</span>
                </div>
              ) : error || weatherError ? (
                <div className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full">
                  <span className="text-red-300 text-sm font-medium">Connection Error</span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full">
                  <span className="text-orange-300 text-sm font-medium">
                    Sol {weatherSol || currentSol || 'Unknown'}
                  </span>
                </div>
              )}
            </div>

            {/* Weather Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Temperature Card */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Temperature</h3>
                  <div className="w-6 h-6 text-blue-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zM11 5c0-.55.45-1 1-1s1 .45 1 1h-2v0z"/>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {weatherData?.temperature?.air ? 
                      formatTemperature(weatherData.temperature.air.average) : 
                      formatTemperature(-18)
                    }
                  </div>
                  <div className="text-sm text-gray-300">
                    {weatherData?.temperature?.air ? (
                      <>
                        Low: {formatTemperature(weatherData.temperature.air.minimum)} • 
                        High: {formatTemperature(weatherData.temperature.air.maximum)}
                      </>
                    ) : (
                      'Low: -78°C • High: 20°C'
                    )}
                  </div>
                </div>
              </div>

              {/* Wind Card */}
              <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 backdrop-blur-sm border border-green-400/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Wind</h3>
                  <div className="w-6 h-6 text-green-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.5 9l1.75-3.5L7 9H3.5zm8.5 0L10.25 5.5 8.5 9H12zm8.5 0L18.25 5.5 16.5 9H20z"/>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {weatherData?.wind?.speed ? 
                      formatWindSpeed(weatherData.wind.speed.average) : 
                      '12 m/s'
                    }
                  </div>
                  <div className="text-sm text-gray-300">
                    Direction: {weatherData?.wind?.direction?.compass_point || 'SW'}
                  </div>
                </div>
              </div>

              {/* Pressure Card */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Pressure</h3>
                  <div className="w-6 h-6 text-purple-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {weatherData?.pressure ? 
                      formatPressure(weatherData.pressure.average) : 
                      '245 Pa'
                    }
                  </div>
                  <div className="text-sm text-gray-300">
                    {weatherData?.pressure ? (
                      <>Range: {formatPressure(weatherData.pressure.minimum)} - {formatPressure(weatherData.pressure.maximum)}</>
                    ) : (
                      'Atmospheric'
                    )}
                  </div>
                </div>
              </div>

              {/* Season Card */}
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-sm border border-orange-400/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Season</h3>
                  <div className="w-6 h-6 text-orange-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {weatherData?.season ? 
                      weatherData.season.charAt(0).toUpperCase() + weatherData.season.slice(1) : 
                      'Late Summer'
                    }
                  </div>
                  <div className="text-sm text-gray-300">
                    {weatherData ? 'Perseverance MEDA' : 'Estimated'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mars Exploration Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Latest from Mars</h2>
              <p className="text-gray-300 text-lg">
                Discover the Red Planet through the eyes of NASA's rovers
              </p>
            </div>

            {/* Latest Photo Preview */}
            {roverData && roverData.photos && roverData.photos.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-8 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/2">
                    <img
                      src={roverData.photos[0].img_src}
                      alt="Latest Mars rover photo"
                      className="w-full h-64 lg:h-80 object-cover rounded-xl"
                    />
                  </div>
                  <div className="lg:w-1/2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full">
                        <span className="text-red-300 text-sm font-medium">Latest Photo</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {roverDisplayName} Rover • Sol {roverData.photos[0].sol}
                    </h3>
                    <p className="text-gray-300">
                      Captured on {new Date(roverData.photos[0].earth_date).toLocaleDateString()} using the {roverData.photos[0].camera.full_name}
                    </p>
                    <div className="flex space-x-4">
                      <Link 
                        to="/mars-rover" 
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-200"
                      >
                        Explore Mars Photos
                      </Link>
                      <Link 
                        to="/apod" 
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        Astronomy Picture
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                to="/apod" 
                className="group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-400/20 rounded-xl p-6 hover:border-indigo-400/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 text-indigo-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Astronomy Picture
                  </h3>
                </div>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  Daily stunning images from space with detailed explanations
                </p>
              </Link>

              <Link 
                to="/mars-rover" 
                className="group bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-400/20 rounded-xl p-6 hover:border-red-400/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 text-red-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                    Mars Rover Photos
                  </h3>
                </div>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  Explore thousands of images captured by NASA's Mars rovers
                </p>
              </Link>

              <Link 
                to="/about" 
                className="group bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-sm border border-emerald-400/20 rounded-xl p-6 hover:border-emerald-400/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 text-emerald-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Mission Control
                  </h3>
                </div>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  Learn about our mission and the technology behind space exploration
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
