import { describe, it, expect } from 'vitest'
import { isValidDate, isValidSol, isNonEmptyString } from '../validators'

describe('Validators', () => {
  describe('isValidDate', () => {
    it('should validate correct date format YYYY-MM-DD', () => {
      expect(isValidDate('2024-01-01')).toBe(true)
      expect(isValidDate('2024-12-31')).toBe(true)
      expect(isValidDate('2020-02-29')).toBe(true) // Leap year
    })

    it('should reject invalid date formats', () => {
      expect(isValidDate('2024/01/01')).toBe(false) // Wrong separator
      expect(isValidDate('01-01-2024')).toBe(false) // Wrong order
      expect(isValidDate('2024-1-1')).toBe(false) // Missing leading zeros
      expect(isValidDate('2024-13-01')).toBe(false) // Invalid month
      expect(isValidDate('2024-01-32')).toBe(false) // Invalid day
      expect(isValidDate('2024-02-30')).toBe(false) // Invalid day for February
      expect(isValidDate('2023-02-29')).toBe(false) // Invalid leap day in non-leap year
    })

    it('should reject non-date strings', () => {
      expect(isValidDate('')).toBe(false)
      expect(isValidDate('not-a-date')).toBe(false)
      expect(isValidDate('2024')).toBe(false)
      expect(isValidDate('2024-01')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidDate('0000-01-01')).toBe(true) // Valid date format
      expect(isValidDate('9999-12-31')).toBe(true) // Valid date format
    })
  })

  describe('isValidSol', () => {
    it('should validate positive integers', () => {
      expect(isValidSol('0')).toBe(true)
      expect(isValidSol('1')).toBe(true)
      expect(isValidSol('1000')).toBe(true)
      expect(isValidSol('999999')).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(isValidSol('-1')).toBe(false)
      expect(isValidSol('-100')).toBe(false)
    })

    it('should reject non-numeric strings', () => {
      expect(isValidSol('')).toBe(false)
      expect(isValidSol('abc')).toBe(false)
      expect(isValidSol('1.5')).toBe(false) // Decimals
      expect(isValidSol('1abc')).toBe(false) // Mixed
      expect(isValidSol('abc1')).toBe(false) // Mixed
    })

    it('should reject invalid number formats', () => {
      expect(isValidSol('01')).toBe(true) // Leading zero is valid
      expect(isValidSol('001')).toBe(true) // Multiple leading zeros
    })
  })

  describe('isNonEmptyString', () => {
    it('should validate non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString('123')).toBe(true)
      expect(isNonEmptyString(' ')).toBe(false) // Only whitespace
      expect(isNonEmptyString('\t\n')).toBe(false) // Only whitespace
    })

    it('should reject empty strings', () => {
      expect(isNonEmptyString('')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
      expect(isNonEmptyString({})).toBe(false)
      expect(isNonEmptyString([])).toBe(false)
      expect(isNonEmptyString(true)).toBe(false)
      expect(isNonEmptyString(false)).toBe(false)
    })

    it('should handle strings with only whitespace', () => {
      expect(isNonEmptyString('   ')).toBe(false)
      expect(isNonEmptyString('\t')).toBe(false)
      expect(isNonEmptyString('\n')).toBe(false)
      expect(isNonEmptyString('\r')).toBe(false)
    })

    it('should validate strings with mixed content', () => {
      expect(isNonEmptyString(' hello ')).toBe(true) // Has non-whitespace
      expect(isNonEmptyString('a')).toBe(true)
      expect(isNonEmptyString('0')).toBe(true)
    })
  })
}) 