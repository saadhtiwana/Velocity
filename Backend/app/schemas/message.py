from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageCreate(BaseModel):
    """Schema for creating a new message"""
    booking_id: Optional[str] = None
    car_id: Optional[str] = None
    receiver_id: str
    message_content: str

class MessageResponse(BaseModel):
    """Schema for message response"""
    id: str
    booking_id: Optional[str] = None
    car_id: Optional[str] = None
    sender_id: str
    receiver_id: str
    message_content: str
    timestamp: datetime
    is_read: str
    sender_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    """Schema for conversation list item"""
    conversation_id: str  # booking_id or car_id
    conversation_type: str  # "booking" or "car"
    other_user_id: str
    other_user_name: str
    car_id: str
    car_brand: str
    car_model: str
    car_image_url: Optional[str] = None
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0