from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class Booking(Base):
    """Booking model for car rentals"""
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True)
    car_id = Column(String, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False, index=True)
    renter_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    pickup_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending, confirmed, rejected, completed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Payment fields
    payment_status = Column(String, default="pending", nullable=False)  # pending, paid, failed, refunded
    payment_intent_id = Column(String, nullable=True)
    stripe_payment_method = Column(String, nullable=True)  # card brand/last4
    amount_paid = Column(Float, nullable=True)
    
    # Relationships
    car = relationship("Car", back_populates="bookings")
    renter = relationship("User", back_populates="bookings")
