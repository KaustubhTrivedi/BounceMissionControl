"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const nasa_api_helper_1 = require("../nasa-api.helper");
const config = __importStar(require("../../config/nasa.config"));
(0, globals_1.describe)('NASA API Helper - Unit Tests', () => {
    (0, globals_1.describe)('Module imports and exports', () => {
        (0, globals_1.it)('should export all required functions', () => {
            (0, globals_1.expect)(typeof nasa_api_helper_1.fetchAPODData).toBe('function');
            (0, globals_1.expect)(typeof nasa_api_helper_1.fetchMarsRoverPhotos).toBe('function');
            (0, globals_1.expect)(typeof nasa_api_helper_1.getMostActiveRover).toBe('function');
            (0, globals_1.expect)(typeof nasa_api_helper_1.checkNASAApiHealth).toBe('function');
            (0, globals_1.expect)(typeof nasa_api_helper_1.fetchRoverManifest).toBe('function');
            (0, globals_1.expect)(typeof nasa_api_helper_1.fetchPerseveranceWeatherData).toBe('function');
        });
        (0, globals_1.it)('should load NASA config correctly', () => {
            (0, globals_1.expect)(config).toBeDefined();
            (0, globals_1.expect)(config.baseUrl).toBeDefined();
            (0, globals_1.expect)(config.apiKey).toBeDefined();
            (0, globals_1.expect)(config.endpoints).toBeDefined();
            (0, globals_1.expect)(config.rovers).toBeDefined();
            (0, globals_1.expect)(Array.isArray(config.rovers)).toBe(true);
            (0, globals_1.expect)(config.rovers).toContain('curiosity');
            (0, globals_1.expect)(config.rovers).toContain('perseverance');
        });
        (0, globals_1.it)('should have proper endpoint configuration', () => {
            (0, globals_1.expect)(config.endpoints.apod).toBe('/planetary/apod');
            (0, globals_1.expect)(config.endpoints.marsRover).toBe('/mars-photos/api/v1/rovers');
            (0, globals_1.expect)(config.endpoints.marsRoverManifest).toBe('/mars-photos/api/v1/manifests');
        });
    });
    (0, globals_1.describe)('Error handling functionality', () => {
        (0, globals_1.it)('should handle network errors gracefully', async () => {
            // This will actually make a request and handle errors
            const result = await (0, nasa_api_helper_1.fetchMarsRoverPhotos)('invalid-rover');
            // Should return empty photos array on error
            (0, globals_1.expect)(result).toHaveProperty('photos');
            (0, globals_1.expect)(Array.isArray(result.photos)).toBe(true);
        });
        (0, globals_1.it)('should provide fallback for most active rover', async () => {
            // This will either return a real rover or fallback to curiosity
            const result = await (0, nasa_api_helper_1.getMostActiveRover)();
            (0, globals_1.expect)(typeof result).toBe('string');
            (0, globals_1.expect)(result.length).toBeGreaterThan(0);
        });
        (0, globals_1.it)('should handle API health check', async () => {
            const result = await (0, nasa_api_helper_1.checkNASAApiHealth)();
            (0, globals_1.expect)(typeof result).toBe('boolean');
        });
    });
    (0, globals_1.describe)('Weather data functionality', () => {
        (0, globals_1.it)('should return weather data structure', async () => {
            const result = await (0, nasa_api_helper_1.fetchPerseveranceWeatherData)();
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result).toHaveProperty('sol_data');
            (0, globals_1.expect)(result).toHaveProperty('location');
            (0, globals_1.expect)(result).toHaveProperty('timestamp');
        });
    });
});
