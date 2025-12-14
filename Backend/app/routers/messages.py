from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc
from app.schemas.message import MessageCreate, MessageResponse, ConversationResponse
from app.database import get_db
from app.models.user import User
from app.models.booking import Booking
from app.models.message import Message
from app.models.car import Car
from app.middleware.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

async def verify_chat_access(
    db: AsyncSession,
    user_id: str,
    booking_id: Optional[str] = None,
    car_id: Optional[str] = None
) -> tuple:
    """
    Verify user has access to this chat (is either renter or owner)
    
    Returns (booking, car, other_user_id) tuple if access is granted
    """
    if booking_id:
        # Booking-based chat
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
                detail="You don't have access to this chat"
            )
        
        # Determine other user
        other_user_id = car.owner_id if booking.renter_id == user_id else booking.renter_id
        
        return booking, car, other_user_id
        
    elif car_id:
        # Car-based chat (pre-booking)
        query = select(Car).where(Car.id == car_id)
        result = await db.execute(query)
        car = result.scalar_one_or_none()
        
        if not car:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Car not found"
            )
        
        # User must be either the owner or a renter (any authenticated user can chat about a car)
        # Owner can chat with any renter, renter can chat with owner
        # If user is owner, other_user_id is unknown at this stage (depends on who they are viewing)
        other_user_id = car.owner_id if user_id != car.owner_id else None
        
        return None, car, other_user_id
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either booking_id or car_id must be provided"
        )

@router.get("", response_model=List[MessageResponse])
async def get_messages(
    booking_id: Optional[str] = Query(None),
    car_id: Optional[str] = Query(None),
    other_user_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all messages for a booking or car chat
    """
    # Verify access
    booking, car, _ = await verify_chat_access(db, current_user.id, booking_id, car_id)
    
    # Build query based on chat type
    if booking_id:
        message_filter = Message.booking_id == booking_id
    else:
        # For car chats, we must strictly filter by the two participants
        # We need to identify the Renter in the conversation.
        if current_user.id == car.owner_id:
            # I am Owner, I need to look for messages with a specific Renter
            if not other_user_id:
                # If no other_user_id provided, we return nothing or error?
                # For safety, return empty list if owner doesn't specify who they're talking to
                return []
            renter_id = other_user_id
        else:
            # I am Renter, so the conversation is with Me
            renter_id = current_user.id
            
        # Simplified filter: Just check if the renter is involved in the message
        # Since car chats are strictly Renter <-> Owner, this is sufficient.
        message_filter = and_(
            Message.car_id == car_id,
            or_(
                Message.sender_id == renter_id,
                Message.receiver_id == renter_id
            )
        )
    
    # Debug logging
    print(f"DEBUG: get_messages calling with car_id={car_id}, booking_id={booking_id}")
    print(f"DEBUG: current_user={current_user.id}, other_user_id={other_user_id}")
    
    # Get messages
    query = select(Message, User).join(
        User, Message.sender_id == User.id
    ).where(
        message_filter
    ).order_by(Message.timestamp.asc())
    
    result = await db.execute(query)
    messages_data = result.all()
    
    print(f"DEBUG: Found {len(messages_data)} messages")
    
    messages_list = []
    for message, sender in messages_data:
        messages_list.append(MessageResponse(
            id=message.id,
            booking_id=message.booking_id,
            car_id=message.car_id,
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
                message_filter,
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
    Send a new message
    """
    # Verify access
    booking, car, _ = await verify_chat_access(
        db, 
        current_user.id, 
        message_data.booking_id, 
        message_data.car_id
    )
    
    # Verify receiver is valid
    if message_data.booking_id:
        valid_participants = [booking.renter_id, car.owner_id]
    else:
        if current_user.id == car.owner_id:
            valid_participants = [message_data.receiver_id]
        else:
            valid_participants = [car.owner_id]
    
    if message_data.receiver_id not in valid_participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid receiver for this chat"
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
        car_id=message_data.car_id,
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
        car_id=new_message.car_id,
        sender_id=new_message.sender_id,
        receiver_id=new_message.receiver_id,
        message_content=new_message.message_content,
        timestamp=new_message.timestamp,
        is_read=new_message.is_read,
        sender_name=current_user.full_name
    )

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all conversations for current user (owner only)
    """
    # Get all messages where user is sender or receiver
    query = select(Message).where(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).order_by(Message.timestamp.desc())
    
    result = await db.execute(query)
    all_messages = result.scalars().all()
    
    # Group by conversation key
    # Key is booking_id OR (car_id + renter_id)
    conversations_dict = {}
    
    for message in all_messages:
        # Determine Other User ID
        other_user_id = message.receiver_id if message.sender_id == current_user.id else message.sender_id
        
        if message.booking_id:
            conv_key = f"booking:{message.booking_id}"
            conv_type = "booking"
            raw_id = message.booking_id
        else:
            # For car chats, conversation is unique per Renter
            conv_key = f"car:{message.car_id}:{other_user_id}"
            conv_type = "car"
            raw_id = message.car_id
        
        if conv_key in conversations_dict:
            continue
        
        # Details lookup
        if message.booking_id:
            booking_query = select(Booking, Car).join(Car, Booking.car_id == Car.id).where(Booking.id == message.booking_id)
            booking_result = await db.execute(booking_query)
            booking_data = booking_result.first()
            if booking_data:
                _, car = booking_data
            else:
                continue
        else:
            car_query = select(Car).where(Car.id == message.car_id)
            car_result = await db.execute(car_query)
            car = car_result.scalar_one_or_none()
            if not car:
                continue
        
        user_query = select(User).where(User.id == other_user_id)
        user_result = await db.execute(user_query)
        other_user = user_result.scalar_one_or_none()
        if not other_user:
            continue
        
        # Count unread
        if conv_type == "booking":
             count_filter = Message.booking_id == raw_id
        else:
             count_filter = and_(
                 Message.car_id == raw_id,
                 or_(
                     Message.sender_id == other_user_id, 
                     Message.receiver_id == other_user_id
                 )
             )

        unread_query = select(func.count(Message.id)).where(
            and_(
                count_filter,
                Message.receiver_id == current_user.id,
                Message.is_read == "false"
            )
        )
        unread_result = await db.execute(unread_query)
        unread_count = unread_result.scalar() or 0
        
        conversations_dict[conv_key] = ConversationResponse(
            conversation_id=raw_id,
            conversation_type=conv_type,
            other_user_id=other_user.id,
            other_user_name=other_user.full_name,
            car_id=car.id,
            car_brand=car.brand,
            car_model=car.model,
            car_image_url=car.image_url,
            last_message=message.message_content,
            last_message_time=message.timestamp,
            unread_count=unread_count
        )
    
    return list(conversations_dict.values())

@router.get("/unread/count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Message).where(
        and_(
            Message.receiver_id == current_user.id,
            Message.is_read == "false"
        )
    )
    
    result = await db.execute(query)
    unread_messages = result.scalars().all()
    
    return {"unread_count": len(unread_messages)}