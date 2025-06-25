// Date validation for APOD endpoint
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) {
    return false
  }
  // Check if date is valid calendar date
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(dateString)
  if (!(date instanceof Date) || isNaN(date.getTime())) return false
  // Month is 0-indexed in JS Date
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  )
}

// Sol validation for Mars Rover endpoint
export const isValidSol = (solString: string): boolean => {
  // Only allow non-negative integers (no decimals)
  return /^\d+$/.test(solString) && Number.isInteger(Number(solString)) && Number(solString) >= 0
}

// Generic string validation
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
} 