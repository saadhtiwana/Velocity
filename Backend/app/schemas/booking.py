from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Request Schemas
class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    car_id: str
    pickup_date: datetime
    return_date: datetime

class BookingStatusUpdate(BaseModel):
    """Schema for updating booking status"""
    status: str  # "confirmed" or "rejected"

# Response Schemas
class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: str
    car_id: str
    renter_id: str
    pickup_date: datetime
    return_date: datetime
    total_price: float
    status: str
    created_at: datetime
    # Optional car details
    car_brand: Optional[str] = None
    car_model: Optional[str] = None
    car_image_url: Optional[str] = None
    # Optional owner/renter details
    owner_id: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    renter_name: Optional[str] = None
    renter_phone: Optional[str] = None
    # Payment fields
    payment_status: Optional[str] = None
    payment_intent_id: Optional[str] = None
    stripe_payment_method: Optional[str] = None
    amount_paid: Optional[float] = None
