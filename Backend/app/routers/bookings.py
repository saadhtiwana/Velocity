from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, extract
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from app.database import get_db
from app.models.user import User
from app.models.car import Car
from app.models.booking import Booking
from app.middleware.auth import get_current_user, require_owner, require_renter
from datetime import datetime
import uuid

router = APIRouter()

async def check_date_conflict(
    db: AsyncSession,
    car_id: str,
    pickup_date: datetime,
    return_date: datetime,
    exclude_booking_id: str = None
) -> bool:
    """
    Check if dates conflict with existing pending/confirmed bookings
    
    Args:
        db: Database session
        car_id: Car ID to check
        pickup_date: Requested pickup date
        return_date: Requested return date
        exclude_booking_id: Booking ID to exclude from check (for updates)
        
    Returns:
        True if conflict exists, False otherwise
    """
    query = select(Booking).where(
        and_(
            Booking.car_id == car_id,
            Booking.status.in_(["pending", "confirmed"]),
            Booking.pickup_date < return_date,
            Booking.return_date > pickup_date
        )
    )
    
    if exclude_booking_id:
        query = query.where(Booking.id != exclude_booking_id)
    
    result = await db.execute(query)
    existing_booking = result.scalar_one_or_none()
    
    return existing_booking is not None

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(require_renter),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new booking request
    
    Renter only endpoint
    """
    # Validate dates
    if booking_data.return_date <= booking_data.pickup_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Return date must be after pickup date"
        )
    
    # Check dates are not in the past
    if booking_data.pickup_date < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup date cannot be in the past"
        )
    
    # Check if car exists and is available
    result = await db.execute(select(Car).where(Car.id == booking_data.car_id))
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
    if car.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Car is not available for booking"
        )
    
    # Check for date conflicts
    has_conflict = await check_date_conflict(
        db,
        booking_data.car_id,
        booking_data.pickup_date,
        booking_data.return_date
    )
    
    if has_conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The car is already booked for the selected dates"
        )
    
    # Calculate total price
    days = (booking_data.return_date - booking_data.pickup_date).days
    if days == 0:
        days = 1  # Minimum 1 day
    total_price = days * car.daily_price
    
    # Create booking
    new_booking = Booking(
        id=str(uuid.uuid4()),
        car_id=booking_data.car_id,
        renter_id=current_user.id,
        pickup_date=booking_data.pickup_date,
        return_date=booking_data.return_date,
        total_price=total_price,
        status="pending"
    )
    
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    
    return BookingResponse(
        id=new_booking.id,
        car_id=new_booking.car_id,
        renter_id=new_booking.renter_id,
        pickup_date=new_booking.pickup_date,
        return_date=new_booking.return_date,
        total_price=new_booking.total_price,
        status=new_booking.status,
        created_at=new_booking.created_at,
        car_brand=car.brand,
        car_model=car.model,
        car_image_url=car.image_url
    )

@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: User = Depends(require_renter),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all bookings made by the current user
    
    Renter only endpoint
    """
    # Query bookings with car details
    query = select(Booking, Car, User).join(
        Car, Booking.car_id == Car.id
    ).join(
        User, Car.owner_id == User.id
    ).where(
        Booking.renter_id == current_user.id
    ).order_by(Booking.created_at.desc())
    
    result = await db.execute(query)
    bookings_data = result.all()
    
    result_list = []
    for booking, car, owner in bookings_data:
        booking_response = BookingResponse(
            id=booking.id,
            car_id=booking.car_id,
            renter_id=booking.renter_id,
            pickup_date=booking.pickup_date,
            return_date=booking.return_date,
            total_price=booking.total_price,
            status=booking.status,
            created_at=booking.created_at,
            car_brand=car.brand,
            car_model=car.model,
            car_image_url=car.image_url
        )
        
        # If confirmed, include owner details
        if booking.status == "confirmed":
            booking_response.owner_name = owner.full_name
            booking_response.owner_phone = owner.phone
        
        result_list.append(booking_response)
    
    return result_list

