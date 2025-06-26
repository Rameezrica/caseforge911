#!/usr/bin/env python3
"""
Setup authentication for CaseForge
- Creates admin user in Firebase
- Creates test users
- Verifies authentication setup
"""

import requests
import json
import time

# Firebase configuration (hardcoded)
FIREBASE_API_KEY = "AIzaSyDjJTOdsvjaa90z53RYkFB-wVyzPz-9sG4"
ADMIN_EMAIL = "rameezuddinmohammed61@gmail.com"
ADMIN_PASSWORD = "admin123"  # Change this to a secure password

def create_firebase_user(email, password, display_name=None):
    """Create a user in Firebase Auth"""
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
    
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    
    if display_name:
        payload["displayName"] = display_name
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Created Firebase user: {email}")
            return data
        else:
            error_data = response.json()
            error_message = error_data.get('error', {}).get('message', 'Unknown error')
            print(f"❌ Failed to create Firebase user {email}: {error_message}")
            return None
    except Exception as e:
        print(f"❌ Error creating Firebase user {email}: {e}")
        return None

def sign_in_firebase_user(email, password):
    """Sign in a user to Firebase Auth"""
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Successfully signed in: {email}")
            return data
        else:
            error_data = response.json()
            error_message = error_data.get('error', {}).get('message', 'Unknown error')
            print(f"❌ Failed to sign in {email}: {error_message}")
            return None
    except Exception as e:
        print(f"❌ Error signing in {email}: {e}")
        return None

def test_backend_auth(id_token):
    """Test backend authentication with Firebase ID token"""
    try:
        response = requests.get(
            "http://localhost:8001/api/auth/me",
            headers={"Authorization": f"Bearer {id_token}"}
        )
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Backend authentication successful: {user_data.get('email')}")
            return user_data
        else:
            print(f"❌ Backend authentication failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error testing backend auth: {e}")
        return None

def main():
    print("🚀 Setting up CaseForge Authentication")
    print("=" * 50)
    
    # 1. Create admin user
    print("\n1. Creating Admin User...")
    admin_data = create_firebase_user(ADMIN_EMAIL, ADMIN_PASSWORD, "Admin User")
    
    if not admin_data:
        # Try to sign in if user already exists
        print("Admin user might already exist, trying to sign in...")
        admin_data = sign_in_firebase_user(ADMIN_EMAIL, ADMIN_PASSWORD)
    
    if admin_data:
        # Test admin authentication with backend
        print("\n2. Testing Admin Authentication with Backend...")
        admin_profile = test_backend_auth(admin_data.get('idToken'))
        
        if admin_profile:
            print(f"✅ Admin user setup complete - is_admin: {admin_profile.get('is_admin')}")
        else:
            print("❌ Admin backend authentication failed")
    
    # 3. Create test users
    print("\n3. Creating Test Users...")
    test_users = [
        ("user1@test.com", "test123", "Test User 1"),
        ("user2@test.com", "test123", "Test User 2"),
    ]
    
    for email, password, display_name in test_users:
        user_data = create_firebase_user(email, password, display_name)
        if user_data:
            # Test user authentication
            user_profile = test_backend_auth(user_data.get('idToken'))
            if user_profile:
                print(f"✅ Test user setup complete: {email}")
    
    print("\n4. Testing Sign-in for existing users...")
    
    # Test admin sign in
    admin_signin = sign_in_firebase_user(ADMIN_EMAIL, ADMIN_PASSWORD)
    if admin_signin:
        print("✅ Admin sign-in test successful")
    
    # Test regular user sign in
    user_signin = sign_in_firebase_user("user1@test.com", "test123")
    if user_signin:
        print("✅ User sign-in test successful")
    
    print("\n" + "=" * 50)
    print("🎉 Authentication setup complete!")
    print("\nCredentials for testing:")
    print(f"Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    print("User: user1@test.com / test123")
    print("User: user2@test.com / test123")

if __name__ == "__main__":
    main()