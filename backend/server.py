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
FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [url.strip() for url in FRONTEND_URLS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
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
user_preferences_collection = db.user_preferences
domain_progress_collection = db.domain_progress
learning_paths_collection = db.learning_paths

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
    time_taken: Optional[int] = None  # in minutes
    domain: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    solved_problems: List[str] = []
    total_score: int = 0
    preferred_domain: Optional[str] = None
    current_level: int = 1
    domain_levels: Dict[str, int] = {}

class Discussion(BaseModel):
    id: str
    problem_id: str
    user_id: str
    title: str
    content: str
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime
    domain: Optional[str] = None

class UserPreferences(BaseModel):
    user_id: str
    preferred_domain: str
    difficulty_preference: str
    notification_settings: Dict[str, bool] = {}
    created_at: datetime
    updated_at: datetime

class DomainProgress(BaseModel):
    user_id: str
    domain: str
    level: int = 1
    experience_points: int = 0
    problems_solved: int = 0
    average_score: float = 0.0
    time_spent: int = 0  # in minutes
    streak: int = 0
    last_activity: datetime
    skills_unlocked: List[str] = []

class LearningPath(BaseModel):
    id: str
    domain: str
    title: str
    description: str
    level: str  # "Beginner", "Intermediate", "Advanced"
    problems: List[str]  # problem IDs
    estimated_duration: int  # in hours
    skills_covered: List[str]
    created_at: datetime

# Constants
DOMAINS = {
    "Finance & Investment": {
        "color": "green",
        "categories": ["Valuation Analysis", "Financial Modeling", "Investment Analysis", "Corporate Finance", "Risk Management"],
        "skills": ["DCF Modeling", "Financial Ratios", "Portfolio Analysis", "Credit Analysis", "Derivatives"],
        "levels": {
            1: {"title": "Finance Analyst", "xp_required": 0},
            2: {"title": "Senior Analyst", "xp_required": 500},
            3: {"title": "Finance Manager", "xp_required": 1200},
            4: {"title": "VP Finance", "xp_required": 2000},
            5: {"title": "CFO", "xp_required": 3500}
        }
    },
    "Strategy & Consulting": {
        "color": "purple", 
        "categories": ["Market Entry Strategy", "Growth Strategy", "Digital Transformation", "Competitive Strategy", "Business Model Design"],
        "skills": ["SWOT Analysis", "Porter's 5 Forces", "McKinsey 7S", "BCG Matrix", "Scenario Planning"],
        "levels": {
            1: {"title": "Strategy Analyst", "xp_required": 0},
            2: {"title": "Consultant", "xp_required": 500},
            3: {"title": "Senior Consultant", "xp_required": 1200},
            4: {"title": "Principal", "xp_required": 2000},
            5: {"title": "Partner", "xp_required": 3500}
        }
    },
    "Operations & Supply Chain": {
        "color": "blue",
        "categories": ["Supply Chain Management", "Process Improvement", "Quality Management", "Project Management", "Production Planning"],
        "skills": ["Lean Six Sigma", "Kaizen", "Supply Chain Optimization", "Inventory Management", "Quality Control"],
        "levels": {
            1: {"title": "Operations Analyst", "xp_required": 0},
            2: {"title": "Operations Specialist", "xp_required": 500},
            3: {"title": "Operations Manager", "xp_required": 1200},
            4: {"title": "Operations Director", "xp_required": 2000},
            5: {"title": "COO", "xp_required": 3500}
        }
    },
    "Marketing & Growth": {
        "color": "orange",
        "categories": ["Customer Acquisition", "Pricing Strategy", "Campaign Optimization", "Brand Strategy", "Digital Marketing"],
        "skills": ["Customer Segmentation", "A/B Testing", "Growth Hacking", "Content Marketing", "Analytics"],
        "levels": {
            1: {"title": "Marketing Analyst", "xp_required": 0},
            2: {"title": "Marketing Specialist", "xp_required": 500},
            3: {"title": "Marketing Manager", "xp_required": 1200},
            4: {"title": "Marketing Director", "xp_required": 2000},
            5: {"title": "CMO", "xp_required": 3500}
        }
    },
    "Data Analytics": {
        "color": "cyan",
        "categories": ["Business Intelligence", "Data Analysis", "Performance Metrics", "Reporting", "Predictive Analytics"],
        "skills": ["SQL", "Data Visualization", "Statistical Analysis", "Machine Learning", "Big Data"],
        "levels": {
            1: {"title": "Data Analyst", "xp_required": 0},
            2: {"title": "Senior Data Analyst", "xp_required": 500},
            3: {"title": "Data Scientist", "xp_required": 1200},
            4: {"title": "Lead Data Scientist", "xp_required": 2000},
            5: {"title": "Chief Data Officer", "xp_required": 3500}
        }
    }
}

# Sample data initialization
async def init_sample_data():
    """Initialize the database with sample business problems and learning paths"""
    
    # Check if problems already exist
    existing_count = await problems_collection.count_documents({})
    if existing_count > 0:
        return
    
    # Extended sample problems for all domains
    sample_problems = [
        # Finance & Investment Problems
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
            "title": "Portfolio Risk Management: Hedge Fund",
            "description": """A $500M hedge fund needs to optimize their portfolio risk management strategy during market volatility.

**Current Portfolio:**
- 60% Equities (Tech-heavy)
- 25% Fixed Income
- 10% Commodities
- 5% Cash
- Current VaR: 2.5% daily
- Sharpe Ratio: 1.2

**Challenge:**
Market volatility has increased significantly, and the fund needs to maintain returns while reducing risk exposure.

**Your Task:**
Design a comprehensive risk management strategy including position sizing, hedging strategies, and portfolio rebalancing recommendations.""",
            "difficulty": "Hard",
            "category": "Risk Management",
            "domain": "Finance & Investment",
            "company": "Hedge Fund",
            "time_limit": 120,
            "sample_framework": "Modern Portfolio Theory + VaR Analysis + Stress Testing",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # Strategy & Consulting Problems
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
            "title": "Digital Transformation: Traditional Bank",
            "description": """A 150-year-old traditional bank is facing intense competition from fintech startups and digital-first banks.

**Current Situation:**
- Legacy IT systems (mainframe-based)
- Branch-heavy distribution model (2,000+ branches)
- Aging customer base (average age 55)
- Declining market share (lost 15% in 3 years)
- High operational costs

**Challenge:**
The bank needs to modernize while maintaining its trusted brand and serving existing customers.

**Your Task:**
Develop a comprehensive digital transformation strategy including technology roadmap, customer experience redesign, and organizational change management.""",
            "difficulty": "Hard",
            "category": "Digital Transformation",
            "domain": "Strategy & Consulting",
            "company": "Traditional Bank",
            "time_limit": 120,
            "sample_framework": "Digital Maturity Assessment + Transformation Roadmap + Change Management",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # Operations & Supply Chain Problems
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
            "title": "McDonald's Process Improvement: Drive-Thru Optimization",
            "description": """McDonald's wants to reduce drive-thru wait times while maintaining food quality and customer satisfaction.

**Current Metrics:**
- Average wait time: 4.5 minutes
- Order accuracy: 92%
- Customer satisfaction: 3.8/5
- Peak hour throughput: 120 cars/hour
- Labor cost per order: $2.50

**Challenge:**
Competition is increasing and customers expect faster service without compromising quality.

**Your Task:**
Design a comprehensive process improvement strategy to reduce wait times by 30% while maintaining or improving other metrics.""",
            "difficulty": "Medium",
            "category": "Process Improvement",
            "domain": "Operations & Supply Chain",
            "company": "McDonald's",
            "time_limit": 75,
            "sample_framework": "Lean Six Sigma + Process Mapping + Time-Motion Study",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # Marketing & Growth Problems
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
            "title": "Spotify Pricing Strategy: Family Plan Optimization",
            "description": """Spotify is evaluating their Family Plan pricing strategy to maximize revenue while maintaining user growth.

**Current State:**
- Individual Plan: $9.99/month
- Family Plan: $15.99/month (up to 6 users)
- Family plan adoption: 35% of subscribers
- Average family size: 3.2 users
- Churn rate: Individual 5%, Family 3%

**Challenge:**
Competitors are launching aggressive family pricing strategies, and Spotify needs to respond strategically.

**Your Task:**
Develop an optimized pricing strategy for the Family Plan considering competitive dynamics, user behavior, and revenue impact.""",
            "difficulty": "Medium",
            "category": "Pricing Strategy",
            "domain": "Marketing & Growth",
            "company": "Spotify",
            "time_limit": 75,
            "sample_framework": "Price Elasticity Analysis + Competitive Pricing + Revenue Optimization",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # Data Analytics Problems
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
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Netflix Recommendation System: Performance Analysis",
            "description": """Netflix wants to improve their recommendation system performance to increase user engagement and reduce churn.

**Current Metrics:**
- Click-through rate: 12%
- Average watch time: 2.3 hours/session
- Content completion rate: 68%
- Monthly churn: 4.5%
- User satisfaction: 4.1/5

**Available Data:**
- User viewing history
- Content metadata
- User demographics
- A/B test results from algorithm changes

**Your Task:**
Analyze the recommendation system performance and propose data-driven improvements to increase engagement by 20%.""",
            "difficulty": "Hard",
            "category": "Predictive Analytics",
            "domain": "Data Analytics",
            "company": "Netflix",
            "time_limit": 120,
            "sample_framework": "Machine Learning Pipeline + A/B Testing + Performance Metrics",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Insert sample problems
    await problems_collection.insert_many(sample_problems)
    print(f"Inserted {len(sample_problems)} sample problems")
    
    # Initialize learning paths
    sample_learning_paths = [
        {
            "id": str(uuid.uuid4()),
            "domain": "Finance & Investment",
            "title": "Investment Banking Prep",
            "description": "Complete preparation for investment banking roles covering valuation, financial modeling, and M&A analysis",
            "level": "Advanced",
            "problems": [],  # Will be populated with relevant problem IDs
            "estimated_duration": 12,  # weeks
            "skills_covered": ["DCF Modeling", "LBO Analysis", "Comparable Company Analysis", "Precedent Transactions"],
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "domain": "Strategy & Consulting",
            "title": "Consulting Track",
            "description": "Comprehensive case preparation for top-tier consulting firms with framework mastery and problem-solving skills",
            "level": "Advanced",
            "problems": [],
            "estimated_duration": 16,  # weeks
            "skills_covered": ["Case Frameworks", "Market Entry", "Profitability Analysis", "Strategic Planning"],
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "domain": "Operations & Supply Chain",
            "title": "Operations Excellence",
            "description": "Master operational efficiency and supply chain optimization for manufacturing and service industries",
            "level": "Intermediate",
            "problems": [],
            "estimated_duration": 10,  # weeks
            "skills_covered": ["Lean Six Sigma", "Process Optimization", "Supply Chain Management", "Quality Control"],
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "domain": "Marketing & Growth",
            "title": "Growth Marketing Mastery",
            "description": "Learn data-driven growth strategies and customer acquisition techniques for modern businesses",
            "level": "Intermediate",
            "problems": [],
            "estimated_duration": 8,  # weeks
            "skills_covered": ["Growth Hacking", "Customer Acquisition", "A/B Testing", "Digital Marketing"],
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "domain": "Data Analytics",
            "title": "Business Analytics Track",
            "description": "Develop expertise in business intelligence, data analysis, and predictive modeling",
            "level": "Intermediate",
            "problems": [],
            "estimated_duration": 10,  # weeks
            "skills_covered": ["SQL", "Data Visualization", "Statistical Analysis", "Business Intelligence"],
            "created_at": datetime.utcnow()
        }
    ]
    
    await learning_paths_collection.insert_many(sample_learning_paths)
    print(f"Inserted {len(sample_learning_paths)} learning paths")

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data on startup"""
    await init_sample_data()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "CaseForge API is running"}

# Domain-specific endpoints
@app.get("/api/domains")
async def get_domains():
    """Get all available domains with metadata"""
    domain_stats = []
    for domain_name, domain_info in DOMAINS.items():
        problem_count = await problems_collection.count_documents({"domain": domain_name})
        domain_stats.append({
            "name": domain_name,
            "color": domain_info["color"],
            "categories": domain_info["categories"],
            "skills": domain_info["skills"],
            "levels": domain_info["levels"],
            "problem_count": problem_count
        })
    return domain_stats

@app.get("/api/domains/{domain}/stats")
async def get_domain_stats(domain: str):
    """Get detailed statistics for a specific domain"""
    # Problem distribution by difficulty
    difficulty_pipeline = [
        {"$match": {"domain": domain}},
        {"$group": {"_id": "$difficulty", "count": {"$sum": 1}}}
    ]
    difficulty_cursor = problems_collection.aggregate(difficulty_pipeline)
    difficulty_stats = {}
    async for stat in difficulty_cursor:
        difficulty_stats[stat["_id"]] = stat["count"]
    
    # Category distribution
    category_pipeline = [
        {"$match": {"domain": domain}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_cursor = problems_collection.aggregate(category_pipeline)
    category_stats = {}
    async for stat in category_cursor:
        category_stats[stat["_id"]] = stat["count"]
    
    total_problems = await problems_collection.count_documents({"domain": domain})
    total_solutions = await solutions_collection.count_documents({"domain": domain})
    
    return {
        "domain": domain,
        "total_problems": total_problems,
        "total_solutions": total_solutions,
        "difficulty_distribution": difficulty_stats,
        "category_distribution": category_stats,
        "domain_info": DOMAINS.get(domain, {})
    }

@app.get("/api/domains/{domain}/leaderboard")
async def get_domain_leaderboard(domain: str, limit: int = 50):
    """Get leaderboard for a specific domain"""
    # Mock leaderboard data for now
    leaderboard = []
    for i in range(min(limit, 20)):
        user_level = DOMAINS.get(domain, {}).get("levels", {}).get(min(5, (i // 4) + 1), {"title": "Analyst"})
        leaderboard.append({
            "rank": i + 1,
            "user_id": f"user_{i+1}",
            "username": f"user_{i+1}",
            "level": min(5, (i // 4) + 1),
            "level_title": user_level["title"],
            "total_score": 1000 - (i * 25),
            "problems_solved": 50 - (i * 2),
            "domain_xp": 2000 - (i * 50),
            "streak": max(0, 15 - i),
            "last_active": datetime.utcnow() - timedelta(days=i)
        })
    
    return {
        "domain": domain,
        "leaderboard": leaderboard,
        "total_participants": len(leaderboard)
    }

@app.get("/api/domains/{domain}/learning-paths")
async def get_domain_learning_paths(domain: str):
    """Get learning paths for a specific domain"""
    cursor = learning_paths_collection.find({"domain": domain})
    paths = []
    async for path in cursor:
        path["_id"] = str(path["_id"])
        paths.append(path)
    return paths

@app.get("/api/domains/{domain}/discussions")
async def get_domain_discussions(domain: str, limit: int = 20):
    """Get discussions for a specific domain"""
    # Mock discussion data for now
    discussions = []
    for i in range(min(limit, 10)):
        discussions.append({
            "id": str(uuid.uuid4()),
            "title": f"Discussion about {domain} problem {i+1}",
            "content": f"This is a discussion about a {domain} related topic...",
            "author": f"user_{i+1}",
            "upvotes": 15 - i,
            "replies": 5 - (i // 2),
            "created_at": datetime.utcnow() - timedelta(days=i),
            "domain": domain,
            "tags": ["discussion", domain.lower().replace(" & ", "-")]
        })
    return discussions

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
    
    # Get domain distribution
    domain_pipeline = [
        {"$group": {"_id": "$domain", "count": {"$sum": 1}}}
    ]
    domain_cursor = problems_collection.aggregate(domain_pipeline)
    domain_stats = {}
    async for stat in domain_cursor:
        domain_stats[stat["_id"]] = stat["count"]
    
    return {
        "total_problems": total_problems,
        "total_solutions": total_solutions,
        "total_users": total_users,
        "difficulty_distribution": difficulty_stats,
        "domain_distribution": domain_stats
    }

# User preferences and progress
@app.post("/api/users/{user_id}/preferences")
async def set_user_preferences(user_id: str, preferences: dict):
    """Set user domain preferences"""
    preference_data = {
        "user_id": user_id,
        "preferred_domain": preferences.get("preferred_domain"),
        "difficulty_preference": preferences.get("difficulty_preference", "Medium"),
        "notification_settings": preferences.get("notification_settings", {}),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await user_preferences_collection.update_one(
        {"user_id": user_id},
        {"$set": preference_data},
        upsert=True
    )
    
    return {"message": "Preferences updated successfully"}

@app.get("/api/users/{user_id}/domain-progress")
async def get_user_domain_progress(user_id: str):
    """Get user's progress across all domains"""
    cursor = domain_progress_collection.find({"user_id": user_id})
    progress = []
    async for domain_progress in cursor:
        domain_progress["_id"] = str(domain_progress["_id"])
        progress.append(domain_progress)
    
    return progress

@app.get("/api/users/{user_id}/domain-progress/{domain}")
async def get_user_domain_specific_progress(user_id: str, domain: str):
    """Get user's progress in a specific domain"""
    progress = await domain_progress_collection.find_one({"user_id": user_id, "domain": domain})
    if not progress:
        # Initialize progress for new domain
        progress = {
            "user_id": user_id,
            "domain": domain,
            "level": 1,
            "experience_points": 0,
            "problems_solved": 0,
            "average_score": 0.0,
            "time_spent": 0,
            "streak": 0,
            "last_activity": datetime.utcnow(),
            "skills_unlocked": []
        }
        result = await domain_progress_collection.insert_one(progress)
        progress["_id"] = str(result.inserted_id)
    else:
        progress["_id"] = str(progress["_id"])
    
    return progress

@app.post("/api/solutions")
async def submit_solution(solution_data: dict):
    """Submit a solution for a problem"""
    # Get problem details to extract domain
    problem = await problems_collection.find_one({"id": solution_data["problem_id"]})
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    solution = {
        "id": str(uuid.uuid4()),
        "problem_id": solution_data["problem_id"],
        "user_id": solution_data.get("user_id", "anonymous"),
        "content": solution_data["content"],
        "submitted_at": datetime.utcnow(),
        "score": solution_data.get("score"),
        "time_taken": solution_data.get("time_taken", 0),
        "domain": problem["domain"]
    }
    
    result = await solutions_collection.insert_one(solution)
    solution["_id"] = str(result.inserted_id)
    
    # Update user domain progress
    user_id = solution_data.get("user_id")
    if user_id and user_id != "anonymous":
        await update_user_domain_progress(user_id, problem["domain"], solution_data.get("score", 0), solution_data.get("time_taken", 0))
    
    return {"message": "Solution submitted successfully", "solution_id": solution["id"]}

async def update_user_domain_progress(user_id: str, domain: str, score: int, time_taken: int):
    """Update user's domain progress after solving a problem"""
    # Calculate experience points based on score and time
    xp_gained = max(10, score // 2) if score else 10
    
    # Update or create domain progress
    progress = await domain_progress_collection.find_one({"user_id": user_id, "domain": domain})
    if progress:
        new_problems_solved = progress["problems_solved"] + 1
        new_total_score = (progress["average_score"] * progress["problems_solved"] + score) / new_problems_solved
        new_xp = progress["experience_points"] + xp_gained
        new_time = progress["time_spent"] + time_taken
        
        # Calculate new level based on XP
        domain_levels = DOMAINS.get(domain, {}).get("levels", {})
        new_level = 1
        for level, level_info in domain_levels.items():
            if new_xp >= level_info["xp_required"]:
                new_level = level
        
        await domain_progress_collection.update_one(
            {"user_id": user_id, "domain": domain},
            {
                "$set": {
                    "problems_solved": new_problems_solved,
                    "average_score": new_total_score,
                    "experience_points": new_xp,
                    "time_spent": new_time,
                    "level": new_level,
                    "last_activity": datetime.utcnow()
                }
            }
        )
    else:
        # Create new progress record
        new_progress = {
            "user_id": user_id,
            "domain": domain,
            "level": 1,
            "experience_points": xp_gained,
            "problems_solved": 1,
            "average_score": float(score) if score else 0.0,
            "time_spent": time_taken,
            "streak": 1,
            "last_activity": datetime.utcnow(),
            "skills_unlocked": []
        }
        await domain_progress_collection.insert_one(new_progress)

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

@app.get("/api/daily-challenge/{domain}")
async def get_domain_daily_challenge(domain: str):
    """Get today's daily challenge for a specific domain"""
    pipeline = [
        {"$match": {"domain": domain}},
        {"$sample": {"size": 1}}
    ]
    cursor = problems_collection.aggregate(pipeline)
    
    async for problem in cursor:
        problem["_id"] = str(problem["_id"])
        return {
            "problem": problem,
            "domain": domain,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "participants": 0,  # Mock data
            "completion_rate": 0.0
        }
    
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)