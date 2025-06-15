
import requests
import sys
import json
from datetime import datetime, timedelta
import os
import uuid
import random

class CaseForgeBackendTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []
        self.firebase_token = None
        self.test_user = None
        self.test_password = None
        self.test_email = None
        self.test_problem_id = None
        
        # Admin credentials
        self.admin_email = os.getenv("ADMIN_EMAIL", "rameezuddinmohammed61@gmail.com")
        self.admin_password = None  # Will need to be provided

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False, admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.firebase_token:
            headers['Authorization'] = f'Bearer {self.firebase_token}'
        
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

    # ===== FIREBASE SPECIFIC TESTS =====
    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        
        if success:
            print(f"✅ Health check successful: {response}")
            return True, response
        else:
            print("❌ Health check failed")
            return False, response
            
    def test_firebase_config(self):
        """Test getting Firebase configuration"""
        return self.run_test(
            "Firebase Config",
            "GET",
            "firebase/config",
            200
        )
        
    def test_protected_route_without_auth(self):
        """Test accessing protected route without auth"""
        return self.run_test(
            "Protected Route Without Auth",
            "GET",
            "auth/me",
            401
        )
        
    # ===== PROBLEMS AND PUBLIC ENDPOINTS =====
    def test_get_all_problems(self):
        """Test getting all problems"""
        return self.run_test(
            "Get All Problems",
            "GET",
            "problems",
            200
        )

    def test_get_categories(self):
        """Test getting categories"""
        return self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )
        
    def test_get_stats(self):
        """Test getting platform statistics"""
        return self.run_test(
            "Get Platform Stats",
            "GET",
            "stats",
            200
        )
        
    def test_get_daily_challenge(self):
        """Test getting daily challenge"""
        return self.run_test(
            "Get Daily Challenge",
            "GET",
            "daily-challenge",
            200
        )
        
    # Note: The following tests would require actual Firebase authentication
    # which we can't do in this test script without Firebase SDK
    # These would be better tested through UI testing with Playwright
    
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
    api_url = os.getenv("REACT_APP_BACKEND_URL", "http://localhost:8001") + "/api"
    
    print(f"Testing CaseForge Backend API at: {api_url}")
    tester = CaseForgeBackendTester(api_url)
    
    # ===== FIREBASE AUTHENTICATION TESTS =====
    print("\n" + "="*50)
    print("🔥 Testing Firebase Authentication Integration")
    print("="*50)
    
    # Test health check for Firebase auth
    tester.test_health_check_firebase()
    
    # Test Firebase config endpoint
    tester.test_firebase_config()
    
    # Test protected route without auth
    tester.test_protected_route_without_auth()
    
    # Test Firebase user registration
    success, _ = tester.test_firebase_register()
    if success:
        print("✅ Firebase user registration successful")
    else:
        print("❌ Firebase user registration failed")
    
    # Test fallback authentication
    fallback_success, _ = tester.test_fallback_auth()
    if fallback_success:
        print("✅ Fallback authentication successful")
        
        # Test protected user endpoints with fallback auth
        tester.test_get_current_user()
    else:
        print("❌ Fallback authentication failed")
    
    # ===== REGULAR AUTHENTICATION SYSTEM TESTS =====
    print("\n" + "="*50)
    print("👤 Testing Regular Authentication System")
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
            
            # ===== USER MANAGEMENT TESTS =====
            print("\n" + "="*50)
            print("👤 Testing User Management")
            print("="*50)
            
            # Test user progress
            tester.test_user_progress()
            
            # Test user solutions
            tester.test_user_solutions()
            
            # ===== PROBLEMS AND PUBLIC ENDPOINTS TESTS =====
            print("\n" + "="*50)
            print("📚 Testing Problems and Public Endpoints")
            print("="*50)
            
            # Test getting all problems
            tester.test_get_all_problems()
            
            # Test getting a specific problem
            tester.test_get_specific_problem()
            
            # Test getting categories
            tester.test_get_categories()
            
            # Test submitting a solution
            tester.test_submit_solution()
            
            # Test logout
            tester.test_logout()
        else:
            print("❌ User login failed")
    else:
        print("❌ User registration failed")
    
    # ===== ADMIN FUNCTIONALITY TESTS =====
    print("\n" + "="*50)
    print("🔐 Testing Admin Functionality")
    print("="*50)
    
    # Login as admin
    admin_success, _ = tester.test_admin_login()
    if admin_success:
        print("✅ Admin login successful")
        
        # Test admin dashboard access
        tester.test_admin_dashboard()
        
        # Test admin users list
        tester.test_admin_users()
        
        # Test admin problems list
        tester.test_admin_problems()
        
        # Test admin problem management
        tester.test_admin_create_problem()
        tester.test_admin_update_problem()
        tester.test_admin_delete_problem()
    else:
        print("❌ Admin login failed")
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
