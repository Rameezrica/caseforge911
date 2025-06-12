from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any, Union
import uvicorn
import os
from datetime import datetime, timedelta
import motor.motor_asyncio
from bson import ObjectId
import json
from dotenv import load_dotenv
from supabase import create_client, Client
import asyncio

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="CaseForge API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://caseforge911.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY]):
    raise ValueError("Missing Supabase environment variables")

# Create Supabase clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
admin_supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# MongoDB connection (keeping for problems data)
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "caseforge")

try:
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    db = None

# Admin email - replace with your actual email
ADMIN_EMAIL = "admin@caseforge.com"

# Pydantic models
class UserSignUp(BaseModel):
    email: EmailStr
    password: str
    username: str
    full_name: Optional[str] = None

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class AdminSignIn(BaseModel):
    email: EmailStr
    password: str

class Problem(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    category: str
    domain: str
    difficulty: str
    company: Optional[str] = None
    tags: List[str] = []
    created_at: Optional[datetime] = None

class Solution(BaseModel):
    problem_id: str
    user_id: str
    content: str
    submitted_at: Optional[datetime] = None

# Mock data for development
MOCK_PROBLEMS = [
    {
        "id": "1",
        "title": "Market Entry Strategy for Electric Vehicles",
        "description": "Tesla is considering entering the Indian market. Analyze the market opportunity, competitive landscape, and recommend an entry strategy.",
        "category": "Strategy",
        "domain": "Automotive",
        "difficulty": "Hard",
        "company": "Tesla",
        "tags": ["market-entry", "automotive", "strategy"],
        "created_at": datetime.now()
    },
    {
        "id": "2", 
        "title": "Customer Acquisition Cost Optimization",
        "description": "A SaaS startup is spending $200 to acquire each customer but only generating $150 in lifetime value. How would you fix this?",
        "category": "Marketing",
        "domain": "Technology",
        "difficulty": "Medium",
        "company": "Generic SaaS",
        "tags": ["marketing", "saas", "metrics"],
        "created_at": datetime.now()
    },
    {
        "id": "3",
        "title": "Supply Chain Disruption Response",
        "description": "A major supplier to your manufacturing company has gone bankrupt. You need to maintain production while finding alternatives.",
        "category": "Operations",
        "domain": "Manufacturing",
        "difficulty": "Hard",
        "company": "Manufacturing Corp",
        "tags": ["supply-chain", "operations", "crisis-management"],
        "created_at": datetime.now()
    }
]

MOCK_STATS = {
    "total_problems": len(MOCK_PROBLEMS),
    "total_users": 1250,
    "problems_solved_today": 45,
    "active_users": 320
}

# Helper functions
async def get_current_user(request: Request):
    """Get current user from Supabase JWT token"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header"
            )
        
        jwt_token = auth_header.split("Bearer ")[1]
        user_response = supabase.auth.get_user(jwt_token)
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        ) from e

async def get_admin_user(current_user=Depends(get_current_user)):
    """Verify that current user is admin"""
    # Check if user is the designated admin
    if current_user.email != ADMIN_EMAIL:
        # Also check user metadata for admin flag
        if not current_user.user_metadata.get("admin", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
    return current_user

# Authentication Routes
@app.post("/api/auth/register")
async def register_user(user_data: UserSignUp):
    """Register a new user"""
    try:
        # Sign up user with Supabase
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "username": user_data.username,
                    "full_name": user_data.full_name or user_data.username,
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed. Email may already be in use."
            )
        
        return {
            "message": "User registered successfully",
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "username": user_data.username,
                "full_name": user_data.full_name or user_data.username,
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        ) from e

@app.post("/api/auth/token")
async def login_for_access_token(credentials: UserSignIn):
    """User login endpoint"""
    try:
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "username": auth_response.user.user_metadata.get("username", ""),
                "full_name": auth_response.user.user_metadata.get("full_name", ""),
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        ) from e

@app.post("/api/auth/admin/login")
async def admin_login(credentials: AdminSignIn):
    """Admin login endpoint"""
    try:
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )
        
        # Check if user is admin
        user = auth_response.user
        is_admin = (user.email == ADMIN_EMAIL or 
                   user.user_metadata.get("admin", False))
        
        if not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.user_metadata.get("username", "admin"),
                "is_admin": True
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        ) from e

@app.get("/api/auth/me")
async def get_current_user_profile(current_user=Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.user_metadata.get("username", ""),
        "full_name": current_user.user_metadata.get("full_name", ""),
        "created_at": current_user.created_at,
        "solved_problems": [],  # TODO: Implement from database
        "total_score": 0,  # TODO: Implement from database
    }

@app.post("/api/auth/logout")
async def logout_user(current_user=Depends(get_current_user)):
    """Logout user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        # Even if logout fails, return success
        return {"message": "Logged out successfully"}

# User Routes
@app.get("/api/user/progress")
async def get_user_progress(current_user=Depends(get_current_user)):
    """Get user progress and statistics"""
    # TODO: Implement real progress tracking
    return {
        "total_problems_solved": 0,
        "total_score": 0,
        "current_streak": 0,
        "longest_streak": 0,
        "problems_by_difficulty": {
            "easy": 0,
            "medium": 0,
            "hard": 0
        },
        "recent_activity": []
    }

@app.get("/api/user/solutions")
async def get_user_solutions(current_user=Depends(get_current_user)):
    """Get user's solutions"""
    # TODO: Implement real solutions retrieval
    return []

# Admin Routes
@app.get("/api/admin/dashboard")
async def get_admin_dashboard(admin_user=Depends(get_admin_user)):
    """Get admin dashboard data"""
    try:
        # Get user count from Supabase
        users_response = admin_supabase.auth.admin.list_users()
        
        # Handle both list and object responses
        if hasattr(users_response, 'users'):
            users = users_response.users or []
        elif isinstance(users_response, list):
            users = users_response
        else:
            users = []
            
        total_users = len(users)
        
        return {
            "total_problems": len(MOCK_PROBLEMS),
            "total_users": total_users,
            "total_solutions": 0,  # TODO: Implement
            "active_competitions": 0,  # TODO: Implement
            "recent_activity": [
                {"type": "user_registration", "count": 5, "date": datetime.now().isoformat()},
                {"type": "problem_solved", "count": 12, "date": datetime.now().isoformat()},
                {"type": "new_problem", "count": 1, "date": datetime.now().isoformat()}
            ]
        }
    except Exception as e:
        # Fallback to mock data if Supabase fails
        return {
            "total_problems": len(MOCK_PROBLEMS),
            "total_users": 10,
            "total_solutions": 0,
            "active_competitions": 0,
            "recent_activity": []
        }

@app.get("/api/admin/users")
async def get_admin_users(
    page: int = 1,
    limit: int = 50,
    admin_user=Depends(get_admin_user)
):
    """Get all users for admin management"""
    try:
        users_response = admin_supabase.auth.admin.list_users()
        
        # Handle both list and object responses
        if hasattr(users_response, 'users'):
            users = users_response.users or []
        elif isinstance(users_response, list):
            users = users_response
        else:
            users = []
        
        # Convert to the expected format
        formatted_users = []
        for user in users:
            formatted_users.append({
                "id": user.id,
                "username": user.user_metadata.get("username", ""),
                "email": user.email,
                "created_at": user.created_at,
                "is_active": True,
                "email_confirmed": user.email_confirmed_at is not None,
                "problems_solved": 0  # TODO: Implement from database
            })
        
        return {
            "users": formatted_users[(page-1)*limit:page*limit],
            "total": len(formatted_users),
            "page": page,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        ) from e

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str, admin_user=Depends(get_admin_user)):
    """Delete a user"""
    try:
        admin_supabase.auth.admin.delete_user(user_id)
        return {"message": f"User {user_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        ) from e

# Public Routes (unchanged)
@app.get("/")
async def root():
    return {"message": "CaseForge API is running with Supabase authentication"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(), "auth": "supabase"}

@app.get("/api/problems")
async def get_problems(
    category: Optional[str] = None,
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = 50
):
    """Get all problems with optional filtering"""
    problems = MOCK_PROBLEMS.copy()
    
    if category:
        problems = [p for p in problems if p["category"].lower() == category.lower()]
    if domain:
        problems = [p for p in problems if p["domain"].lower() == domain.lower()]
    if difficulty:
        problems = [p for p in problems if p["difficulty"].lower() == difficulty.lower()]
    
    return problems[:limit]

@app.get("/api/problems/{problem_id}")
async def get_problem(problem_id: str):
    """Get a specific problem by ID"""
    problem = next((p for p in MOCK_PROBLEMS if p["id"] == problem_id), None)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@app.get("/api/categories")
async def get_categories():
    """Get available categories and domains"""
    categories = list(set(p["category"] for p in MOCK_PROBLEMS))
    domains = list(set(p["domain"] for p in MOCK_PROBLEMS))
    difficulties = list(set(p["difficulty"] for p in MOCK_PROBLEMS))
    
    return {
        "categories": categories,
        "domains": domains,
        "difficulties": difficulties
    }

@app.get("/api/stats")
async def get_stats():
    """Get platform statistics"""
    return MOCK_STATS

@app.get("/api/daily-challenge")
async def get_daily_challenge():
    """Get today's daily challenge"""
    if MOCK_PROBLEMS:
        return MOCK_PROBLEMS[0]
    raise HTTPException(status_code=404, detail="No daily challenge available")

@app.post("/api/solutions")
async def submit_solution(solution: Solution, current_user=Depends(get_current_user)):
    """Submit a solution for a problem"""
    # In a real implementation, this would save to database
    solution_data = solution.dict()
    solution_data["submitted_at"] = datetime.now()
    solution_data["user_id"] = current_user.id
    
    return {"message": "Solution submitted successfully", "solution_id": "mock_solution_id"}

# Admin problem management routes
@app.get("/api/admin/problems")
async def get_admin_problems(admin_user=Depends(get_admin_user)):
    """Get all problems for admin management"""
    return MOCK_PROBLEMS

@app.post("/api/admin/problems")
async def create_problem(problem: Problem, admin_user=Depends(get_admin_user)):
    """Create a new problem"""
    problem_data = problem.dict()
    problem_data["id"] = f"problem_{len(MOCK_PROBLEMS) + 1}"
    problem_data["created_at"] = datetime.now()
    
    MOCK_PROBLEMS.append(problem_data)
    return {"message": "Problem created successfully", "problem": problem_data}

@app.put("/api/admin/problems/{problem_id}")
async def update_problem(
    problem_id: str, 
    problem: Problem, 
    admin_user=Depends(get_admin_user)
):
    """Update an existing problem"""
    return {"message": f"Problem {problem_id} updated successfully"}

@app.delete("/api/admin/problems/{problem_id}")
async def delete_problem(problem_id: str, admin_user=Depends(get_admin_user)):
    """Delete a problem"""
    global MOCK_PROBLEMS
    MOCK_PROBLEMS = [p for p in MOCK_PROBLEMS if p["id"] != problem_id]
    return {"message": f"Problem {problem_id} deleted successfully"}

@app.get("/api/admin/competitions")
async def get_admin_competitions(admin_user=Depends(get_admin_user)):
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

@app.get("/api/admin/analytics")
async def get_admin_analytics(admin_user=Depends(get_admin_user)):
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)