import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About NASA API Explorer</h1>
          <p className="text-xl text-gray-600">Exploring the cosmos through NASA's open data</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            NASA API Explorer (Bounce Mission Control) is a full-stack web application designed to make space exploration 
            accessible to everyone. By leveraging NASA's public APIs, we bring the wonders of the universe directly to your screen.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Astronomy Picture of the Day (APOD)</h3>
              <p className="text-blue-600">
                Discover daily featured astronomy images and videos with detailed explanations from NASA scientists.
                Browse the archive by selecting any past date.
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Mars Rover Photo Explorer</h3>
              <p className="text-red-600">
                Explore high-resolution photographs captured by NASA's Curiosity rover on Mars. 
                Search by Martian day (Sol) and view images in a responsive gallery.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-blue-600 font-semibold">Frontend</div>
              <div className="text-sm text-gray-600">React + TypeScript</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-green-600 font-semibold">Backend</div>
              <div className="text-sm text-gray-600">Node.js + Express</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-purple-600 font-semibold">Routing</div>
              <div className="text-sm text-gray-600">TanStack Router</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-yellow-600 font-semibold">Styling</div>
              <div className="text-sm text-gray-600">Tailwind CSS</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Source</h2>
          <p className="text-gray-600 leading-relaxed">
            All data is sourced exclusively from NASA's Open APIs (api.nasa.gov), ensuring authentic and up-to-date 
            space exploration content. Our backend serves as a secure proxy to these APIs, protecting sensitive 
            credentials while providing a smooth user experience.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-500">
            Built as part of the "bounce Insights" coding challenge
          </p>
        </div>
      </div>
    </div>
  )
}