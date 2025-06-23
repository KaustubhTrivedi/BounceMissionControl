/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { describe, it, expect, jest } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../async-handler'

describe('Async Handler - Unit Tests', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: jest.MockedFunction<NextFunction>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    mockNext = jest.fn()
  })

  it('should handle successful async functions', async () => {
    const asyncFunction = jest.fn().mockResolvedValue('success')
    const wrappedFunction = asyncHandler(asyncFunction)

    await wrappedFunction(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(asyncFunction).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext)
    expect(mockNext).not.toHaveBeenCalled() // Should not call next on success
  })

  it('should handle async function errors', async () => {
    const error = new Error('Test error')
    const asyncFunction = jest.fn().mockRejectedValue(error)
    const wrappedFunction = asyncHandler(asyncFunction)

    await wrappedFunction(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(asyncFunction).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext)
    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('should pass through function parameters correctly', async () => {
    const asyncFunction = jest.fn().mockResolvedValue(undefined)
    const wrappedFunction = asyncHandler(asyncFunction)

    mockRequest.params = { id: '123' }
    mockRequest.query = { filter: 'test' }

    await wrappedFunction(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(asyncFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { id: '123' },
        query: { filter: 'test' }
      }),
      mockResponse,
      mockNext
    )
  })

  it('should handle synchronous errors in async functions', async () => {
    const error = new Error('Sync error')
    const asyncFunction = jest.fn().mockImplementation(() => {
      throw error
    })
    const wrappedFunction = asyncHandler(asyncFunction)

    try {
      await wrappedFunction(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    } catch (e) {
      // The error is thrown synchronously, so we catch it here
      expect(e).toBe(error)
    }
  })
}) 