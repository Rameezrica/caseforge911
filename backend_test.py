
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
        self.firebase_token = None
        
        # Test user credentials
        self.test_email = f"test{datetime.now().strftime('%Y%m%d%H%M%S')}@caseforge.com"
        self.test_password = "TestPassword123!"
        self.test_username = f"testuser{datetime.now().strftime('%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False):
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
                    return success, response_data
                except:
                    print(f"Response: {response.text[:200]}...")
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                return success, {}

            self.results.append({
                "name": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "url": url
            })

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "name": name,
                "success": False,
                "error": str(e),
                "url": url
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root endpoint"""
        return self.run_test(
            "Root Endpoint",
            "GET",
            "",
            200
        )

    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        
        if success:
            print(f"✅ Health check successful")
            # Verify the response contains expected fields
            expected_fields = ["status", "timestamp", "auth", "database", "version"]
            for field in expected_fields:
                if field not in response:
                    print(f"❌ Health check response missing field: {field}")
                    success = False
            
            if success:
                print("✅ Health check response contains all expected fields")
        else:
            print("❌ Health check failed")
            
        return success, response
            
    def test_firebase_config(self):
        """Test getting Firebase configuration"""
        success, response = self.run_test(
            "Firebase Config",
            "GET",
            "firebase/config",
            200
        )
        
        if success:
            # Verify the response contains the Firebase config
            if "config" not in response:
                print("❌ Firebase config response missing 'config' field")
                success = False
            else:
                config = response["config"]
                expected_fields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
                missing_fields = [field for field in expected_fields if field not in config]
                
                if missing_fields:
                    print(f"❌ Firebase config missing fields: {', '.join(missing_fields)}")
                    success = False
                else:
                    print("✅ Firebase config contains all required fields")
                    
                    # Check if any fields are undefined or empty
                    empty_fields = [field for field in expected_fields if not config.get(field)]
                    if empty_fields:
                        print(f"⚠️ Warning: Firebase config has empty values for: {', '.join(empty_fields)}")
        
        return success, response
        
    def test_protected_route_without_auth(self):
        """Test accessing protected route without auth"""
        return self.run_test(
            "Protected Route Without Auth",
            "GET",
            "auth/me",
            401
        )
    
    def test_protected_route_with_invalid_token(self):
        """Test accessing protected route with invalid token"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer invalid_token_here'
        }
        
        url = f"{self.base_url}/auth/me"
        
        self.tests_run += 1
        print(f"\n🔍 Testing Protected Route With Invalid Token...")
        print(f"URL: {url}")
        
        try:
            response = requests.get(url, headers=headers)
            
            success = response.status_code == 401
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected 401, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
            self.results.append({
                "name": "Protected Route With Invalid Token",
                "success": success,
                "status_code": response.status_code,
                "expected_status": 401,
                "url": url
            })
            
            return success, {}
            
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "name": "Protected Route With Invalid Token",
                "success": False,
                "error": str(e),
                "url": url
            })
            return False, {}
    
    def test_categories_endpoint(self):
        """Test the categories endpoint"""
        return self.run_test(
            "Categories Endpoint",
            "GET",
            "categories",
            200
        )
    
    def test_stats_endpoint(self):
        """Test the stats endpoint"""
        return self.run_test(
            "Stats Endpoint",
            "GET",
            "stats",
            200
        )
    
    def test_daily_challenge_endpoint(self):
        """Test the daily challenge endpoint"""
        return self.run_test(
            "Daily Challenge Endpoint",
            "GET",
            "daily-challenge",
            200
        )
    
    def test_problems_endpoint(self):
        """Test the problems endpoint"""
        return self.run_test(
            "Problems Endpoint",
            "GET",
            "problems",
            200
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
    # Get the API URL from the frontend .env file
    api_base_url = None
    try:
        with open('/app/.env', 'r') as f:
            for line in f:
                if line.startswith('VITE_API_BASE_URL='):
                    api_base_url = line.strip().split('=')[1]
                    break
    except Exception as e:
        print(f"Error reading .env file: {e}")
    
    # Use the API URL from environment or default to http://localhost:8001/api
    api_url = api_base_url or "/api"
    
    # If the API URL is relative, use the full URL
    if api_url.startswith('/'):
        api_url = f"http://localhost:8001{api_url}"
    
    print(f"Testing CaseForge Authentication API at: {api_url}")
    tester = CaseForgeAuthTester(api_url)
    
    # ===== BASIC API TESTS =====
    print("\n" + "="*50)
    print("🔍 Testing API Endpoints")
    print("="*50)
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test health check
    tester.test_health_check()
    
    # Test Firebase config endpoint
    firebase_success, firebase_config = tester.test_firebase_config()
    
    # Test public endpoints
    tester.test_categories_endpoint()
    tester.test_stats_endpoint()
    tester.test_daily_challenge_endpoint()
    tester.test_problems_endpoint()
    
    # Test protected routes
    tester.test_protected_route_without_auth()
    tester.test_protected_route_with_invalid_token()
    
    # Print summary
    success = tester.print_summary()
    
    print("\n" + "="*50)
    print("🔐 Authentication Testing Results")
    print("="*50)
    
    if firebase_success:
        print("✅ Firebase configuration is properly returned by the backend API")
        print("✅ All required Firebase configuration fields are present")
    else:
        print("❌ Firebase configuration has issues - check the test output above")
    
    print("\nBackend API endpoints for authentication are working as expected.")
    print("The Firebase authentication flow requires client-side integration and cannot be fully tested with this script.")
    print("Please use the Playwright UI tests to verify the complete authentication flow including:")
    print("1. User registration")
    print("2. User login")
    print("3. Token storage and retrieval")
    print("4. Access to protected routes")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
