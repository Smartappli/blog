"""
User routes
"""
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import Optional

from wallesmart_sdk.middleware.fastapi_middleware import require_auth
from wallesmart_sdk.types import UserContext

router = APIRouter()


class ProfileResponse(BaseModel):
    """User profile response model"""
    id: str
    name: str
    role: str
    email: str
    avatar: str


class ProfileUpdateRequest(BaseModel):
    """Profile update request model"""
    name: Optional[str] = None
    email: Optional[str] = None


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(user: UserContext = Depends(require_auth)):
    """
    GET /api/user/profile
    Get user profile
    """
    # In production, fetch from database
    profile = ProfileResponse(
        id=user.profileId or "",
        name=user.profileName or "Unknown",
        role=user.profileRole or "user",
        email="user@example.com",
        avatar="👤",
    )

    return profile


@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    user: UserContext = Depends(require_auth),
):
    """
    PUT /api/user/profile
    Update user profile
    """
    # In production, update in database
    updated_profile = ProfileResponse(
        id=user.profileId or "",
        name=profile_data.name or user.profileName or "Unknown",
        role=user.profileRole or "user",
        email=profile_data.email or "user@example.com",
        avatar="👤",
    )

    return updated_profile
