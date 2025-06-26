#!/usr/bin/env python3
"""Test admin authentication"""

import requests
import json

FIREBASE_API_KEY = "AIzaSyDjJTOdsvjaa90z53RYkFB-wVyzPz-9sG4"
ADMIN_EMAIL = "rameezuddinmohammed61@gmail.com"
ADMIN_PASSWORD = "Qwerty9061#"

def test_admin_auth():
    """Test admin authentication"""
    print("🔐 Testing Admin Authentication")
    print("=" * 40)
    
    # Try to sign in
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    
    payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "returnSecureToken": True
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Admin Firebase authentication successful!")
            
            # Test backend authentication
            backend_response = requests.get(
                "http://localhost:8001/api/auth/me",
                headers={"Authorization": f"Bearer {data['idToken']}"}
            )
            
            if backend_response.status_code == 200:
                admin_data = backend_response.json()
                print(f"✅ Backend authentication successful!")
                print(f"📧 Email: {admin_data.get('email')}")
                print(f"👑 Is Admin: {admin_data.get('is_admin')}")
                print(f"🆔 ID: {admin_data.get('id')}")
                
                # Test admin dashboard access
                dashboard_response = requests.get(
                    "http://localhost:8001/api/admin/dashboard",
                    headers={"Authorization": f"Bearer {data['idToken']}"}
                )
                
                if dashboard_response.status_code == 200:
                    dashboard_data = dashboard_response.json()
                    print(f"✅ Admin dashboard access successful!")
                    print(f"📊 Total Problems: {dashboard_data.get('total_problems')}")
                    print(f"👥 Total Users: {dashboard_data.get('total_users')}")
                else:
                    print(f"❌ Admin dashboard access failed: {dashboard_response.status_code}")
                
                return True
            else:
                print(f"❌ Backend authentication failed: {backend_response.status_code}")
                print(f"Response: {backend_response.text}")
        else:
            error_data = response.json()
            error_message = error_data.get('error', {}).get('message', 'Unknown error')
            print(f"❌ Admin Firebase authentication failed: {error_message}")
    
    except Exception as e:
        print(f"❌ Error testing admin auth: {e}")
    
    return False

if __name__ == "__main__":
    success = test_admin_auth()
    if success:
        print(f"\n🎉 Admin authentication is working!")
        print(f"📝 Use these credentials:")
        print(f"   Email: {ADMIN_EMAIL}")
        print(f"   Password: {ADMIN_PASSWORD}")
    else:
        print(f"\n💥 Admin authentication failed!")