from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class User(Base):
    """User model for renters and car owners"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, nullable=False)  # "renter" or "owner"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    cars = relationship("Car", back_populates="owner", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="renter", cascade="all, delete-orphan")
