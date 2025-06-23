// Date validation for APOD endpoint
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) {
    return false
  }
  
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// Sol validation for Mars Rover endpoint
export const isValidSol = (solString: string): boolean => {
  const solNumber = parseInt(solString, 10)
  return !isNaN(solNumber) && solNumber >= 0
}

// Generic string validation
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
} 