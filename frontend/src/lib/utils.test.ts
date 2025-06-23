import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('Utils - cn function', () => {
  it('should combine class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'conditional', 'always')).toBe('base always')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('should handle Tailwind class conflicts', () => {
    // twMerge should handle conflicting classes
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle complex class combinations', () => {
    const result = cn(
      'bg-white border border-gray-200',
      'hover:bg-gray-50',
      true && 'active:bg-gray-100',
      false && 'disabled:opacity-50'
    )
    expect(result).toContain('bg-white')
    expect(result).toContain('hover:bg-gray-50')
    expect(result).toContain('active:bg-gray-100')
    expect(result).not.toContain('disabled:opacity-50')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn('', '', '')).toBe('')
  })
}) 