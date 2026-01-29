# Task Management Application (Python)

Task Management application built with FastAPI and WalleSmart Python SDK.

## Features

- 🔐 **JWT Authentication** via WalleSmart proxy
- 📝 **Task Management** CRUD operations
- 👤 **User Profile** management
- 📊 **GraphQL Integration** examples
- 🎯 **Role-Based Access Control**
- 🐳 **Docker Support** for development and production
- 🔒 **Private PyPI Registry Support** (GitLab Packages)

---

## 🔒 Private Registry Configuration (GitLab PyPI)

This project uses the **private GitLab PyPI registry** to install packages like `wallesmart-sdk`.

### For Local Development

#### Option 1: Using pip config (Recommended)
```bash
# Configure pip to use the private registry
pip config set global.extra-index-url https://__token__:<your-token>@gitlab.awenet.be/api/v4/projects/84/packages/pypi/simple

# Install dependencies
pip install -r requirements.txt
```

Replace `<your-token>` with your GitLab personal access token.

#### Option 2: Using environment variable
```bash
# Set the token as an environment variable
export GITLAB_PYPI_TOKEN=<your-token>

# Install with inline index URL
pip install --extra-index-url https://__token__:${GITLAB_PYPI_TOKEN}@gitlab.awenet.be/api/v4/projects/84/packages/pypi/simple -r requirements.txt
```

#### Option 3: Create a local pip.conf file

Create `~/.pip/pip.conf` (Linux/Mac) or `%APPDATA%\pip\pip.ini` (Windows):
```ini
[global]
index-url = https://pypi.org/simple
extra-index-url = https://__token__:<your-token>@gitlab.awenet.be/api/v4/projects/84/packages/pypi/simple
```

Then simply run:
```bash
pip install -r requirements.txt
```

### For Docker Development

Create a `.env` file in the project root:
```env
GITLAB_PYPI_TOKEN=<your-token>
```

> **Important:** Add `.env` to `.gitignore` to keep your token secure.

The `docker-compose.yml` will automatically pass the token to the Docker build process.

### For CI/CD

The GitLab CI/CD pipeline automatically uses `CI_JOB_TOKEN` to authenticate with the private registry. No manual configuration is needed.

---

## Quick Start

### Development
```bash
# Install dependencies (see Private Registry Configuration above)
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run application
python main.py
```

The application will be available at:

- API: [http://localhost:5000](http://localhost:5000)
- Docs: [http://localhost:5000/docs](http://localhost:5000/docs)
- Health: [http://localhost:5000/health](http://localhost:5000/health)

---

## Docker Development
```bash
# Create .env file with your GitLab token
echo "GITLAB_PYPI_TOKEN=<your-token>" > .env

# Start with docker-compose
docker-compose up

# Or for development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

## API Endpoints

### Authentication

All endpoints (except `/health`) require authentication via the `X-Proxy-Token` header.

### Built-in Endpoints

- `GET /health` — Health check
- `GET /user-info` — Current user information
- `GET /docs` — Interactive API documentation

### Task Management

- `GET /api/tasks` — Get all tasks
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/{id}` — Update task
- `DELETE /api/tasks/{id}` — Delete task
- `GET /api/tasks/admin/stats` — Get statistics (admin only)

### User Profile

- `GET /api/user/profile` — Get user profile
- `PUT /api/user/profile` — Update user profile

### GraphQL Examples

- `GET /api/data/profile` — Query user profile from GraphQL
- `GET /api/data/list` — Query paginated data
- `POST /api/data` — Create data using GraphQL mutation

### Widgets

- `GET /widgets/task-summary` — Get task summary widget

---

## Configuration

Environment variables in `.env`:
```properties
NODE_ENV=production
PORT=5000
PROXY_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:5173,https://wallesmart.be
GRAPHQL_URL=http://wallesmart-api:3000/v1/graphql
GRAPHQL_TOKEN=Bearer your-token
GRAPHQL_TIMEOUT=30000

# For Docker builds only
GITLAB_PYPI_TOKEN=your-gitlab-token
```

---

## Project Structure
```
task-management-python/
├── app.py                  # FastAPI application setup
├── main.py                 # Application entry point
├── config.py               # Configuration
├── requirements.txt        # Python dependencies
├── routes/
│   ├── __init__.py
│   ├── tasks.py           # Task routes
│   ├── users.py           # User routes
│   └── data.py            # GraphQL example routes
├── docker/
│   └── Dockerfile         # Docker image definition
├── docker-compose.yml     # Docker Compose configuration
├── .gitlab-ci.yml         # CI/CD pipeline
└── .env                   # Environment variables (gitignored)
```

---

## Development

### Running Tests
```bash
# Install dev dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Quality
```bash
# Format code
black .

# Lint code
ruff check .

# Type checking
mypy .
```

---

## Deployment

### CI/CD Pipeline

The project uses GitLab CI/CD for automated deployment:

- **Staging**: Automatically deploys on push to `develop` branch
- **Production**: Manual deployment from `main` branch

The pipeline automatically handles:
- Installing dependencies from private PyPI registry
- Building Docker images
- Pushing to container registries
- Deploying to environments

---

## License

MIT License