import { useState, useMemo } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import type { TechPortProject, TechPortCategory } from '../services/nasa'

interface TechMapViewProps {
  projects: TechPortProject[]
  categories: TechPortCategory[]
  onProjectSelect: (projectId: string) => void
  selectedProject: string | null
}

export default function TechMapView({
  projects,
  categories,
  onProjectSelect,
  selectedProject
}: TechMapViewProps) {
  const [mapView, setMapView] = useState<'category' | 'organization' | 'trl'>('category')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const mapData = useMemo(() => {
    if (mapView === 'category') {
      const projectsByCategory = projects.reduce((acc, project) => {
        if (!acc[project.category]) acc[project.category] = []
        acc[project.category].push(project)
        return acc
      }, {} as Record<string, TechPortProject[]>)

      return Object.entries(projectsByCategory).map(([category, categoryProjects]) => ({
        id: category,
        label: category,
        projects: categoryProjects,
        color: categories.find(c => c.name === category)?.color || '#66FCF1',
        size: categoryProjects.length
      }))
    }

    if (mapView === 'organization') {
      const projectsByOrg = projects.reduce((acc, project) => {
        if (!acc[project.organization]) acc[project.organization] = []
        acc[project.organization].push(project)
        return acc
      }, {} as Record<string, TechPortProject[]>)

      const orgColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#FFB347', '#87CEEB', '#F0E68C', '#FFA07A'
      ]

      return Object.entries(projectsByOrg).map(([org, orgProjects], index) => ({
        id: org,
        label: org,
        projects: orgProjects,
        color: orgColors[index % orgColors.length],
        size: orgProjects.length
      }))
    }

    if (mapView === 'trl') {
      const projectsByTrl = projects.reduce((acc, project) => {
        const trlKey = `TRL ${project.trl}`
        if (!acc[trlKey]) acc[trlKey] = []
        acc[trlKey].push(project)
        return acc
      }, {} as Record<string, TechPortProject[]>)

      const trlColors = [
        '#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39',
        '#8BC34A', '#4CAF50', '#00BCD4', '#2196F3'
      ]

      return Object.entries(projectsByTrl)
        .map(([trl, trlProjects]) => ({
          id: trl,
          label: trl,
          projects: trlProjects,
          color: trlColors[parseInt(trl.split(' ')[1]) - 1] || '#9E9E9E',
          size: trlProjects.length
        }))
        .sort((a, b) => parseInt(a.id.split(' ')[1]) - parseInt(b.id.split(' ')[1]))
    }

    return []
  }, [projects, categories, mapView])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#66FCF1'
      case 'completed': return '#4CAF50'
      case 'planned': return '#FFC107'
      case 'cancelled': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">🗺️ Technology Map</h3>
            <p className="text-gray-400">
              Interactive network of NASA technologies grouped by similarity and relationships
            </p>
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: 'category', label: '📂 Category', icon: '📂' },
              { key: 'organization', label: '🏢 Organization', icon: '🏢' },
              { key: 'trl', label: '🔬 TRL Level', icon: '🔬' }
            ].map(({ key, label, icon }) => (
              <Button
                key={key}
                onClick={() => setMapView(key as any)}
                className={`px-4 py-2 rounded-lg ${
                  mapView === key
                    ? 'bg-[#66FCF1] text-black font-bold'
                    : 'bg-transparent text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label.split(' ')[1]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mapData.map(group => (
          <div
            key={group.id}
            className="relative bg-black/60 rounded-lg p-4 border border-white/20 hover:border-white/40 transition-all"
          >
            {/* Group Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                ></div>
                <h4 className="font-bold text-white">{group.label}</h4>
              </div>
              <div className="text-sm text-gray-400">
                {group.size} project{group.size !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {group.projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => onProjectSelect(project.id)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedProject === project.id
                      ? 'bg-white/20 border-white shadow-lg'
                      : hoveredProject === project.id
                      ? 'bg-white/10 border-white/40'
                      : 'bg-black/40 border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-white text-sm line-clamp-1">
                      {project.title}
                    </h5>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 ml-2"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    ></div>
                  </div>
                  
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <span className="text-xs px-2 py-1 bg-[#C3073F]/20 text-[#C3073F] rounded">
                        TRL {project.trl}
                      </span>
                      {mapView !== 'category' && (
                        <span className="text-xs px-2 py-1 bg-[#66FCF1]/20 text-[#66FCF1] rounded">
                          {project.category}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {project.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connection indicators */}
            {group.projects.length > 1 && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full opacity-20">
                  {group.projects.slice(0, -1).map((project, index) => {
                    const startY = 80 + (index * 70)
                    const endY = 80 + ((index + 1) * 70)
                    return (
                      <line
                        key={`${project.id}-${index}`}
                        x1="20"
                        y1={startY}
                        x2="20"
                        y2={endY}
                        stroke={group.color}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )
                  })}
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {mapData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🗺️</div>
          <p>No projects match the current filters</p>
        </div>
      )}
    </Card>
  )
} 