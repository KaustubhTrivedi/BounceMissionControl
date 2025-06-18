import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🚀</span>
                </div>
                <span>Bounce Mission Control</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link 
                to="/apod" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                activeProps={{ className: "text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium" }}
              >
                Astronomy Picture
              </Link>
              <Link 
                to="/mars-rover" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                activeProps={{ className: "text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium" }}
              >
                Mars Rover Photos
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                activeProps={{ className: "text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium" }}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Devtools */}
      <TanStackRouterDevtools />
    </div>
  )
}
