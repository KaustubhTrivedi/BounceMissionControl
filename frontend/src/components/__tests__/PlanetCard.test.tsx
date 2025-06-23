import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import PlanetCard from '../PlanetCard'

// Mock the router and query client
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>
}))

const mockPlanetData = {
  id: 'mars',
  name: 'Mars',
  type: 'planet',
  mission_count: 3,
  data_freshness: {
    hours_ago: 2
  },
  active_missions: [
    { status: 'active', name: 'Perseverance' },
    { status: 'active', name: 'Curiosity' },
    { status: 'planned', name: 'Mars Sample Return' }
  ],
  surface_conditions: {
    temperature: {
      average: -63
    },
    gravity: 0.38,
    radiation_level: 'moderate'
  },
  last_activity: {
    description: 'Perseverance collected rock sample',
    days_ago: 1
  },
  next_event: {
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
    render(<PlanetCard planet={mockPlanetData} />)
    
    const card = screen.getByText('Mars').closest('div')
    expect(card).toHaveClass('from-red-900/40', 'to-orange-900/40')
  })

  it('handles click events correctly', async () => {
    const mockOnClick = vi.fn()
    render(<PlanetCard planet={mockPlanetData} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button', { name: /mars/i })
    fireEvent.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockPlanetData)
  })

  it('applies hover effects correctly', async () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    const card = screen.getByRole('button', { name: /mars/i })
    
    fireEvent.mouseEnter(card)
    expect(card).toHaveClass('hover:scale-105')
    
    fireEvent.mouseLeave(card)
    expect(card).not.toHaveClass('scale-105')
  })

  it('handles missing optional data gracefully', () => {
    const minimalPlanet = {
      name: 'Unknown Planet',
      description: 'A mysterious world'
    }
    
    render(<PlanetCard planet={minimalPlanet} />)
    
    expect(screen.getByText('Unknown Planet')).toBeInTheDocument()
    expect(screen.getByText('A mysterious world')).toBeInTheDocument()
    // Should not crash with missing data
  })

  it('renders accessibility attributes correctly', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label')
    expect(card).toHaveAttribute('tabIndex', '0')
  })
}) 