
import requests
import sys
import json
from datetime import datetime, timedelta
import os
import uuid
import random

class CaseForgeAuthTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []
        self.admin_token = None
        self.user_token = None
        self.test_user = None
        self.test_password = None
        self.test_email = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False, admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth:
            token = self.admin_token if admin else self.user_token
            if token:
                headers['Authorization'] = f'Bearer {token}'
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)[:500]}...")
                except:
                    print(f"Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")

            self.results.append({
                "name": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "url": url
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "name": name,
                "success": False,
                "error": str(e),
                "url": url
            })
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )

    def test_user_registration(self):
        """Test user registration"""
        # Generate a unique username and email
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_suffix = str(random.randint(1000, 9999))
        self.test_user = f"testuser_{timestamp}_{random_suffix}"
        self.test_email = f"testuser_{timestamp}_{random_suffix}@gmail.com"
        self.test_password = "TestPassword123!"
        
        user_data = {
            "username": self.test_user,
            "email": self.test_email,
            "password": self.test_password,
            "full_name": "Test User"
        }
        
        return self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=user_data
        )

    def test_user_login(self):
        """Test user login and get token"""
        if not self.test_email:
            print("❌ Cannot test login: No test user created")
            return False, {}
            
        login_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/token",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.user_token = response['access_token']
            print(f"✅ Successfully obtained user token")
            return True, response
        else:
            print(f"❌ Failed to obtain user token")
            return False, response

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "WrongPassword123!"
        }
        
        return self.run_test(
            "Invalid Login",
            "POST",
            "auth/token",
            401,
            data=login_data
        )

    def test_get_current_user(self):
        """Test getting current user profile"""
        return self.run_test(
            "Get Current User Profile",
            "GET",
            "auth/me",
            200,
            auth=True,
            admin=False
        )

    def test_unauthorized_access(self):
        """Test accessing protected route without auth"""
        return self.run_test(
            "Unauthorized Access",
            "GET",
            "auth/me",
            401
        )

    def test_admin_login(self):
        """Test admin login and get token"""
        login_data = {
            "email": "admin@caseforge.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/admin/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"✅ Successfully obtained admin token")
            return True, response
        else:
            print(f"❌ Failed to obtain admin token")
            return False, response

    def test_admin_dashboard(self):
        """Test accessing admin dashboard"""
        return self.run_test(
            "Admin Dashboard Access",
            "GET",
            "admin/dashboard",
            200,
            auth=True,
            admin=True
        )

    def test_admin_users(self):
        """Test accessing admin users list"""
        return self.run_test(
            "Admin Users List",
            "GET",
            "admin/users",
            200,
            auth=True,
            admin=True
        )

    def test_user_accessing_admin(self):
        """Test regular user trying to access admin route"""
        return self.run_test(
            "User Accessing Admin Route",
            "GET",
            "admin/dashboard",
            403,
            auth=True,
            admin=False
        )

    def test_logout(self):
        """Test user logout"""
        return self.run_test(
            "User Logout",
            "POST",
            "auth/logout",
            200,
            auth=True,
            admin=False
        )

    def print_summary(self):
        """Print a summary of the test results"""
        print("\n" + "="*50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*50)
        
        if self.tests_passed == self.tests_run:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed:")
            for result in self.results:
                if not result.get("success"):
                    print(f"  - {result['name']}")
        
        return self.tests_passed == self.tests_run

def main():
    # Use the API URL from environment or default to http://localhost:8001/api
    api_url = os.getenv("VITE_API_BASE_URL", "/api")
    
    # Ensure the URL has a scheme
    if not api_url.startswith(('http://', 'https://')):
        api_url = f"http://localhost:8001{api_url}"
    
    print(f"Testing CaseForge Authentication API at: {api_url}")
    tester = CaseForgeAuthTester(api_url)
    
    # Test basic health check
    tester.test_health_check()
    
    # Test user authentication flow
    print("\n" + "="*50)
    print("👤 Testing User Authentication Flow")
    print("="*50)
    
    # Test invalid login
    tester.test_invalid_login()
    
    # Test unauthorized access
    tester.test_unauthorized_access()
    
    # Register a new user
    success, _ = tester.test_user_registration()
    if success:
        print("✅ User registration successful")
        
        # Login with the new user
        login_success, _ = tester.test_user_login()
        if login_success:
            print("✅ User login successful")
            
            # Test protected user endpoints
            tester.test_get_current_user()
            
            # Test user trying to access admin route
            tester.test_user_accessing_admin()
            
            # Test logout
            tester.test_logout()
        else:
            print("❌ User login failed")
    else:
        print("❌ User registration failed")
    
    # Test admin authentication and functionality
    print("\n" + "="*50)
    print("🔐 Testing Admin Authentication and Functionality")
    print("="*50)
    
    # Login as admin
    admin_success, _ = tester.test_admin_login()
    if admin_success:
        print("✅ Admin login successful")
        
        # Test admin dashboard access
        tester.test_admin_dashboard()
        
        # Test admin users list
        tester.test_admin_users()
    else:
        print("❌ Admin login failed")
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
