from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Form
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, delete
from app.schemas.car import CarCreate, CarUpdate, CarResponse
from app.database import get_db
from app.models.user import User
from app.models.car import Car
from app.models.booking import Booking
from app.middleware.auth import get_current_user, require_owner
from app.utils.imagekit import upload_car_image
from datetime import datetime
import uuid

router = APIRouter()

@router.get("", response_model=List[CarResponse])
async def get_cars(
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category: Optional[str] = None,
    fuel_type: Optional[str] = None,
    location: Optional[str] = None,
    seating: Optional[int] = None,
    pickup_date: Optional[str] = None,
    return_date: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all available cars with optional filters
    
    Public endpoint - no authentication required
    """
    # Build query
    query = select(Car, User).join(User, Car.owner_id == User.id).where(Car.status == "available")
    
    # Search filter (brand or model)
    if search:
        query = query.where(
            or_(
                Car.brand.ilike(f"%{search}%"),
                Car.model.ilike(f"%{search}%")
            )
        )
    
    # Price range filter
    if min_price is not None:
        query = query.where(Car.daily_price >= min_price)
    if max_price is not None:
        query = query.where(Car.daily_price <= max_price)
    
    # Category filter
    if category:
        query = query.where(Car.category == category)
    
    # Fuel type filter
    if fuel_type:
        query = query.where(Car.fuel_type == fuel_type)
    
    # Location filter
    if location:
        query = query.where(Car.location.ilike(f"%{location}%"))
    
    # Seating capacity filter
    if seating:
        query = query.where(Car.seating_capacity >= seating)
    
    # Execute query
    result = await db.execute(query)
    cars_with_owners = result.all()
    
    # If dates provided, exclude cars with conflicting bookings
    if pickup_date and return_date:
        try:
            pickup_dt = datetime.fromisoformat(pickup_date.replace('Z', '+00:00'))
            return_dt = datetime.fromisoformat(return_date.replace('Z', '+00:00'))
            
            # Find cars with conflicting bookings
            conflict_query = select(Booking.car_id).where(
                and_(
                    Booking.status.in_(["pending", "confirmed"]),
                    Booking.pickup_date < return_dt,
                    Booking.return_date > pickup_dt
                )
            )
            conflict_result = await db.execute(conflict_query)
            conflicting_car_ids = [row[0] for row in conflict_result.all()]
            
            # Filter out conflicting cars
            cars_with_owners = [(car, owner) for car, owner in cars_with_owners if car.id not in conflicting_car_ids]
        except:
            pass  # If date parsing fails, just don't filter by dates
    
    # Build response
    result_list = []
    for car, owner in cars_with_owners:
        result_list.append(CarResponse(
            id=car.id,
            owner_id=car.owner_id,
            brand=car.brand,
            model=car.model,
            year=car.year,
            daily_price=car.daily_price,
            category=car.category,
            fuel_type=car.fuel_type,
            seating_capacity=car.seating_capacity,
            location=car.location,
            description=car.description,
            image_url=car.image_url,
            status=car.status,
            created_at=car.created_at,
            owner_name=owner.full_name
        ))
    
    return result_list

@router.get("/featured", response_model=List[CarResponse])
async def get_featured_cars(db: AsyncSession = Depends(get_db)):
    """
    Get 6 random featured cars
    
    Public endpoint - no authentication required
    """
    # Query for random cars
    query = select(Car, User).join(User, Car.owner_id == User.id).where(
        Car.status == "available"
    ).order_by(func.random()).limit(6)
    
    result = await db.execute(query)
    cars_with_owners = result.all()
    
    # Build response
    result_list = []
    for car, owner in cars_with_owners:
        result_list.append(CarResponse(
            id=car.id,
            owner_id=car.owner_id,
            brand=car.brand,
            model=car.model,
            year=car.year,
            daily_price=car.daily_price,
            category=car.category,
            fuel_type=car.fuel_type,
            seating_capacity=car.seating_capacity,
            location=car.location,
            description=car.description,
            image_url=car.image_url,
            status=car.status,
            created_at=car.created_at,
            owner_name=owner.full_name
        ))
    
    return result_list

@router.get("/my-cars", response_model=List[CarResponse])
async def get_my_cars(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all cars owned by current user
    
    Owner only endpoint
    """
    query = select(Car).where(Car.owner_id == current_user.id).order_by(Car.created_at.desc())
    result = await db.execute(query)
    cars = result.scalars().all()
    
    result_list = []
    for car in cars:
        result_list.append(CarResponse(
            id=car.id,
            owner_id=car.owner_id,
            brand=car.brand,
            model=car.model,
            year=car.year,
            daily_price=car.daily_price,
            category=car.category,
            fuel_type=car.fuel_type,
            seating_capacity=car.seating_capacity,
            location=car.location,
            description=car.description,
            image_url=car.image_url,
            status=car.status,
            created_at=car.created_at,
            owner_name=current_user.full_name
        ))
    
    return result_list

@router.get("/{car_id}", response_model=CarResponse)
async def get_car(car_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get specific car details with owner information
    
    Public endpoint - no authentication required
    """
    query = select(Car, User).join(User, Car.owner_id == User.id).where(Car.id == car_id)
    result = await db.execute(query)
    car_with_owner = result.first()
    
    if not car_with_owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
    car, owner = car_with_owner
    
    return CarResponse(
        id=car.id,
        owner_id=car.owner_id,
        brand=car.brand,
        model=car.model,
        year=car.year,
        daily_price=car.daily_price,
        category=car.category,
        fuel_type=car.fuel_type,
        seating_capacity=car.seating_capacity,
        location=car.location,
        description=car.description,
        image_url=car.image_url,
        status=car.status,
        created_at=car.created_at,
        owner_name=owner.full_name,
        owner_phone=owner.phone
    )

@router.post("", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
async def create_car(
    brand: str = Form(...),
    model: str = Form(...),
    year: int = Form(...),
    daily_price: float = Form(...),
    category: str = Form(...),
    fuel_type: str = Form(...),
    seating_capacity: int = Form(...),
    location: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...),
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new car listing with image upload
    
    Owner only endpoint
    """
    # Validate year
    if year < 1900 or year > 2030:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Year must be between 1900 and 2030"
        )
    
    # Validate price
    if daily_price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Daily price must be greater than 0"
        )
    
    # Validate seating
    if seating_capacity < 1 or seating_capacity > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seating capacity must be between 1 and 20"
        )
    
    # Upload image to ImageKit
    try:
        image_bytes = await image.read()
        image_url = await upload_car_image(image_bytes, image.filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image upload failed: {str(e)}"
        )
    
    # Create car
    new_car = Car(
        id=str(uuid.uuid4()),
        owner_id=current_user.id,
        brand=brand,
        model=model,
        year=year,
        daily_price=daily_price,
        category=category,
        fuel_type=fuel_type,
        seating_capacity=seating_capacity,
        location=location,
        description=description,
        image_url=image_url,
        status="available"
    )
    
    db.add(new_car)
    await db.commit()
    await db.refresh(new_car)
    
    return CarResponse(
        id=new_car.id,
        owner_id=new_car.owner_id,
        brand=new_car.brand,
        model=new_car.model,
        year=new_car.year,
        daily_price=new_car.daily_price,
        category=new_car.category,
        fuel_type=new_car.fuel_type,
        seating_capacity=new_car.seating_capacity,
        location=new_car.location,
        description=new_car.description,
        image_url=new_car.image_url,
        status=new_car.status,
        created_at=new_car.created_at,
        owner_name=current_user.full_name
    )

