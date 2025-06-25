"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTechPortAnalyticsEndpoint = exports.getTechPortCategoriesEndpoint = exports.getTechPortProject = exports.getTechPortProjects = exports.getHistoricMarsWeather = exports.getMultiPlanetaryDashboardData = exports.getMarsWeather = exports.getPerseveranceWeatherData = exports.getLatestRoverPhotos = exports.getMostActiveRoverEndpoint = exports.getRoverManifest = exports.getMarsRoverPhotos = exports.getAPOD = exports.healthCheck = void 0;
const nasa_api_helper_1 = require("../helpers/nasa-api.helper");
const validators_1 = require("../utils/validators");
const async_handler_1 = require("../utils/async-handler");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nasaConfig = require('../config/nasa.config');
// Health check controller
const healthCheck = (req, res) => {
    res.json({
        message: 'Bounce Mission Control Backend API',
        version: '1.0.0',
        status: 'operational',
        timestamp: new Date().toISOString(),
        nasa_api_key: process.env.NASA_API_KEY === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Configured',
        available_rovers: nasaConfig.rovers,
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
        ]
    });
};
exports.healthCheck = healthCheck;
// APOD controller
const getAPOD = async (req, res) => {
    const { date } = req.query;
    // Validate date parameter if provided
    if (date && (0, validators_1.isNonEmptyString)(date)) {
        if (!(0, validators_1.isValidDate)(date)) {
            return res.status(400).json({
                error: 'Invalid date format. Please use YYYY-MM-DD format.',
                timestamp: new Date().toISOString()
            });
        }
    }
    const apodData = await (0, nasa_api_helper_1.fetchAPODData)(date);
    res.json(apodData);
};
exports.getAPOD = getAPOD;
// Mars Rover Photos controller with dynamic rover support
const getMarsRoverPhotos = async (req, res) => {
    const { sol } = req.query;
    const { rover } = req.params;
    // Validate rover parameter
    if (rover && !nasaConfig.rovers.includes(rover.toLowerCase())) {
        return res.status(400).json({
            error: `Invalid rover. Available rovers: ${nasaConfig.rovers.join(', ')}`,
            timestamp: new Date().toISOString()
        });
    }
    // Validate sol parameter if provided
    if (sol && (0, validators_1.isNonEmptyString)(sol)) {
        if (!(0, validators_1.isValidSol)(sol)) {
            return res.status(400).json({
                error: 'Invalid sol value. Sol must be a non-negative integer.',
                timestamp: new Date().toISOString()
            });
        }
    }
    const selectedRover = rover || 'curiosity';
    try {
        const roverData = await (0, nasa_api_helper_1.fetchMarsRoverPhotos)(selectedRover, sol);
        // Ensure photos array exists and is valid
        const photos = roverData?.photos || [];
        // Format response with metadata
        const response = {
            photos: photos,
            total_photos: photos.length,
            rover: photos[0]?.rover || null,
            sol: (typeof sol === 'string') ? sol : 'latest'
        };
        res.json(response);
    }
    catch (error) {
        console.error(`Error fetching Mars rover photos for ${selectedRover}:`, error);
        res.status(500).json({
            error: `Failed to fetch Mars rover photos for ${selectedRover}. The rover may be inactive or data temporarily unavailable.`,
            timestamp: new Date().toISOString()
        });
    }
};
exports.getMarsRoverPhotos = getMarsRoverPhotos;
// Get rover manifest (mission info and latest sol)
const getRoverManifest = async (req, res) => {
    const { rover } = req.params;
    // Validate rover parameter
    if (!rover || !nasaConfig.rovers.includes(rover.toLowerCase())) {
        return res.status(400).json({
            error: `Invalid rover. Available rovers: ${nasaConfig.rovers.join(', ')}`,
            timestamp: new Date().toISOString()
        });
    }
    const manifest = await (0, nasa_api_helper_1.fetchRoverManifest)(rover.toLowerCase());
    res.json(manifest);
};
exports.getRoverManifest = getRoverManifest;
// Get the most active rover
const getMostActiveRoverEndpoint = async (req, res) => {
    const mostActiveRover = await (0, nasa_api_helper_1.getMostActiveRover)();
    res.json({
        most_active_rover: mostActiveRover,
        timestamp: new Date().toISOString()
    });
};
exports.getMostActiveRoverEndpoint = getMostActiveRoverEndpoint;
// Get photos from the most active rover
const getLatestRoverPhotos = async (req, res) => {
    const { sol } = req.query;
    // Validate sol parameter if provided
    if (sol && (0, validators_1.isNonEmptyString)(sol)) {
        if (!(0, validators_1.isValidSol)(sol)) {
            return res.status(400).json({
                error: 'Invalid sol value. Sol must be a non-negative integer.',
                timestamp: new Date().toISOString()
            });
        }
    }
    try {
        const mostActiveRover = await (0, nasa_api_helper_1.getMostActiveRover)();
        const roverData = await (0, nasa_api_helper_1.fetchMarsRoverPhotos)(mostActiveRover, sol);
        // Ensure photos array exists and is valid
        const photos = roverData?.photos || [];
        // Format response with metadata
        const response = {
            photos: photos,
            total_photos: photos.length,
            rover: photos[0]?.rover || null,
            sol: (typeof sol === 'string') ? sol : 'latest',
            selected_rover: mostActiveRover
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching latest rover photos:', error);
        res.status(500).json({
            error: 'Failed to fetch latest rover photos. Data may be temporarily unavailable.',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getLatestRoverPhotos = getLatestRoverPhotos;
// Get Perseverance MEDA weather data
const getPerseveranceWeatherData = async (req, res) => {
    try {
        const weatherData = await (0, nasa_api_helper_1.fetchPerseveranceWeatherData)();
        res.json(weatherData);
    }
    catch (error) {
        console.error('Error fetching Perseverance weather data:', error);
        res.status(500).json({
            error: 'Failed to fetch Perseverance weather data. Data may be temporarily unavailable.',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getPerseveranceWeatherData = getPerseveranceWeatherData;
// Get Mars weather data (alias for Perseverance weather)
const getMarsWeather = async (req, res) => {
    try {
        const weatherData = await (0, nasa_api_helper_1.fetchPerseveranceWeatherData)();
        res.json(weatherData);
    }
    catch (error) {
        console.error('Error fetching Mars weather data:', error);
        res.status(500).json({
            error: 'Failed to fetch Mars weather data. Data may be temporarily unavailable.',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getMarsWeather = getMarsWeather;
// Get multi-planetary dashboard data
const getMultiPlanetaryDashboardData = async (req, res) => {
    try {
        const dashboardData = await (0, nasa_api_helper_1.getMultiPlanetaryDashboard)();
        res.json(dashboardData);
    }
    catch (error) {
        console.error('Error fetching multi-planetary dashboard data:', error);
        res.status(500).json({
            error: 'Failed to fetch multi-planetary dashboard data',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getMultiPlanetaryDashboardData = getMultiPlanetaryDashboardData;
// Get historic Mars weather data for visualization
exports.getHistoricMarsWeather = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const historicData = await (0, nasa_api_helper_1.fetchHistoricMarsWeatherData)();
    res.status(200).json({
        success: true,
        data: historicData,
        message: 'Historic Mars weather data retrieved successfully'
    });
});
// TechPort Controllers
const getTechPortProjects = async (req, res) => {
    const { page, limit, updatedSince, category, status, trl } = req.query;
    try {
        const techPortData = await (0, nasa_api_helper_1.fetchTechPortProjects)({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 100,
            updatedSince: updatedSince
        });
        // Apply client-side filtering since TechPort API might be limited
        let filteredProjects = techPortData.projects;
        if (category) {
            filteredProjects = filteredProjects.filter((project) => project.category?.toLowerCase().includes(category.toLowerCase()));
        }
        if (status) {
            filteredProjects = filteredProjects.filter((project) => project.status?.toLowerCase() === status.toLowerCase());
        }
        if (trl) {
            filteredProjects = filteredProjects.filter((project) => project.trl === parseInt(trl));
        }
        res.json({
            ...techPortData,
            projects: filteredProjects
        });
    }
    catch (error) {
        console.error('Error in getTechPortProjects controller:', error);
        res.status(500).json({
            error: 'Failed to fetch or process TechPort projects.',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getTechPortProjects = getTechPortProjects;
const getTechPortProject = async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) {
        return res.status(400).json({
            error: 'Project ID is required',
            timestamp: new Date().toISOString()
        });
    }
    try {
        const projectData = await (0, nasa_api_helper_1.fetchTechPortProject)(projectId);
        res.json(projectData);
    }
    catch (error) {
        console.error(`Error fetching TechPort project ${projectId}:`, error);
        res.status(404).json({
            error: `TechPort project ${projectId} not found or unavailable.`,
            timestamp: new Date().toISOString()
        });
    }
};
exports.getTechPortProject = getTechPortProject;
const getTechPortCategoriesEndpoint = async (req, res) => {
    try {
        const categoriesData = await (0, nasa_api_helper_1.getTechPortCategories)();
        res.json(categoriesData);
    }
    catch (error) {
        console.error('Error fetching TechPort categories:', error);
        res.status(500).json({
            error: 'Failed to fetch TechPort categories. Data may be temporarily unavailable.',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getTechPortCategoriesEndpoint = getTechPortCategoriesEndpoint;
const getTechPortAnalyticsEndpoint = async (req, res) => {
    try {
        const analyticsData = await (0, nasa_api_helper_1.getTechPortAnalytics)();
        res.json(analyticsData);
    }
    catch (error) {
        console.error('Error fetching TechPort analytics:', error);
        res.status(500).json({
            error: 'Failed to fetch TechPort analytics. Data may be temporarily unavailable.',
            timestamp: new Date().toISOString()
        });
    }
};
exports.getTechPortAnalyticsEndpoint = getTechPortAnalyticsEndpoint;
