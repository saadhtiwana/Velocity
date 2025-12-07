from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class Car(Base):
    """Car model for rental listings"""
    __tablename__ = "cars"
    
    id = Column(String, primary_key=True)
    owner_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    daily_price = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # Sedan, SUV, Hatchback, Luxury, Sports, Van
    fuel_type = Column(String, nullable=False)  # Petrol, Diesel, Electric, Hybrid
    seating_capacity = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    status = Column(String, default="available", nullable=False)  # available or unavailable
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="cars")
    bookings = relationship("Booking", back_populates="car", cascade="all, delete-orphan")