@router.get("/my-car-bookings", response_model=List[BookingResponse])
async def get_my_car_bookings(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all bookings for cars owned by the current user
    
    Owner only endpoint
    """
    # Query bookings for owner's cars with renter details
    query = select(Booking, Car, User).join(
        Car, Booking.car_id == Car.id
    ).join(
        User, Booking.renter_id == User.id  # Join on renter, not owner
    ).where(
        Car.owner_id == current_user.id
    ).order_by(Booking.created_at.desc())
    
    result = await db.execute(query)
    bookings_data = result.all()
    
    result_list = []
    for booking, car, renter in bookings_data:
        result_list.append(BookingResponse(
            id=booking.id,
            car_id=booking.car_id,
            renter_id=booking.renter_id,
            pickup_date=booking.pickup_date,
            return_date=booking.return_date,
            total_price=booking.total_price,
            status=booking.status,
            created_at=booking.created_at,
            car_brand=car.brand,
            car_model=car.model,
            car_image_url=car.image_url,
            renter_name=renter.full_name,
            renter_phone=renter.phone
        ))
    
    return result_list

@router.patch("/{booking_id}/status", response_model=BookingResponse)
async def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Confirm or reject a booking
    
    Owner only endpoint - must own the car
    """
    # Validate status
    if status_update.status not in ["confirmed", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be either 'confirmed' or 'rejected'"
        )
    
    # Find booking with car
    query = select(Booking, Car, User).join(
        Car, Booking.car_id == Car.id
    ).join(
        User, Booking.renter_id == User.id
    ).where(Booking.id == booking_id)
    
    result = await db.execute(query)
    booking_data = result.first()
    
    if not booking_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    booking, car, renter = booking_data
    
    # Check booking status
    if booking.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending bookings can be updated"
        )
    
    # Check car ownership
    if car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update bookings for your own cars"
        )
    
    # Update status
    booking.status = status_update.status
    await db.commit()
    await db.refresh(booking)
    
    return BookingResponse(
        id=booking.id,
        car_id=booking.car_id,
        renter_id=booking.renter_id,
        pickup_date=booking.pickup_date,
        return_date=booking.return_date,
        total_price=booking.total_price,
        status=booking.status,
        created_at=booking.created_at,
        car_brand=car.brand,
        car_model=car.model,
        car_image_url=car.image_url,
        renter_name=renter.full_name,
        renter_phone=renter.phone
    )

@router.get("/owner/dashboard")
async def get_owner_dashboard(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Get dashboard statistics for car owner
    
    Owner only endpoint
    """
    # Get owner's cars
    cars_result = await db.execute(select(Car).where(Car.owner_id == current_user.id))
    cars = cars_result.scalars().all()
    car_ids = [car.id for car in cars]
    
    # Get all bookings for these cars
    bookings_result = await db.execute(select(Booking).where(Booking.car_id.in_(car_ids)))
    all_bookings = bookings_result.scalars().all()
    
    # Calculate statistics
    total_cars = len(cars)
    total_bookings = len(all_bookings)
    pending_bookings = len([b for b in all_bookings if b.status == "pending"])
    confirmed_bookings = len([b for b in all_bookings if b.status == "confirmed"])
    
    # Calculate monthly revenue (current month, confirmed bookings only)
    now = datetime.utcnow()
    current_month_start = datetime(now.year, now.month, 1)
    
    monthly_revenue_result = await db.execute(
        select(func.sum(Booking.total_price)).where(
            and_(
                Booking.car_id.in_(car_ids),
                Booking.status == "confirmed",
                Booking.created_at >= current_month_start
            )
        )
    )
    monthly_revenue = monthly_revenue_result.scalar() or 0.0
    
    # Get recent 5 bookings with details
    recent_query = select(Booking, Car, User).join(
        Car, Booking.car_id == Car.id
    ).join(
        User, Booking.renter_id == User.id
    ).where(
        Booking.car_id.in_(car_ids)
    ).order_by(Booking.created_at.desc()).limit(5)
    
    recent_result = await db.execute(recent_query)
    recent_bookings_data = recent_result.all()
    
    recent_bookings_list = []
    for booking, car, renter in recent_bookings_data:
        recent_bookings_list.append({
            "id": booking.id,
            "car_brand": car.brand,
            "car_model": car.model,
            "renter_name": renter.full_name,
            "pickup_date": booking.pickup_date,
            "return_date": booking.return_date,
            "total_price": booking.total_price,
            "status": booking.status,
            "created_at": booking.created_at
        })
    
    return {
        "total_cars": total_cars,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "monthly_revenue": float(monthly_revenue),
        "recent_bookings": recent_bookings_list
    }
