import { createFileRoute, Link } from '@tanstack/react-router'
import { useMultiPlanetaryDashboard } from '@/hooks/useNASA'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data: dashboardData, isLoading, error } = useMultiPlanetaryDashboard()

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
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">Live NASA Data Explorer</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-6 tracking-tight">
              NASA API
            </h1>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent mb-8 tracking-tight">
              EXPLORER
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover and explore NASA's vast collection of space data, images, and real-time information through interactive APIs
            </p>
          </div>

          

          {/* Mission Details Sections */}
          {!isLoading && !error && (
            <div className="max-w-6xl mx-auto space-y-20">
              {/* Mars Rover Photos Section */}
              <section className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 text-red-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                      Mars Rover Photo Gallery
                    </h2>
                  </div>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Explore thousands of high-resolution photos captured by NASA's Mars rovers including Curiosity, Perseverance, and Opportunity.
                    Witness the Martian landscape through the eyes of our robotic explorers.
                  </p>
                </div>
                <Link
                  to="/mars-rover"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
                >
                  <span className="text-lg">Browse Mars Gallery</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </section>

              {/* Deep Space Images Section */}
              <section className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 text-indigo-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                      Astronomy Picture of the Day
                    </h2>
                  </div>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Discover the cosmos through NASA's daily astronomical discoveries. From nebulae to galaxies,
                    witness the most breathtaking cosmic phenomena captured by space telescopes and observatories.
                  </p>
                </div>
                <Link
                  to="/apod"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
                >
                  <span className="text-lg">Explore Deep Space</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </section>

              {/* Mars Weather Section */}
              <section className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 text-amber-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-2zm2 14c-1.1 0-2-.9-2-2 0-.55.45-1 1-1s1 .45 1 1c0 1.1-.9 2-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                      Live Mars Weather Data
                    </h2>
                  </div>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Get real-time weather updates from Mars surface through the Perseverance rover's MEDA (Mars Environmental Dynamics Analyzer) instruments.
                    Monitor temperature, pressure, and atmospheric conditions on the Red Planet.
                  </p>
                </div>
                <Link
                  to="/mars-weather"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25"
                >
                  <span className="text-lg">Check Mars Weather</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </section>

            </div>
          )}




        </div>
      </div>
    </>
  )
}
