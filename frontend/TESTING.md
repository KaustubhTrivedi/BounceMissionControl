# Frontend Testing Guide

This document outlines the testing strategy and setup for the Bounce Mission Control frontend.

## Testing Stack

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation

## Test Structure

```
src/
├── test/
│   ├── setup.ts                 # Test configuration
│   ├── utils.tsx               # Test utilities and providers
│   └── mocks/
│       ├── server.ts           # MSW server setup
│       └── handlers.ts         # API mock handlers
├── components/
│   └── __tests__/
│       └── PlanetCard.test.tsx # Component tests
├── hooks/
│   └── __tests__/
│       └── useNASA.test.tsx    # Hook tests
├── services/
│   └── __tests__/
│       ├── api.test.ts         # API service tests
│       └── nasa.test.ts        # NASA service tests
└── routes/
    └── __tests__/
        └── apod.test.tsx       # Route component tests
```

## Test Categories

### 1. Component Tests

Test React components in isolation with mocked dependencies.

**Example: PlanetCard Component**
```typescript
import { render, screen } from '@/test/utils'
import PlanetCard from '../PlanetCard'

describe('PlanetCard', () => {
  it('renders planet information correctly', () => {
    render(<PlanetCard planet={mockPlanetData} />)
    expect(screen.getByText('Mars')).toBeInTheDocument()
  })
})
```

**Test Coverage:**
- ✅ Rendering with different props
- ✅ Conditional rendering
- ✅ User interactions
- ✅ Error states
- ✅ Loading states
- ✅ Accessibility

### 2. Hook Tests

Test custom React hooks using `renderHook`.

**Example: useNASA Hooks**
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useAPOD } from '../useNASA'

describe('useAPOD', () => {
  it('fetches APOD data successfully', async () => {
    const { result } = renderHook(() => useAPOD())
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
```

**Test Coverage:**
- ✅ Data fetching
- ✅ Loading states
- ✅ Error handling
- ✅ Parameter variations
- ✅ Cache behavior

### 3. Service Tests

Test API service functions with mocked HTTP requests.

**Example: NASA Service**
```typescript
import { nasaApi } from '../nasa'
import * as apiModule from '../api'

describe('NASA Service', () => {
  it('fetches APOD data', async () => {
    const mockData = { title: 'Test' }
    vi.mocked(apiModule.api.get).mockResolvedValue(mockData)
    
    const result = await nasaApi.getAPOD()
    expect(result).toEqual(mockData)
  })
})
```

**Test Coverage:**
- ✅ API calls
- ✅ Parameter handling
- ✅ Error responses
- ✅ Data transformation
- ✅ Timeout handling

### 4. Integration Tests

Test component interactions with real hooks and services.

**Example: APOD Route**
```typescript
import { render, screen } from '@/test/utils'
import { APOD } from '../apod'

describe('APOD Route', () => {
  it('displays APOD content', () => {
    render(<APOD />)
    expect(screen.getByText('Astronomy Picture of the Day')).toBeInTheDocument()
  })
})
```

## Mock Data

### NASA API Mocks

```typescript
const mockAPODData = {
  title: 'Cosmic Beauty',
  explanation: 'A beautiful view of the cosmos.',
  url: 'https://example.com/image.jpg',
  media_type: 'image',
  date: '2024-01-01',
}

const mockMarsRoverData = {
  photos: [
    {
      id: 1,
      sol: 1000,
      camera: { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
      img_src: 'https://example.com/rover1.jpg',
      earth_date: '2024-01-01',
      rover: { name: 'Curiosity', status: 'active' },
    },
  ],
}
```

### Planet Data Mocks

```typescript
const mockPlanetData = {
  id: 'mars',
  name: 'Mars',
  type: 'planet',
  mission_count: 3,
  active_missions: [
    { name: 'Curiosity', status: 'active', mission_type: 'rover' },
  ],
  surface_conditions: {
    temperature: { average: -63, unit: '°C' },
    gravity: 0.38,
    day_length: '24h 37m',
  },
  last_activity: {
    date: '2024-01-01',
    description: 'Curiosity sent new images',
    days_ago: 1,
  },
  notable_fact: 'Mars has the largest volcano in the solar system.',
}
```

## Testing Utilities

### Custom Render Function

```typescript
// src/test/utils.tsx
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'

const AllTheProviders = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({ routeTree })
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export const customRender = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })
```

### MSW Setup

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/apod', () => {
    return HttpResponse.json(mockAPODData)
  }),
  http.get('/api/mars-photos/:rover', () => {
    return HttpResponse.json(mockMarsRoverData)
  }),
]
```

## Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking Strategy
- Mock external dependencies
- Use MSW for API calls
- Create reusable mock data

### 3. Component Testing
- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features

### 4. Hook Testing
- Test all hook states (loading, success, error)
- Verify side effects
- Test parameter variations

### 5. Service Testing
- Mock HTTP requests
- Test error scenarios
- Verify data transformation

## Coverage Goals

- **Components**: 90%+ coverage
- **Hooks**: 95%+ coverage
- **Services**: 100% coverage
- **Utilities**: 100% coverage

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage
```

## Debugging Tests

### Common Issues

1. **TanStack Router Conflicts**: Ensure test files are excluded from route generation
2. **Async Operations**: Use `waitFor` for async assertions
3. **Mock Cleanup**: Clear mocks between tests
4. **Provider Setup**: Ensure all required providers are included

### Debug Commands

```bash
# Run specific test file
npm run test:run src/components/__tests__/PlanetCard.test.tsx

# Run tests with verbose output
npm run test:run -- --reporter=verbose

# Debug failing tests
npm run test:run -- --reporter=verbose --no-coverage
```

## Future Improvements

1. **E2E Testing**: Add Playwright for end-to-end tests
2. **Visual Testing**: Implement visual regression testing
3. **Performance Testing**: Add performance benchmarks
4. **Accessibility Testing**: Integrate axe-core for accessibility testing
5. **Contract Testing**: Add API contract testing with Pact

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 