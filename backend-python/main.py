"""
Application entry point
"""
import uvicorn
from config import config

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=config.is_development(),
        log_level="info" if config.is_development() else "warning",
    )
