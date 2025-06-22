import React from 'react'
import { type PlanetData } from '@/services/nasa'

interface PlanetCardProps {
  planet: PlanetData
}

const PlanetCard: React.FC<PlanetCardProps> = ({ planet }) => {
  // Get status-based styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 border-green-400/30 text-green-300'
      case 'planned':
        return 'bg-blue-500/20 border-blue-400/30 text-blue-300'
      case 'en-route':
        return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300'
      case 'completed':
        return 'bg-gray-500/20 border-gray-400/30 text-gray-300'
      default:
        return 'bg-gray-500/20 border-gray-400/30 text-gray-300'
    }
  }

  // Get radiation level styling
  const getRadiationStyle = (level?: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400'
      case 'moderate':
        return 'text-yellow-400'
      case 'high':
        return 'text-orange-400'
      case 'extreme':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  // Get planet-based gradient
  const getPlanetGradient = (planetId: string) => {
    switch (planetId) {
      case 'mars':
        return 'from-red-900/40 to-orange-900/40 border-red-400/20'
      case 'moon':
        return 'from-gray-800/40 to-slate-900/40 border-gray-400/20'
      case 'venus':
        return 'from-yellow-900/40 to-orange-900/40 border-yellow-400/20'
      case 'europa':
        return 'from-blue-900/40 to-cyan-900/40 border-blue-400/20'
      case 'titan':
        return 'from-amber-900/40 to-orange-900/40 border-amber-400/20'
      case 'asteroid-belt':
        return 'from-stone-900/40 to-gray-900/40 border-stone-400/20'
      default:
        return 'from-purple-900/40 to-indigo-900/40 border-purple-400/20'
    }
  }

  const activeMissions = planet.active_missions.filter(mission => mission.status === 'active').length
  const plannedMissions = planet.active_missions.filter(mission => mission.status === 'planned').length
  const enRouteMissions = planet.active_missions.filter(mission => mission.status === 'en-route').length

  return (
    <div className={`bg-gradient-to-br ${getPlanetGradient(planet.id)} backdrop-blur-sm border rounded-xl p-6 hover:border-opacity-40 transition-all duration-300 hover:scale-[1.02]`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{planet.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 capitalize">{planet.type}</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span className="text-xs text-gray-400">
              {planet.data_freshness.hours_ago === 0 ? 'Just updated' : `${planet.data_freshness.hours_ago}h ago`}
            </span>
          </div>
        </div>
        
        {/* Mission Count Badge */}
        <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-full">
          <span className="text-white text-sm font-medium">
            {planet.mission_count} Mission{planet.mission_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Active Missions */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
          <div className="w-4 h-4 mr-2">
            <svg fill="currentColor" viewBox="0 0 24 24" className="text-cyan-400">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          Active Missions
        </h4>
        <div className="space-y-2">
          {activeMissions > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">
                {activeMissions} Active
              </span>
            </div>
          )}
          {enRouteMissions > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-yellow-300 text-sm">
                {enRouteMissions} En Route
              </span>
            </div>
          )}
          {plannedMissions > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-blue-300 text-sm">
                {plannedMissions} Planned
              </span>
            </div>
          )}
          {planet.mission_count === 0 && (
            <span className="text-gray-400 text-sm">No active missions</span>
          )}
        </div>
      </div>

      {/* Surface Conditions */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
          <div className="w-4 h-4 mr-2">
            <svg fill="currentColor" viewBox="0 0 24 24" className="text-orange-400">
              <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4z"/>
            </svg>
          </div>
          Surface Conditions
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Temp:</span>
            <span className="text-white ml-1">
              {planet.surface_conditions.temperature.average}°C
            </span>
          </div>
          <div>
            <span className="text-gray-400">Gravity:</span>
            <span className="text-white ml-1">
              {planet.surface_conditions.gravity}g
            </span>
          </div>
          {planet.surface_conditions.radiation_level && (
            <div className="col-span-2">
              <span className="text-gray-400">Radiation:</span>
              <span className={`ml-1 capitalize ${getRadiationStyle(planet.surface_conditions.radiation_level)}`}>
                {planet.surface_conditions.radiation_level}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Last Activity */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
          <div className="w-4 h-4 mr-2">
            <svg fill="currentColor" viewBox="0 0 24 24" className="text-purple-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          Last Activity
        </h4>
        <div className="text-sm">
          <div className="text-gray-300 mb-1">{planet.last_activity.description}</div>
          <div className="text-gray-500">
            {planet.last_activity.days_ago === 0 ? 'Today' : `${planet.last_activity.days_ago} days ago`}
          </div>
        </div>
      </div>

      {/* Next Event */}
      {planet.next_event && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
            <div className="w-4 h-4 mr-2">
              <svg fill="currentColor" viewBox="0 0 24 24" className="text-green-400">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            Next Event
          </h4>
          <div className="text-sm">
            <div className="text-gray-300 mb-1">{planet.next_event.description}</div>
            <div className="text-gray-500">
              {planet.next_event.days_until > 0 
                ? `In ${planet.next_event.days_until} days`
                : planet.next_event.days_until === 0 
                  ? 'Today' 
                  : `${Math.abs(planet.next_event.days_until)} days ago`
              }
            </div>
          </div>
        </div>
      )}

      {/* Notable Fact */}
      <div className="pt-3 border-t border-white/10">
        <div className="text-xs text-gray-400 mb-1">Did you know?</div>
        <div className="text-sm text-gray-300 italic">
          {planet.notable_fact}
        </div>
      </div>
    </div>
  )
}

export default PlanetCard 