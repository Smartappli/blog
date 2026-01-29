"""
Configuration module for Task Management application
"""
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""

    # Application
    APP_NAME = "wes-app-blog"
    ENV = os.getenv("ENV", "development")
    PORT = int(os.getenv("PORT", "5000"))

    # Security
    PROXY_SECRET = os.getenv("PROXY_SECRET", "dev-secret")

    # CORS
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://wallesmart.be"
    ).split(",")

    # GraphQL
    GRAPHQL_URL = os.getenv("GRAPHQL_URL", "https://portail.wallesmart.be/v1/graphql")
    GRAPHQL_TOKEN = os.getenv("GRAPHQL_TOKEN", "Bearer your-token-here")
    GRAPHQL_TIMEOUT = int(os.getenv("GRAPHQL_TIMEOUT", "30000"))

    @classmethod
    def is_development(cls) -> bool:
        """Check if running in development mode"""
        return cls.ENV == "development"


config = Config()
