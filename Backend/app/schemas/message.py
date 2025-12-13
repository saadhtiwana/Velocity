from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    """Schema for creating a new message"""
    booking_id: str
    receiver_id: str
    message_content: str

class MessageResponse(BaseModel):
    """Schema for message response"""
    id: str
    booking_id: str
    sender_id: str
    receiver_id: str
    message_content: str
    timestamp: datetime
    is_read: str
    sender_name: str | None = None
    
    class Config:
        from_attributes = True