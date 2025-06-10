
import requests
import sys
import json
from datetime import datetime, timedelta
import os
import uuid
import random

class CaseForgeAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []
        self.admin_token = None
        self.user_token = None
        self.test_user = None
        self.test_password = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False, form_data=None, admin=True):
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
                if form_data:
                    # For form data (like login), don't use JSON
                    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
                    if auth:
                        token = self.admin_token if admin else self.user_token
                        if token:
                            headers['Authorization'] = f'Bearer {token}'
                    response = requests.post(url, data=form_data, headers=headers)
                else:
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
        self.test_password = "TestPassword123!"
        
        user_data = {
            "username": self.test_user,
            "email": f"{self.test_user}@example.com",
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
        if not self.test_user:
            print("❌ Cannot test login: No test user created")
            return False, {}
            
        form_data = {
            "username": self.test_user,
            "password": self.test_password
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/token",
            200,
            form_data=form_data
        )
        
        if success and 'access_token' in response:
            self.user_token = response['access_token']
            print(f"✅ Successfully obtained user token")
            return True, response
        else:
            print(f"❌ Failed to obtain user token")
            return False, response

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

    def test_get_user_progress(self):
        """Test getting user progress"""
        return self.run_test(
            "Get User Progress",
            "GET",
            "user/progress",
            200,
            auth=True,
            admin=False
        )

    def test_admin_login(self, username="Rameezadmin", password="Qwerty9061#"):
        """Test admin login and get token"""
        form_data = {
            "username": username,
            "password": password
        }
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/token",
            200,
            form_data=form_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"✅ Successfully obtained admin token")
            return True
        else:
            print(f"❌ Failed to obtain admin token")
            return False

    def test_get_admin_problems(self):
        """Test getting problems as admin"""
        return self.run_test(
            "Get Admin Problems",
            "GET",
            "admin/problems",
            200,
            auth=True
        )

    def test_create_admin_problem(self):
        """Test creating a problem as admin"""
        problem_data = {
            "title": f"Test Problem {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "description": "This is a test problem created by the API test.",
            "difficulty": "Medium",
            "category": "Test Category",
            "domain": "Test Domain",
            "company": "Test Company",
            "time_limit": 60,
            "sample_framework": "Test Framework"
        }
        
        return self.run_test(
            "Create Admin Problem",
            "POST",
            "admin/problems",
            201,
            data=problem_data,
            auth=True
        )

    def test_update_admin_problem(self, problem_id):
        """Test updating a problem as admin"""
        update_data = {
            "title": f"Updated Test Problem {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "description": "This problem was updated by the API test."
        }
        
        return self.run_test(
            "Update Admin Problem",
            "PUT",
            f"admin/problems/{problem_id}",
            200,
            data=update_data,
            auth=True
        )

    def test_delete_admin_problem(self, problem_id):
        """Test deleting a problem as admin"""
        return self.run_test(
            "Delete Admin Problem",
            "DELETE",
            f"admin/problems/{problem_id}",
            204,
            auth=True
        )

    def test_get_admin_competitions(self):
        """Test getting competitions as admin"""
        return self.run_test(
            "Get Admin Competitions",
            "GET",
            "admin/competitions",
            200,
            auth=True
        )

    def test_create_admin_competition(self):
        """Test creating a competition as admin"""
        # Create dates for the competition
        start_date = (datetime.now() + timedelta(days=1)).isoformat()
        end_date = (datetime.now() + timedelta(days=8)).isoformat()
        
        competition_data = {
            "name": f"Test Competition {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "description": "This is a test competition created by the API test.",
            "start_date": start_date,
            "end_date": end_date,
            "problem_ids": [],
            "is_active": False
        }
        
        return self.run_test(
            "Create Admin Competition",
            "POST",
            "admin/competitions",
            201,
            data=competition_data,
            auth=True
        )

    def test_update_admin_competition(self, competition_id):
        """Test updating a competition as admin"""
        update_data = {
            "name": f"Updated Test Competition {datetime.now().strftime('%Y%m%d%H%M%S')}",
            "description": "This competition was updated by the API test.",
            "is_active": True
        }
        
        return self.run_test(
            "Update Admin Competition",
            "PUT",
            f"admin/competitions/{competition_id}",
            200,
            data=update_data,
            auth=True
        )

    def test_delete_admin_competition(self, competition_id):
        """Test deleting a competition as admin"""
        return self.run_test(
            "Delete Admin Competition",
            "DELETE",
            f"admin/competitions/{competition_id}",
            204,
            auth=True
        )

    def test_get_problems(self):
        """Test getting all problems"""
        return self.run_test(
            "Get All Problems",
            "GET",
            "problems",
            200
        )

    def test_get_problems_with_filters(self):
        """Test getting problems with filters"""
        return self.run_test(
            "Get Problems with Filters",
            "GET",
            "problems?domain=Strategy%20%26%20Consulting&limit=2",
            200
        )

    def test_get_problem_by_id(self, problem_id):
        """Test getting a specific problem by ID"""
        return self.run_test(
            "Get Problem by ID",
            "GET",
            f"problems/{problem_id}",
            200
        )

    def test_get_categories(self):
        """Test getting all categories and domains"""
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
        """Test getting the daily challenge"""
        return self.run_test(
            "Get Daily Challenge",
            "GET",
            "daily-challenge",
            200
        )

    def test_submit_solution(self, problem_id):
        """Test submitting a solution as an authenticated user"""
        return self.run_test(
            "Submit Solution (Authenticated)",
            "POST",
            "solutions",
            200,
            data={
                "problem_id": problem_id,
                "content": "This is a test solution for the CaseForge API test."
            },
            auth=True,
            admin=False
        )

    def test_get_user_solutions(self):
        """Test getting user solutions"""
        return self.run_test(
            "Get User Solutions",
            "GET",
            "user/solutions",
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
        api_url = f"http://localhost{api_url}"
    
    print(f"Testing CaseForge API at: {api_url}")
    tester = CaseForgeAPITester(api_url)
    
    # Test basic health check
    tester.test_health_check()
    
    # Test public endpoints
    print("\n" + "="*50)
    print("🌐 Testing Public Endpoints")
    print("="*50)
    
    success, problems = tester.test_get_problems()
    if success and problems:
        # Get a problem ID for later tests
        problem_id = problems[0]['id']
        tester.test_get_problem_by_id(problem_id)
    
    tester.test_get_categories()
    tester.test_get_stats()
    tester.test_get_daily_challenge()
    
    # Test user authentication flow
    print("\n" + "="*50)
    print("👤 Testing User Authentication Flow")
    print("="*50)
    
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
            tester.test_get_user_progress()
            
            # Test solution submission if we have a problem ID
            if success and problems:
                problem_id = problems[0]['id']
                tester.test_submit_solution(problem_id)
                tester.test_get_user_solutions()
        else:
            print("❌ User login failed")
    else:
        print("❌ User registration failed")
    
    # Test admin authentication and functionality
    print("\n" + "="*50)
    print("🔐 Testing Admin Authentication and Functionality")
    print("="*50)
    
    # Login as admin
    if tester.test_admin_login("Rameezadmin", "Qwerty9061#"):
        print("✅ Admin login successful")
        
        # Test admin problems endpoints
        success, admin_problems = tester.test_get_admin_problems()
        if success:
            print("✅ Admin problems endpoint accessible")
            
            # Test creating a new problem
            success, new_problem = tester.test_create_admin_problem()
            if success and 'id' in new_problem:
                problem_id = new_problem['id']
                print(f"✅ Created new problem with ID: {problem_id}")
                
                # Test updating the problem
                tester.test_update_admin_problem(problem_id)
                
                # Test deleting the problem
                tester.test_delete_admin_problem(problem_id)
            
        # Test admin competitions endpoints
        success, admin_competitions = tester.test_get_admin_competitions()
        if success:
            print("✅ Admin competitions endpoint accessible")
            
            # Test creating a new competition
            success, new_competition = tester.test_create_admin_competition()
            if success and 'id' in new_competition:
                competition_id = new_competition['id']
                print(f"✅ Created new competition with ID: {competition_id}")
                
                # Test updating the competition
                tester.test_update_admin_competition(competition_id)
                
                # Test deleting the competition
                tester.test_delete_admin_competition(competition_id)
    else:
        print("❌ Admin login failed")
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
