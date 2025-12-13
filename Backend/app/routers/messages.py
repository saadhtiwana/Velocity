from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.schemas.message import MessageCreate, MessageResponse
from app.database import get_db
from app.models.user import User
from app.models.booking import Booking
from app.models.message import Message
from app.models.car import Car
from app.middleware.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

async def verify_booking_access(
    db: AsyncSession,
    booking_id: str,
    user_id: str
) -> Booking:
    """
    Verify user has access to this booking (is either renter or owner)
    
    Returns the booking if access is granted, raises HTTPException otherwise
    """
    query = select(Booking, Car).join(Car, Booking.car_id == Car.id).where(
        Booking.id == booking_id
    )
    
    result = await db.execute(query)
    booking_data = result.first()
    
    if not booking_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    booking, car = booking_data
    
    # Check if user is renter or owner
    if booking.renter_id != user_id and car.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this booking"
        )
    
    # Check if booking is confirmed
    if booking.status != "confirmed":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat is only available for confirmed bookings"
        )
    
    return booking

@router.get("/{booking_id}", response_model=List[MessageResponse])
async def get_messages(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all messages for a booking
    
    Only accessible by booking participants (renter and owner)
    """
    # Verify access
    booking = await verify_booking_access(db, booking_id, current_user.id)
    
    # Get all messages for this booking
    query = select(Message, User).join(
        User, Message.sender_id == User.id
    ).where(
        Message.booking_id == booking_id
    ).order_by(Message.timestamp.asc())
    
    result = await db.execute(query)
    messages_data = result.all()
    
    messages_list = []
    for message, sender in messages_data:
        messages_list.append(MessageResponse(
            id=message.id,
            booking_id=message.booking_id,
            sender_id=message.sender_id,
            receiver_id=message.receiver_id,
            message_content=message.message_content,
            timestamp=message.timestamp,
            is_read=message.is_read,
            sender_name=sender.full_name
        ))
    
    # Mark messages as read for current user
    await db.execute(
        Message.__table__.update().where(
            and_(
                Message.booking_id == booking_id,
                Message.receiver_id == current_user.id,
                Message.is_read == "false"
            )
        ).values(is_read="true")
    )
    await db.commit()
    
    return messages_list

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a new message in a booking chat
    
    Only accessible by booking participants
    """
    # Verify access
    booking = await verify_booking_access(db, message_data.booking_id, current_user.id)
    
    # Verify receiver is part of the booking
    query = select(Car).where(Car.id == booking.car_id)
    result = await db.execute(query)
    car = result.scalar_one()
    
    valid_participants = [booking.renter_id, car.owner_id]
    
    if message_data.receiver_id not in valid_participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid receiver for this booking"
        )
    
    if message_data.receiver_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to yourself"
        )
    
    # Create message
    new_message = Message(
        id=str(uuid.uuid4()),
        booking_id=message_data.booking_id,
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        message_content=message_data.message_content.strip(),
        timestamp=datetime.utcnow(),
        is_read="false"
    )
    
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    
    return MessageResponse(
        id=new_message.id,
        booking_id=new_message.booking_id,
        sender_id=new_message.sender_id,
        receiver_id=new_message.receiver_id,
        message_content=new_message.message_content,
        timestamp=new_message.timestamp,
        is_read=new_message.is_read,
        sender_name=current_user.full_name
    )

@router.get("/unread/count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get count of unread messages for current user
    """
    query = select(Message).where(
        and_(
            Message.receiver_id == current_user.id,
            Message.is_read == "false"
        )
    )
    
    result = await db.execute(query)
    unread_messages = result.scalars().all()
    
    return {"unread_count": len(unread_messages)}