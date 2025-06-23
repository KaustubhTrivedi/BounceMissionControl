import { Card } from './ui/card'
import { Button } from './ui/button'
import type { TechPortProject } from '../services/nasa'

interface ProjectDetailPanelProps {
  project: TechPortProject
  onClose: () => void
}

export default function ProjectDetailPanel({
  project,
  onClose
}: ProjectDetailPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#66FCF1'
      case 'completed': return '#4CAF50'
      case 'planned': return '#FFC107'
      case 'cancelled': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getTrlDescription = (trl: number) => {
    const descriptions = {
      1: 'Basic principles observed',
      2: 'Technology concept formulated',
      3: 'Experimental proof of concept',
      4: 'Technology validated in laboratory',
      5: 'Technology validated in relevant environment',
      6: 'Technology demonstrated in relevant environment',
      7: 'System prototype demonstration',
      8: 'System complete and qualified',
      9: 'Actual system proven in operational environment'
    }
    return descriptions[trl as keyof typeof descriptions] || 'Unknown TRL level'
  }

  const formatBudget = (budget: number) => {
    if (budget >= 1e9) return `$${(budget / 1e9).toFixed(1)}B`
    if (budget >= 1e6) return `$${(budget / 1e6).toFixed(1)}M`
    if (budget >= 1e3) return `$${(budget / 1e3).toFixed(0)}K`
    return `$${budget}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-black/90 backdrop-blur-md border-l border-white/20 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {project.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor(project.status) }}
              ></span>
              <span className="text-sm text-gray-300 capitalize">
                {project.status}
              </span>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="ml-4 p-2 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-black/60 border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66FCF1]">
                TRL {project.trl}
              </div>
              <div className="text-xs text-gray-400">
                Technology Readiness
              </div>
            </div>
          </Card>
          
          {project.budget && (
            <Card className="p-4 bg-black/60 border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C3073F]">
                  {formatBudget(project.budget)}
                </div>
                <div className="text-xs text-gray-400">
                  Total Budget
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Description</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* TRL Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Technology Readiness</h3>
          <Card className="p-4 bg-gradient-to-r from-[#66FCF1]/10 to-[#C3073F]/10 border-[#66FCF1]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#66FCF1]">TRL {project.trl}</span>
              <div className="flex space-x-1">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < project.trl ? 'bg-[#66FCF1]' : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              {getTrlDescription(project.trl)}
            </p>
          </Card>
        </div>

        {/* Project Details */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Project Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-white font-medium">{project.category}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Organization:</span>
                <span className="text-white font-medium">{project.organization}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white font-medium">{project.location}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Start Date:</span>
                <span className="text-white font-medium">{formatDate(project.startDate)}</span>
              </div>
              
              {project.endDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">End Date:</span>
                  <span className="text-white font-medium">{formatDate(project.endDate)}</span>
                </div>
              )}
              
              {project.manager && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Manager:</span>
                  <span className="text-white font-medium">{project.manager}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#66FCF1]/20 text-[#66FCF1] rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {project.benefits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Key Benefits</h3>
            <ul className="space-y-2">
              {project.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-[#66FCF1] mt-1">•</span>
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500">
            Last updated: {formatDate(project.lastUpdated)}
          </p>
        </div>
      </div>
    </div>
  )
} 