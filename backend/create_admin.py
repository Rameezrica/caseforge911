#!/usr/bin/env python3
"""
Script to create the first admin user for CaseForge
"""
import asyncio
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "rameezuddinmohammed61@gmail.com")

async def create_admin_user():
    """Create the first admin user"""
    if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
        print("❌ Missing Supabase environment variables")
        return False
    
    # Create admin client
    admin_supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    try:
        print("🔐 Creating admin user...")
        
        # Ask for admin password
        admin_password = input(f"Enter password for admin ({ADMIN_EMAIL}): ")
        if len(admin_password) < 6:
            print("❌ Password must be at least 6 characters")
            return False
        
        # Create admin user using admin API
        auth_response = admin_supabase.auth.admin.create_user({
            "email": ADMIN_EMAIL,
            "password": admin_password,
            "user_metadata": {
                "username": "admin",
                "full_name": "Administrator",
                "admin": True
            },
            "email_confirm": True  # Auto-confirm the email
        })
        
        if auth_response.user:
            print(f"✅ Admin user created successfully!")
            print(f"📧 Email: {auth_response.user.email}")
            print(f"🆔 ID: {auth_response.user.id}")
            print("\n🚀 You can now login at /admin/login")
            return True
        else:
            print("❌ Failed to create admin user")
            return False
            
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        
        # If user already exists, that's OK
        if "already been registered" in str(e) or "already exists" in str(e):
            print("ℹ️  Admin user already exists - you can login at /admin/login")
            return True
        
        return False

if __name__ == "__main__":
    print("🔧 CaseForge Admin Setup")
    print("=" * 30)
    
    success = asyncio.run(create_admin_user())
    
    if success:
        print("\n✅ Setup completed successfully!")
    else:
        print("\n❌ Setup failed. Please check your Supabase configuration.")