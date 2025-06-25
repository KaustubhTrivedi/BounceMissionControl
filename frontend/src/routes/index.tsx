import { createFileRoute, Link } from '@tanstack/react-router'
import { useMostActiveRoverWithPhotos } from '@/hooks/useNASA'
import { getRoverDisplayName } from '@/services/nasa'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // Get the most active rover and its latest data
  const { data: roverData, isLoading, error } = useMostActiveRoverWithPhotos({})

  // Extract the current sol from the latest data
  const currentSol = roverData?.photos?.[0]?.sol
  const latestPhoto = roverData?.photos?.[0]
  const mostActiveRover = roverData?.selected_rover
  const roverDisplayName = mostActiveRover ? getRoverDisplayName(mostActiveRover) : 'Unknown'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-60 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
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
                  {mostActiveRover && (
                    <p className="text-blue-300/70 text-sm mt-1">
                      Data from {roverDisplayName} Rover
                    </p>
                  )}
                </div>
              </div>
              {isLoading ? (
                <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full">
                  <span className="text-yellow-300 text-sm font-medium">Loading Sol...</span>
                </div>
              ) : error ? (
                <div className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full">
                  <span className="text-red-300 text-sm font-medium">Connection Error</span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full">
                  <span className="text-orange-300 text-sm font-medium">
                    Sol {currentSol || 'Unknown'}
                  </span>
                </div>
              )}
            </div>

            {/* Weather Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Temperature Card */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-red-400 mr-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">-18°C</div>
                <div className="text-red-300 text-sm">Low: -78°C</div>
              </div>

              {/* Wind Card */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-cyan-400 mr-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">12 m/s</div>
                <div className="text-cyan-300 text-sm">Direction: SW</div>
              </div>

              {/* Pressure Card */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-purple-400 mr-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">245 Pa</div>
                <div className="text-purple-300 text-sm">Season: Late Summer</div>
              </div>

              {/* Visibility Card */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-green-400 mr-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">Clear</div>
                <div className="text-green-300 text-sm">UV Index: 8.5</div>
              </div>
            </div>
            
            {/* Latest Photo Preview */}
            {latestPhoto && (
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-blue-200 mb-4">
                  Latest Image from {roverDisplayName} - Sol {currentSol}
                </h4>
                <div className="flex items-center space-x-4">
                  <img 
                    src={latestPhoto.img_src} 
                    alt={`Mars surface from ${latestPhoto.camera.full_name}`}
                    className="w-20 h-20 rounded-lg object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-white font-medium mb-1">{latestPhoto.camera.full_name}</div>
                    <div className="text-blue-300/70 text-sm mb-1">{latestPhoto.earth_date}</div>
                    <div className="text-gray-400 text-xs">Camera: {latestPhoto.camera.name}</div>
                  </div>
                  <div className="ml-auto">
                    <Link 
                      to="/mars-rover" 
                      className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors text-sm"
                    >
                      View Gallery
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exploration Features */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Astronomy Section */}
              <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border border-blue-400/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-blue-400/40">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Cosmic Observatory</h3>
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Explore the universe through NASA's daily astronomy images. Witness galaxies, nebulae, and celestial phenomena captured by advanced telescopes.
                </p>
                <Link 
                  to="/apod" 
                  className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 group"
                >
                  Explore Universe
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Mars Exploration Section */}
              <div className="bg-gradient-to-br from-orange-600/10 to-red-600/10 backdrop-blur-sm border border-orange-400/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-orange-400/40">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Mars Exploration</h3>
                    {mostActiveRover && (
                      <p className="text-orange-300/70 text-sm">
                        Currently active: {roverDisplayName}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Journey to Mars with our robotic explorers. View real photos from the Martian surface and track the latest discoveries from NASA's rover missions.
                </p>
                <Link 
                  to="/mars-rover" 
                  className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300 group"
                >
                  Explore Mars
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Mission Status Footer */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Mission Status: Operational</span>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-gray-400 text-xs">Powered by NASA Open APIs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
