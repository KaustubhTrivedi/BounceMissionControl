# Bounce Mission Control Backend

A well-structured Node.js/Express.js backend following industry best practices for the NASA API Explorer.

## 📁 Folder Structure

```
src/
├── config/          # Configuration files
│   ├── app.config.js    # Application settings
│   └── nasa.config.js   # NASA API configuration
├── controllers/     # Business logic handlers
│   └── nasa.controller.ts
├── helpers/         # Helper functions for specific tasks
│   └── nasa-api.helper.ts
├── middleware/      # Express middleware
│   └── error-handler.ts
├── models/          # TypeScript interfaces and types
│   └── nasa.models.ts
├── routes/          # Route definitions
│   ├── index.ts         # Central route configuration
│   └── nasa.routes.ts   # NASA API routes
├── utils/           # Utility functions
│   ├── async-handler.ts # Async wrapper for Express
│   └── validators.ts    # Input validation utilities
└── app.ts          # Main application entry point
```

## 🏗️ Architecture Patterns

### Separation of Concerns
- **Controllers**: Handle request/response logic and orchestrate business operations
- **Helpers**: Contain business-specific logic (NASA API interactions)
- **Utils**: Generic utility functions that can be reused
- **Middleware**: Express-specific middleware (error handling, auth, etc.)
- **Models**: TypeScript interfaces and data models
- **Config**: Application and service configurations

### Benefits of This Structure
1. **Maintainability**: Clear separation makes code easier to understand and modify
2. **Scalability**: Easy to add new features without affecting existing code
3. **Testability**: Each component can be tested in isolation
4. **Reusability**: Utils and helpers can be shared across different parts of the app
5. **Team Collaboration**: Developers can work on different layers without conflicts

## 🚀 Key Features

- **Express 5** with proper async error handling
- **TypeScript** for type safety
- **Modular architecture** following industry standards
- **Comprehensive error handling**
- **Input validation**
- **Configuration management**
- **NASA API integration**

## 📚 Inspired By

This structure follows the patterns outlined in [Vaibhav Mehta's Node.js folder structure guide](https://mr-alien.medium.com/folder-structure-for-nodejs-expressjs-project-56be9ec35548), adapted for our specific NASA API use case. 