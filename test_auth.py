import os
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv("backend/.env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
TEST_EMAIL = "new_test_user_success@example.com"
TEST_PASS = "TestPass123!"

async def test_auth():
    print("Testing Supabase flow...")
    async with httpx.AsyncClient() as client:
        # 1. Sign Up
        print("1. Signing up...")
        res = await client.post(
            f"{SUPABASE_URL}/auth/v1/signup",
            headers={"apikey": SUPABASE_KEY},
            json={"email": TEST_EMAIL, "password": TEST_PASS, "data": {"name": "Test User"}}
        )
        print("Signup status:", res.status_code)
        print("Signup response:", res.json())
        
        # 2. Sign In
        print("2. Signing in...")
        res = await client.post(
            f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers={"apikey": SUPABASE_KEY},
            json={"email": TEST_EMAIL, "password": TEST_PASS}
        )
        print("Signin status:", res.status_code)
        
        if res.status_code == 200:
            token = res.json().get("access_token")
            # 3. Test Backend Auth (We need to start the backend server first, but we can just test the Supabase auth flow for now)
            print("Successfully got access token")
            
            # 4. Invalid Sign In
            print("3. Testing invalid credentials...")
            bad_res = await client.post(
                f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
                headers={"apikey": SUPABASE_KEY},
                json={"email": TEST_EMAIL, "password": "WrongPassword123!"}
            )
            print("Invalid Signin status:", bad_res.status_code)
            assert bad_res.status_code == 400
        else:
            print(res.json())

asyncio.run(test_auth())
