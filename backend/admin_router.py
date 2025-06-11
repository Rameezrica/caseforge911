from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import jwt
import os

# Security
security = HTTPBearer()
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")

# Router
admin_router = APIRouter(prefix="/api/admin", tags=["admin"])

# Models
class AdminLogin(BaseModel):
    username: str
    password: str

class ProblemCreate(BaseModel):
    title: str
    description: str
    category: str
    domain: str
    difficulty: str
    company: Optional[str] = None
    tags: List[str] = []

class CompetitionCreate(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    problems: List[str] = []

# Mock admin credentials
ADMIN_CREDENTIALS = {
    "admin": "admin123",  # In production, use proper hashing
    "superuser": "super123"
}

# Helper functions
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)
        
        if username is None or not is_admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )

def create_admin_token(username: str) -> str:
    payload = {
        "sub": username,
        "is_admin": True,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

# Routes
@admin_router.post("/login")
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint"""
    if (credentials.username not in ADMIN_CREDENTIALS or 
        ADMIN_CREDENTIALS[credentials.username] != credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    token = create_admin_token(credentials.username)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": credentials.username,
            "is_admin": True
        }
    }

@admin_router.get("/dashboard")
async def get_admin_dashboard(current_admin: str = Depends(get_current_admin)):
    """Get admin dashboard data"""
    return {
        "total_problems": 150,
        "total_users": 1250,
        "total_solutions": 3400,
        "active_competitions": 2,
        "recent_activity": [
            {"type": "user_registration", "count": 15, "date": "2024-01-15"},
            {"type": "problem_solved", "count": 89, "date": "2024-01-15"},
            {"type": "new_problem", "count": 3, "date": "2024-01-15"}
        ]
    }

@admin_router.get("/problems")
async def get_admin_problems(current_admin: str = Depends(get_current_admin)):
    """Get all problems for admin management"""
    # Mock data - in real implementation, fetch from database
    return [
        {
            "id": "1",
            "title": "Market Entry Strategy for Electric Vehicles",
            "category": "Strategy",
            "domain": "Automotive",
            "difficulty": "Hard",
            "company": "Tesla",
            "created_at": "2024-01-10T10:00:00Z",
            "status": "published"
        },
        {
            "id": "2",
            "title": "Customer Acquisition Cost Optimization",
            "category": "Marketing", 
            "domain": "Technology",
            "difficulty": "Medium",
            "company": "Generic SaaS",
            "created_at": "2024-01-12T14:30:00Z",
            "status": "published"
        }
    ]

@admin_router.post("/problems")
async def create_problem(problem: ProblemCreate, current_admin: str = Depends(get_current_admin)):
    """Create a new problem"""
    # Mock implementation - in real app, save to database
    problem_data = problem.dict()
    problem_data["id"] = "new_problem_id"
    problem_data["created_at"] = datetime.utcnow()
    problem_data["created_by"] = current_admin
    problem_data["status"] = "published"
    
    return {"message": "Problem created successfully", "problem": problem_data}

@admin_router.put("/problems/{problem_id}")
async def update_problem(
    problem_id: str, 
    problem: ProblemCreate, 
    current_admin: str = Depends(get_current_admin)
):
    """Update an existing problem"""
    # Mock implementation
    return {"message": f"Problem {problem_id} updated successfully"}

@admin_router.delete("/problems/{problem_id}")
async def delete_problem(problem_id: str, current_admin: str = Depends(get_current_admin)):
    """Delete a problem"""
    # Mock implementation
    return {"message": f"Problem {problem_id} deleted successfully"}

@admin_router.get("/competitions")
async def get_admin_competitions(current_admin: str = Depends(get_current_admin)):
    """Get all competitions for admin management"""
    return [
        {
            "id": "comp_1",
            "title": "Winter Strategy Challenge",
            "description": "A week-long competition focusing on strategic thinking",
            "start_date": "2024-01-20T00:00:00Z",
            "end_date": "2024-01-27T23:59:59Z",
            "participants": 45,
            "status": "upcoming"
        }
    ]

@admin_router.post("/competitions")
async def create_competition(
    competition: CompetitionCreate, 
    current_admin: str = Depends(get_current_admin)
):
    """Create a new competition"""
    competition_data = competition.dict()
    competition_data["id"] = "new_competition_id"
    competition_data["created_at"] = datetime.utcnow()
    competition_data["created_by"] = current_admin
    competition_data["participants"] = 0
    competition_data["status"] = "upcoming"
    
    return {"message": "Competition created successfully", "competition": competition_data}

@admin_router.get("/users")
async def get_admin_users(
    page: int = 1, 
    limit: int = 50, 
    current_admin: str = Depends(get_current_admin)
):
    """Get all users for admin management"""
    # Mock data
    return {
        "users": [
            {
                "id": "user_1",
                "username": "john_doe",
                "email": "john@example.com",
                "created_at": "2024-01-01T10:00:00Z",
                "is_active": True,
                "problems_solved": 15
            },
            {
                "id": "user_2", 
                "username": "jane_smith",
                "email": "jane@example.com",
                "created_at": "2024-01-05T15:30:00Z",
                "is_active": True,
                "problems_solved": 23
            }
        ],
        "total": 1250,
        "page": page,
        "limit": limit
    }

@admin_router.get("/analytics")
async def get_admin_analytics(current_admin: str = Depends(get_current_admin)):
    """Get platform analytics"""
    return {
        "user_growth": [
            {"date": "2024-01-01", "users": 1000},
            {"date": "2024-01-08", "users": 1100},
            {"date": "2024-01-15", "users": 1250}
        ],
        "problem_difficulty_distribution": {
            "Easy": 45,
            "Medium": 78,
            "Hard": 27
        },
        "category_popularity": {
            "Strategy": 35,
            "Marketing": 28,
            "Operations": 22,
            "Finance": 15
        },
        "daily_active_users": [
            {"date": "2024-01-10", "users": 120},
            {"date": "2024-01-11", "users": 135},
            {"date": "2024-01-12", "users": 142},
            {"date": "2024-01-13", "users": 128},
            {"date": "2024-01-14", "users": 156},
            {"date": "2024-01-15", "users": 163}
        ]
    }