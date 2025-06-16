
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
        self.admin_password = os.getenv("ADMIN_PASSWORD", "Qwerty9061#")

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
        success, response = self.run_test(
            "Get All Problems",
            "GET",
            "problems",
            200
        )
        
        if success and isinstance(response, list):
            # Store a problem ID for later tests if available
            if len(response) > 0:
                self.test_problem_id = response[0].get('id')
                print(f"✅ Found problem ID for testing: {self.test_problem_id}")
        
        return success, response

    def test_get_problem_by_id(self):
        """Test getting a specific problem by ID"""
        if not self.test_problem_id:
            print("⚠️ No problem ID available for testing")
            return False, {}
            
        return self.run_test(
            "Get Problem by ID",
            "GET",
            f"problems/{self.test_problem_id}",
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
        
    # ===== ADMIN ENDPOINTS =====
    def test_admin_dashboard(self):
        """Test getting admin dashboard data"""
        if not self.firebase_token:
            print("⚠️ No Firebase token available for admin testing")
            return False, {}
            
        return self.run_test(
            "Admin Dashboard",
            "GET",
            "admin/dashboard",
            200,
            auth=True
        )
        
    def test_admin_problems(self):
        """Test getting admin problems"""
        if not self.firebase_token:
            print("⚠️ No Firebase token available for admin testing")
            return False, {}
            
        return self.run_test(
            "Admin Problems",
            "GET",
            "admin/problems",
            200,
            auth=True
        )
        
    def test_create_problem(self):
        """Test creating a new problem"""
        if not self.firebase_token:
            print("⚠️ No Firebase token available for admin testing")
            return False, {}
            
        problem_data = {
            "title": f"Test Problem {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "description": "This is a test problem created by the automated test script",
            "category": "Marketing",
            "domain": "Technology",
            "difficulty": "Medium",
            "company": "TestCorp",
            "tags": ["test", "automation"]
        }
        
        return self.run_test(
            "Create Problem",
            "POST",
            "admin/problems",
            200,
            data=problem_data,
            auth=True
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
    # Use the API URL from environment or default to http://localhost:3001/api
    api_url = os.getenv("VITE_API_BASE_URL", "/api")
    
    print(f"Testing CaseForge Backend API at: {api_url}")
    tester = CaseForgeBackendTester(api_url)
    
    # ===== BASIC API TESTS =====
    print("\n" + "="*50)
    print("🔍 Testing Basic API Functionality")
    print("="*50)
    
    # Test health check
    tester.test_health_check()
    
    # Test Firebase config endpoint
    tester.test_firebase_config()
    
    # Test protected route without auth
    tester.test_protected_route_without_auth()
    
    # ===== PUBLIC ENDPOINTS TESTS =====
    print("\n" + "="*50)
    print("📚 Testing Public Endpoints")
    print("="*50)
    
    # Test getting all problems
    tester.test_get_all_problems()
    
    # Test getting a specific problem by ID
    if tester.test_problem_id:
        tester.test_get_problem_by_id()
    
    # Test getting categories
    tester.test_get_categories()
    
    # Test getting platform stats
    tester.test_get_stats()
    
    # Test getting daily challenge
    tester.test_get_daily_challenge()
    
    # Print summary
    success = tester.print_summary()
    
    print("\n" + "="*50)
    print("🔐 Note on Firebase Authentication Testing")
    print("="*50)
    print("Firebase authentication requires client-side integration and cannot be fully tested with this script.")
    print("Please use the Playwright UI tests to verify the complete authentication flow.")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
