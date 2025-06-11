from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import motor.motor_asyncio
from bson import ObjectId
import json

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
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "caseforge")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

# Pydantic models
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

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    password_hash: str
    created_at: Optional[datetime] = None

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
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Routes
@app.get("/")
async def root():
    return {"message": "CaseForge API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

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
    # For now, return the first problem as daily challenge
    if MOCK_PROBLEMS:
        return MOCK_PROBLEMS[0]
    raise HTTPException(status_code=404, detail="No daily challenge available")

@app.post("/api/solutions")
async def submit_solution(solution: Solution, current_user: str = Depends(get_current_user)):
    """Submit a solution for a problem"""
    # In a real implementation, this would save to database
    solution_data = solution.dict()
    solution_data["submitted_at"] = datetime.now()
    solution_data["user_id"] = current_user
    
    return {"message": "Solution submitted successfully", "solution_id": "mock_solution_id"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)