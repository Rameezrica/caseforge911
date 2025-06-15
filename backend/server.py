from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
import firebase_admin
from firebase_admin import credentials, auth
import json
import uuid

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="CaseForge API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_URLS", "http://localhost:3000,http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Create Supabase clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
admin_supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Firebase configuration
FIREBASE_CONFIG = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID")
}

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        if not firebase_admin._apps:
            # For development, initialize with project ID only
            firebase_admin.initialize_app(options={
                'projectId': FIREBASE_CONFIG["projectId"]
            })
            print("✅ Firebase Admin initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Firebase Admin initialization failed: {e}")
        return False

# Initialize Firebase
firebase_initialized = initialize_firebase()

# Admin email
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "rameezuddinmohammed61@gmail.com")

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
    created_by: Optional[str] = None

class Solution(BaseModel):
    id: Optional[str] = None
    problem_id: str
    user_id: str
    content: str
    submitted_at: Optional[datetime] = None

class UserProfile(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    is_admin: bool = False
    created_at: Optional[datetime] = None

# Helper functions
async def verify_firebase_token(id_token: str) -> Optional[Dict[str, Any]]:
    """Verify Firebase ID token"""
    try:
        if not firebase_initialized:
            raise HTTPException(status_code=500, detail="Firebase not initialized")
        
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"❌ Firebase token verification error: {e}")
        return None

async def get_current_user(request: Request):
    """Get current user from Firebase ID token"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header"
            )
        
        token = auth_header.split("Bearer ")[1]
        
        # Verify Firebase token
        firebase_user = await verify_firebase_token(token)
        if not firebase_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase token"
            )
        
        # Get or create user profile in Supabase
        user_profile = await get_or_create_user_profile(firebase_user)
        return user_profile
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        ) from e

async def get_or_create_user_profile(firebase_user: Dict[str, Any]) -> Dict[str, Any]:
    """Get or create user profile in Supabase"""
    try:
        # Check if user exists in Supabase
        result = admin_supabase.table("users").select("*").eq("firebase_uid", firebase_user["uid"]).execute()
        
        if result.data:
            return result.data[0]
        
        # Create new user profile
        user_data = {
            "id": str(uuid.uuid4()),
            "firebase_uid": firebase_user["uid"],
            "email": firebase_user.get("email"),
            "display_name": firebase_user.get("name", firebase_user.get("email", "").split("@")[0]),
            "is_admin": firebase_user.get("email") == ADMIN_EMAIL,
            "created_at": datetime.now().isoformat()
        }
        
        result = admin_supabase.table("users").insert(user_data).execute()
        return result.data[0] if result.data else user_data
        
    except Exception as e:
        print(f"❌ Error getting/creating user profile: {e}")
        # Return basic user data if database operation fails
        return {
            "id": str(uuid.uuid4()),
            "firebase_uid": firebase_user["uid"],
            "email": firebase_user.get("email"),
            "display_name": firebase_user.get("name", firebase_user.get("email", "").split("@")[0]),
            "is_admin": firebase_user.get("email") == ADMIN_EMAIL,
            "created_at": datetime.now().isoformat()
        }

async def get_admin_user(current_user=Depends(get_current_user)):
    """Verify that current user is admin"""
    if not current_user.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# API Routes
@app.get("/")
async def root():
    return {"message": "CaseForge API v2.0 - Firebase Auth + Supabase Database"}

@app.get("/api/firebase/config")
async def get_firebase_config():
    """Get Firebase configuration for frontend"""
    return {
        "config": FIREBASE_CONFIG,
        "message": "Firebase configuration"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "timestamp": datetime.now(), 
        "auth": "firebase",
        "database": "supabase",
        "version": "2.0.0"
    }

# User Routes
@app.get("/api/auth/me")
async def get_current_user_profile(current_user=Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@app.get("/api/user/progress")
async def get_user_progress(current_user=Depends(get_current_user)):
    """Get user progress and statistics"""
    try:
        # Get user's solutions from Supabase
        solutions_result = admin_supabase.table("solutions").select("*").eq("user_id", current_user["id"]).execute()
        solutions = solutions_result.data or []
        
        # Calculate progress stats
        total_problems_solved = len(solutions)
        total_score = sum(solution.get("score", 0) for solution in solutions)
        
        # Get problems solved by difficulty
        problem_ids = [solution["problem_id"] for solution in solutions]
        problems_by_difficulty = {"easy": 0, "medium": 0, "hard": 0}
        
        if problem_ids:
            problems_result = admin_supabase.table("problems").select("difficulty").in_("id", problem_ids).execute()
            for problem in problems_result.data or []:
                difficulty = problem.get("difficulty", "").lower()
                if difficulty in problems_by_difficulty:
                    problems_by_difficulty[difficulty] += 1
        
        return {
            "total_problems_solved": total_problems_solved,
            "total_score": total_score,
            "current_streak": 0,  # TODO: Implement streak calculation
            "longest_streak": 0,  # TODO: Implement streak calculation
            "problems_by_difficulty": problems_by_difficulty,
            "recent_activity": solutions[-5:] if solutions else []
        }
    except Exception as e:
        print(f"❌ Error getting user progress: {e}")
        return {
            "total_problems_solved": 0,
            "total_score": 0,
            "current_streak": 0,
            "longest_streak": 0,
            "problems_by_difficulty": {"easy": 0, "medium": 0, "hard": 0},
            "recent_activity": []
        }

@app.get("/api/user/solutions")
async def get_user_solutions(current_user=Depends(get_current_user)):
    """Get user's solutions"""
    try:
        result = admin_supabase.table("solutions").select("*").eq("user_id", current_user["id"]).execute()
        return result.data or []
    except Exception as e:
        print(f"❌ Error getting user solutions: {e}")
        return []

