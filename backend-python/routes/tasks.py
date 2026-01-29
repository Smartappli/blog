"""
Task routes
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import Optional

from wallesmart_sdk.middleware.fastapi_middleware import require_auth, require_role
from wallesmart_sdk.types import UserContext

router = APIRouter()
widget_router = APIRouter()

# In-memory task storage (replace with database in production)
tasks_db = [
    {
        "id": "1",
        "title": "Plant crops",
        "completed": False,
        "createdAt": datetime.now().isoformat(),
    },
    {
        "id": "2",
        "title": "Water fields",
        "completed": True,
        "createdAt": datetime.now().isoformat(),
    },
    {
        "id": "3",
        "title": "Check livestock",
        "completed": False,
        "createdAt": datetime.now().isoformat(),
    },
]


class Task(BaseModel):
    """Task model"""
    id: str
    title: str
    completed: bool
    createdAt: str

    userId: Optional[str] = None


class TaskCreateRequest(BaseModel):
    """Task creation request"""
    title: str


class TaskUpdateRequest(BaseModel):
    """Task update request"""
    title: Optional[str] = None
    completed: Optional[bool] = None


class TaskListResponse(BaseModel):
    """Task list response"""
    tasks: list[Task]
    total: int
    userId: str


class StatsResponse(BaseModel):
    """Statistics response"""
    totalTasks: int
    completedTasks: int
    pendingTasks: int


class TaskSummaryResponse(BaseModel):
    """Task summary for widget"""
    total: int
    completed: int
    pending: int
    recentTasks: list[Task]
    userId: str


@router.get("", response_model=TaskListResponse)
async def get_all_tasks(user: UserContext = Depends(require_auth)):
    """
    GET /api/tasks
    Get all tasks for current user
    """
    # In production, filter by profileId from database
    tasks = [
        Task(**{**task, "userId": user.profileId})
        for task in tasks_db
    ]

    return TaskListResponse(
        tasks=tasks,
        total=len(tasks),
        userId=user.profileId or "",
    )


@router.post("", response_model=Task, status_code=201)
async def create_task(
    task_data: TaskCreateRequest,
    user: UserContext = Depends(require_auth),
):
    """
    POST /api/tasks
    Create new task
    """
    if not task_data.title:
        raise HTTPException(status_code=400, detail="Title is required")

    new_task = {
        "id": str(len(tasks_db) + 1),
        "title": task_data.title,
        "completed": False,
        "createdAt": datetime.now().isoformat(),
        "userId": user.profileId,
    }

    tasks_db.append(new_task)

    return Task(**new_task)


@router.put("/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_data: TaskUpdateRequest,
    user: UserContext = Depends(require_auth),
):
    """
    PUT /api/tasks/:id
    Update task
    """
    # Find task
    task = next((t for t in tasks_db if t["id"] == task_id), None)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update fields
    if task_data.title is not None:
        task["title"] = task_data.title
    if task_data.completed is not None:
        task["completed"] = task_data.completed

    return Task(**{**task, "userId": user.profileId})


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    user: UserContext = Depends(require_auth),
):
    """
    DELETE /api/tasks/:id
    Delete task
    """
    global tasks_db

    # Find task index
    task_index = next((i for i, t in enumerate(tasks_db) if t["id"] == task_id), None)

    if task_index is None:
        raise HTTPException(status_code=404, detail="Task not found")

    tasks_db.pop(task_index)

    return None


@router.get("/admin/stats", response_model=StatsResponse)
async def get_stats(user: UserContext = Depends(require_role("admin"))):
    """
    GET /api/tasks/admin/stats
    Get statistics (admin only)
    """
    completed = sum(1 for t in tasks_db if t["completed"])
    pending = sum(1 for t in tasks_db if not t["completed"])

    return StatsResponse(
        totalTasks=len(tasks_db),
        completedTasks=completed,
        pendingTasks=pending,
    )


@widget_router.get("/task-summary", response_model=TaskSummaryResponse)
async def get_task_summary(user: UserContext = Depends(require_auth)):
    """
    GET /widgets/task-summary
    Get task summary for widget
    """
    completed = sum(1 for t in tasks_db if t["completed"])
    pending = sum(1 for t in tasks_db if not t["completed"])

    recent_tasks = [
        Task(**{**t, "userId": user.profileId})
        for t in sorted(tasks_db, key=lambda x: x["createdAt"], reverse=True)[:3]
    ]

    return TaskSummaryResponse(
        total=len(tasks_db),
        completed=completed,
        pending=pending,
        recentTasks=recent_tasks,
        userId=user.profileId or "",
    )
