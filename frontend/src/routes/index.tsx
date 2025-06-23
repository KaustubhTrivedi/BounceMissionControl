import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMultiPlanetaryDashboard } from '@/hooks/useNASA'
import PlanetCard from '@/components/PlanetCard'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data: dashboardData, isLoading, error } = useMultiPlanetaryDashboard()
  const [activeFilter, setActiveFilter] = useState<'all' | 'planets' | 'moons' | 'asteroids'>('all')

  // Filter planets based on active filter
  const filteredPlanets = dashboardData?.planets.filter(planet => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'planets') return planet.type === 'planet'
    if (activeFilter === 'moons') return planet.type === 'moon'
    if (activeFilter === 'asteroids') return planet.type === 'asteroid'
    return true
  }) || []

  const totalActiveMissions = dashboardData?.total_active_missions || 0
  const totalPlanets = dashboardData?.planets.length || 0

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
              <span className="text-green-300 text-sm font-medium">Live Mission Control Center</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-6 tracking-tight">
              MISSION
            </h1>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent mb-8 tracking-tight">
              CONTROL
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Real-time command center for ongoing space missions across the solar system
            </p>
          </div>

          {/* Mission Overview Stats */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Active Missions */}
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm border border-green-400/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-green-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {isLoading ? '—' : totalActiveMissions}
                </div>
                <div className="text-green-300 font-medium">Active Missions</div>
                <div className="text-xs text-gray-400 mt-1">Across all celestial bodies</div>
              </div>

              {/* Celestial Bodies Monitored */}
              <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-blue-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {isLoading ? '—' : totalPlanets}
                </div>
                <div className="text-blue-300 font-medium">Celestial Bodies</div>
                <div className="text-xs text-gray-400 mt-1">Under active monitoring</div>
              </div>

              {/* Data Freshness */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 6h-4v6l3 3-1 1-4-4V7h2v5.6l2.6 2.6L16 8z"/>
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {isLoading ? '—' : 'Live'}
                </div>
                <div className="text-purple-300 font-medium">Data Status</div>
                <div className="text-xs text-gray-400 mt-1">Real-time mission updates</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All Missions', count: totalPlanets },
                  { key: 'planets', label: 'Planets', count: dashboardData?.planets.filter(p => p.type === 'planet').length || 0 },
                  { key: 'moons', label: 'Moons', count: dashboardData?.planets.filter(p => p.type === 'moon').length || 0 },
                  { key: 'asteroids', label: 'Asteroids', count: dashboardData?.planets.filter(p => p.type === 'asteroid').length || 0 },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter.key
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-6xl mx-auto text-center py-12">
              <div className="inline-flex items-center space-x-2 text-blue-300">
                <div className="w-6 h-6 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                <span>Loading mission data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-6xl mx-auto text-center py-12">
              <div className="bg-red-900/40 border border-red-400/30 rounded-xl p-6">
                <div className="text-red-400 mb-2">Mission Control Connection Error</div>
                <div className="text-gray-300 text-sm">Unable to fetch live mission data. Please try again later.</div>
              </div>
            </div>
          )}

          {/* Planet Cards Grid */}
          {!isLoading && !error && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredPlanets.map((planet) => (
                  <PlanetCard key={planet.id} planet={planet} />
                ))}
              </div>

              {filteredPlanets.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">No missions found for this filter</div>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View all missions
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mission Details Links */}
          {!isLoading && !error && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Detailed Mission Data</h2>
                <p className="text-gray-300">
                  Explore specific missions and discoveries in detail
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Mars Rover Photos Link */}
                <Link 
                  to="/mars-rover" 
                  className="group bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-400/20 rounded-xl p-6 hover:border-red-400/40 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 text-red-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                      Mars Rover Photos
                    </h3>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors flex-grow">
                    Explore thousands of photos captured by NASA's Mars rovers including Curiosity and Perseverance
                  </p>
                  <div className="mt-4 flex items-center text-red-300 group-hover:text-red-200 transition-colors">
                    <span className="text-sm font-medium">Browse Gallery</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link 
                  to="/apod" 
                  className="group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-400/20 rounded-xl p-6 hover:border-indigo-400/40 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 text-indigo-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Deep Space Images
                    </h3>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors flex-grow">
                    Daily astronomical discoveries and cosmic phenomena captured by NASA
                  </p>
                  <div className="mt-4 flex items-center text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    <span className="text-sm font-medium">View APOD</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link 
                  to="/mars-weather" 
                  className="group bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 hover:border-amber-400/40 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 text-amber-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-2zm2 14c-1.1 0-2-.9-2-2 0-.55.45-1 1-1s1 .45 1 1c0 1.1-.9 2-2 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      Mars Weather
                    </h3>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors flex-grow">
                    Live weather data from Perseverance rover's MEDA instruments on Mars
                  </p>
                  <div className="mt-4 flex items-center text-amber-300 group-hover:text-amber-200 transition-colors">
                    <span className="text-sm font-medium">View Weather</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <div className="group bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-sm border border-emerald-400/20 rounded-xl p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 text-emerald-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 6h-4v6l3 3-1 1-4-4V7h2v5.6l2.6 2.6L16 8z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Mission Status
                    </h3>
                  </div>
                  <p className="text-gray-300 flex-grow">
                    Real-time monitoring of active space missions across the solar system
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Active Missions</span>
                      <span className="text-emerald-300 font-medium">{totalActiveMissions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Celestial Bodies</span>
                      <span className="text-emerald-300 font-medium">{totalPlanets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Status</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-300 font-medium text-sm">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
