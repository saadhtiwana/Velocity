from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Request Schemas
class CarCreate(BaseModel):
    """Schema for creating a car listing"""
    brand: str
    model: str
    year: int = Field(..., ge=1900, le=2030)
    daily_price: float = Field(..., gt=0)
    category: str
    fuel_type: str
    seating_capacity: int = Field(..., ge=1, le=20)
    location: str
    description: Optional[str] = None

class CarUpdate(BaseModel):
    """Schema for updating car details"""
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = Field(None, ge=1900, le=2030)
    daily_price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    fuel_type: Optional[str] = None
    seating_capacity: Optional[int] = Field(None, ge=1, le=20)
    location: Optional[str] = None
    description: Optional[str] = None

# Response Schemas
class CarResponse(BaseModel):
    """Schema for car response"""
    id: str
    owner_id: str
    brand: str
    model: str
    year: int
    daily_price: float
    category: str
    fuel_type: str
    seating_capacity: int
    location: str
    description: Optional[str] = None
    image_url: str
    status: str
    created_at: datetime
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
