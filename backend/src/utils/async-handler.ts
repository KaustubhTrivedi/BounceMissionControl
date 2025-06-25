import { Request, Response, NextFunction } from 'express'

// Type for async route handlers
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown

// Async handler wrapper for Express routes
export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next)
    } catch (err) {
      next(err)
    }
  }
} 