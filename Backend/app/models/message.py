from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class Message(Base):
    """Message model for booking and car chat"""
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=True, index=True)  # Nullable for pre-booking chats
    car_id = Column(String, ForeignKey("cars.id", ondelete="CASCADE"), nullable=True, index=True)  # For pre-booking chats
    sender_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    message_content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    is_read = Column(String, default="false", nullable=False)  # "true" or "false"
    
    # Relationships
    booking = relationship("Booking", backref="messages")
    car = relationship("Car", backref="messages")
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], backref="received_messages")