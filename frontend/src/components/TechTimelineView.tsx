import { useState, useMemo } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import type { TechPortProject } from '../services/nasa'

interface TechTimelineViewProps {
  projects: TechPortProject[]
  onProjectSelect: (projectId: string) => void
  selectedProject: string | null
}

export default function TechTimelineView({
  projects,
  onProjectSelect,
  selectedProject
}: TechTimelineViewProps) {
  const [timelineView, setTimelineView] = useState<'year' | 'status' | 'trl'>('year')

  const timelineData = useMemo(() => {
    if (timelineView === 'year') {
      const projectsByYear = projects.reduce((acc, project) => {
        const year = new Date(project.startDate).getFullYear()
        if (!acc[year]) acc[year] = []
        acc[year].push(project)
        return acc
      }, {} as Record<number, TechPortProject[]>)

      return Object.entries(projectsByYear)
        .map(([year, projects]) => ({ label: year, projects }))
        .sort((a, b) => parseInt(a.label) - parseInt(b.label))
    }

    if (timelineView === 'status') {
      const projectsByStatus = projects.reduce((acc, project) => {
        if (!acc[project.status]) acc[project.status] = []
        acc[project.status].push(project)
        return acc
      }, {} as Record<string, TechPortProject[]>)

      const statusOrder = ['planned', 'active', 'completed', 'cancelled']
      return statusOrder
        .filter(status => projectsByStatus[status])
        .map(status => ({ 
          label: status.charAt(0).toUpperCase() + status.slice(1), 
          projects: projectsByStatus[status] 
        }))
    }

    if (timelineView === 'trl') {
      const projectsByTrl = projects.reduce((acc, project) => {
        const trl = `TRL ${project.trl}`
        if (!acc[trl]) acc[trl] = []
        acc[trl].push(project)
        return acc
      }, {} as Record<string, TechPortProject[]>)

      return Object.entries(projectsByTrl)
        .map(([trl, projects]) => ({ label: trl, projects }))
        .sort((a, b) => parseInt(a.label.split(' ')[1]) - parseInt(b.label.split(' ')[1]))
    }

    return []
  }, [projects, timelineView])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#66FCF1'
      case 'completed': return '#4CAF50'
      case 'planned': return '#FFC107'
      case 'cancelled': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getTrlColor = (trl: number) => {
    const colors = [
      '#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39',
      '#8BC34A', '#4CAF50', '#00BCD4', '#2196F3'
    ]
    return colors[trl - 1] || '#9E9E9E'
  }

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">📊 Technology Timeline</h3>
            <p className="text-gray-400">
              Explore NASA's technology portfolio across time, status, and readiness levels
            </p>
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: 'year', label: '📅 By Year', icon: '📅' },
              { key: 'status', label: '🎯 By Status', icon: '🎯' },
              { key: 'trl', label: '🔬 By TRL', icon: '🔬' }
            ].map(({ key, label, icon }) => (
              <Button
                key={key}
                onClick={() => setTimelineView(key as any)}
                className={`px-4 py-2 rounded-lg ${
                  timelineView === key
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

      <div className="space-y-6">
        {timelineData.map(({ label, projects: groupProjects }, groupIndex) => (
          <div key={label} className="relative">
            {/* Timeline marker */}
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-[#66FCF1] rounded-full mr-4 flex-shrink-0"></div>
              <h4 className="text-xl font-bold text-white">{label}</h4>
              <div className="ml-4 text-sm text-gray-400">
                {groupProjects.length} project{groupProjects.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Timeline line */}
            {groupIndex < timelineData.length - 1 && (
              <div className="absolute left-2 top-8 w-0.5 h-full bg-gradient-to-b from-[#66FCF1] to-transparent"></div>
            )}

            {/* Projects grid */}
            <div className="ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => onProjectSelect(project.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                    selectedProject === project.id
                      ? 'bg-white/20 border-white shadow-lg'
                      : 'bg-black/60 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-bold text-white text-sm line-clamp-2">
                      {project.title}
                    </h5>
                    <div className="flex-shrink-0 ml-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: timelineView === 'status' 
                            ? getStatusColor(project.status)
                            : timelineView === 'trl'
                            ? getTrlColor(project.trl)
                            : '#66FCF1'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs px-2 py-1 bg-[#66FCF1]/20 text-[#66FCF1] rounded">
                      {project.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-[#C3073F]/20 text-[#C3073F] rounded">
                      TRL {project.trl}
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${getStatusColor(project.status)}20`,
                        color: getStatusColor(project.status)
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {project.organization}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {timelineData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <p>No projects match the current filters</p>
        </div>
      )}
    </Card>
  )
} 