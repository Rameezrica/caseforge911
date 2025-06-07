from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timedelta
import bcrypt
import jwt

# Load environment variables
load_dotenv()

app = FastAPI(title="CaseForge API", description="Backend for business case practice platform")

# CORS middleware - Get allowed origins from environment
FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:5173,http://localhost:3000,https://localhost:3000")
allowed_origins = [url.strip() for url in FRONTEND_URLS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "caseforge")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

# Collections
problems_collection = db.problems
users_collection = db.users
solutions_collection = db.solutions
discussions_collection = db.discussions

# Pydantic models
class Problem(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str  # "Easy", "Medium", "Hard"
    category: str
    domain: str
    company: Optional[str] = None
    time_limit: Optional[int] = 60  # minutes
    sample_framework: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class Solution(BaseModel):
    id: str
    problem_id: str
    user_id: str
    content: str
    submitted_at: datetime
    score: Optional[int] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    solved_problems: List[str] = []
    total_score: int = 0

class Discussion(BaseModel):
    id: str
    problem_id: str
    user_id: str
    title: str
    content: str
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime

# Sample data initialization
async def init_sample_data():
    """Initialize the database with sample business problems"""
    
    # Check if problems already exist
    existing_count = await problems_collection.count_documents({})
    if existing_count > 0:
        return
    
    sample_problems = [
        {
            "id": str(uuid.uuid4()),
            "title": "Netflix Market Entry Strategy: India",
            "description": """Netflix is considering entering the Indian streaming market. The market is highly price-sensitive with strong local competition from Hotstar, Amazon Prime Video, and emerging players. 
            
**Context:**
- India has 600M+ internet users but low ARPU (Average Revenue Per User)
- Strong preference for local content and dubbed versions
- Mobile-first consumption with data cost concerns
- Existing players offer annual subscriptions as low as $15

**Your Task:**
Develop a comprehensive market entry strategy for Netflix in India. Consider pricing strategy, content strategy, partnerships, and competitive positioning.

**Framework Suggestion:**
Use the 4P framework (Product, Price, Place, Promotion) combined with competitive analysis and market sizing.""",
            "difficulty": "Medium",
            "category": "Market Entry Strategy", 
            "domain": "Strategy & Consulting",
            "company": "Netflix",
            "time_limit": 90,
            "sample_framework": "4P Framework + Competitive Analysis",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Tesla Gigafactory Supply Chain Optimization",
            "description": """Tesla is experiencing supply chain bottlenecks at their Berlin Gigafactory, causing production delays and increased costs.

**Context:**
- Current production: 350,000 vehicles/year (target: 500,000)
- Key bottlenecks: Battery cell supply, semiconductor shortage, logistics
- Rising raw material costs (lithium, nickel, cobalt)
- European regulations on local content requirements

**Your Task:**
Design a supply chain optimization strategy to achieve production targets while reducing costs by 15%.

**Consider:**
- Supplier diversification vs. consolidation
- Vertical integration opportunities
- Inventory management strategies
- Risk mitigation approaches""",
            "difficulty": "Hard",
            "category": "Supply Chain Management",
            "domain": "Operations & Supply Chain", 
            "company": "Tesla",
            "time_limit": 120,
            "sample_framework": "Supply Chain Diamond + Risk Analysis",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Startup Valuation: EdTech Platform",
            "description": """A Series A EdTech startup focused on professional skill development needs valuation for their next funding round.

**Company Metrics:**
- Revenue: $2M ARR (100% YoY growth)
- Users: 50,000 paid subscribers
- ARPU: $40/month
- Churn rate: 8% monthly
- Team: 25 employees
- Cash runway: 18 months

**Market Context:**
- Total Addressable Market: $200B
- Key competitors valued at 15-25x revenue multiples
- Recent market downturn affecting EdTech valuations

**Your Task:**
Provide a comprehensive valuation using multiple methodologies and recommend a fair Series A valuation range.""",
            "difficulty": "Hard",
            "category": "Valuation Analysis",
            "domain": "Finance & Investment",
            "company": "EdTech Startup",
            "time_limit": 90,
            "sample_framework": "DCF + Comparable Company Analysis + Precedent Transactions",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Customer Acquisition Strategy: D2C Brand",
            "description": """A direct-to-consumer sustainable fashion brand needs to optimize their customer acquisition strategy with a limited marketing budget.

**Current Situation:**
- Monthly marketing budget: $50,000
- Current CAC: $45 (target: $30)
- LTV: $120 (6-month payback period)
- Primary channels: Instagram ads, influencer partnerships
- Conversion rate: 2.5%

**Challenge:**
Competition is increasing ad costs, and the brand needs to diversify acquisition channels while improving unit economics.

**Your Task:**
Develop a comprehensive customer acquisition strategy to achieve 40% growth in new customers while reducing CAC by 30%.""",
            "difficulty": "Medium",
            "category": "Customer Acquisition",
            "domain": "Marketing & Growth",
            "company": "D2C Fashion Brand",
            "time_limit": 75,
            "sample_framework": "Customer Acquisition Funnel + Channel Portfolio Matrix",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "E-commerce Analytics: Revenue Drop Analysis",
            "description": """An e-commerce platform experienced a sudden 25% drop in revenue over the last month despite stable traffic.

**Data Points:**
- Website traffic: Stable (no significant change)
- Conversion rate: Dropped from 3.2% to 2.1%
- Average order value: Decreased from $85 to $72
- Customer complaints: Increased 40%
- New feature launch: Updated checkout process 6 weeks ago

**Available Data:**
- Google Analytics data
- Customer support tickets
- A/B test results from checkout changes
- Competitor pricing analysis

**Your Task:**
Conduct a comprehensive analysis to identify root causes and recommend immediate actions to recover revenue.""",
            "difficulty": "Easy",
            "category": "Business Intelligence",
            "domain": "Data Analytics",
            "company": "E-commerce Platform",
            "time_limit": 60,
            "sample_framework": "Funnel Analysis + Root Cause Analysis",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Insert sample problems
    await problems_collection.insert_many(sample_problems)
    print(f"Inserted {len(sample_problems)} sample problems")

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data on startup"""
    await init_sample_data()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "CaseForge API is running"}

@app.get("/api/problems", response_model=List[Problem])
async def get_problems(
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 50
):
    """Get problems with optional filtering"""
    filter_query = {}
    
    if domain:
        filter_query["domain"] = domain
    if difficulty:
        filter_query["difficulty"] = difficulty
    if category:
        filter_query["category"] = category
    
    cursor = problems_collection.find(filter_query).limit(limit)
    problems = []
    async for problem in cursor:
        problem["_id"] = str(problem["_id"])
        problems.append(problem)
    
    return problems

@app.get("/api/problems/{problem_id}", response_model=Problem)
async def get_problem(problem_id: str):
    """Get a specific problem by ID"""
    problem = await problems_collection.find_one({"id": problem_id})
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem["_id"] = str(problem["_id"])
    return problem

@app.get("/api/categories")
async def get_categories():
    """Get all available categories and domains"""
    pipeline = [
        {
            "$group": {
                "_id": "$domain",
                "categories": {"$addToSet": "$category"},
                "count": {"$sum": 1}
            }
        }
    ]
    
    cursor = problems_collection.aggregate(pipeline)
    domains = []
    async for domain in cursor:
        domains.append({
            "domain": domain["_id"],
            "categories": domain["categories"],
            "problem_count": domain["count"]
        })
    
    return domains

@app.get("/api/stats")
async def get_platform_stats():
    """Get platform statistics"""
    total_problems = await problems_collection.count_documents({})
    total_solutions = await solutions_collection.count_documents({})
    total_users = await users_collection.count_documents({})
    
    # Get difficulty distribution
    difficulty_pipeline = [
        {"$group": {"_id": "$difficulty", "count": {"$sum": 1}}}
    ]
    difficulty_cursor = problems_collection.aggregate(difficulty_pipeline)
    difficulty_stats = {}
    async for stat in difficulty_cursor:
        difficulty_stats[stat["_id"]] = stat["count"]
    
    return {
        "total_problems": total_problems,
        "total_solutions": total_solutions,
        "total_users": total_users,
        "difficulty_distribution": difficulty_stats
    }

@app.post("/api/solutions")
async def submit_solution(solution_data: dict):
    """Submit a solution for a problem"""
    solution = {
        "id": str(uuid.uuid4()),
        "problem_id": solution_data["problem_id"],
        "user_id": solution_data.get("user_id", "anonymous"),
        "content": solution_data["content"],
        "submitted_at": datetime.utcnow(),
        "score": None  # To be calculated later
    }
    
    result = await solutions_collection.insert_one(solution)
    solution["_id"] = str(result.inserted_id)
    
    return {"message": "Solution submitted successfully", "solution_id": solution["id"]}

@app.get("/api/daily-challenge")
async def get_daily_challenge():
    """Get today's daily challenge"""
    # For now, return a random problem
    # In production, this would be based on date
    pipeline = [{"$sample": {"size": 1}}]
    cursor = problems_collection.aggregate(pipeline)
    
    async for problem in cursor:
        problem["_id"] = str(problem["_id"])
        return {
            "problem": problem,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "participants": 0,  # Mock data
            "completion_rate": 0.0
        }
    
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)