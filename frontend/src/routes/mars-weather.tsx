import { createFileRoute } from '@tanstack/react-router'
import { usePerseveranceWeather } from '@/hooks/useNASA'

export const Route = createFileRoute('/mars-weather')({
  component: MarsWeather,
})

function MarsWeather() {
  const { data: weatherData, isLoading, error } = usePerseveranceWeather()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Mars weather data...</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Weather Data</h3>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : String(error) || 'An error occurred'}</p>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No weather data available</p>
        </div>
      </div>
    )
  }

  const solData = weatherData.sol_data

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mars Weather Station
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Live weather data from NASA's Perseverance rover
          </p>
          <p className="text-sm text-gray-500">
            Location: {weatherData.location.name} ({weatherData.location.coordinates.latitude}°N, {weatherData.location.coordinates.longitude}°E)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sol {solData.sol}</h2>
              <p className="text-gray-600">{new Date(solData.terrestrial_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Season: {solData.season || 'Unknown'}</p>
              <p className="text-xs text-gray-400">
                Last updated: {new Date(weatherData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {solData.temperature && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-red-500 mr-3">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-2zm2 14c-1.1 0-2-.9-2-2 0-.55.45-1 1-1s1 .45 1 1c0 1.1-.9 2-2 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
              </div>
              
              {solData.temperature.air && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Air Temperature</p>
                  <div className="space-y-1">
                    {solData.temperature.air.average && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="text-sm font-medium">{solData.temperature.air.average.toFixed(1)}°C</span>
                      </div>
                    )}
                    {solData.temperature.air.minimum && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min:</span>
                        <span className="text-sm font-medium text-blue-600">{solData.temperature.air.minimum.toFixed(1)}°C</span>
                      </div>
                    )}
                    {solData.temperature.air.maximum && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max:</span>
                        <span className="text-sm font-medium text-red-600">{solData.temperature.air.maximum.toFixed(1)}°C</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {solData.temperature.ground && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Ground Temperature</p>
                  <div className="space-y-1">
                    {solData.temperature.ground.average && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="text-sm font-medium">{solData.temperature.ground.average.toFixed(1)}°C</span>
                      </div>
                    )}
                    {solData.temperature.ground.minimum && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min:</span>
                        <span className="text-sm font-medium text-blue-600">{solData.temperature.ground.minimum.toFixed(1)}°C</span>
                      </div>
                    )}
                    {solData.temperature.ground.maximum && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max:</span>
                        <span className="text-sm font-medium text-red-600">{solData.temperature.ground.maximum.toFixed(1)}°C</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {solData.pressure && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-blue-500 mr-3">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Atmospheric Pressure</h3>
              </div>
              
              <div className="space-y-1">
                {solData.pressure.average && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="text-sm font-medium">{solData.pressure.average.toFixed(1)} Pa</span>
                  </div>
                )}
                {solData.pressure.minimum && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Min:</span>
                    <span className="text-sm font-medium">{solData.pressure.minimum.toFixed(1)} Pa</span>
                  </div>
                )}
                {solData.pressure.maximum && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max:</span>
                    <span className="text-sm font-medium">{solData.pressure.maximum.toFixed(1)} Pa</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wind */}
          {solData.wind && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-green-500 mr-3">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Wind</h3>
              </div>
              
              <div className="space-y-3">
                {solData.wind.speed && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Speed</p>
                    <div className="space-y-1">
                      {solData.wind.speed.average && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average:</span>
                          <span className="text-sm font-medium">{solData.wind.speed.average.toFixed(1)} m/s</span>
                        </div>
                      )}
                      {solData.wind.speed.maximum && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Max:</span>
                          <span className="text-sm font-medium">{solData.wind.speed.maximum.toFixed(1)} m/s</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {solData.wind.direction && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Direction</p>
                    <div className="space-y-1">
                      {solData.wind.direction.compass_point && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Compass:</span>
                          <span className="text-sm font-medium">{solData.wind.direction.compass_point}</span>
                        </div>
                      )}
                      {solData.wind.direction.degrees && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Degrees:</span>
                          <span className="text-sm font-medium">{solData.wind.direction.degrees}°</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Humidity */}
          {solData.humidity && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-cyan-500 mr-3">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Humidity</h3>
              </div>
              
              <div className="space-y-1">
                {solData.humidity.average && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="text-sm font-medium">{solData.humidity.average.toFixed(1)}%</span>
                  </div>
                )}
                {solData.humidity.minimum && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Min:</span>
                    <span className="text-sm font-medium">{solData.humidity.minimum.toFixed(1)}%</span>
                  </div>
                )}
                {solData.humidity.maximum && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max:</span>
                    <span className="text-sm font-medium">{solData.humidity.maximum.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sun Times */}
          {(solData.sunrise || solData.sunset) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-yellow-500 mr-3">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sun Times</h3>
              </div>
              
              <div className="space-y-1">
                {solData.sunrise && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sunrise:</span>
                    <span className="text-sm font-medium">{solData.sunrise}</span>
                  </div>
                )}
                {solData.sunset && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sunset:</span>
                    <span className="text-sm font-medium">{solData.sunset}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Atmospheric Conditions */}
          {(solData.atmosphere_opacity || solData.local_uv_irradiance_index) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-purple-500 mr-3">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Atmospheric Conditions</h3>
              </div>
              
              <div className="space-y-1">
                {solData.atmosphere_opacity && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Opacity:</span>
                    <span className="text-sm font-medium">{solData.atmosphere_opacity}</span>
                  </div>
                )}
                {solData.local_uv_irradiance_index && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">UV Index:</span>
                    <span className="text-sm font-medium">{solData.local_uv_irradiance_index}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="w-6 h-6 text-blue-600 mr-3 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">About MEDA Weather Data</h4>
              <p className="text-sm text-blue-800">
                This weather data is collected by the Mars Environmental Dynamics Analyzer (MEDA) instrument aboard NASA's Perseverance rover. 
                MEDA measures atmospheric pressure, humidity, wind speed and direction, air and ground temperature, and radiation levels on Mars.
                Data is updated daily based on the rover's operations schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 