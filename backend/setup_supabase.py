"""
Simple Supabase setup script - Create tables manually via SQL
Since direct SQL execution isn't available via Python client, 
this script creates the basic tables we need for testing.
"""

from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Create Supabase client with service key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def create_basic_tables():
    """Create basic tables via insert operations"""
    print("🚀 Setting up basic Supabase structure...")
    
    # Create sample problems directly
    sample_problems = [
        {
            "id": str(uuid.uuid4()),
            "title": "Market Entry Strategy for Electric Vehicles",
            "description": "Tesla is considering entering the Indian market. Analyze the market opportunity, competitive landscape, and recommend an entry strategy.",
            "category": "Strategy",
            "domain": "Automotive",
            "difficulty": "Hard",
            "company": "Tesla",
            "tags": ["market-entry", "automotive", "strategy"],
            "created_at": "2024-01-15T10:00:00Z"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Customer Acquisition Cost Optimization",
            "description": "A SaaS startup is spending $200 to acquire each customer but only generating $150 in lifetime value. How would you fix this?",
            "category": "Marketing",
            "domain": "Technology",
            "difficulty": "Medium",
            "company": "Generic SaaS",
            "tags": ["marketing", "saas", "metrics"],
            "created_at": "2024-01-15T10:00:00Z"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Supply Chain Disruption Response",
            "description": "A major supplier to your manufacturing company has gone bankrupt. You need to maintain production while finding alternatives.",
            "category": "Operations",
            "domain": "Manufacturing",
            "difficulty": "Hard",
            "company": "Manufacturing Corp",
            "tags": ["supply-chain", "operations", "crisis-management"],
            "created_at": "2024-01-15T10:00:00Z"
        }
    ]
    
    print("📝 Creating sample problems...")
    try:
        # Try to create problems table if it doesn't exist by inserting data
        result = supabase.table("problems").insert(sample_problems).execute()
        print(f"✅ Successfully created {len(sample_problems)} sample problems")
        return True
    except Exception as e:
        print(f"❌ Error creating problems: {e}")
        print("💡 Note: Tables may need to be created manually in Supabase dashboard")
        print("💡 Or the tables might already exist with data")
        return False

def test_connection():
    """Test Supabase connection"""
    try:
        # Try to query problems table
        result = supabase.table("problems").select("*").limit(1).execute()
        print(f"✅ Connection successful - Found {len(result.data)} problems")
        return True
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        return False

if __name__ == "__main__":
    print("🔧 CaseForge Supabase Setup")
    print(f"📊 Database URL: {SUPABASE_URL}")
    print("=" * 50)
    
    # Test connection first
    if test_connection():
        print("✅ Supabase connection working!")
    else:
        print("⚠️ Attempting to create basic structure...")
        create_basic_tables()
    
    print("\n✨ Setup complete!")
    print("\n📋 Manual Setup Instructions:")
    print("1. Go to your Supabase dashboard: https://app.supabase.com")
    print("2. Navigate to SQL Editor")
    print("3. Run the following SQL to create tables:")
    print("""
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    domain TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    company TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID REFERENCES problems(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_email TEXT,
    user_name TEXT
);
""")