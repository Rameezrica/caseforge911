#!/usr/bin/env python3
"""
Script to confirm email for test users
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def confirm_user_email(email: str):
    """Confirm user email"""
    if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
        print("❌ Missing Supabase environment variables")
        return False
    
    # Create admin client
    admin_supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    try:
        # Get user by email
        users_response = admin_supabase.auth.admin.list_users()
        
        # Handle both list and object responses
        if hasattr(users_response, 'users'):
            users = users_response.users or []
        elif isinstance(users_response, list):
            users = users_response
        else:
            users = []
        
        user = None
        for u in users:
            if u.email == email:
                user = u
                break
        
        if not user:
            print(f"❌ User with email {email} not found")
            return False
        
        # Update user to confirm email
        updated_user = admin_supabase.auth.admin.update_user_by_id(
            user.id,
            {"email_confirm": True}
        )
        
        print(f"✅ Email confirmed for user: {email}")
        return True
        
    except Exception as e:
        print(f"❌ Error confirming email: {str(e)}")
        return False

if __name__ == "__main__":
    email = "testuser@gmail.com"
    confirm_user_email(email)