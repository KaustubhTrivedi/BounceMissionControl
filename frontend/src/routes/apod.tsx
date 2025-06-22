import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { useAPOD } from '@/hooks/useNASA'
import { APOD_START_DATE, TODAY } from '@/services/nasa'

export const Route = createFileRoute('/apod')({
  component: APOD,
})
function APOD() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { 
    data: apodData, 
    isLoading, 
    error, 
    refetch,
    isFetching
  } = useAPOD(selectedDate)
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const resetToToday = () => {
    setSelectedDate(undefined)
  }

  if (isLoading && !isFetching) {
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
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : String(error) || 'An error occurred'}</p>
          <Button 
            onClick={() => refetch()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const apodStartDate = APOD_START_DATE
  const today = TODAY

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Select a date:
            </label>
            <div className="flex items-center gap-2">
              <DatePicker
                date={selectedDate}
                onDateChange={handleDateChange}
                placeholder="Pick a date for APOD"
                minDate={apodStartDate}
                maxDate={today}
                disabled={isLoading || isFetching}
              />
              {isFetching && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              )}
            </div>
            <Button
              onClick={resetToToday}
              variant="default"
              disabled={isLoading || isFetching}
            >
              Today's APOD
            </Button>
          </div>
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
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="bg-black bg-opacity-70 text-white hover:bg-opacity-90"
                      >
                        <a
                          href={apodData.hdurl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          HD Version
                        </a>
                      </Button>
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