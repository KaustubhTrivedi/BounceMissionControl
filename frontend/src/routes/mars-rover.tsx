import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMarsRoverPhotos } from '@/hooks/useNASA'

export const Route = createFileRoute('/mars-rover')({
  component: MarsRover,
})

import type { MarsRoverPhoto } from '@/services/nasa'

// Use MarsRoverPhoto from service, create alias for compatibility
type RoverPhoto = MarsRoverPhoto

function MarsRover() {
  const [sol, setSol] = useState<string>('')
  const [selectedPhoto, setSelectedPhoto] = useState<RoverPhoto | null>(null)
  
  // Use React Query hook for data fetching
  const solNumber = sol ? parseInt(sol, 10) : undefined
  const validSol = solNumber && !isNaN(solNumber) ? solNumber : undefined
  
  const { 
    data: roverData, 
    isLoading, 
    error, 
    refetch,
    isFetching
  } = useMarsRoverPhotos({ sol: validSol })

  // No need for manual fetch function with React Query

  const handleSolSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Sol state change will trigger the React Query refetch automatically
  }

  const resetToLatest = () => {
    setSol('')
    // Setting sol to empty will trigger the React Query refetch automatically
  }

  const openModal = (photo: RoverPhoto) => {
    setSelectedPhoto(photo)
  }

  const closeModal = () => {
    setSelectedPhoto(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Mars rover photos...</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Photos</h3>
          <p className="text-gray-600 mb-4">{error?.message || 'An error occurred'}</p>
          <button 
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mars Rover Photo Explorer
            </h1>
            <p className="text-gray-600 text-lg">
              Explore photographs captured by NASA's Curiosity rover on Mars
            </p>
          </div>

          {/* Sol Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSolSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <label htmlFor="sol-input" className="text-sm font-medium text-gray-700">
                Search by Martian Day (Sol):
              </label>
              <input
                id="sol-input"
                type="number"
                value={sol}
                onChange={(e) => setSol(e.target.value)}
                placeholder="Enter sol number (e.g. 1000)"
                min="0"
                disabled={isLoading || isFetching}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || isFetching}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetching ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={resetToLatest}
                disabled={isLoading || isFetching}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetching ? 'Loading...' : 'Latest Photos'}
              </button>
            </form>
          </div>

          {/* Results Info */}
          {roverData && (
            <div className="mb-6">
              <p className="text-gray-600 text-center">
                {roverData.photos.length > 0 
                  ? `Found ${roverData.photos.length} photo${roverData.photos.length !== 1 ? 's' : ''} ${sol ? `from Sol ${sol}` : 'from the latest available day'}`
                  : `No photos found ${sol ? `for Sol ${sol}` : 'for the latest day'}`
                }
              </p>
            </div>
          )}

          {/* Photo Gallery */}
          {roverData && roverData.photos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {roverData.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openModal(photo)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={photo.img_src}
                      alt={`Mars rover photo from Sol ${photo.sol}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Sol {photo.sol}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(photo.earth_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {photo.camera.full_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {roverData && roverData.photos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600 mb-4">
                {sol ? `No photos were taken on Sol ${sol}. ` : ''}
                Try searching for a different Martian day.
              </p>
              <button
                onClick={resetToLatest}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                View Latest Photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedPhoto.img_src}
                alt={`Mars rover photo from Sol ${selectedPhoto.sol}`}
                className="w-full h-auto"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mars Photo Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Sol:</span>
                  <span className="ml-2 text-gray-600">{selectedPhoto.sol}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Earth Date:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedPhoto.earth_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Camera:</span>
                  <span className="ml-2 text-gray-600">{selectedPhoto.camera.full_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Photo ID:</span>
                  <span className="ml-2 text-gray-600">{selectedPhoto.id}</span>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={selectedPhoto.img_src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  View Full Resolution
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 