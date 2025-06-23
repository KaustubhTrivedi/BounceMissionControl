import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import type { TechPortProject, TechPortCategory } from '../services/nasa'

interface SearchFilterPanelProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: {
    category: string
    status: string
    trl: string
    organization: string
  }
  onFiltersChange: (filters: any) => void
  categories: TechPortCategory[]
  projects: TechPortProject[]
}

export default function SearchFilterPanel({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  categories,
  projects
}: SearchFilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Safely extract unique values with null checks
  const uniqueOrganizations = Array.from(new Set(
    projects.filter(p => p?.organization).map(p => p.organization)
  )).sort()
  
  const uniqueStatuses = Array.from(new Set(
    projects.filter(p => p?.status).map(p => p.status)
  )).sort()
  
  const trlLevels = Array.from({length: 9}, (_, i) => i + 1)

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      status: '',
      trl: '',
      organization: ''
    })
    onSearchChange('')
  }

  const hasActiveFilters = searchQuery || Object.values(filters).some(v => v)
  const activeFilterCount = Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0)

  return (
    <Card 
      className="p-6 bg-black/40 backdrop-blur-md border-white/10"
      role="search"
      aria-label="Project search and filter controls"
    >
      {/* Search Bar */}
      <div className="relative mb-4">
        <label htmlFor="project-search" className="sr-only">
          Search NASA technology projects
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400" aria-hidden="true">🔍</span>
        </div>
        <input
          id="project-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, descriptions, tags..."
          className="w-full pl-10 pr-12 py-3 bg-black/60 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 
                     focus:border-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/50
                     hover:border-white/30 transition-colors"
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">
          Search across project titles, descriptions, and tags. Use keywords like propulsion, robotics, or mars.
        </div>
        
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white 
                       focus:text-white focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/50 rounded-r-lg"
            aria-label="Clear search query"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-4" role="toolbar" aria-label="Filter controls">
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-[#66FCF1]/20 text-[#66FCF1] hover:bg-[#66FCF1]/30 border-2 border-[#66FCF1]/30
                     focus:ring-2 focus:ring-[#66FCF1]/50 focus:border-[#66FCF1]"
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
          type="button"
        >
          <span className="mr-2" aria-hidden="true">⚙️</span>
          Advanced Filters
          <span className="ml-2" aria-hidden="true">{showAdvanced ? '▲' : '▼'}</span>
        </Button>
        
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border-2 border-red-500/30
                       focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            aria-label={`Clear all ${activeFilterCount} active filters`}
            type="button"
          >
            <span className="mr-2" aria-hidden="true">🗑️</span>
            Clear All ({activeFilterCount})
          </Button>
        )}

        {/* Active filter indicators - improved accessibility */}
        {filters.category && (
          <div 
            className="px-3 py-1 bg-[#C3073F]/20 border-2 border-[#C3073F]/30 rounded-full text-[#C3073F] text-sm font-medium"
            role="status"
            aria-label={`Active filter: Category is ${filters.category}`}
          >
            Category: {filters.category}
          </div>
        )}
        {filters.status && (
          <div 
            className="px-3 py-1 bg-[#FF7F50]/20 border-2 border-[#FF7F50]/30 rounded-full text-[#FF7F50] text-sm font-medium"
            role="status"
            aria-label={`Active filter: Status is ${filters.status}`}
          >
            Status: {filters.status}
          </div>
        )}
        {filters.trl && (
          <div 
            className="px-3 py-1 bg-[#4CAF50]/20 border-2 border-[#4CAF50]/30 rounded-full text-[#4CAF50] text-sm font-medium"
            role="status"
            aria-label={`Active filter: TRL level is ${filters.trl}`}
          >
            TRL: {filters.trl}
          </div>
        )}
        {filters.organization && (
          <div 
            className="px-3 py-1 bg-purple-500/20 border-2 border-purple-500/30 rounded-full text-purple-300 text-sm font-medium"
            role="status"
            aria-label={`Active filter: Organization is ${filters.organization}`}
          >
            Org: {filters.organization}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <fieldset 
          id="advanced-filters"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-white/10"
        >
          <legend className="sr-only">Advanced filter options</legend>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-200 mb-2">
              Category
            </label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => onFiltersChange({...filters, category: e.target.value})}
              className="w-full p-3 bg-black/60 border-2 border-white/20 rounded-lg text-white 
                         focus:border-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/50
                         hover:border-white/30 transition-colors"
              aria-describedby="category-help"
            >
              <option value="">All Categories</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.count || 0})
                </option>
              ))}
            </select>
            <div id="category-help" className="sr-only">
              Filter projects by technology category such as propulsion, robotics, or materials
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-200 mb-2">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => onFiltersChange({...filters, status: e.target.value})}
              className="w-full p-3 bg-black/60 border-2 border-white/20 rounded-lg text-white 
                         focus:border-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/50
                         hover:border-white/30 transition-colors"
              aria-describedby="status-help"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <div id="status-help" className="sr-only">
              Filter projects by current status: active, completed, or planned
            </div>
          </div>

          {/* TRL Filter */}
          <div>
            <label htmlFor="trl-filter" className="block text-sm font-medium text-gray-200 mb-2">
              <abbr title="Technology Readiness Level">TRL</abbr> Level
            </label>
            <select
              id="trl-filter"
              value={filters.trl}
              onChange={(e) => onFiltersChange({...filters, trl: e.target.value})}
              className="w-full p-3 bg-black/60 border-2 border-white/20 rounded-lg text-white 
                         focus:border-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/50
                         hover:border-white/30 transition-colors"
              aria-describedby="trl-help"
            >
              <option value="">All TRL Levels</option>
              {trlLevels.map(trl => (
                <option key={trl} value={trl.toString()}>TRL {trl}</option>
              ))}
            </select>
            <div id="trl-help" className="sr-only">
              Filter by Technology Readiness Level from 1 (basic research) to 9 (flight proven)
            </div>
          </div>

          {/* Organization Filter */}
          <div>
            <label htmlFor="organization-filter" className="block text-sm font-medium text-gray-200 mb-2">
              Organization
            </label>
            <select
              id="organization-filter"
              value={filters.organization}
              onChange={(e) => onFiltersChange({...filters, organization: e.target.value})}
              className="w-full p-3 bg-black/60 border-2 border-white/20 rounded-lg text-white 
                         focus:border-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/50
                         hover:border-white/30 transition-colors"
              aria-describedby="org-help"
            >
              <option value="">All Organizations</option>
              {uniqueOrganizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
            <div id="org-help" className="sr-only">
              Filter projects by NASA center or organization responsible for the project
            </div>
          </div>
        </fieldset>
      )}
    </Card>
  )
} 