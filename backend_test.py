
import requests
import sys
import json
from datetime import datetime
import os
import urllib.parse

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

    def test_get_domains(self):
        """Test getting all domains"""
        return self.run_test(
            "Get All Domains",
            "GET",
            "domains",
            200
        )

    def test_get_domain_stats(self, domain):
        """Test getting domain statistics"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get Domain Stats for {domain}",
            "GET",
            f"domains/{encoded_domain}/stats",
            200
        )

    def test_get_domain_leaderboard(self, domain):
        """Test getting domain leaderboard"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get Domain Leaderboard for {domain}",
            "GET",
            f"domains/{encoded_domain}/leaderboard",
            200
        )

    def test_get_domain_learning_paths(self, domain):
        """Test getting domain learning paths"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get Domain Learning Paths for {domain}",
            "GET",
            f"domains/{encoded_domain}/learning-paths",
            200
        )

    def test_get_domain_discussions(self, domain):
        """Test getting domain discussions"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get Domain Discussions for {domain}",
            "GET",
            f"domains/{encoded_domain}/discussions",
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

    def test_get_problems_with_domain_filter(self, domain):
        """Test getting problems with domain filter"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get Problems for Domain {domain}",
            "GET",
            f"problems?domain={encoded_domain}&limit=5",
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

    def test_get_domain_daily_challenge(self, domain):
        """Test getting domain-specific daily challenge"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get Daily Challenge for Domain {domain}",
            "GET",
            f"daily-challenge/{encoded_domain}",
            200
        )

    def test_set_user_preferences(self, user_id, domain):
        """Test setting user domain preferences"""
        return self.run_test(
            "Set User Domain Preferences",
            "POST",
            f"users/{user_id}/preferences",
            200,
            data={
                "preferred_domain": domain,
                "difficulty_preference": "Medium",
                "notification_settings": {
                    "daily_challenge": True,
                    "new_problems": True
                }
            }
        )

    def test_get_user_domain_progress(self, user_id, domain):
        """Test getting user domain progress"""
        encoded_domain = urllib.parse.quote(domain)
        return self.run_test(
            f"Get User Progress for Domain {domain}",
            "GET",
            f"users/{user_id}/domain-progress/{encoded_domain}",
            200
        )

    def test_submit_solution(self, problem_id, domain):
        """Test submitting a solution"""
        return self.run_test(
            "Submit Solution",
            "POST",
            "solutions",
            200,
            data={
                "problem_id": problem_id,
                "content": f"This is a test solution for the {domain} domain.",
                "user_id": "test_user",
                "score": 85,
                "time_taken": 45
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
    if not api_url.endswith('/api'):
        api_url = f"{api_url}/api"
    
    # Print environment variables for debugging
    print("Environment Variables:")
    print(f"VITE_API_BASE_URL: {os.environ.get('VITE_API_BASE_URL')}")
    
    print(f"Testing CaseForge API at: {api_url}")
    tester = CaseForgeAPITester(api_url)
    
    # Run basic health check
    tester.test_health_check()
    
    # Test domain-related endpoints
    success, domains_data = tester.test_get_domains()
    
    # Select a test domain for further tests
    test_domain = None
    if success and domains_data:
        if len(domains_data) > 0:
            test_domain = domains_data[0].get('name')
    
    if test_domain:
        print(f"\n🔍 Using test domain: {test_domain}")
        
        # Test domain-specific endpoints
        tester.test_get_domain_stats(test_domain)
        tester.test_get_domain_leaderboard(test_domain)
        tester.test_get_domain_learning_paths(test_domain)
        tester.test_get_domain_discussions(test_domain)
        tester.test_get_problems_with_domain_filter(test_domain)
        tester.test_get_domain_daily_challenge(test_domain)
        
        # Test user domain preferences and progress
        test_user_id = "test_user_1"
        tester.test_set_user_preferences(test_user_id, test_domain)
        tester.test_get_user_domain_progress(test_user_id, test_domain)
    else:
        print("❌ Could not get a domain for further tests")
    
    # Test problem-related endpoints
    success, problems_data = tester.test_get_problems()
    
    # Get a problem ID for further tests
    problem_id = None
    if success and problems_data:
        if isinstance(problems_data, list) and len(problems_data) > 0:
            problem_id = problems_data[0].get('id')
    
    if problem_id:
        tester.test_get_problem_by_id(problem_id)
        if test_domain:
            tester.test_submit_solution(problem_id, test_domain)
    else:
        print("❌ Could not get a problem ID for further tests")
    
    # Test other general endpoints
    tester.test_get_categories()
    tester.test_get_stats()
    tester.test_get_daily_challenge()
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
