import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import MarsBackdrop from '../components/MarsBackdrop'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen relative">
      {/* Dynamic Mars Command Backdrop */}
      <MarsBackdrop />
      {/* Navigation Header */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-xl font-bold text-white hover:text-[#66FCF1] transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#C3073F] to-[#FF7F50] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🔴</span>
                </div>
                <span>Bounce Mission Control</span>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/apod" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-[#66FCF1] bg-[#66FCF1]/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                Astronomy
              </Link>
              <Link 
                to="/mars-rover" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-[#C3073F] bg-[#C3073F]/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                Mars Data
              </Link>
              <Link 
                to="/techport" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-[#FF7F50] bg-[#FF7F50]/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                TechPort
              </Link>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-[#66FCF1] bg-[#66FCF1]/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                Gallery
              </Link>
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                activeProps={{ className: "text-[#FF7F50] bg-[#FF7F50]/20 px-4 py-2 rounded-lg text-sm font-medium" }}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Devtools */}
      <TanStackRouterDevtools />
    </div>
  )
}
