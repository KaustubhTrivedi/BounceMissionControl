import { describe, it, expect, jest } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../async-handler'

type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>

describe('Async Handler - Unit Tests', () => {
  let mockRequest: Request
  let mockResponse: Response
  let mockNext: jest.MockedFunction<NextFunction>

  beforeEach(() => {
    mockRequest = {} as unknown as Request

    const statusMock = jest.fn().mockReturnThis() as unknown as Response['status']
    const jsonMock = jest.fn().mockReturnThis() as unknown as Response['json']

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response
    mockNext = jest.fn() as unknown as jest.MockedFunction<NextFunction>
  })

  it('handles successful async functions', async () => {
    const asyncFunction: jest.MockedFunction<AsyncFn> = jest.fn(async () => 'success')
    const wrapped = asyncHandler(asyncFunction)

    await wrapped(mockRequest as unknown as Request, mockResponse as Response, mockNext)

    expect(asyncFunction).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      mockNext
    )
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('forwards rejected promise errors', async () => {
    const error = new Error('Test error')
    const asyncFunction: jest.MockedFunction<AsyncFn> = jest.fn(async () => {
      throw error
    })
    const wrapped = asyncHandler(asyncFunction)

    await wrapped(mockRequest as unknown as Request, mockResponse as Response, mockNext)

    expect(asyncFunction).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      mockNext
    )
    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('passes params and query through', async () => {
    const asyncFunction: jest.MockedFunction<AsyncFn> = jest.fn(async () => undefined)
    const wrapped = asyncHandler(asyncFunction)

    // add params/query
    Object.assign(
      mockRequest as unknown as {
        params?: Record<string, unknown>
        query?: Record<string, unknown>
      },
      {
        params: { id: '123' },
        query: { filter: 'test' },
      }
    )

    await wrapped(mockRequest as Request, mockResponse as Response, mockNext)

    expect(asyncFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { id: '123' },
        query: { filter: 'test' },
      }),
      mockResponse,
      mockNext
    )
  })

  it('catches synchronous errors', async () => {
    const error = new Error('Sync error')
    const asyncFunction: jest.MockedFunction<AsyncFn> = jest.fn(() => {
      throw error
    })
    const wrapped = asyncHandler(asyncFunction)

    expect(() =>
      wrapped(mockRequest as Request, mockResponse as Response, mockNext)
    ).toThrow(error)
  })
}) 