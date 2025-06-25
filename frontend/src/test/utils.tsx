import type { ReactElement } from 'react'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { AllTheProviders } from './providers'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Export specific testing utilities
export {
  screen,
  waitFor,
  fireEvent,
  within,
  customRender as render,
} 