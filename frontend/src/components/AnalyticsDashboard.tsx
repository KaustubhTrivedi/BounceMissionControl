import { Card } from './ui/card'
import type { TechPortAnalytics, TechPortProject } from '../services/nasa'

interface AnalyticsDashboardProps {
  analytics: TechPortAnalytics
  projects: TechPortProject[]
}

export default function AnalyticsDashboard({
  analytics,
  projects: _projects
}: AnalyticsDashboardProps) {
  const formatBudget = (budget: number | undefined) => {
    if (!budget || budget === 0) return '$0'
    if (budget >= 1e9) return `$${(budget / 1e9).toFixed(1)}B`
    if (budget >= 1e6) return `$${(budget / 1e6).toFixed(1)}M`
    return `$${(budget / 1e3).toFixed(0)}K`
  }

  // Safe data extraction with null checks
  const safeAnalytics = {
    overview: analytics?.overview || {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      plannedProjects: 0,
      totalBudget: 0,
      averageTrl: 0
    },
    trlDistribution: analytics?.trlDistribution || {},
    categoryDistribution: analytics?.categoryDistribution || [],
    organizationDistribution: analytics?.organizationDistribution || [],
    timeline: analytics?.timeline || []
  }

  const maxCategoryCount = Math.max(...safeAnalytics.categoryDistribution.map(c => c?.count || 0), 1)
  const maxOrgCount = Math.max(...safeAnalytics.organizationDistribution.map(o => o?.count || 0), 1)
  const maxTrlCount = Math.max(...Object.values(safeAnalytics.trlDistribution).map(v => v || 0), 1)

  return (
    <main className="space-y-6" role="main" aria-label="NASA Technology Portfolio Analytics Dashboard">
      {/* Header */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <header>
          <h1 className="text-2xl font-bold text-white mb-2">📈 Analytics Dashboard</h1>
          <p className="text-gray-300 text-lg">
            Comprehensive insights into NASA's technology portfolio and development trends
          </p>
        </header>
      </Card>

      {/* Overview Metrics */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Portfolio Overview Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 bg-gradient-to-br from-[#66FCF1]/20 to-[#66FCF1]/5 border-[#66FCF1]/30">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-[#66FCF1]"
                aria-label={`${safeAnalytics.overview.totalProjects} total projects`}
              >
                {safeAnalytics.overview.totalProjects.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300 font-medium">Total Projects</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#4CAF50]/20 to-[#4CAF50]/5 border-[#4CAF50]/30">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-[#4CAF50]"
                aria-label={`${safeAnalytics.overview.activeProjects} active projects`}
              >
                {safeAnalytics.overview.activeProjects.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300 font-medium">Active Projects</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#FFC107]/20 to-[#FFC107]/5 border-[#FFC107]/30">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-[#FFC107]"
                aria-label={`${safeAnalytics.overview.completedProjects} completed projects`}
              >
                {safeAnalytics.overview.completedProjects.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300 font-medium">Completed</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#C3073F]/20 to-[#C3073F]/5 border-[#C3073F]/30">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-[#C3073F]"
                aria-label={`Total budget: ${formatBudget(safeAnalytics.overview.totalBudget)}`}
              >
                {formatBudget(safeAnalytics.overview.totalBudget)}
              </div>
              <div className="text-xs text-gray-300 font-medium">Total Budget</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#FF7F50]/20 to-[#FF7F50]/5 border-[#FF7F50]/30">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-[#FF7F50]"
                aria-label={`Average TRL: ${safeAnalytics.overview.averageTrl.toFixed(1)}`}
              >
                {safeAnalytics.overview.averageTrl.toFixed(1)}
              </div>
              <div className="text-xs text-gray-300 font-medium">
                <abbr title="Technology Readiness Level">Avg TRL</abbr>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30">
            <div className="text-center">
              <div 
                className="text-2xl font-bold text-purple-300"
                aria-label={`${safeAnalytics.overview.plannedProjects} planned projects`}
              >
                {safeAnalytics.overview.plannedProjects.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300 font-medium">Planned</div>
            </div>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TRL Distribution */}
        <section aria-labelledby="trl-heading">
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 id="trl-heading" className="text-xl font-bold text-white mb-4">
              🔬 <abbr title="Technology Readiness Level">TRL</abbr> Distribution
            </h3>
            <div className="space-y-3" role="group" aria-label="Technology Readiness Level distribution chart">
              {Object.entries(safeAnalytics.trlDistribution).map(([trl, count]) => {
                const percentage = maxTrlCount > 0 ? (count / maxTrlCount) * 100 : 0
                return (
                  <div key={trl} className="flex items-center space-x-3">
                    <div className="w-12 text-sm text-gray-300 font-medium">
                      <abbr title={`Technology Readiness Level ${trl}`}>TRL {trl}</abbr>
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className="h-6 bg-gray-700 rounded-lg overflow-hidden"
                        role="progressbar"
                        aria-valuenow={count}
                        aria-valuemin={0}
                        aria-valuemax={maxTrlCount}
                        aria-label={`TRL ${trl}: ${count} projects, ${percentage.toFixed(1)}% of maximum`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-[#66FCF1] to-[#C3073F] transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                        aria-hidden="true"
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </section>

        {/* Category Distribution */}
        <section aria-labelledby="categories-heading">
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 id="categories-heading" className="text-xl font-bold text-white mb-4">📂 Categories</h3>
            <div className="space-y-3" role="group" aria-label="Project categories distribution chart">
              {safeAnalytics.categoryDistribution.slice(0, 8).map((category, index) => {
                const percentage = maxCategoryCount > 0 ? (category.count / maxCategoryCount) * 100 : 0
                const colorHue = index * 45
                return (
                  <div key={category.category} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-300 truncate font-medium" title={category.category}>
                      {category.category}
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className="h-6 bg-gray-700 rounded-lg overflow-hidden"
                        role="progressbar"
                        aria-valuenow={category.count}
                        aria-valuemin={0}
                        aria-valuemax={maxCategoryCount}
                        aria-label={`${category.category}: ${category.count} projects, ${category.percentage.toFixed(1)}% of total`}
                      >
                        <div
                          className="h-full transition-all duration-1000"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: `hsl(${colorHue}, 70%, 60%)`
                          }}
                        ></div>
                      </div>
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                        aria-hidden="true"
                      >
                        {category.count} ({category.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </section>

        {/* Organization Distribution */}
        <section aria-labelledby="organizations-heading">
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 id="organizations-heading" className="text-xl font-bold text-white mb-4">🏢 Organizations</h3>
            <div className="space-y-3" role="group" aria-label="Organizations distribution chart">
              {safeAnalytics.organizationDistribution.slice(0, 8).map((org, index) => {
                const percentage = maxOrgCount > 0 ? (org.count / maxOrgCount) * 100 : 0
                const colorHue = 200 + index * 20
                return (
                  <div key={org.org} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-300 truncate font-medium" title={org.org}>
                      {org.org}
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className="h-6 bg-gray-700 rounded-lg overflow-hidden"
                        role="progressbar"
                        aria-valuenow={org.count}
                        aria-valuemin={0}
                        aria-valuemax={maxOrgCount}
                        aria-label={`${org.org}: ${org.count} projects, ${org.percentage.toFixed(1)}% of total`}
                      >
                        <div
                          className="h-full transition-all duration-1000"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: `hsl(${colorHue}, 70%, 60%)`
                          }}
                        ></div>
                      </div>
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                        aria-hidden="true"
                      >
                        {org.count} ({org.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </section>

        {/* Timeline */}
        <section aria-labelledby="timeline-heading">
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 id="timeline-heading" className="text-xl font-bold text-white mb-4">📅 Project Timeline</h3>
            <div className="space-y-4" role="group" aria-label="Project timeline by year">
              {safeAnalytics.timeline.map((year) => (
                <div key={year.year} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white text-lg">{year.year}</div>
                    <div className="text-sm text-gray-300">
                      {year.active} active
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div 
                        className="h-3 bg-[#66FCF1] rounded mb-1 transition-all duration-500" 
                        style={{ width: `${Math.min((year.started / 250) * 100, 100)}%` }}
                        role="progressbar"
                        aria-valuenow={year.started}
                        aria-valuemax={250}
                        aria-label={`${year.started} projects started in ${year.year}`}
                      ></div>
                      <div className="text-[#66FCF1] font-medium">{year.started} Started</div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="h-3 bg-[#4CAF50] rounded mb-1 transition-all duration-500" 
                        style={{ width: `${Math.min((year.completed / 150) * 100, 100)}%` }}
                        role="progressbar"
                        aria-valuenow={year.completed}
                        aria-valuemax={150}
                        aria-label={`${year.completed} projects completed in ${year.year}`}
                      ></div>
                      <div className="text-[#4CAF50] font-medium">{year.completed} Completed</div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="h-3 bg-[#FFC107] rounded mb-1 transition-all duration-500" 
                        style={{ width: `${Math.min((year.active / 800) * 100, 100)}%` }}
                        role="progressbar"
                        aria-valuenow={year.active}
                        aria-valuemax={800}
                        aria-label={`${year.active} projects active in ${year.year}`}
                      ></div>
                      <div className="text-[#FFC107] font-medium">{year.active} Active</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      {/* Summary Insights */}
      <section aria-labelledby="insights-heading">
        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
          <h3 id="insights-heading" className="text-xl font-bold text-white mb-4">💡 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-[#66FCF1]/10 border border-[#66FCF1]/30 rounded-lg">
              <h4 className="font-bold text-[#66FCF1] mb-2">Portfolio Health</h4>
              <p className="text-gray-300 text-sm">
                {safeAnalytics.overview.activeProjects > safeAnalytics.overview.completedProjects 
                  ? 'Strong active project pipeline with ongoing innovation'
                  : 'Mature portfolio with significant completion rate'
                }
              </p>
            </div>
            
            <div className="p-4 bg-[#C3073F]/10 border border-[#C3073F]/30 rounded-lg">
              <h4 className="font-bold text-[#C3073F] mb-2">Technology Maturity</h4>
              <p className="text-gray-300 text-sm">
                Average TRL of {safeAnalytics.overview.averageTrl.toFixed(1)} indicates{' '}
                {safeAnalytics.overview.averageTrl >= 6 
                  ? 'mature technologies approaching deployment'
                  : 'early-stage research and development focus'
                }
              </p>
            </div>
            
            <div className="p-4 bg-[#FF7F50]/10 border border-[#FF7F50]/30 rounded-lg">
              <h4 className="font-bold text-[#FF7F50] mb-2">Investment Scale</h4>
              <p className="text-gray-300 text-sm">
                {formatBudget(safeAnalytics.overview.totalBudget)} total investment across{' '}
                {safeAnalytics.overview.totalProjects} projects demonstrates NASA's commitment to innovation
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  )
} 