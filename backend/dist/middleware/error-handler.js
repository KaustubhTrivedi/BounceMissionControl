"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const axios_1 = __importDefault(require("axios"));
// Global error handling middleware
const errorHandler = (error, req, res, _next) => {
    console.error('Global error handler:', error);
    // Handle Axios errors
    if (axios_1.default.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.msg ||
            error.response?.data?.errors ||
            'Failed to fetch data from NASA API';
        const errorResponse = {
            error: message,
            details: 'Unable to retrieve data from NASA API',
            timestamp: new Date().toISOString()
        };
        res.status(status).json(errorResponse);
        return;
    }
    // Handle generic errors
    const errorResponse = {
        error: 'Internal server error',
        details: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
};
exports.errorHandler = errorHandler;
// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        available_endpoints: [
            'GET /',
            'GET /api/apod?date=YYYY-MM-DD',
            'GET /api/mars-photos?sol=NUMBER',
            'GET /api/mars-photos/:rover?sol=NUMBER',
            'GET /api/rover-manifest/:rover',
            'GET /api/most-active-rover',
            'GET /api/latest-rover-photos?sol=NUMBER',
            'GET /api/perseverance-weather',
            'GET /api/multi-planetary-dashboard'
        ],
        timestamp: new Date().toISOString()
    });
};
exports.notFoundHandler = notFoundHandler;
