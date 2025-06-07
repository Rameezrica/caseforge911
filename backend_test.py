
import requests
import sys
import json
from datetime import datetime
import os

class CaseForgeAPITester:
    def __init__(self, base_url="http://localhost:8001/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

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
    # Get the API URL from environment or use default
    api_url = os.environ.get("VITE_API_BASE_URL", "http://localhost:8001/api")
    # Make sure the URL doesn't have a double /api suffix
    if api_url.endswith('/api'):
        api_url = api_url
    else:
        api_url = f"{api_url}/api"
    
    # Print environment variables for debugging
    print("Environment Variables:")
    print(f"VITE_API_BASE_URL: {os.environ.get('VITE_API_BASE_URL')}")
    
    print(f"Testing CaseForge API at: {api_url}")
    tester = CaseForgeAPITester(api_url)
    
    # Run the tests
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
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
