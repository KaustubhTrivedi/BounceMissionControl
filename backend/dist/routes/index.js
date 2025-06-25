"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const nasa_routes_1 = __importDefault(require("./nasa.routes"));
// Configure all application routes
const configureRoutes = (app) => {
    // Mount NASA routes under /api prefix
    app.use('/api', nasa_routes_1.default);
};
exports.configureRoutes = configureRoutes;
