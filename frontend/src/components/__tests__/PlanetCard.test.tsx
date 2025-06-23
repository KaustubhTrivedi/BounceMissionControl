import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlanetCard from '../PlanetCard'

const mockPlanetData = {
  id: 'mars',
  name: 'Mars',
  type: 'planet' as const,
  mission_count: 3,
  data_freshness: {
    last_updated: '2024-01-01T12:00:00Z',
    hours_ago: 2
  },
  active_missions: [
    { 
      name: 'Perseverance', 
      status: 'active' as const,
      mission_type: 'rover' as const,
      description: 'Mars 2020 rover exploring Jezero Crater'
    },
    { 
      name: 'Ingenuity', 
      status: 'active' as const,
      mission_type: 'flyby' as const,
      description: 'Mars helicopter technology demonstration'
    },
    { 
      name: 'Mars Sample Return', 
      status: 'planned' as const,
      mission_type: 'sample-return' as const,
      description: 'Joint NASA-ESA mission to return Mars samples'
    }
  ],
  surface_conditions: {
    temperature: {
      average: -63,
      min: -125,
      max: 20,
      unit: 'C'
    },
    gravity: 0.38,
    day_length: '24h 37m',
    radiation_level: 'moderate' as const
  },
  last_activity: {
    date: '2024-01-01T10:00:00Z',
    description: 'Perseverance collected rock sample',
    days_ago: 1
  },
  next_event: {
    date: '2025-09-01',
    description: 'Mars Sample Return mission launch',
    days_until: 450
  },
  notable_fact: 'Mars has the largest volcano in the solar system, Olympus Mons.'
}

describe('PlanetCard Component', () => {
  it('renders planet name and basic information', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    expect(screen.getByText('Mars')).toBeInTheDocument()
    expect(screen.getByText('planet')).toBeInTheDocument()
    expect(screen.getByText('3 Missions')).toBeInTheDocument()
    expect(screen.getByText('2h ago')).toBeInTheDocument()
  })

  it('displays surface conditions correctly', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    expect(screen.getByText('-63°C')).toBeInTheDocument()
    expect(screen.getByText('0.38g')).toBeInTheDocument()
    expect(screen.getByText('moderate')).toBeInTheDocument()
  })

  it('shows mission status breakdown', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    expect(screen.getByText('2 Active')).toBeInTheDocument()
    expect(screen.getByText('1 Planned')).toBeInTheDocument()
  })

  it('displays last activity information', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    expect(screen.getByText('Perseverance collected rock sample')).toBeInTheDocument()
    expect(screen.getByText('1 days ago')).toBeInTheDocument()
  })

  it('shows next event when available', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    expect(screen.getByText('Mars Sample Return mission launch')).toBeInTheDocument()
    expect(screen.getByText('In 450 days')).toBeInTheDocument()
  })

  it('displays notable fact', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    expect(screen.getByText(/largest volcano in the solar system/)).toBeInTheDocument()
  })

  it('handles zero missions correctly', () => {
    const noMissionPlanet = {
      ...mockPlanetData,
      mission_count: 0,
      active_missions: []
    }
    
    render(<PlanetCard planet={noMissionPlanet} />)
    
    expect(screen.getByText('0 Missions')).toBeInTheDocument()
    expect(screen.getByText('No active missions')).toBeInTheDocument()
  })

  it('applies correct styling based on planet type', () => {
    const { container } = render(<PlanetCard planet={mockPlanetData} />)
    
    const card = container.firstChild as HTMLElement
    expect(card?.className).toContain('from-red-900/40')
    expect(card?.className).toContain('to-orange-900/40')
  })

  it('handles missing optional data gracefully', () => {
    const minimalPlanet = {
      ...mockPlanetData,
      next_event: undefined
    }
    
    render(<PlanetCard planet={minimalPlanet} />)
    
    expect(screen.getByText('Mars')).toBeInTheDocument()
    // Should not crash with missing next_event
    expect(screen.queryByText('Next Event')).not.toBeInTheDocument()
  })

  it('shows radiation level with correct styling', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    const radiationElement = screen.getByText('moderate')
    expect(radiationElement).toHaveClass('text-yellow-400')
  })

  it('handles different radiation levels', () => {
    const highRadiationPlanet = {
      ...mockPlanetData,
      surface_conditions: {
        ...mockPlanetData.surface_conditions,
        radiation_level: 'high' as const
      }
    }
    
    render(<PlanetCard planet={highRadiationPlanet} />)
    
    const radiationElement = screen.getByText('high')
    expect(radiationElement).toHaveClass('text-orange-400')
  })

  it('displays different planet gradients correctly', () => {
    const moonPlanet = {
      ...mockPlanetData,
      id: 'moon',
      name: 'Moon'
    }
    
    const { container } = render(<PlanetCard planet={moonPlanet} />)
    
    const card = container.firstChild as HTMLElement
    expect(card?.className).toContain('from-gray-800/40')
    expect(card?.className).toContain('to-slate-900/40')
  })
}) 