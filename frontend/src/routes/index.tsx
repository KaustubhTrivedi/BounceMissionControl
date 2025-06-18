import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            NASA API Explorer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the wonders of space through NASA's open data APIs. Discover breathtaking astronomy images and explore Mars through the eyes of rovers.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* APOD Card */}
          <Link 
            to="/apod" 
            className="group block bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white">Astronomy Picture of the Day</h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Discover NASA's featured astronomy image or video with detailed explanations. Browse through stunning cosmic imagery captured by telescopes and spacecraft.
            </p>
            <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="text-lg">Explore APOD</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Mars Rover Card */}
          <Link 
            to="/mars-rover" 
            className="group block bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Mars Rover Photos</h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Explore photographs captured by NASA's Curiosity rover on Mars. Search by Martian day (Sol) and view high-resolution images from the Red Planet.
            </p>
            <div className="flex items-center text-red-400 group-hover:text-red-300 transition-colors">
              <span className="text-lg">Explore Mars</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Features Overview */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Date Selection</h3>
              <p className="text-gray-400">Browse APOD archive by selecting any past date</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sol Search</h3>
              <p className="text-gray-400">Search Mars rover photos by Martian day number</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">High-Res Gallery</h3>
              <p className="text-gray-400">View images in full resolution with modal gallery</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Powered by NASA Open APIs</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This application uses NASA's publicly available APIs to bring you the latest in space exploration and astronomical discoveries.
          </p>
          <Link 
            to="/about" 
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
