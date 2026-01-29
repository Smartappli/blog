"""
FastAPI application with WalleSmart SDK integration
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from wallesmart_sdk import WalleSmartSDK, UserContext
from config import config

# Import routes
from routes import tasks, users, data

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 Blog running on port {config.PORT}")
    print(f"📝 Environment: {config.ENV}")
    print(f"🔗 Health check: http://localhost:{config.PORT}/health")
    print(f"📚 API docs: http://localhost:{config.PORT}/docs")
    yield
    print("🛑 Shutting down Blog application")

# ============================================================================
# Initialize WalleSmart SDK
# ============================================================================

sdk = WalleSmartSDK(
    config={
        "appName": config.APP_NAME,
        "proxySecret": config.PROXY_SECRET,
        "env": config.ENV,
        "corsOrigins": config.CORS_ORIGINS,
        "graphqlUrl": config.GRAPHQL_URL,
        "graphqlToken": config.GRAPHQL_TOKEN,
        "graphqlTimeout": config.GRAPHQL_TIMEOUT,
        "devUserContext": UserContext(
            profileId="dev-profile-123",
            userId="dev-user-456",
            appId="task-management-789",
            memberReferenceId="dev-member-abc",
            profileName="John Developer",
            profileRole="farmer",
            appName=config.APP_NAME,
            csrfToken="dev-csrf-token-xyz",
        ) if config.is_development() else None,
    }
)

# ============================================================================
# FastAPI Application Setup
# ============================================================================

app = FastAPI(
    title="Blog API",
    description="Blog application using WALLeSmart SDK",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup WALLeSmart SDK middleware and endpoints
sdk.setup_fastapi(app)

# Store SDK in app state for access in routes
app.state.sdk = sdk

# ============================================================================
# Include Routers
# ============================================================================

# Task routes
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])

# User routes
app.include_router(users.router, prefix="/api/user", tags=["Users"])

# Data routes (GraphQL examples)
app.include_router(data.router, prefix="/api/data", tags=["Data"])

# Widget routes
app.include_router(tasks.widget_router, prefix="/widgets", tags=["Widgets"])

# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    if config.is_development():
        import traceback
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "message": str(exc),
                "detail": traceback.format_exc(),
            },
        )

    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "message": "An error occurred"},
    )
