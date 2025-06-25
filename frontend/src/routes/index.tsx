import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      {/* Animated star field background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          {/* Live Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center space-x-2 rounded-full border border-green-400/30 bg-green-500/20 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-green-300">Live from NASA APIs</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-7xl">
              MISSION
            </h1>
            <h1 className="mb-8 bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-7xl">
              CONTROL
            </h1>
            
            {/* Enhanced Tagline */}
            <p className="mx-auto max-w-4xl text-2xl font-semibold leading-relaxed text-blue-200 mb-4">
              Your Gateway to the Cosmos
            </p>
            
            {/* Value Proposition */}
            <p className="mx-auto max-w-5xl text-lg leading-relaxed text-gray-300 mb-6">
              Dive into breathtaking images, vital data, and the latest discoveries from humanity's quest among the stars. 
              Experience space like never before through curated content that brings the wonders of the universe directly to you.
            </p>
            
            {/* USP */}
            <p className="mx-auto max-w-4xl text-base leading-relaxed text-gray-400 italic">
              Curated by space enthusiasts for space enthusiasts, bringing you the most captivating moments from across the solar system.
            </p>
          </div>

          {/* Social Proof */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center space-x-8 rounded-xl border border-white/10 bg-black/20 px-8 py-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15,000+</div>
                <div className="text-sm text-gray-400">Images Explored</div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">Active Missions</div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Daily</div>
                <div className="text-sm text-gray-400">New Discoveries</div>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Begin Your Cosmic Journey</h2>
              <p className="text-xl text-gray-300">
                Choose your path through the universe and unlock the secrets of space exploration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Mars Rover Photos Card */}
              <Link to="/mars-rover" className="group bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-400/20 rounded-xl p-8 hover:border-red-400/40 transition-all duration-300 flex flex-col h-full hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 text-red-400">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Journey to Mars</h3>
                </div>
                <p className="text-gray-200 flex-grow mb-6 text-lg leading-relaxed">
                  Immerse yourself in a vast collection of stunning, high-resolution photographs sent directly from NASA's Mars rovers. 
                  Witness the Martian landscape through the eyes of Curiosity and Perseverance, and uncover the mysteries of an alien world.
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center text-red-300 group-hover:text-red-200 transition-colors">
                    <span className="text-lg font-semibold">Explore Mars Gallery</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
                <div className="mt-4 text-sm text-red-300/70">
                  🔥 Over 1,000 new images monthly
                </div>
              </Link>

              {/* Deep Space Images Card */}
              <Link to="/apod" className="group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-400/20 rounded-xl p-8 hover:border-indigo-400/40 transition-all duration-300 flex flex-col h-full hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 text-indigo-400">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Gaze into the Cosmos</h3>
                </div>
                <p className="text-gray-200 flex-grow mb-6 text-lg leading-relaxed">
                  Discover the awe-inspiring beauty of the universe with our curated collection of deep space images. 
                  Featuring NASA's daily Astronomy Picture of the Day, each image tells a story of distant galaxies, 
                  nebulae, and celestial phenomena.
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    <span className="text-lg font-semibold">View APOD Collection</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
                <div className="mt-4 text-sm text-indigo-300/70">
                  ✨ Fresh cosmic wonder daily
                </div>
              </Link>

              {/* Mars Weather Card */}
              <Link to="/mars-weather" className="group bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm border border-amber-400/20 rounded-xl p-8 hover:border-amber-400/40 transition-all duration-300 flex flex-col h-full hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 text-amber-400">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-2zm2 14c-1.1 0-2-.9-2-2 0-.55.45-1 1-1s1 .45 1 1c0 1.1-.9 2-2 2z"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Martian Climate</h3>
                </div>
                <p className="text-gray-200 flex-grow mb-6 text-lg leading-relaxed">
                  Delve into the unique atmospheric conditions of Mars with fascinating historical weather data from NASA's InSight lander. 
                  Explore daily temperature fluctuations, wind patterns, and pressure readings that shape the Red Planet.
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center text-amber-300 group-hover:text-amber-200 transition-colors">
                    <span className="text-lg font-semibold">Explore Weather Data</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
                <div className="mt-4 text-sm text-amber-300/70">
                  📊 Historical data archive
                </div>
              </Link>
            </div>
          </div>

          {/* Why Explore Space With Us Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Why Explore Space With Us?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-blue-400">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Curated Excellence</h3>
                <p className="text-gray-300">Hand-picked content from NASA's most captivating missions and discoveries.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Latest Discoveries</h3>
                <p className="text-gray-300">Be among the first to explore breakthrough visuals and data from across the cosmos.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-green-400">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Easy Access</h3>
                <p className="text-gray-300">All the wonders of space, organized and accessible in one intuitive platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
