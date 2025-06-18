import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/analytics')({
  component: Analytics,
})

function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Analytics dashboard coming soon...</p>
        </div>
      </div>
    </div>
  )
} 