@router.put("/{car_id}", response_model=CarResponse)
async def update_car(
    car_id: str,
    car_data: CarUpdate,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Update car details (excluding image and status)
    
    Owner only endpoint - must own the car
    """
    # Get car
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
    # Check ownership
    if car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own cars"
        )
    
    # Update fields
    update_data = car_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(car, key, value)
    
    await db.commit()
    await db.refresh(car)
    
    return CarResponse(
        id=car.id,
        owner_id=car.owner_id,
        brand=car.brand,
        model=car.model,
        year=car.year,
        daily_price=car.daily_price,
        category=car.category,
        fuel_type=car.fuel_type,
        seating_capacity=car.seating_capacity,
        location=car.location,
        description=car.description,
        image_url=car.image_url,
        status=car.status,
        created_at=car.created_at,
        owner_name=current_user.full_name
    )

@router.patch("/{car_id}/status", response_model=CarResponse)
async def toggle_car_status(
    car_id: str,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle car availability status (available ↔ unavailable)
    
    Owner only endpoint - must own the car
    """
    # Get car
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
    # Check ownership
    if car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own cars"
        )
    
    # Toggle status
    car.status = "unavailable" if car.status == "available" else "available"
    
    await db.commit()
    await db.refresh(car)
    
    return CarResponse(
        id=car.id,
        owner_id=car.owner_id,
        brand=car.brand,
        model=car.model,
        year=car.year,
        daily_price=car.daily_price,
        category=car.category,
        fuel_type=car.fuel_type,
        seating_capacity=car.seating_capacity,
        location=car.location,
        description=car.description,
        image_url=car.image_url,
        status=car.status,
        created_at=car.created_at,
        owner_name=current_user.full_name
    )

@router.delete("/{car_id}")
async def delete_car(
    car_id: str,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a car listing
    
    Owner only endpoint - must own the car and have no active bookings
    """
    # Get car
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
    # Check ownership
    if car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own cars"
        )
    
    # Check for active bookings
    booking_result = await db.execute(
        select(Booking).where(
            and_(
                Booking.car_id == car_id,
                Booking.status.in_(["pending", "confirmed"])
            )
        )
    )
    active_booking = booking_result.scalar_one_or_none()
    
    if active_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete car with pending or confirmed bookings"
        )
    
    await db.delete(car)
    await db.commit()
    
    return {"message": "Car deleted successfully"}
