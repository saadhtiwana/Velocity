from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Request Schemas
class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str
    phone: Optional[str] = None
    role: str  # "renter" or "owner"

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

# Response Schemas
class UserResponse(BaseModel):
    """Schema for user response (excludes password)"""
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    
class LoginResponse(BaseModel):
    """Schema for login response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
