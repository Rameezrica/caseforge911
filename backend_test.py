
import requests
import sys
import json
from datetime import datetime, timedelta
import os

class CaseForgeAPITester:
    def __init__(self, base_url="/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []
        self.admin_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False, form_data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'
        
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
                    if auth and self.admin_token:
                        headers['Authorization'] = f'Bearer {self.admin_token}'
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
                "expected_status": expected_status
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "name": name,
                "success": False,
                "error": str(e)
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

    def test_admin_login(self, username="admin", password="adminpassword"):
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
        """Test submitting a solution"""
        return self.run_test(
            "Submit Solution",
            "POST",
            "solutions",
            200,
            data={
                "problem_id": problem_id,
                "content": "This is a test solution for the CaseForge API test.",
                "user_id": "test_user"
            }
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
    api_url = "http://localhost:8001/api"
    
    print(f"Testing CaseForge API at: {api_url}")
    tester = CaseForgeAPITester(api_url)
    
    # Run basic API tests
    tester.test_health_check()
    success, problems_data = tester.test_get_problems()
    
    # Get a problem ID for further tests
    problem_id = None
    if success and problems_data:
        if isinstance(problems_data, list) and len(problems_data) > 0:
            problem_id = problems_data[0].get('id')
    
    if problem_id:
        tester.test_get_problem_by_id(problem_id)
        tester.test_submit_solution(problem_id)
    else:
        print("❌ Could not get a problem ID for further tests")
    
    tester.test_get_problems_with_filters()
    tester.test_get_categories()
    tester.test_get_stats()
    tester.test_get_daily_challenge()
    
    # Run admin API tests
    print("\n" + "="*50)
    print("🔐 Testing Admin API Endpoints")
    print("="*50)
    
    # Login as admin
    if tester.test_admin_login():
        # Test admin problems endpoints
        success, admin_problems = tester.test_get_admin_problems()
        
        # Create a new problem
        success, new_problem = tester.test_create_admin_problem()
        if success and 'id' in new_problem:
            new_problem_id = new_problem['id']
            # Update the problem
            tester.test_update_admin_problem(new_problem_id)
            # Delete the problem
            tester.test_delete_admin_problem(new_problem_id)
        
        # Test admin competitions endpoints
        success, admin_competitions = tester.test_get_admin_competitions()
        
        # Create a new competition
        success, new_competition = tester.test_create_admin_competition()
        if success and 'id' in new_competition:
            new_competition_id = new_competition['id']
            # Update the competition
            tester.test_update_admin_competition(new_competition_id)
            # Delete the competition
            tester.test_delete_admin_competition(new_competition_id)
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
