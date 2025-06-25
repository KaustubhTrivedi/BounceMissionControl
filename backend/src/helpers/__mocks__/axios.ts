import { vi } from 'vitest'
const axiosMock = {
  create: () => axiosMock,
  get: vi.fn()
}
export default axiosMock; 