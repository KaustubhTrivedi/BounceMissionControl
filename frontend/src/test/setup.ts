import '@testing-library/jest-dom'
import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// MSW server setup for API mocking
export const server = setupServer(
  // Default handlers - can be overridden in individual tests
  http.get('/api/mars-weather', () => {
    return HttpResponse.json({
      location: { name: 'Jezero Crater' },
      sol_data: {
        sol: 1000,
        terrestrial_date: '2023-12-01',
        temperature: { air: { average: -20, minimum: -35, maximum: -5 } },
        pressure: { average: 850 },
        wind: { speed: { average: 10 }, direction: { compass_point: 'NW' } },
        season: 'winter',
        atmosphere_opacity: 'dusty',
        sunrise: '06:30',
        sunset: '18:30'
      },
      timestamp: new Date().toISOString()
    })
  }),
  
  http.get('/api/mars-weather/historic', () => {
    return HttpResponse.json({
      mission_info: {
        name: 'Mars Science Laboratory',
        location: 'Gale Crater',
        mission_duration: '3000+ sols',
        status: 'active',
        earth_dates: { start: '2012-08-06', end: '2023-12-01' }
      },
      temperature_data: [
        { sol: 1, min_temp: -80, max_temp: -10, avg_temp: -45 },
        { sol: 2, min_temp: -75, max_temp: -15, avg_temp: -40 }
      ],
      pressure_data: [
        { sol: 1, pressure: 750 },
        { sol: 2, pressure: 780 }
      ],
      wind_data: [
        { sol: 1, wind_speed: 5, wind_direction: 'N' },
        { sol: 2, wind_speed: 8, wind_direction: 'SW' }
      ]
    })
  })
)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Clean up after each test
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Close server after all tests
afterAll(() => server.close())

// Extend Vitest's expect with jest-dom matchers
expect.extend({}) 