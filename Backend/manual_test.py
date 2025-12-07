"""
Manual testing script for Velocity API

This script demonstrates how to manually test the API endpoints.
Make sure PostgreSQL is running and the server is started with:
    uvicorn app.main:app --reload

Then run this script: python manual_test.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(title, response):
    """Pretty print response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def main():
    print("🚀 Velocity API Manual Testing")
    
    # Test 1: Health Check
    response = requests.get(f"{BASE_URL}/health")
    print_response("1. Health Check", response)
    
    # Test 2: Register Owner
    owner_data = {
        "email": "testowner@example.com",
        "password": "password123",
        "full_name": "Test Owner",
        "phone": "1234567890",
        "role": "owner"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=owner_data)
    print_response("2. Register Owner", response)
    
    # Test 3: Register Renter
    renter_data = {
        "email": "testrenter@example.com",
        "password": "password123",
        "full_name": "Test Renter",
        "phone": "0987654321",
        "role": "renter"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=renter_data)
    print_response("3. Register Renter", response)
    
    # Test 4: Login as Owner
    login_data = {
        "email": "testowner@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print_response("4. Login as Owner", response)
    
    if response.status_code == 200:
        owner_token = response.json()["access_token"]
        
        # Test 5: Get Current User
        headers = {"Authorization": f"Bearer {owner_token}"}
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        print_response("5. Get Current User (Owner)", response)
        
        # Test 6: Get My Cars (should be empty)
        response = requests.get(f"{BASE_URL}/api/cars/my-cars", headers=headers)
        print_response("6. Get My Cars (Empty)", response)
    
    # Test 7: Login as Renter
    login_data = {
        "email": "testrenter@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print_response("7. Login as Renter", response)
    
    if response.status_code == 200:
        renter_token = response.json()["access_token"]
        
        # Test 8: Get My Bookings (should be empty)
        headers = {"Authorization": f"Bearer {renter_token}"}
        response = requests.get(f"{BASE_URL}/api/bookings/my-bookings", headers=headers)
        print_response("8. Get My Bookings (Empty)", response)
    
    # Test 9: Get All Cars (public)
    response = requests.get(f"{BASE_URL}/api/cars")
    print_response("9. Get All Cars (Public)", response)
    
    # Test 10: Get Featured Cars
    response = requests.get(f"{BASE_URL}/api/cars/featured")
    print_response("10. Get Featured Cars", response)
    
    print(f"\n{'='*60}")
    print("✅ Manual testing complete!")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the API.")
        print("Make sure the server is running with: uvicorn app.main:app --reload")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
