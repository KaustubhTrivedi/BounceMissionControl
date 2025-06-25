import { describe, it, expect, vi } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../async-handler'

describe('asyncHandler', () => {
  it('should handle successful async functions', async () => {
    const mockReq = {} as Request
    const mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response
    const mockNext = vi.fn() as NextFunction

    const asyncFunction = async (req: Request, res: Response) => {
      res.json({ success: true })
    }

    const wrappedHandler = asyncHandler(asyncFunction)
    await wrappedHandler(mockReq, mockRes, mockNext)

    expect(mockRes.json).toHaveBeenCalledWith({ success: true })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should handle async functions that throw errors', async () => {
    const mockReq = {} as Request
    const mockRes = {} as Response
    const mockNext = vi.fn() as NextFunction

    const error = new Error('Test error')
    const asyncFunction = async () => {
      throw error
    }

    const wrappedHandler = asyncHandler(asyncFunction)
    await wrappedHandler(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('should handle synchronous functions that throw errors', async () => {
    const mockReq = {} as Request
    const mockRes = {} as Response
    const mockNext = vi.fn() as NextFunction

    const error = new Error('Test error')
    const syncFunction = () => {
      throw error
    }

    const wrappedHandler = asyncHandler(syncFunction)
    await wrappedHandler(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('should handle functions that return promises', async () => {
    const mockReq = {} as Request
    const mockRes = {
      json: vi.fn(),
    } as unknown as Response
    const mockNext = vi.fn() as NextFunction

    const promiseFunction = (req: Request, res: Response) => {
      return Promise.resolve().then(() => {
        res.json({ data: 'promise result' })
      })
    }

    const wrappedHandler = asyncHandler(promiseFunction)
    await wrappedHandler(mockReq, mockRes, mockNext)

    expect(mockRes.json).toHaveBeenCalledWith({ data: 'promise result' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should handle functions that return rejected promises', async () => {
    const mockReq = {} as Request
    const mockRes = {} as Response
    const mockNext = vi.fn() as NextFunction

    const error = new Error('Promise rejection')
    const promiseFunction = () => {
      return Promise.reject(error)
    }

    const wrappedHandler = asyncHandler(promiseFunction)
    await wrappedHandler(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('should pass request, response, and next to the wrapped function', async () => {
    const mockReq = { body: { test: 'data' } } as Request
    const mockRes = {
      json: vi.fn(),
    } as unknown as Response
    const mockNext = vi.fn() as NextFunction

    const asyncFunction = vi.fn(async (req: Request, res: Response, next: NextFunction) => {
      expect(req).toBe(mockReq)
      expect(res).toBe(mockRes)
      expect(next).toBe(mockNext)
      res.json({ received: req.body })
    })

    const wrappedHandler = asyncHandler(asyncFunction)
    await wrappedHandler(mockReq, mockRes, mockNext)

    expect(asyncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext)
    expect(mockRes.json).toHaveBeenCalledWith({ received: { test: 'data' } })
  })
}) 