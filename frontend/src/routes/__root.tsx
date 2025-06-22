import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-xl font-bold text-white hover:text-blue-400 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🚀</span>
                </div>
                <span>Mission Control</span>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/apod" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-blue-400 bg-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                Astronomy
              </Link>
              <Link 
                to="/mars-rover" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-blue-400 bg-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                Mars Data
              </Link>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-blue-400 bg-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                Gallery
              </Link>
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-blue-400 bg-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium" }}
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
