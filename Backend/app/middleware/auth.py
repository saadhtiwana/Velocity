from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.utils.auth import decode_access_token
from app.database import get_db, AsyncSessionLocal
from app.models.user import User

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    """
    Dependency to get the current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer token credentials
        db: Database session
        
    Returns:
        User ORM object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token"
        )
    
    user_id = payload.get("user_id")
    
    # Query user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User not found"
        )
    
    return user

async def require_owner(current_user: User = Depends(get_current_user)):
    """
    Dependency to ensure the current user has owner role
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if owner
        
    Raises:
        HTTPException: If user is not an owner
    """
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Owner access required"
        )
    return current_user

async def require_renter(current_user: User = Depends(get_current_user)):
    """
    Dependency to ensure the current user has renter role
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if renter
        
    Raises:
        HTTPException: If user is not a renter
    """
    if current_user.role != "renter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Renter access required"
        )
    return current_user

async def get_current_user_ws(token: str) -> User | None:
    """
    Get current user from WebSocket token (for real-time chat)
    
    Args:
        token: JWT token string
        
    Returns:
        User object if valid, None otherwise
    """
    try:
        payload = decode_access_token(token)
        
        if payload is None:
            return None
        
        user_id = payload.get("user_id")
        
        if user_id is None:
            return None
        
        # Create a new database session for WebSocket
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            return user
    
    except Exception as e:
        print(f"WebSocket auth error: {e}")
        return None