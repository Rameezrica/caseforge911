#!/usr/bin/env python3
"""
Script to create admin user in Firebase Authentication
"""
import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth

# Load environment variables
load_dotenv()

def create_admin_user():
    """Create admin user in Firebase Authentication"""
    try:
        # Initialize Firebase Admin SDK
        service_account_key = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        if not service_account_key:
            print("❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in environment")
            return False
        
        # Parse the service account key
        service_account_info = json.loads(service_account_key)
        
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            cred = credentials.Certificate(service_account_info)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialized")
        
        # Admin credentials
        admin_email = os.getenv("ADMIN_EMAIL", "rameezuddinmohammed61@gmail.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "Qwerty9061#")
        
        print(f"Creating admin user: {admin_email}")
        
        # Check if user already exists
        try:
            existing_user = auth.get_user_by_email(admin_email)
            print(f"✅ Admin user already exists: {existing_user.uid}")
            
            # Update the user's password
            auth.update_user(
                existing_user.uid,
                password=admin_password,
                display_name="CaseForge Admin",
                email_verified=True
            )
            print("✅ Admin user password updated")
            return True
            
        except auth.UserNotFoundError:
            # Create new admin user
            user = auth.create_user(
                email=admin_email,
                password=admin_password,
                display_name="CaseForge Admin",
                email_verified=True
            )
            print(f"✅ Admin user created successfully: {user.uid}")
            return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return False

if __name__ == "__main__":
    success = create_admin_user()
    if success:
        print("\n🎉 Admin user setup completed!")
        print("📧 Email: rameezuddinmohammed61@gmail.com")
        print("🔑 Password: Qwerty9061#")
    else:
        print("\n💥 Admin user setup failed!")