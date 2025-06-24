# Bounce Mission Control

Bounce Mission Control is a full-stack web application designed to make space exploration accessible to everyone by leveraging NASA's public APIs. It serves as a real-time command center, allowing users to explore fascinating data about our solar system—from daily astronomy pictures to Mars rover expeditions and technology development projects.

## 🚀 Key Features

- **Astronomy Picture of the Day (APOD) Viewer:** Discover daily featured astronomy images and videos with detailed explanations from NASA scientists. Browse the archive by selecting any past date.

- **Mars Rover Photo Explorer:** Explore high-resolution photographs captured by NASA's Curiosity rover on Mars. Search by Martian day (Sol) and view images in a responsive gallery.

- **Historic Martian Weather Data:** Visualize real atmospheric measurements from NASA's Mars missions, providing insights into temperature, pressure, and wind trends.

- **NASA TechPort Visual Explorer:** Discover NASA's technology portfolio through interactive visualizations (galaxy, timeline, map views) and detailed project analytics.

- **Multi-Planetary Dashboard:** A real-time command center displaying active missions and surface conditions across various celestial bodies in the solar system.

## 🏗️ Technology Stack

- **Architecture:** Decoupled monorepo with a React/Vite frontend and a Node.js/Express backend.

### Frontend

- Framework: React + TypeScript
- Build Tool: Vite
- Routing: TanStack Router
- State Management/Data Fetching: React Query
- Styling: Tailwind CSS
- UI Components: Shadcn UI
- Charts: Recharts

### Backend

- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- API Interaction: Axios
- Environment Variables: Dotenv
- Code Quality: ESLint, Prettier

## 📁 Project Structure

```text
.
├── .github/workflows/          # GitHub Actions CI/CD workflows
├── backend/                    # Node.js Express backend
│   ├── src/                    # Backend source code
│   │   ├── config/             # Application and NASA API configurations
│   │   ├── controllers/        # Business logic for API endpoints
│   │   ├── helpers/            # Helper functions for NASA API interactions, data processing
│   │   ├── middleware/         # Express middleware (e.g., error handling)
│   │   ├── models/             # TypeScript interfaces for API data
│   │   ├── routes/             # API route definitions
│   │   ├── utils/              # Utility functions (e.g., validators)
│   │   └── app.ts              # Main Express application entry point
│   ├── package.json            # Backend dependencies and scripts
│   ├── package-lock.json       # Backend dependency lock file
│   └── tsconfig.json           # TypeScript configuration for backend
├── frontend/                   # React TypeScript Vite frontend
│   ├── public/                 # Static assets
│   ├── src/                    # Frontend source code
│   │   ├── components/         # Reusable UI components (e.g., UI library elements, custom components)
│   │   │   └── ui/             # Shadcn UI components
│   │   ├── config/             # Frontend API configuration
│   │   ├── hooks/              # React custom hooks for data fetching
│   │   ├── lib/                # Utility functions (e.g., `cn` for Tailwind)
│   │   ├── routes/             # TanStack Router route components (pages)
│   │   ├── services/           # API service functions for frontend
│   │   ├── App.css             # Global CSS for the app
│   │   ├── App.tsx             # Main App component
│   │   ├── index.css           # Tailwind CSS imports and custom styles
│   │   ├── main.tsx            # React entry point
│   │   └── vite-env.d.ts       # Vite environment type definitions
│   ├── package.json            # Frontend dependencies and scripts
│   ├── package-lock.json       # Frontend dependency lock file
│   ├── tsconfig.json           # TypeScript configuration for frontend
│   ├── tsconfig.app.json       # TypeScript configuration for frontend application
│   ├── tsconfig.node.json      # TypeScript configuration for Node.js environment
│   └── vite.config.ts          # Vite configuration
├── .gitignore                  # Git ignore file for project-wide exclusions
└── Bounce Mission Control - SRS.md # Software Requirements Specification
```

## 🗺️ API Endpoints (Backend)

