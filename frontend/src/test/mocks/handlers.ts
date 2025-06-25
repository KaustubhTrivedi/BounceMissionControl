import { http, HttpResponse } from 'msw'

// Mock data for NASA API responses
const mockAPODData = {
  copyright: 'NASA',
  date: '2024-01-01',
  explanation: 'A beautiful view of the cosmos from the Hubble Space Telescope.',
  hdurl: 'https://example.com/hd-image.jpg',
  media_type: 'image',
  service_version: 'v1',
  title: 'Cosmic Beauty',
  url: 'https://example.com/image.jpg',
}

const mockMarsRoverData = {
  photos: [
    {
      id: 1,
      sol: 1000,
      camera: {
        id: 20,
        name: 'FHAZ',
        rover_id: 5,
        full_name: 'Front Hazard Avoidance Camera',
      },
      img_src: 'https://example.com/rover1.jpg',
      earth_date: '2024-01-01',
      rover: {
        id: 5,
        name: 'Curiosity',
        landing_date: '2012-08-06',
        launch_date: '2011-11-26',
        status: 'active',
      },
    },
    {
      id: 2,
      sol: 1000,
      camera: {
        id: 21,
        name: 'RHAZ',
        rover_id: 5,
        full_name: 'Rear Hazard Avoidance Camera',
      },
      img_src: 'https://example.com/rover2.jpg',
      earth_date: '2024-01-01',
      rover: {
        id: 5,
        name: 'Curiosity',
        landing_date: '2012-08-06',
        launch_date: '2011-11-26',
        status: 'active',
      },
    },
  ],
}

const mockMarsWeatherData = {
  sol_keys: ['1000', '1001'],
  validity_checks: {
    1000: {
      AT: { valid: true, sol_hours_with_data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
      HWS: { valid: true, sol_hours_with_data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
      PRE: { valid: true, sol_hours_with_data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
    },
  },
  1000: {
    AT: {
      av: -65.0,
      ct: 24,
      mn: -75.0,
      mx: -55.0,
    },
    HWS: {
      av: 7.0,
      ct: 24,
      mn: 2.0,
      mx: 15.0,
    },
    PRE: {
      av: 700.0,
      ct: 24,
      mn: 650.0,
      mx: 750.0,
    },
  },
}

export const handlers = [
  // APOD endpoint
  http.get('/api/apod', () => {
    return HttpResponse.json(mockAPODData)
  }),

  // Mars Rover Photos endpoint
  http.get('/api/mars-photos/:rover', () => {
    return HttpResponse.json(mockMarsRoverData)
  }),

  // Latest Rover Photos endpoint
  http.get('/api/latest-rover-photos', () => {
    return HttpResponse.json(mockMarsRoverData)
  }),

  // Mars Weather endpoint
  http.get('/api/mars-weather', () => {
    return HttpResponse.json(mockMarsWeatherData)
  }),
] 