from pydantic_settings import BaseSettings
from pathlib import Path
import os

# Get the Backend directory (parent of app directory)
BACKEND_DIR = Path(__file__).parent.parent
ENV_FILE = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # ImageKit
    IMAGEKIT_PUBLIC_KEY: str
    IMAGEKIT_PRIVATE_KEY: str
    IMAGEKIT_URL_ENDPOINT: str
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    class Config:
        # Use absolute path to .env file in Backend directory
        env_file = str(ENV_FILE) if ENV_FILE.exists() else ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()

# Debug: Print if Stripe keys are loaded (only in development)
if not settings.STRIPE_SECRET_KEY:
    print(f"⚠️  WARNING: STRIPE_SECRET_KEY is not set!")
    print(f"   Looking for .env file at: {ENV_FILE}")
    print(f"   .env file exists: {ENV_FILE.exists()}")
    if ENV_FILE.exists():
        print(f"   .env file contents (first 500 chars):")
        try:
            with open(ENV_FILE, 'r') as f:
                content = f.read(500)
                print(f"   {content}")
        except Exception as e:
            print(f"   Error reading .env: {e}")