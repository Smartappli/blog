# Task Management - WALLeSmart App Example

A simple task management app demonstrating WALLeSmart SDK Vue usage.

## Features

- ✅ Task management (create, update, delete, complete)
- 📊 Dashboard with statistics
- 👤 User profile
- 🧩 Dashboard widget (Task Summary)
- 🔒 Authentication via WALLeSmart proxy
- 📱 Responsive design

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install backend dependencies
cd backend
pnpm install
cp .env.example .env

# Install frontend dependencies
cd ../frontend
pnpm install
cp .env.example .env

# Install widget dependencies
cd ../widgets/task-summary
pnpm install
```

### Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev

# Terminal 3 - Build widget (optional)
cd widgets/task-summary
pnpm build
```

### Access the App

Frontend: http://localhost:5173 Backend: http://localhost:5000 Health Check: http://localhost:5000/health

### Build for Production

```bash
# Build backend
cd backend
# Backend runs as-is (no build needed)

# Build frontend
cd frontend
pnpm build
# Output: dist/task-management.js, dist/task-management.css

# Build widget
cd widgets/task-summary
pnpm build
# Output: dist/task-summary.es.js, dist/task-summary.css
```

### Deployment

#### Frontend

Copy `frontend/dist/task-management.js` and `frontend/dist/task-management.css` to `wallesmart-vue/public/apps/wes-app-task-management/`

#### Backend

Deploy backend to Docker container with WALLeSmart API

#### Widget

Copy `widgets/task-summary/dist/*` to `wallesmart-vue/public/widgets/wes-widget-task-summary/`

#### Project Structure

```
task-management/
├── backend/          # Express.js backend with SDK
├── frontend/         # Vue.js frontend with SDK
└── widgets/          # Dashboard widgets
    └── task-summary/ # Task summary widget
```

### License

MIT
