"""
Comprehensive test suite for Velocity API

Run tests with: pytest -v
Run with coverage: pytest --cov=app --cov-report=html
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool
from app.main import app
from app.database import Base, get_db
from app.models.user import User
from app.models.car import Car
from app.models.booking import Booking

# Test database URL (use in-memory SQLite for testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create test engine
engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=NullPool,
)

# Create test session factory
TestingSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def override_get_db():
    """Override database dependency for testing"""
    async with TestingSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Override dependency
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
async def test_db():
    """Create test database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
async def client(test_db):
    """Create test client"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def owner_user(test_db):
    """Create a test owner user"""
    async with TestingSessionLocal() as session:
        user = User(
            email="owner@test.com",
            password_hash="$2b$12$dummyhash",  # This is a dummy hash
            full_name="Test Owner",
            phone="1234567890",
            role="owner"
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

@pytest.fixture
async def renter_user(test_db):
    """Create a test renter user"""
    async with TestingSessionLocal() as session:
        user = User(
            email="renter@test.com",
            password_hash="$2b$12$dummyhash",
            full_name="Test Renter",
            phone="0987654321",
            role="renter"
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


# ============ HEALTH CHECK TESTS ============

@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Velocity API is running"
    assert data["version"] == "1.0.0"

@pytest.mark.asyncio
async def test_health_check(client):
    """Test health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


# ============ AUTHENTICATION TESTS ============

@pytest.mark.asyncio
async def test_register_owner(client):
    """Test user registration as owner"""
    response = await client.post("/api/auth/register", json={
        "email": "newowner@test.com",
        "password": "password123",
        "full_name": "New Owner",
        "phone": "5555555555",
        "role": "owner"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "User registered successfully"
    assert "user_id" in data

@pytest.mark.asyncio
async def test_register_renter(client):
    """Test user registration as renter"""
    response = await client.post("/api/auth/register", json={
        "email": "newrenter@test.com",
        "password": "password123",
        "full_name": "New Renter",
        "role": "renter"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "User registered successfully"

@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    """Test registration with duplicate email"""
    # First registration
    await client.post("/api/auth/register", json={
        "email": "duplicate@test.com",
        "password": "password123",
        "full_name": "First User",
        "role": "owner"
    })
    
    # Try duplicate
    response = await client.post("/api/auth/register", json={
        "email": "duplicate@test.com",
        "password": "password123",
        "full_name": "Second User",
        "role": "renter"
    })
    assert response.status_code == 409

@pytest.mark.asyncio
async def test_register_invalid_role(client):
    """Test registration with invalid role"""
    response = await client.post("/api/auth/register", json={
        "email": "test@test.com",
        "password": "password123",
        "full_name": "Test User",
        "role": "admin"  # Invalid role
    })
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_login_success(client):
    """Test successful login"""
    # Register user first
    await client.post("/api/auth/register", json={
        "email": "login@test.com",
        "password": "password123",
        "full_name": "Login Test",
        "role": "owner"
    })
    
    # Login
    response = await client.post("/api/auth/login", json={
        "email": "login@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@test.com"

@pytest.mark.asyncio
async def test_login_wrong_password(client):
    """Test login with wrong password"""
    # Register user
    await client.post("/api/auth/register", json={
        "email": "wrong@test.com",
        "password": "password123",
        "full_name": "Wrong Test",
        "role": "renter"
    })
    
    # Try wrong password
    response = await client.post("/api/auth/login", json={
        "email": "wrong@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_login_nonexistent_user(client):
    """Test login with non-existent email"""
    response = await client.post("/api/auth/login", json={
        "email": "nonexistent@test.com",
        "password": "password123"
    })
    assert response.status_code == 401


# ============ CAR TESTS ============

@pytest.mark.asyncio
async def test_get_cars_empty(client):
    """Test getting cars when none exist"""
    response = await client.get("/api/cars")
    assert response.status_code == 200
    assert response.json() == []

@pytest.mark.asyncio
async def test_get_featured_cars_empty(client):
    """Test getting featured cars when none exist"""
    response = await client.get("/api/cars/featured")
    assert response.status_code == 200
    assert response.json() == []


# ============ PROTECTED ROUTE TESTS ============

@pytest.mark.asyncio
async def test_my_cars_unauthorized(client):
    """Test accessing my-cars without authentication"""
    response = await client.get("/api/cars/my-cars")
    assert response.status_code == 403  # No auth header

@pytest.mark.asyncio
async def test_my_bookings_unauthorized(client):
    """Test accessing my-bookings without authentication"""
    response = await client.get("/api/bookings/my-bookings")
    assert response.status_code == 403


# ============ VALIDATION TESTS ============

@pytest.mark.asyncio
async def test_register_short_password(client):
    """Test registration with password less than 8 characters"""
    response = await client.post("/api/auth/register", json={
        "email": "short@test.com",
        "password": "1234567",  # Only 7 characters
        "full_name": "Short Password",
        "role": "owner"
    })
    assert response.status_code == 422  # Validation error

@pytest.mark.asyncio
async def test_register_invalid_email(client):
    """Test registration with invalid email format"""
    response = await client.post("/api/auth/register", json={
        "email": "notanemail",
        "password": "password123",
        "full_name": "Invalid Email",
        "role": "owner"
    })
    assert response.status_code == 422


print("✅ Test suite created successfully!")
print("Run tests with: pytest -v")
print("Run with coverage: pytest --cov=app --cov-report=html")
