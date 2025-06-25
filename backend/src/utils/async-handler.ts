import { Request, Response, NextFunction } from 'express'

// Async handler wrapper for Express routes
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next)
    } catch (err) {
      next(err)
    }
  }
} 