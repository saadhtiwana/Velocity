from imagekitio import ImageKit
from app.config import settings

# Initialize ImageKit client
imagekit = ImageKit(
    public_key=settings.IMAGEKIT_PUBLIC_KEY,
    private_key=settings.IMAGEKIT_PRIVATE_KEY,
    url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
)

async def upload_car_image(file_bytes: bytes, file_name: str) -> str:
    """
    Upload image to ImageKit cloud storage
    
    Args:
        file_bytes: Image file as bytes
        file_name: Name for the uploaded file
        
    Returns:
        URL of the uploaded image
        
    Raises:
        Exception: If upload fails
    """
    try:
        upload = imagekit.upload(
            file=file_bytes,
            file_name=file_name,
            options={"folder": "/velocity/cars/"}
        )
        return upload.url
    except Exception as e:
        raise Exception(f"Image upload failed: {str(e)}")