The backend acts as a secure proxy to NASA's Open APIs, abstracting data-fetching logic and securing the API key. All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | / | Health check endpoint. Provides basic API information, version, status, and available rovers/endpoints. |
| GET | /api/apod | Astronomy Picture of the Day. Query: `date` (YYYY-MM-DD, optional). |
| GET | /api/mars-photos | Mars Rover photos from the Curiosity rover (default). Query: `sol` (optional). |
| GET | /api/mars-photos/:rover | Mars Rover photos from a specific rover. Path: `rover` (`curiosity\|opportunity\|spirit\|perseverance`). Query: `sol` (optional). |
| GET | /api/rover-manifest/:rover | Mission manifest and latest sol information for a given rover. |
| GET | /api/most-active-rover | Returns the name of the most active Mars rover based on its latest photo date. |
| GET | /api/latest-rover-photos | Latest photos from the most active Mars rover. |
| GET | /api/perseverance-weather | Latest weather data from Mars (simulated fallback when external data is unavailable). |
| GET | /api/mars-weather | Historic Mars weather data (InSight mission or simulated fallback). |
| GET | /api/multi-planetary-dashboard | Aggregated data for multi-planetary dashboard (missions and surface conditions). |
| GET | /api/techport/projects | List of NASA TechPort projects. Query: `page`, `limit`, `updatedSince`, `category`, `status`, `trl`. |
| GET | /api/techport/projects/:projectId | Detailed information for a specific TechPort project. |
| GET | /api/techport/categories | List of technology categories from TechPort. |
| GET | /api/techport/analytics | Aggregated analytics and statistics about the TechPort portfolio. |

## 🌐 Frontend Pages/Routes

The frontend is a Single Page Application (SPA) powered by TanStack Router.

- `/` (Home): Multi-planetary dashboard with an overview of active missions and celestial bodies.
- `/apod`: Astronomy Picture of the Day viewer for a selected date.
- `/mars-rover`: Mars Rover Photo Explorer with gallery and Sol filter.
- `/mars-weather`: Historic Mars weather data visualizations.
- `/techport`: NASA TechPort Explorer with interactive visualizations and analytics.
- `/about`: About page with application, mission, features, and technology stack info.

## 🛠️ Setup and Local Development

### Prerequisites

- Node.js (v18+)
- npm (v8+) or Yarn (v1.x) / pnpm (v8+)
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (example):

```ini
NASA_API_KEY=YOUR_NASA_API_KEY_HERE
PORT=3000
FRONTEND_URL=http://localhost:5173
```

For development you can use `NASA_API_KEY=DEMO_KEY` (rate limited).

```bash
npm run dev:watch   # Backend runs at http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```ini
VITE_API_BASE_URL=http://localhost:3000
```

```bash
npm run dev         # Frontend runs at http://localhost:5173
```

## 🧪 Testing

Both frontend and backend include scripts for linting and type checking, and placeholders for tests.

- Linting:
	- Backend: npm run lint
	- Frontend: npm run lint
- Type Checking:
	- Backend: npm run typecheck
	- Frontend: npm run typecheck
- Tests:
	- Backend: npm test (Currently echo "No tests yet")
	- Frontend: npm test (Currently echo "No tests yet")

## ⚙️ CI/CD Pipeline

This project uses GitHub Actions for Continuous Integration (CI) and Continuous Deployment (CD) for both frontend and backend.

**Continuous Integration (CI):**
- Workflows are triggered on push and pull requests to the main branch, running only if changes are detected in their respective directories (`backend/` or `frontend/`).
- Steps include:
  - Checkout code
  - Setup Node.js (v20) and cache dependencies
  - Install dependencies (`npm ci`)
  - Lint (`npm run lint`)
  - Type check (`npm run typecheck`)
  - Run tests (`npm test`)
  - Build (`npm run build`)

**Continuous Deployment (CD):**
- **Frontend:**
  - Deployed to Netlify: [https://bouncemissioncontrolfe.kaustubhsstuff.com](https://bouncemissioncontrolfe.kaustubhsstuff.com)
  - Netlify auto-builds and deploys on main branch updates.
- **Backend:**
  - Deployed to Render: [https://bouncemissioncontrol.onrender.com](https://bouncemissioncontrol.onrender.com)
  - Render auto-builds and redeploys on main branch updates.

**Docker Image Build & Push:**
- As part of CI, Docker images for both frontend and backend are built and pushed to GitHub Container Registry (`ghcr.io`).
- Images are tagged as `latest`, with the version from `package.json` (e.g., `v1.0.0`), and a unique tag with the version and short commit SHA (e.g., `v1.0.0-abcdefg`).
- Images are pushed to `ghcr.io/${{ github.repository_lowercase }}/frontend` or `/backend`.

## 🚀 Deployment

- Frontend:
https://bouncemissioncontrolfe.kaustubhsstuff.com
- Backend:
https://bouncemissioncontrol.onrender.com

## 🤝 Contributing

I am not accepting contributions for this project at the moment.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Powered by NASA Open APIs.
- Developed as part of the "bounce Insights" coding challenge.