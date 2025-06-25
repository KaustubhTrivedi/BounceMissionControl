import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PlanetCard from '../PlanetCard'
import type { PlanetData } from '@/services/nasa'

// Simple wrapper without router for component tests
const ComponentWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const renderComponent = (ui: React.ReactElement) => {
  return render(ui, { wrapper: ComponentWrapper })
}

const mockPlanetData: PlanetData = {
  id: 'mars',
  name: 'Mars',
  type: 'planet',
  mission_count: 3,
  data_freshness: {
    last_updated: '2024-01-01T12:00:00Z',
    hours_ago: 2,
  },
  active_missions: [
    { 
      name: 'Curiosity', 
      status: 'active',
      mission_type: 'rover',
      description: 'Exploring Gale Crater',
    },
    { 
      name: 'Perseverance', 
      status: 'active',
      mission_type: 'rover',
      description: 'Searching for signs of ancient life',
    },
    { 
      name: 'Ingenuity', 
      status: 'en-route',
      mission_type: 'flyby',
      description: 'Technology demonstration',
    },
  ],
  surface_conditions: {
    temperature: {
      average: -63,
      min: -140,
      max: 20,
      unit: '°C',
    },
    gravity: 0.38,
    radiation_level: 'moderate',
    day_length: '24h 37m',
  },
  last_activity: {
    date: '2024-01-01',
    description: 'Curiosity sent new images from Gale Crater',
    days_ago: 1,
  },
  next_event: {
    date: '2024-01-06',
    description: 'Perseverance sample collection',
    days_until: 5,
  },
  notable_fact: 'Mars has the largest volcano in the solar system, Olympus Mons.',
}

describe('PlanetCard', () => {
  it('renders planet information correctly', () => {
    renderComponent(<PlanetCard planet={mockPlanetData} />)

    // Check if planet name is displayed
    expect(screen.getByText('Mars')).toBeInTheDocument()

    // Check if planet type is displayed
    expect(screen.getByText('planet')).toBeInTheDocument()

    // Check if mission count is displayed
    expect(screen.getByText('3 Missions')).toBeInTheDocument()

    // Check if data freshness is displayed
    expect(screen.getByText('2h ago')).toBeInTheDocument()
  })

  it('displays mission status correctly', () => {
    renderComponent(<PlanetCard planet={mockPlanetData} />)

    // Check for active missions
    expect(screen.getByText('2 Active')).toBeInTheDocument()

    // Check for en route missions
    expect(screen.getByText('1 En Route')).toBeInTheDocument()
  })

  it('displays surface conditions correctly', () => {
    renderComponent(<PlanetCard planet={mockPlanetData} />)

    // Check temperature
    expect(screen.getByText('-63°C')).toBeInTheDocument()

    // Check gravity
    expect(screen.getByText('0.38g')).toBeInTheDocument()

    // Check radiation level
    expect(screen.getByText('moderate')).toBeInTheDocument()
  })

  it('displays last activity correctly', () => {
    renderComponent(<PlanetCard planet={mockPlanetData} />)

    expect(screen.getByText('Curiosity sent new images from Gale Crater')).toBeInTheDocument()
    expect(screen.getByText('1 days ago')).toBeInTheDocument()
  })

  it('displays next event correctly', () => {
    renderComponent(<PlanetCard planet={mockPlanetData} />)

    expect(screen.getByText('Perseverance sample collection')).toBeInTheDocument()
    expect(screen.getByText('In 5 days')).toBeInTheDocument()
  })

  it('displays notable fact correctly', () => {
    renderComponent(<PlanetCard planet={mockPlanetData} />)

    expect(screen.getByText('Mars has the largest volcano in the solar system, Olympus Mons.')).toBeInTheDocument()
  })

  it('handles planet with no missions', () => {
    const planetWithNoMissions = {
      ...mockPlanetData,
      mission_count: 0,
      active_missions: [],
    }

    renderComponent(<PlanetCard planet={planetWithNoMissions} />)

    expect(screen.getByText('0 Missions')).toBeInTheDocument()
    expect(screen.getByText('No active missions')).toBeInTheDocument()
  })

  it('handles planet without next event', () => {
    const planetWithoutNextEvent = {
      ...mockPlanetData,
      next_event: undefined,
    }

    renderComponent(<PlanetCard planet={planetWithoutNextEvent} />)

    // Should not display "Next Event" section
    expect(screen.queryByText('Next Event')).not.toBeInTheDocument()
  })

  it('handles planet without radiation level', () => {
    const planetWithoutRadiation = {
      ...mockPlanetData,
      surface_conditions: {
        ...mockPlanetData.surface_conditions,
        radiation_level: undefined,
      },
    }

    renderComponent(<PlanetCard planet={planetWithoutRadiation} />)

    // Should not display radiation information
    expect(screen.queryByText('Radiation:')).not.toBeInTheDocument()
  })

  it('displays "Just updated" for fresh data', () => {
    const planetWithFreshData = {
      ...mockPlanetData,
      data_freshness: { 
        last_updated: '2024-01-01T12:00:00Z',
        hours_ago: 0 
      },
    }

    renderComponent(<PlanetCard planet={planetWithFreshData} />)

    expect(screen.getByText('Just updated')).toBeInTheDocument()
  })

  it('displays "Today" for recent activity', () => {
    const planetWithRecentActivity = {
      ...mockPlanetData,
      last_activity: {
        ...mockPlanetData.last_activity,
        days_ago: 0,
      },
    }

    renderComponent(<PlanetCard planet={planetWithRecentActivity} />)

    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('displays "Today" for next event happening today', () => {
    const planetWithTodayEvent = {
      ...mockPlanetData,
      next_event: {
        ...mockPlanetData.next_event!,
        days_until: 0,
      },
    }

    renderComponent(<PlanetCard planet={planetWithTodayEvent} />)

    expect(screen.getByText('Today')).toBeInTheDocument()
  })
}) 