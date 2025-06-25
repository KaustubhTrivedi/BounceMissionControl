"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// Load environment variables for testing
(0, dotenv_1.config)({ path: '.env.test' });
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random port for testing
// Global test timeout
jest.setTimeout(30000);
// Mock external dependencies that shouldn't be called during tests
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }))
}));
// Console suppressions for cleaner test output
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is deprecated')) {
            return;
        }
        originalError.call(console, ...args);
    };
});
afterAll(() => {
    console.error = originalError;
});
