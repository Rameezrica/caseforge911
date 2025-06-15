"""
Initialize Supabase database tables for CaseForge
Run this script to create the required tables in your Supabase database
"""

from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Create Supabase client with service key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def create_tables():
    """Create all required tables in Supabase"""
    
    # SQL commands to create tables
    sql_commands = [
        # Users table
        """
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            display_name TEXT,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """,
        
        # Problems table
        """
        CREATE TABLE IF NOT EXISTS problems (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            domain TEXT NOT NULL,
            difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
            company TEXT,
            tags TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id)
        );
        """,
        
        # Solutions table
        """
        CREATE TABLE IF NOT EXISTS solutions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_email TEXT,
            user_name TEXT
        );
        """,
        
        # Competitions table (for future use)
        """
        CREATE TABLE IF NOT EXISTS competitions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id)
        );
        """,
        
        # User progress tracking table
        """
        CREATE TABLE IF NOT EXISTS user_progress (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            score INTEGER DEFAULT 0,
            UNIQUE(user_id, problem_id)
        );
        """,
        
        # Create indexes for better performance
        "CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);",
        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);",
        "CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);",
        "CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);",
        "CREATE INDEX IF NOT EXISTS idx_solutions_user_id ON solutions(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_solutions_problem_id ON solutions(problem_id);",
        "CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);",
        
        # Enable Row Level Security (RLS)
        "ALTER TABLE users ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE problems ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;",
        
        # Create RLS policies
        """
        CREATE POLICY "Users can view all profiles" ON users
            FOR SELECT USING (true);
        """,
        
        """
        CREATE POLICY "Users can update own profile" ON users
            FOR UPDATE USING (auth.uid()::text = firebase_uid);
        """,
        
        """
        CREATE POLICY "Anyone can view problems" ON problems
            FOR SELECT USING (true);
        """,
        
        """
        CREATE POLICY "Admins can manage problems" ON problems
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE firebase_uid = auth.uid()::text 
                    AND is_admin = true
                )
            );
        """,
        
        """
        CREATE POLICY "Users can view all solutions" ON solutions
            FOR SELECT USING (true);
        """,
        
        """
        CREATE POLICY "Users can insert own solutions" ON solutions
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE firebase_uid = auth.uid()::text 
                    AND id = user_id
                )
            );
        """,
    ]
    
    # Execute SQL commands
    for i, sql in enumerate(sql_commands):
        try:
            print(f"Executing command {i+1}/{len(sql_commands)}...")
            result = supabase.rpc("exec_sql", {"sql": sql}).execute()
            print(f"✅ Command {i+1} executed successfully")
        except Exception as e:
            print(f"❌ Error executing command {i+1}: {e}")
            # Continue with other commands
            continue
    
    print("\n🎉 Database initialization completed!")

def insert_sample_data():
    """Insert sample problems for testing"""
    sample_problems = [
        {
            "title": "Market Entry Strategy for Electric Vehicles",
            "description": "Tesla is considering entering the Indian market. Analyze the market opportunity, competitive landscape, and recommend an entry strategy.",
            "category": "Strategy",
            "domain": "Automotive",
            "difficulty": "Hard",
            "company": "Tesla",
            "tags": ["market-entry", "automotive", "strategy"]
        },
        {
            "title": "Customer Acquisition Cost Optimization",
            "description": "A SaaS startup is spending $200 to acquire each customer but only generating $150 in lifetime value. How would you fix this?",
            "category": "Marketing",
            "domain": "Technology",
            "difficulty": "Medium",
            "company": "Generic SaaS",
            "tags": ["marketing", "saas", "metrics"]
        },
        {
            "title": "Supply Chain Disruption Response",
            "description": "A major supplier to your manufacturing company has gone bankrupt. You need to maintain production while finding alternatives.",
            "category": "Operations",
            "domain": "Manufacturing",
            "difficulty": "Hard",
            "company": "Manufacturing Corp",
            "tags": ["supply-chain", "operations", "crisis-management"]
        }
    ]
    
    try:
        result = supabase.table("problems").insert(sample_problems).execute()
        print(f"✅ Inserted {len(sample_problems)} sample problems")
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")

if __name__ == "__main__":
    print("🚀 Initializing CaseForge Supabase Database...")
    print(f"📊 Database URL: {SUPABASE_URL}")
    print("=" * 50)
    
    create_tables()
    
    # Automatically insert sample data
    print("\n📝 Inserting sample problems...")
    insert_sample_data()
    
    print("\n✨ Setup complete! Your CaseForge database is ready.")