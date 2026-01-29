"""
Data routes with GraphQL examples
"""
from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel
from typing import Optional

from wallesmart_sdk.middleware.fastapi_middleware import require_auth
from wallesmart_sdk.types import UserContext
from wallesmart_sdk.graphql import GraphQLQueryError, GraphQLRequestError

router = APIRouter()

class UserProfileResponse(BaseModel):
    """User profile from GraphQL"""
    id: str
    name: str
    email: str
    role: str
    preferences: Optional[dict] = None


class DataItem(BaseModel):
    """Data item model"""
    id: str
    name: str
    createdAt: str


class DataListResponse(BaseModel):
    """Data list response"""
    items: list[DataItem]
    total: int
    hasMore: bool


class DataCreateRequest(BaseModel):
    """Data creation request"""
    name: str
    description: str


class DataCreateResponse(BaseModel):
    """Data creation response"""
    id: str
    name: str
    description: str
    createdAt: str


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    request: Request,
    user: UserContext = Depends(require_auth),
):
    """
    Example: Query user profile from GraphQL API
    GET /api/data/profile
    """
    query = """
        query GetUserProfile($profileId: ID!) {
            profile(id: $profileId) {
                id
                name
                email
                role
                preferences {
                    theme
                    language
                }
            }
        }
    """

    try:
        sdk = request.app.state.sdk
        data = await sdk.execute_graphql_async(
            query,
            {"profileId": user.profileId},
            user,
        )

        return data["profile"]

    except GraphQLQueryError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except GraphQLRequestError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/list", response_model=DataListResponse)
async def get_data_list(
    request: Request,
    page: int = 1,
    limit: int = 10,
    user: UserContext = Depends(require_auth),
):
    """
    Example: Query data with pagination
    GET /api/data/list?page=1&limit=10
    """
    query = """
        query GetDataList($page: Int!, $limit: Int!) {
            dataList(page: $page, limit: $limit) {
                items {
                    id
                    name
                    createdAt
                }
                total
                hasMore
            }
        }
    """

    try:
        sdk = request.app.state.sdk
        graphql_client = sdk.get_graphql_client()

        data = await graphql_client.query_async(
            query,
            {"page": page, "limit": limit},
            user,
        )

        return data["dataList"]

    except GraphQLQueryError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except GraphQLRequestError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/", response_model=DataCreateResponse, status_code=201)
async def create_data(
    request: Request,
    data_input: DataCreateRequest,
    user: UserContext = Depends(require_auth),
):
    """
    Example: Create data with mutation
    POST /api/data
    """
    mutation = """
        mutation CreateData($input: DataInput!) {
            createData(input: $input) {
                id
                name
                description
                createdAt
            }
        }
    """

    try:
        sdk = request.app.state.sdk
        graphql_client = sdk.get_graphql_client()

        result = await graphql_client.mutate_async(
            mutation,
            {"input": {"name": data_input.name, "description": data_input.description}},
            user,
        )

        return result["createData"]

    except GraphQLQueryError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except GraphQLRequestError as e:
        raise HTTPException(status_code=502, detail=str(e))
