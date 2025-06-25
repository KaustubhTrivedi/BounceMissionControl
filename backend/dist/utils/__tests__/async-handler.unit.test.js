"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const async_handler_1 = require("../async-handler");
(0, globals_1.describe)('Async Handler - Unit Tests', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeEach(() => {
        mockRequest = {};
        const statusMock = globals_1.jest.fn().mockReturnThis();
        const jsonMock = globals_1.jest.fn().mockReturnThis();
        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };
        mockNext = globals_1.jest.fn();
    });
    (0, globals_1.it)('handles successful async functions', async () => {
        const asyncFunction = globals_1.jest.fn(async () => 'success');
        const wrapped = (0, async_handler_1.asyncHandler)(asyncFunction);
        await wrapped(mockRequest, mockResponse, mockNext);
        (0, globals_1.expect)(asyncFunction).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('forwards rejected promise errors', async () => {
        const error = new Error('Test error');
        const asyncFunction = globals_1.jest.fn(async () => {
            throw error;
        });
        const wrapped = (0, async_handler_1.asyncHandler)(asyncFunction);
        await wrapped(mockRequest, mockResponse, mockNext);
        (0, globals_1.expect)(asyncFunction).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
        (0, globals_1.expect)(mockNext).toHaveBeenCalledWith(error);
    });
    (0, globals_1.it)('passes params and query through', async () => {
        const asyncFunction = globals_1.jest.fn(async () => undefined);
        const wrapped = (0, async_handler_1.asyncHandler)(asyncFunction);
        // add params/query
        Object.assign(mockRequest, {
            params: { id: '123' },
            query: { filter: 'test' },
        });
        await wrapped(mockRequest, mockResponse, mockNext);
        (0, globals_1.expect)(asyncFunction).toHaveBeenCalledWith(globals_1.expect.objectContaining({
            params: { id: '123' },
            query: { filter: 'test' },
        }), mockResponse, mockNext);
    });
    (0, globals_1.it)('catches synchronous errors', async () => {
        const error = new Error('Sync error');
        const asyncFunction = globals_1.jest.fn(() => {
            throw error;
        });
        const wrapped = (0, async_handler_1.asyncHandler)(asyncFunction);
        (0, globals_1.expect)(() => wrapped(mockRequest, mockResponse, mockNext)).toThrow(error);
    });
});