# Problems Routes
@app.get("/api/problems")
async def get_problems(
    category: Optional[str] = None,
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = 50
):
    """Get all problems with optional filtering"""
    try:
        query = admin_supabase.table("problems").select("*")
        
        if category:
            query = query.eq("category", category)
        if domain:
            query = query.eq("domain", domain)
        if difficulty:
            query = query.eq("difficulty", difficulty)
        
        result = query.limit(limit).execute()
        return result.data or []
    except Exception as e:
        print(f"❌ Error getting problems: {e}")
        return []

@app.get("/api/problems/{problem_id}")
async def get_problem(problem_id: str):
    """Get a specific problem by ID"""
    try:
        result = admin_supabase.table("problems").select("*").eq("id", problem_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Problem not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting problem: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/categories")
async def get_categories():
    """Get available categories and domains"""
    try:
        # Get unique categories
        categories_result = admin_supabase.table("problems").select("category").execute()
        categories = list(set(item["category"] for item in categories_result.data or []))
        
        # Get unique domains
        domains_result = admin_supabase.table("problems").select("domain").execute()
        domains = list(set(item["domain"] for item in domains_result.data or []))
        
        # Get unique difficulties
        difficulties_result = admin_supabase.table("problems").select("difficulty").execute()
        difficulties = list(set(item["difficulty"] for item in difficulties_result.data or []))
        
        return {
            "categories": categories,
            "domains": domains,
            "difficulties": difficulties
        }
    except Exception as e:
        print(f"❌ Error getting categories: {e}")
        return {"categories": [], "domains": [], "difficulties": []}

@app.get("/api/stats")
async def get_stats():
    """Get platform statistics"""
    try:
        # Get total problems
        problems_result = admin_supabase.table("problems").select("id", count="exact").execute()
        total_problems = problems_result.count or 0
        
        # Get total users
        users_result = admin_supabase.table("users").select("id", count="exact").execute()
        total_users = users_result.count or 0
        
        # Get total solutions
        solutions_result = admin_supabase.table("solutions").select("id", count="exact").execute()
        total_solutions = solutions_result.count or 0
        
        return {
            "total_problems": total_problems,
            "total_users": total_users,
            "problems_solved_today": 0,  # TODO: Implement daily count
            "active_users": total_users
        }
    except Exception as e:
        print(f"❌ Error getting stats: {e}")
        return {
            "total_problems": 0,
            "total_users": 0,
            "problems_solved_today": 0,
            "active_users": 0
        }

@app.get("/api/daily-challenge")
async def get_daily_challenge():
    """Get today's daily challenge"""
    try:
        result = admin_supabase.table("problems").select("*").limit(1).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="No daily challenge available")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting daily challenge: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/solutions")
async def submit_solution(solution: Solution, current_user=Depends(get_current_user)):
    """Submit a solution for a problem"""
    try:
        solution_data = {
            "id": str(uuid.uuid4()),
            "problem_id": solution.problem_id,
            "user_id": current_user["id"],
            "content": solution.content,
            "submitted_at": datetime.now().isoformat(),
            "user_email": current_user["email"],
            "user_name": current_user["display_name"]
        }
        
        result = admin_supabase.table("solutions").insert(solution_data).execute()
        return {"message": "Solution submitted successfully", "solution_id": solution_data["id"]}
    except Exception as e:
        print(f"❌ Error submitting solution: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit solution")

