from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, cars, bookings, imagekit_auth, messages
from app.database import init_db
from app.config import settings
from app.websocket import websocket_endpoint

app = FastAPI(
    title="Velocity API",
    description="Car Rental Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# IMPORTANT: CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # THIS ALLOWS ALL ORIGINS - FOR DEVELOPMENT ONLY
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(cars.router, prefix="/api/cars", tags=["Cars"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(imagekit_auth.router, prefix="/api/imagekit", tags=["ImageKit"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])

# WebSocket endpoint
@app.websocket("/ws/chat/{booking_id}")
async def websocket_chat(websocket: WebSocket, booking_id: str, token: str):
    await websocket_endpoint(websocket, booking_id, token)

@app.on_event("startup")
async def startup_event():
    await init_db()
    print("✅ Database tables created")
    print("✅ Velocity API is running!")

@app.get("/")
def root():
    return {"message": "Velocity API is running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}