from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timedelta
# import bcrypt # Replaced by passlib
# import jwt # Replaced by jose
from passlib.context import CryptContext # For password hashing
from jose import JWTError, jwt as jose_jwt # For JWT operations

load_dotenv()

app = FastAPI(title="CaseForge API", description="Backend for business case practice platform")

FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:5173,http://localhost:3000,https://localhost:3000")
allowed_origins = [url.strip() for url in FRONTEND_URLS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "caseforge")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

problems_collection = db.problems
users_collection = db.users
solutions_collection = db.solutions
discussions_collection = db.discussions
competitions_collection = db.competitions # New collection for Competitions

class Problem(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    category: str
    domain: str
    company: Optional[str] = None
    time_limit: Optional[int] = 60
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

# --- Competition Models ---
class CompetitionBase(BaseModel):
    name: str
    description: str
    start_date: datetime
    end_date: datetime
    problem_ids: List[str] = []
    is_active: bool = False

class CompetitionCreate(CompetitionBase):
    pass # is_active can be set at creation, defaults to False in Competition

class CompetitionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    problem_ids: Optional[List[str]] = None
    is_active: Optional[bool] = None
    updated_at: datetime = datetime.utcnow() # Always update this field

class Competition(CompetitionBase):
    id: str = uuid.uuid4().hex # Default factory for id
    created_at: datetime = datetime.utcnow() # Default factory for created_at
    updated_at: datetime = datetime.utcnow() # Default factory for updated_at

    class Config:
        # For Pydantic v2, default_factory is preferred inside Field for newer versions
        # but this structure is common for v1. Let's ensure it's v2 compatible if possible.
        # For id, created_at, updated_at, using Field(default_factory=...) is more explicit.
        # For now, this will work as Pydantic v1 style defaults in class body.
        # If using Pydantic v2 extensively, Field(default_factory=...) is better.
        pass


# --- Authentication Models and Settings ---
class UserBase(BaseModel):
    username: str
    email: EmailStr # Using EmailStr for validation
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    hashed_password: str
    is_admin: bool = False
    created_at: datetime # This field will be set by db_create_user
    # solved_problems and total_score are part of the User model, UserInDB will get them if needed from User

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_key_please_change_in_prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Already using CryptContext

# OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token") # Adjusted tokenUrl to match router prefix

# --- End Authentication Models and Settings ---

# --- User Database Functions ---
async def get_user_db(username: str) -> Optional[UserInDB]: # Renamed to avoid conflict with potential endpoint
    user_data = await users_collection.find_one({"username": username})
    if user_data:
        # Ensure all fields for UserInDB are present, providing defaults if necessary
        # This is important if your DB schema might not perfectly match UserInDB initially
        user_data_complete = {
            "id": str(user_data.get("id", uuid.uuid4())), # Ensure ID is a string
            "username": user_data.get("username"),
            "email": user_data.get("email"),
            "full_name": user_data.get("full_name"),
            "hashed_password": user_data.get("hashed_password"),
            "is_admin": user_data.get("is_admin", False),
            "created_at": user_data.get("created_at", datetime.utcnow()),
            "solved_problems": user_data.get("solved_problems", []),
            "total_score": user_data.get("total_score", 0)
        }
        return UserInDB(**user_data_complete)
    return None

async def db_create_user(user: UserCreate) -> UserInDB:
    existing_user_by_username = await users_collection.find_one({"username": user.username})
    if existing_user_by_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    existing_user_by_email = await users_collection.find_one({"email": user.email})
    if existing_user_by_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    # Prepare data for UserInDB
    user_id_val = str(uuid.uuid4())
    created_at_val = datetime.utcnow()

    user_in_db_data = user.dict(exclude={"password"})
    user_in_db_data.update({
        "id": user_id_val,
        "hashed_password": hashed_password,
        "is_admin": False,
        "created_at": created_at_val,
        # solved_problems and total_score are not part of UserBase/UserCreate
        # they are part of the main User model and should be handled there or upon retrieval
    })
    # Need to ensure all fields required by UserInDB are present
    # UserInDB inherits UserBase (username, email, full_name)
    # and adds id, hashed_password, is_admin, created_at.
    # Let's ensure user_in_db_data matches UserInDB's definition.

    # Minimal UserInDB based on current definition:
    user_for_db_dict = {
        "id": user_id_val,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "is_admin": False,
        "created_at": created_at_val
        # solved_problems and total_score are part of the main User model,
        # not directly part of UserInDB's core definition here.
        # They would be added when a full User object is constructed from DB.
    }
    user_in_db = UserInDB(**user_for_db_dict)

    await users_collection.insert_one(user_in_db.dict())
    return user_in_db
# --- End User Database Functions ---

# --- OAuth2 Dependencies ---
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    token_data = decode_access_token(token)
    user = await get_user_db(token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or token invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_admin_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin"
        )
    return current_user
# --- End OAuth2 Dependencies ---

# --- Authentication Router ---
auth_router = APIRouter()

@auth_router.post("/register", response_model=User) # Using existing User model for response
async def register_user(user_create: UserCreate):
    # db_create_user already handles username/email uniqueness checks and raises HTTPException
    user_in_db = await db_create_user(user_create)
    # Convert UserInDB to the User response model
    # Assuming User model has: id, username, email, created_at, solved_problems, total_score
    return User(
        id=user_in_db.id,
        username=user_in_db.username, # from UserInDB
        email=user_in_db.email,       # from UserInDB
        created_at=user_in_db.created_at, # from UserInDB
        full_name=user_in_db.full_name, # from UserInDB
        # solved_problems and total_score are part of the main User model.
        # If UserInDB doesn't store them directly (as per current model def),
        # they would be defaulted or fetched separately for the User response model.
        # For now, let's assume they are part of the User model's defaults.
        solved_problems=[], # Default for new user response
        total_score=0       # Default for new user response
    )

@auth_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_db(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"username": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- End Authentication Router ---

class Discussion(BaseModel):
    id: str
    problem_id: str
    user_id: str
    title: str
    content: str
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime

# --- Password & JWT Utility Functions ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "sub": to_encode.get("username")}) # Add "sub" claim
    encoded_jwt = jose_jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jose_jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jose_jwt.JWTError: # Catching base JWTError from python-jose
        raise credentials_exception
    return token_data

# --- End Password & JWT Utility Functions ---

async def init_sample_data():
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
    
    await problems_collection.insert_many(sample_problems)
    print(f"Inserted {len(sample_problems)} sample problems")

@app.on_event("startup")
async def startup_event():
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
    problem = await problems_collection.find_one({"id": problem_id})
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem["_id"] = str(problem["_id"])
    return problem

@app.get("/api/categories")
async def get_categories():
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
    total_problems = await problems_collection.count_documents({})
    total_solutions = await solutions_collection.count_documents({})
    total_users = await users_collection.count_documents({}) # This will count all user documents

    # Example: Create a default admin user if it doesn't exist (for testing)
    # Note: In production, admin creation should be a secure, separate process.
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_user = await users_collection.find_one({"username": admin_username})
    if not admin_user:
        admin_password = os.getenv("ADMIN_PASSWORD", "adminpassword") # Ensure this is strong
        hashed_password = get_password_hash(admin_password)
        admin_user_data = {
            "id": str(uuid.uuid4()),
            "username": admin_username,
            "email": os.getenv("ADMIN_EMAIL", "admin@example.com"),
            "full_name": "Admin User",
            "hashed_password": hashed_password,
            "is_admin": True,
            "created_at": datetime.utcnow(),
            "solved_problems": [],
            "total_score": 0
        }
        await users_collection.insert_one(admin_user_data)
        print(f"Created default admin user: {admin_username}")
    
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
    solution = {
        "id": str(uuid.uuid4()),
        "problem_id": solution_data["problem_id"],
        "user_id": solution_data.get("user_id", "anonymous"),
        "content": solution_data["content"],
        "submitted_at": datetime.utcnow(),
        "score": None
    }
    
    result = await solutions_collection.insert_one(solution)
    solution["_id"] = str(result.inserted_id)
    
    return {"message": "Solution submitted successfully", "solution_id": solution["id"]}

@app.get("/api/daily-challenge")
async def get_daily_challenge(): # This could be protected if needed
    pipeline = [{"$sample": {"size": 1}}]
    cursor = problems_collection.aggregate(pipeline)
    
    async for problem in cursor:
        problem["_id"] = str(problem["_id"])
        return {
            "problem": problem,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "participants": 0,
            "completion_rate": 0.0
        }
    
    return None

# Placeholder for existing User CRUD - to be replaced/augmented by auth logic
# For example, the current User model might become UserPublic or UserResponse
# And user creation will go through the /auth/register endpoint.

# The existing User model:
# class User(BaseModel):
#     id: str
#     username: str
#     email: str
#     created_at: datetime
#     solved_problems: List[str] = []
#     total_score: int = 0
# This will be used as the response model for user info, ensuring passwords aren't sent.

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Import and include the admin router
from backend.admin_router import admin_router as admin_router_instance # renamed to avoid conflict
app.include_router(admin_router_instance, prefix="/api") # /api prefix will be combined with /admin from admin_router


if __name__ == "__main__":
    import uvicorn
    # Ensure CryptContext is imported for the get_password_hash in init_sample_data
    # Ensure CryptContext is imported for the get_password_hash in init_sample_data
    # APIRouter is already imported at the top level
    # CryptContext is already imported at the top level
    uvicorn.run(app, host="0.0.0.0", port=8001)