# Admin Routes
@app.get("/api/admin/dashboard")
async def get_admin_dashboard(admin_user=Depends(get_admin_user)):
    """Get admin dashboard data"""
    try:
        # Get counts
        problems_result = admin_supabase.table("problems").select("id", count="exact").execute()
        users_result = admin_supabase.table("users").select("id", count="exact").execute()
        solutions_result = admin_supabase.table("solutions").select("id", count="exact").execute()
        
        return {
            "total_problems": problems_result.count or 0,
            "total_users": users_result.count or 0,
            "total_solutions": solutions_result.count or 0,
            "active_competitions": 0,
            "recent_activity": [
                {"type": "user_registration", "count": 5, "date": datetime.now().isoformat()},
                {"type": "problem_solved", "count": 12, "date": datetime.now().isoformat()},
                {"type": "new_problem", "count": 1, "date": datetime.now().isoformat()}
            ]
        }
    except Exception as e:
        print(f"❌ Error getting admin dashboard: {e}")
        return {
            "total_problems": 0,
            "total_users": 0,
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
        offset = (page - 1) * limit
        result = admin_supabase.table("users").select("*").range(offset, offset + limit - 1).execute()
        
        # Get total count
        count_result = admin_supabase.table("users").select("id", count="exact").execute()
        
        return {
            "users": result.data or [],
            "total": count_result.count or 0,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        print(f"❌ Error getting admin users: {e}")
        return {
            "users": [],
            "total": 0,
            "page": page,
            "limit": limit
        }

@app.get("/api/admin/problems")
async def get_admin_problems(admin_user=Depends(get_admin_user)):
    """Get all problems for admin management"""
    try:
        result = admin_supabase.table("problems").select("*").execute()
        return result.data or []
    except Exception as e:
        print(f"❌ Error getting admin problems: {e}")
        return []

@app.post("/api/admin/problems")
async def create_problem(problem: Problem, admin_user=Depends(get_admin_user)):
    """Create a new problem"""
    try:
        problem_data = {
            "id": str(uuid.uuid4()),
            "title": problem.title,
            "description": problem.description,
            "category": problem.category,
            "domain": problem.domain,
            "difficulty": problem.difficulty,
            "company": problem.company,
            "tags": problem.tags,
            "created_at": datetime.now().isoformat(),
            "created_by": admin_user["id"]
        }
        
        result = admin_supabase.table("problems").insert(problem_data).execute()
        return result.data[0] if result.data else problem_data
    except Exception as e:
        print(f"❌ Error creating problem: {e}")
        raise HTTPException(status_code=500, detail="Failed to create problem")

@app.put("/api/admin/problems/{problem_id}")
async def update_problem(
    problem_id: str, 
    problem: Problem, 
    admin_user=Depends(get_admin_user)
):
    """Update an existing problem"""
    try:
        problem_data = {
            "title": problem.title,
            "description": problem.description,
            "category": problem.category,
            "domain": problem.domain,
            "difficulty": problem.difficulty,
            "company": problem.company,
            "tags": problem.tags,
            "updated_at": datetime.now().isoformat()
        }
        
        result = admin_supabase.table("problems").update(problem_data).eq("id", problem_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Problem not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating problem: {e}")
        raise HTTPException(status_code=500, detail="Failed to update problem")

@app.delete("/api/admin/problems/{problem_id}")
async def delete_problem(problem_id: str, admin_user=Depends(get_admin_user)):
    """Delete a problem"""
    try:
        result = admin_supabase.table("problems").delete().eq("id", problem_id).execute()
        return {"message": f"Problem {problem_id} deleted successfully"}
    except Exception as e:
        print(f"❌ Error deleting problem: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete problem")

@app.get("/api/admin/solutions")
async def get_admin_solutions(admin_user=Depends(get_admin_user)):
    """Get all submitted solutions for admin review"""
    try:
        # Get solutions with problem details
        solutions_result = admin_supabase.table("solutions").select("*, problems(title, difficulty)").execute()
        
        solutions_with_problems = []
        for solution in solutions_result.data or []:
            solution_with_problem = solution.copy()
            if solution.get("problems"):
                solution_with_problem["problem_title"] = solution["problems"]["title"]
                solution_with_problem["problem_difficulty"] = solution["problems"]["difficulty"]
            else:
                solution_with_problem["problem_title"] = "Unknown Problem"
                solution_with_problem["problem_difficulty"] = "Unknown"
            solutions_with_problems.append(solution_with_problem)
        
        return {
            "solutions": solutions_with_problems,
            "total": len(solutions_with_problems)
        }
    except Exception as e:
        print(f"❌ Error getting admin solutions: {e}")
        return {"solutions": [], "total": 0}

@app.get("/api/admin/solutions/{problem_id}")
async def get_problem_solutions(problem_id: str, admin_user=Depends(get_admin_user)):
    """Get all solutions for a specific problem"""
    try:
        # Get problem details
        problem_result = admin_supabase.table("problems").select("*").eq("id", problem_id).execute()
        if not problem_result.data:
            raise HTTPException(status_code=404, detail="Problem not found")
        
        # Get solutions for this problem
        solutions_result = admin_supabase.table("solutions").select("*").eq("problem_id", problem_id).execute()
        
        return {
            "problem": problem_result.data[0],
            "solutions": solutions_result.data or [],
            "total": len(solutions_result.data or [])
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting problem solutions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)