import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

export const Route = createFileRoute('/apod')({
  component: APOD,
})

interface APODData {
  title: string
  explanation: string
  url: string
  media_type: 'image' | 'video'
  date: string
  hdurl?: string
}

function APOD() {
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isDateChanging, setIsDateChanging] = useState(false)

  const fetchAPOD = async (date?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const url = date 
        ? `http://localhost:3000/api/apod?date=${date}`
        : 'http://localhost:3000/api/apod'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch APOD: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setApodData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAPOD()
  }, [])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault() // Prevent any default form behavior
    const date = event.target.value
    setSelectedDate(date)
    
    // Immediately fetch on date change (no debouncing for better UX)
    if (date) {
      setIsDateChanging(true)
      fetchAPOD(date).finally(() => setIsDateChanging(false))
    }
  }

  const handleDateSubmit = (event: React.FormEvent) => {
    event.preventDefault() // Prevent form submission
    if (selectedDate) {
      fetchAPOD(selectedDate)
    }
  }

  const resetToToday = () => {
    setSelectedDate('')
    setIsDateChanging(false)
    fetchAPOD()
  }

  if (loading && !isDateChanging) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading astronomy picture...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading APOD</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchAPOD(selectedDate || undefined)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Astronomy Picture of the Day
          </h1>
          <p className="text-gray-600 text-lg">
            Discover the cosmos through NASA's daily featured astronomy images and videos
          </p>
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleDateSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label htmlFor="date-picker" className="text-sm font-medium text-gray-700">
              Select a date:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min="1995-06-16" // APOD started on June 16, 1995
                max={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                disabled={loading}
              />
              {isDateChanging && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              )}
              {selectedDate && !isDateChanging && (
                <button
                  type="submit"
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                  title="Load selected date"
                  disabled={loading}
                >
                  Go
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={resetToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Today's APOD
            </button>
          </form>
        </div>

        {/* APOD Content */}
        {apodData && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Title and Date */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {apodData.title}
              </h2>
              <p className="text-gray-600">
                {new Date(apodData.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Media Content */}
            <div className="relative">
              {apodData.media_type === 'image' ? (
                <div className="group">
                  <img
                    src={apodData.url}
                    alt={apodData.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {apodData.hdurl && (
                    <div className="absolute top-4 right-4">
                      <a
                        href={apodData.hdurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90 transition-opacity"
                      >
                        HD Version
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video">
                  <iframe
                    src={apodData.url}
                    title={apodData.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Explanation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {apodData.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 