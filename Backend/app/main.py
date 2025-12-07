from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, cars, bookings
from app.database import init_db
from app.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Velocity API",
    description="Car Rental Platform API - Complete backend for renting and listing cars",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(cars.router, prefix="/api/cars", tags=["Cars"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    await init_db()
    print("✅ Database tables created")
    print("✅ Velocity API is running!")
    print(f"📚 API Documentation: http://localhost:8000/docs")

@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "message": "Velocity API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Velocity API",
        "version": "1.0.0"
    }

