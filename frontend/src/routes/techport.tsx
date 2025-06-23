import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { nasaApi } from '../services/nasa'
import type { TechPortProject, TechPortCategory, TechPortAnalytics } from '../services/nasa'

// TechPort Visual Explorer Components
import TechGalaxyView from '../components/TechGalaxyView'
import TechTimelineView from '../components/TechTimelineView'
import TechMapView from '../components/TechMapView'
import SearchFilterPanel from '../components/SearchFilterPanel'
import ProjectDetailPanel from '../components/ProjectDetailPanel'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

export const Route = createFileRoute('/techport')({
  component: TechPortExplorer,
})

type ViewMode = 'galaxy' | 'timeline' | 'map' | 'analytics'

function TechPortExplorer() {
  const [projects, setProjects] = useState<TechPortProject[]>([])
  const [categories, setCategories] = useState<TechPortCategory[]>([])
  const [analytics, setAnalytics] = useState<TechPortAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // View and filter states
  const [viewMode, setViewMode] = useState<ViewMode>('galaxy')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    trl: '',
    organization: ''
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectsRes, categoriesRes, analyticsRes] = await Promise.all([
          nasaApi.getTechPortProjects({ limit: 500 }),
          nasaApi.getTechPortCategories(),
          nasaApi.getTechPortAnalytics()
        ])
        
        setProjects(projectsRes.projects)
        setCategories(categoriesRes.categories)
        setAnalytics(analyticsRes)
      } catch (err) {
        setError('Failed to load TechPort data')
        console.error('TechPort data loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !filters.category || 
        project.category.toLowerCase().includes(filters.category.toLowerCase())

      const matchesStatus = !filters.status || 
        project.status === filters.status

      const matchesTrl = !filters.trl || 
        project.trl.toString() === filters.trl

      const matchesOrganization = !filters.organization || 
        project.organization.toLowerCase().includes(filters.organization.toLowerCase())

      return matchesSearch && matchesCategory && matchesStatus && matchesTrl && matchesOrganization
    })
  }, [projects, searchQuery, filters])

  const selectedProjectData = useMemo(() => {
    return selectedProject ? projects.find(p => p.id === selectedProject) : null
  }, [projects, selectedProject])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#66FCF1] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg">Loading NASA Technology Portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 bg-red-900/20 border-red-500">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading TechPort Data</h2>
          <p className="text-red-300">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          <span className="bg-gradient-to-r from-[#66FCF1] via-[#C3073F] to-[#FF7F50] bg-clip-text text-transparent">
            NASA TechPort
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          🧭 Visual Explorer of NASA's Technology Portfolio - Discover the galaxy of innovations 
          shaping the future of space exploration
        </p>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
            <div className="text-2xl font-bold text-[#66FCF1]">{projects.length}</div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
            <div className="text-2xl font-bold text-[#C3073F]">{filteredProjects.length}</div>
            <div className="text-sm text-gray-400">Filtered Results</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
            <div className="text-2xl font-bold text-[#FF7F50]">{categories.length}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Panel */}
      <SearchFilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        projects={projects}
      />

      {/* View Mode Selector */}
      <div className="flex justify-center">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10">
          <div className="flex space-x-2">
            {[
              { mode: 'galaxy' as ViewMode, icon: '🌌', label: 'Galaxy View' },
              { mode: 'timeline' as ViewMode, icon: '📊', label: 'Timeline' },
              { mode: 'map' as ViewMode, icon: '🗺️', label: 'Tech Map' },
              { mode: 'analytics' as ViewMode, icon: '📈', label: 'Analytics' }
            ].map(({ mode, icon, label }) => (
              <Button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-[#66FCF1] text-black font-bold'
                    : 'bg-transparent text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="relative">
        {viewMode === 'galaxy' && (
          <TechGalaxyView
            projects={filteredProjects}
            categories={categories}
            onProjectSelect={setSelectedProject}
            selectedProject={selectedProject}
          />
        )}
        
        {viewMode === 'timeline' && (
          <TechTimelineView
            projects={filteredProjects}
            onProjectSelect={setSelectedProject}
            selectedProject={selectedProject}
          />
        )}
        
        {viewMode === 'map' && (
          <TechMapView
            projects={filteredProjects}
            categories={categories}
            onProjectSelect={setSelectedProject}
            selectedProject={selectedProject}
          />
        )}
        
        {viewMode === 'analytics' && analytics && (
          <AnalyticsDashboard
            analytics={analytics}
            projects={filteredProjects}
          />
        )}

        {/* Project Detail Side Panel */}
        {selectedProjectData && (
          <ProjectDetailPanel
            project={selectedProjectData}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>

      {/* Footer Credits */}
      <div className="text-center text-gray-500 text-sm mt-12">
        <p>Powered by NASA TechPort API • Data updated {analytics?.timestamp ? new Date(analytics.timestamp).toLocaleDateString() : 'recently'}</p>
      </div>
    </div>
  )
} 