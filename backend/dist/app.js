"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const error_handler_1 = require("./middleware/error-handler");
// Load environment variables
dotenv_1.default.config();
// Import configurations
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appConfig = require('./config/app.config');
// Create Express application
const app = (0, express_1.default)();
// Configure CORS
app.use((0, cors_1.default)(appConfig.cors));
// Configure JSON parsing
app.use(express_1.default.json({ limit: appConfig.requestLimits.json }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: appConfig.requestLimits.urlencoded
}));
// Configure routes
(0, routes_1.configureRoutes)(app);
// Error handling middleware (must be last)
app.use(error_handler_1.errorHandler);
app.use(error_handler_1.notFoundHandler);
// Start server
app.listen(appConfig.port, () => {
    console.log(`🚀 Bounce Mission Control Backend listening on port ${appConfig.port}`);
    console.log(`Environment: ${appConfig.environment}`);
    console.log(`NASA API Key: ${process.env.NASA_API_KEY === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Configured'}`);
    if (appConfig.environment === 'development') {
        console.log(`Available endpoints:`);
        console.log(`  GET http://localhost:${appConfig.port}/api/`);
        console.log(`  GET http://localhost:${appConfig.port}/api/apod?date=YYYY-MM-DD`);
        console.log(`  GET http://localhost:${appConfig.port}/api/mars-photos?sol=NUMBER`);
    }
});
exports.default = app;
