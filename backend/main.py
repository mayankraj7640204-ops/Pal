import os
import httpx
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

class User(BaseModel):
    id: str
    email: str
    name: str | None = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Supabase not configured on backend")
        
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}", "apikey": SUPABASE_KEY}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            
        user_data = response.json()
        return User(
            id=user_data.get("id"),
            email=user_data.get("email"),
            name=user_data.get("user_metadata", {}).get("name")
        )

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/auth/me", response_model=User)
async def auth_me(current_user: User = Depends(get_current_user)):
    return current_user
