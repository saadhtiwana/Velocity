# from imagekitio import ImageKit
# from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
# from app.config import settings

# # Initialize ImageKit client
# imagekit = ImageKit(
#     public_key=settings.IMAGEKIT_PUBLIC_KEY,
#     private_key=settings.IMAGEKIT_PRIVATE_KEY,
#     url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
# )

# async def upload_car_image(file_bytes: bytes, file_name: str) -> str:
#     """
#     Upload image to ImageKit cloud storage
    
#     Args:
#         file_bytes: Image file as bytes
#         file_name: Name for the uploaded file
        
#     Returns:
#         URL of the uploaded image
        
#     Raises:
#         Exception: If upload fails
#     """
#     try:
#         print(f"🔄 Attempting to upload image: {file_name}")
#         print(f"📊 File size: {len(file_bytes)} bytes")
        
#         # Create proper options object
#         options = UploadFileRequestOptions(
#             folder="/velocity/cars/"
#         )
        
#         upload_response = imagekit.upload(
#             file=file_bytes,
#             file_name=file_name,
#             options=options
#         )
        
#         print(f"✅ Upload response received")
#         print(f"📋 Response type: {type(upload_response)}")
        
#         # Debug: Print all attributes
#         if hasattr(upload_response, 'response_metadata'):
#             print(f"📋 response_metadata type: {type(upload_response.response_metadata)}")
#             print(f"📋 response_metadata content: {upload_response.response_metadata}")
#             if isinstance(upload_response.response_metadata, dict):
#                 print(f"📋 response_metadata keys: {upload_response.response_metadata.keys()}")
        
#         # Extract URL from response
#         # The ImageKit SDK returns response_metadata as a dict
#         url = None
        
#         if hasattr(upload_response, 'response_metadata'):
#             metadata = upload_response.response_metadata
#             if isinstance(metadata, dict):
#                 url = metadata.get('url')
#                 print(f"✅ URL from dict: {url}")
#             elif hasattr(metadata, 'url'):
#                 url = metadata.url
#                 print(f"✅ URL from attribute: {url}")
        
#         if not url and hasattr(upload_response, 'url'):
#             url = upload_response.url
#             print(f"✅ URL from direct response: {url}")
        
#         if not url:
#             print(f"❌ Could not extract URL")
#             print(f"📋 Response attributes: {dir(upload_response)}")
#             raise Exception("Could not extract URL from ImageKit response")
        
#         print(f"✅ Final URL: {url}")
#         return url
            
#     except Exception as e:
#         print(f"❌ Error during upload: {str(e)}")
#         print(f"❌ Error type: {type(e)}")
#         import traceback
#         print(f"❌ Traceback: {traceback.format_exc()}")
#         raise Exception(f"Image upload failed: {str(e)}")




from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from app.config import settings
import base64

imagekit = ImageKit(
    public_key=settings.IMAGEKIT_PUBLIC_KEY,
    private_key=settings.IMAGEKIT_PRIVATE_KEY,
    url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
)

async def upload_car_image(file_bytes: bytes, file_name: str) -> str:
    if not file_bytes or len(file_bytes) < 100:
        raise Exception("Invalid or empty image file")

    # ✅ Convert bytes → base64 (THIS IS THE KEY)
    encoded_file = base64.b64encode(file_bytes).decode("utf-8")

    options = UploadFileRequestOptions(
        folder="velocity/cars"   # ❗ no leading slash
    )

    upload_response = imagekit.upload(
        file=encoded_file,       # ✅ CORRECT
        file_name=file_name,
        options=options
    )

    return upload_response.url
