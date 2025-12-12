from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.models.user import User
from app.utils.imagekit import imagekit
import time

router = APIRouter()

@router.get("/auth")
async def get_imagekit_auth(current_user: User = Depends(get_current_user)):
    """
    Get ImageKit authentication parameters for client-side uploads
    
    Owner only endpoint - requires authentication
    """
    # Generate authentication parameters
    auth_params = imagekit.get_authentication_parameters()
    
    return {
        "token": auth_params["token"],
        "expire": auth_params["expire"],
        "signature": auth_params["signature"]
    }
