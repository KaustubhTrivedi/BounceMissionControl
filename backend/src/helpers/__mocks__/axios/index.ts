import { vi } from 'vitest'

const mockGet = vi.fn()
const axiosMock = {
  create: vi.fn(() => ({
    get: mockGet
  })),
  get: vi.fn()
}

export default axiosMock; 