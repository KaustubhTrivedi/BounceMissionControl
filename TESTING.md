# 🧪 BounceMissionControl Testing Guide

This document provides a comprehensive guide to testing in the BounceMissionControl project, following a robust testing pyramid strategy.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Tools & Technologies](#tools--technologies)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Coverage & Quality Gates](#coverage--quality-gates)
- [Best Practices](#best-practices)

## 🎯 Testing Philosophy

Our testing strategy follows these core principles:

1. **Fast Feedback** - Unit tests provide immediate feedback during development
2. **Confidence** - Integration tests ensure components work together
3. **User-Centric** - E2E tests validate real user journeys
4. **Maintainable** - Tests are easy to understand, update, and debug
5. **Reliable** - Tests produce consistent results across environments

## 🏗️ Testing Pyramid

```
                ┌────────────┐
                │ E2E Tests  │  ← Cypress/Playwright (Few, High Value)
                └────┬───────┘
                     │
             ┌───────▼───────┐
             │ Integration   │  ← React Testing Library + Supertest
             └───────┬───────┘
                     │
             ┌───────▼───────┐
             │ Unit Tests    │  ← Jest + Vitest (Many, Fast)
             └───────────────┘
```

### Test Distribution
- **70%** Unit Tests - Fast, isolated, focused
- **20%** Integration Tests - Component interactions
- **10%** E2E Tests - Complete user journeys

## 🛠️ Tools & Technologies

### Frontend Testing Stack
- **Vitest** - Fast unit test runner with hot reloading
- **React Testing Library** - Component testing utilities
- **jsdom** - Browser environment simulation
- **MSW** - API mocking for realistic tests
- **Playwright** - E2E testing with real browsers

### Backend Testing Stack
- **Jest** - Comprehensive testing framework
- **Supertest** - HTTP endpoint testing
- **ts-jest** - TypeScript support for Jest

### Coverage & Quality
- **V8 Coverage** (Frontend) - Fast, accurate coverage reports
- **Jest Coverage** (Backend) - Built-in coverage analysis
- **GitHub Actions** - Automated CI/CD pipeline

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js 18+ and npm
node --version  # Should be 18+
npm --version
```

### Installation
```bash
# Install frontend dependencies
cd frontend
npm ci

# Install backend dependencies
cd ../backend
npm ci

# Install Playwright browsers (one-time setup)
cd ../frontend
npx playwright install
```

## 🏃‍♂️ Running Tests

### Frontend Tests

```bash
cd frontend

# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run with UI (visual test runner)
npm run test:ui

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Full Test Suite

```bash
# Run everything from project root
npm run test:all  # If you add this script to root package.json
```

## ✍️ Writing Tests

### Unit Tests

#### Frontend Example
```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('Utils - cn function', () => {
  it('should combine class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })
})
```

#### Backend Example
```typescript
// src/helpers/__tests__/nasa-api.helper.unit.test.ts
import { fetchAPODData } from '../nasa-api.helper'

describe('NASA API Helper', () => {
  it('should fetch APOD data successfully', async () => {
    const result = await fetchAPODData('2023-12-01')
    expect(result).toHaveProperty('title')
  })
})
```

### Component Tests

```typescript
// src/components/__tests__/PlanetCard.test.tsx
import { render, screen } from '@testing-library/react'
import PlanetCard from '../PlanetCard'

describe('PlanetCard Component', () => {
  it('renders planet information', () => {
    const mockPlanet = { name: 'Mars', /* ... */ }
    render(<PlanetCard planet={mockPlanet} />)
    
    expect(screen.getByText('Mars')).toBeInTheDocument()
  })
})
```

### Integration Tests

```typescript
// backend/src/controllers/__tests__/nasa.controller.integration.test.ts
import request from 'supertest'
import app from '../../app'

describe('NASA API Integration', () => {
  it('should return weather data', async () => {
    const response = await request(app)
      .get('/api/mars-weather')
      .expect(200)
    
    expect(response.body).toHaveProperty('sol_data')
  })
})
```

### E2E Tests

```typescript
// src/test/e2e/navigation.test.ts
import { test, expect } from '@playwright/test'

test('user navigation flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Mars Weather')
  await expect(page).toHaveURL('/mars-weather')
})
```

## 🔄 CI/CD Integration

Our GitHub Actions pipeline automatically runs:

1. **Linting & Formatting** - Code quality checks
2. **TypeScript Compilation** - Type checking
3. **Unit Tests** - Fast feedback on logic
4. **Integration Tests** - API and component interaction
5. **E2E Tests** - Full user journey validation
6. **Build Verification** - Production build success
7. **Coverage Analysis** - Quality gate enforcement

### Pipeline Triggers
- **Push** to `main`, `develop`, or `testing/*` branches
- **Pull Requests** to `main` or `develop`

### Pipeline Status
All tests must pass for:
- PR merging
- Deployment to staging/production

## 📊 Coverage & Quality Gates

### Coverage Thresholds

| Metric | Frontend | Backend |
|--------|----------|---------|
| Lines | 85% | 85% |
| Functions | 85% | 85% |
| Branches | 80% | 80% |
| Statements | 85% | 85% |

### Quality Gates
- ✅ All tests pass
- ✅ Coverage thresholds met
- ✅ No linting errors
- ✅ TypeScript compilation succeeds
- ✅ Build completes successfully

## 🎯 Best Practices

### Test Organization
```
src/
├── components/
│   ├── PlanetCard.tsx
│   └── __tests__/
│       └── PlanetCard.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── test/
    ├── setup.ts
    └── e2e/
        └── navigation.test.ts
```

### Naming Conventions
- **Files**: `ComponentName.test.tsx`, `filename.test.ts`
- **Test suites**: `describe('ComponentName', () => {})`
- **Test cases**: `it('should do something specific', () => {})`

### Test Data
```typescript
// Use factories for test data
const createMockPlanet = (overrides = {}) => ({
  id: 'mars',
  name: 'Mars',
  type: 'planet' as const,
  ...overrides
})
```

### Mocking Guidelines

#### MSW for API Mocking
```typescript
// src/test/setup.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  http.get('/api/mars-weather', () => {
    return HttpResponse.json({ /* mock data */ })
  })
)
```

#### Component Dependencies
```typescript
// Mock external dependencies
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}))
```

### Async Testing
```typescript
// Wait for elements
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument()
})

// User interactions
await user.click(screen.getByRole('button', { name: 'Submit' }))
```

### E2E Best Practices
```typescript
// Use data-testid for reliable element selection
await page.locator('[data-testid="weather-card"]').click()

// Wait for network requests
await page.waitForResponse('/api/mars-weather')

// Verify final state
await expect(page.locator('h1')).toContainText('Mars Weather')
```

## 🐛 Debugging Tests

### Frontend (Vitest)
```bash
# Debug in VS Code
npm run test -- --inspect-brk

# Open Vitest UI for visual debugging
npm run test:ui
```

### Backend (Jest)
```bash
# Debug with Node inspector
npm run test -- --detectOpenHandles --forceExit

# Run specific test file
npm run test -- nasa.controller.test.ts
```

### E2E (Playwright)
```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode with Playwright Inspector
npx playwright test --debug

# Generate test with Playwright codegen
npx playwright codegen localhost:5173
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [MSW Documentation](https://mswjs.io/)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this documentation if needed
5. Include test scenarios in PR description

---

**Happy Testing! 🧪✨** 