"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nasa_controller_1 = require("../controllers/nasa.controller");
const async_handler_1 = require("../utils/async-handler");
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/', nasa_controller_1.healthCheck);
// APOD (Astronomy Picture of the Day) endpoint
router.get('/apod', (0, async_handler_1.asyncHandler)(nasa_controller_1.getAPOD));
// Mars Rover Photos endpoints
router.get('/mars-photos', (0, async_handler_1.asyncHandler)(nasa_controller_1.getMarsRoverPhotos)); // Default rover (curiosity)
router.get('/mars-photos/:rover', (0, async_handler_1.asyncHandler)(nasa_controller_1.getMarsRoverPhotos)); // Specific rover
// Rover manifest endpoints
router.get('/rover-manifest/:rover', (0, async_handler_1.asyncHandler)(nasa_controller_1.getRoverManifest));
// Most active rover endpoints
router.get('/most-active-rover', (0, async_handler_1.asyncHandler)(nasa_controller_1.getMostActiveRoverEndpoint));
router.get('/latest-rover-photos', (0, async_handler_1.asyncHandler)(nasa_controller_1.getLatestRoverPhotos)); // Photos from most active rover
// Perseverance MEDA weather route
router.get('/perseverance-weather', (0, async_handler_1.asyncHandler)(nasa_controller_1.getPerseveranceWeatherData));
// Mars weather endpoint
router.get('/mars-weather', nasa_controller_1.getHistoricMarsWeather);
// Multi-planetary dashboard endpoint
router.get('/multi-planetary-dashboard', (0, async_handler_1.asyncHandler)(nasa_controller_1.getMultiPlanetaryDashboardData));
// TechPort API endpoints
router.get('/techport/projects', (0, async_handler_1.asyncHandler)(nasa_controller_1.getTechPortProjects));
router.get('/techport/projects/:projectId', (0, async_handler_1.asyncHandler)(nasa_controller_1.getTechPortProject));
router.get('/techport/categories', (0, async_handler_1.asyncHandler)(nasa_controller_1.getTechPortCategoriesEndpoint));
router.get('/techport/analytics', (0, async_handler_1.asyncHandler)(nasa_controller_1.getTechPortAnalyticsEndpoint));
exports.default = router;
