# Velocity Backend API 🚗

> **FastAPI + PostgreSQL backend for peer-to-peer car rental platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192?logo=postgresql)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python)](https://www.python.org/)

## 👨‍💻 Built By

**Malik Saad Hayat** - Backend Engineer

*Part of the Velocity Team:*
- **Ahmad Mustafa** - Frontend Developer
- **Muneeb Zia** - Developer
- **Malik Saad Hayat** - Backend Engineer

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | FastAPI 0.115.6, Uvicorn 0.32.1 |
| **Database** | PostgreSQL 14+, SQLAlchemy 2.0.36, asyncpg 0.30.0 |
| **Authentication** | JWT (python-jose 3.3.0), bcrypt 4.0.1, passlib 1.7.4 |
| **Validation** | Pydantic 2.10.6, email-validator 2.3.0 |
| **Storage** | ImageKit CDN 3.2.0 |
| **Migrations** | Alembic 1.14.0 |
| **Testing** | pytest 7.4.3, httpx 0.25.2, pytest-asyncio 0.21.1 |

---

## ✨ Features

✅ **16 RESTful API Endpoints** - Complete CRUD operations for users, cars, and bookings  
✅ **JWT Authentication** - Secure token-based auth with role-based access control  
✅ **PostgreSQL Database** - 3 normalized tables with foreign key relationships  
✅ **ImageKit CDN Integration** - Cloud-based image storage and optimization  
✅ **Date Conflict Prevention** - SQL-based overlap detection for bookings  
✅ **Owner Dashboard** - Revenue stats, booking analytics, and insights  
✅ **Async Operations** - Non-blocking database queries for high performance  
✅ **Type Safety** - Full Pydantic validation on all endpoints  

---

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,                    -- UUID
    email VARCHAR UNIQUE NOT NULL,             -- Indexed
    password_hash VARCHAR NOT NULL,            -- Bcrypt hashed
    full_name VARCHAR NOT NULL,
    phone VARCHAR,
    role VARCHAR NOT NULL,                     -- 'owner' or 'renter'
    created_at TIMESTAMP NOT NULL
);
```

### **Cars Table**
```sql
CREATE TABLE cars (
    id VARCHAR PRIMARY KEY,                    -- UUID
    owner_id VARCHAR NOT NULL,                 -- FK → users.id (CASCADE)
    brand VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    daily_price FLOAT NOT NULL,
    category VARCHAR NOT NULL,                 -- Sedan, SUV, Hatchback, etc.
    fuel_type VARCHAR NOT NULL,                -- Petrol, Diesel, Electric, Hybrid
    seating_capacity INTEGER NOT NULL,
    location VARCHAR NOT NULL,
    description VARCHAR,
    image_url VARCHAR NOT NULL,                -- ImageKit CDN URL
    status VARCHAR NOT NULL,                   -- 'available' or 'unavailable'
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX ix_cars_owner_id ON cars(owner_id);
```

### **Bookings Table**
```sql
CREATE TABLE bookings (
    id VARCHAR PRIMARY KEY,                    -- UUID
    car_id VARCHAR NOT NULL,                   -- FK → cars.id (CASCADE)
    renter_id VARCHAR NOT NULL,                -- FK → users.id (CASCADE)
    pickup_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP NOT NULL,
    total_price FLOAT NOT NULL,
    status VARCHAR NOT NULL,                   -- pending, confirmed, rejected, completed
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY(car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY(renter_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX ix_bookings_car_id ON bookings(car_id);
CREATE INDEX ix_bookings_renter_id ON bookings(renter_id);
CREATE INDEX ix_bookings_created_at ON bookings(created_at);
```

---

## 📡 API Endpoints

### **Authentication** (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user (owner/renter) | ❌ |
| POST | `/api/auth/login` | Login and receive JWT token | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |

**Example: Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "owner@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "phone": "1234567890",
  "role": "owner"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user_id": "08890d14-b0d8-4920-bbf4-944e3a512c80"
}
```

---

### **Cars** (`/api/cars`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cars` | Search/filter available cars | ❌ |
| GET | `/api/cars/featured` | Get 6 random featured cars | ❌ |
| GET | `/api/cars/{id}` | Get specific car details | ❌ |
| GET | `/api/cars/my-cars` | Get owner's cars | ✅ Owner |
| POST | `/api/cars` | Create new car listing (with image) | ✅ Owner |
| PUT | `/api/cars/{id}` | Update car details | ✅ Owner |
| PATCH | `/api/cars/{id}/status` | Toggle car availability | ✅ Owner |
| DELETE | `/api/cars/{id}` | Delete car listing | ✅ Owner |

**Example: Search Cars**
```bash
GET /api/cars?search=toyota&category=sedan&min_price=50&max_price=150&location=karachi
```

**Filters Available:**
- `search` - Search by brand or model
- `min_price` / `max_price` - Price range
- `category` - Sedan, SUV, Hatchback, Luxury, Sports, Van
- `fuel_type` - Petrol, Diesel, Electric, Hybrid
- `location` - Location search (case-insensitive)
- `seating` - Minimum seating capacity
- `pickup_date` / `return_date` - Date availability check

---

### **Bookings** (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create new booking request | ✅ Renter |
| GET | `/api/bookings/my-bookings` | Get renter's bookings | ✅ Renter |
| GET | `/api/bookings/my-car-bookings` | Get bookings for owner's cars | ✅ Owner |
| PATCH | `/api/bookings/{id}/status` | Confirm/reject booking | ✅ Owner |
| GET | `/api/bookings/owner/dashboard` | Owner dashboard statistics | ✅ Owner |

**Example: Create Booking**
```bash
POST /api/bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "car_id": "abc123...",
  "pickup_date": "2025-01-15T10:00:00",
  "return_date": "2025-01-20T10:00:00"
}
```

**Response:**
```json
{
  "id": "booking-uuid",
  "car_id": "abc123...",
  "renter_id": "user-uuid",
  "pickup_date": "2025-01-15T10:00:00",
  "return_date": "2025-01-20T10:00:00",
  "total_price": 750.0,
  "status": "pending",
  "car_brand": "Toyota",
  "car_model": "Camry"
}
```

---

## 🚀 Setup Instructions

### **Prerequisites**
- Python 3.13+
- PostgreSQL 14+
- ImageKit account (for image uploads)

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/velocity.git
cd velocity/Backend
```

### **2. Create Virtual Environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### **3. Install Dependencies**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### **4. Setup PostgreSQL**

**Option A: Local Installation**
```bash
# Create database
createdb velocity

# Or using psql
psql -U postgres
CREATE DATABASE velocity;
```

**Option B: Docker**
```bash
docker run -d \
  --name velocity-postgres \
  -e POSTGRES_DB=velocity \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:14
```

**Option C: Cloud (Supabase/Railway/Neon)**
- Create account and provision PostgreSQL database
- Copy connection string

### **5. Configure Environment Variables**
```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
nano .env
```

### **6. Run Database Migrations**
```bash
# Tables are auto-created on first startup
# Or use Alembic for migrations:
alembic upgrade head
```

### **7. Start Development Server**
```bash
uvicorn app.main:app --reload
```

Server will start at: **http://localhost:8000**

---

## 🔐 Environment Variables

Create a `.env` file in the `Backend/` directory:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/velocity

# JWT Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24

# ImageKit CDN
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Frontend CORS
FRONTEND_URL=http://localhost:3000
```

**Security Notes:**
- Never commit `.env` to version control
- Use strong, random values for `JWT_SECRET_KEY` in production
- Rotate secrets regularly

---

## 🖥️ Running Locally

### **Start the Server**
```bash
uvicorn app.main:app --reload
```

### **Access API Documentation**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### **Health Check**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Velocity API",
  "version": "1.0.0"
}
```

---

## 📚 API Documentation

The API includes **auto-generated interactive documentation**:

### **Swagger UI** (http://localhost:8000/docs)
- Interactive API explorer
- Test endpoints directly in browser
- View request/response schemas
- Try authentication with JWT tokens

### **ReDoc** (http://localhost:8000/redoc)
- Clean, searchable documentation
- Mobile-responsive
- Perfect for sharing with frontend team

---

## 🔑 Key Features Implemented

### **1. Async Database Operations**
```python
# All queries are non-blocking
async def get_cars(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Car).where(Car.status == "available"))
    return result.scalars().all()
```

### **2. Password Hashing with Bcrypt**
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)
```

### **3. JWT Token Generation**
```python
from jose import jwt

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

### **4. Role-Based Middleware**
```python
def require_owner(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")
    return current_user
```

### **5. Date Overlap Checking**
```python
# Prevent double-booking with SQL
conflict_query = select(Booking).where(
    and_(
        Booking.car_id == car_id,
        Booking.status.in_(["pending", "confirmed"]),
        Booking.pickup_date < return_date,
        Booking.return_date > pickup_date
    )
)
```

### **6. Image Upload to ImageKit**
```python
from imagekitio import ImageKit

async def upload_car_image(image_bytes, filename):
    imagekit = ImageKit(
        private_key=IMAGEKIT_PRIVATE_KEY,
        public_key=IMAGEKIT_PUBLIC_KEY,
        url_endpoint=IMAGEKIT_URL_ENDPOINT
    )
    result = imagekit.upload(file=image_bytes, file_name=filename)
    return result.url
```

### **7. Revenue Calculation**
```python
# Monthly revenue for owner
monthly_revenue = await db.execute(
    select(func.sum(Booking.total_price)).where(
        and_(
            Booking.car_id.in_(owner_car_ids),
            Booking.status == "confirmed",
            Booking.created_at >= current_month_start
        )
    )
)
```

### **8. Advanced Search & Filter**
```python
# Dynamic query building
query = select(Car).where(Car.status == "available")

if search:
    query = query.where(or_(
        Car.brand.ilike(f"%{search}%"),
        Car.model.ilike(f"%{search}%")
    ))

if min_price:
    query = query.where(Car.daily_price >= min_price)
```

---

## 🧪 Testing

### **Run All Tests**
```bash
pytest test_api.py -v
```

### **Run with Coverage**
```bash
pytest test_api.py --cov=app --cov-report=html
```

### **Manual Integration Tests**
```bash
# Make sure server is running first
python manual_test.py
```

**Test Output:**
```
🚀 Velocity API Manual Testing
============================================================
1. Health Check                    ✅ 200 OK
2. Register Owner                  ✅ 201 Created
3. Register Renter                 ✅ 201 Created
4. Login as Owner                  ✅ 200 OK
5. Get Current User                ✅ 200 OK
...
```

---

## 🌐 Deployment

### **Deploy to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add

# Set environment variables
railway variables set JWT_SECRET_KEY=your-secret-key

# Deploy
railway up
```

### **Deploy to Render**
1. Create account at [render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Add environment variables
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### **Deploy to Heroku**
```bash
# Create Heroku app
heroku create velocity-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET_KEY=your-secret-key

# Deploy
git push heroku main
```

---

## 📁 Project Structure

```
Backend/
├── app/
│   ├── main.py                    # FastAPI app + CORS + startup
│   ├── config.py                  # Environment configuration
│   ├── database.py                # PostgreSQL async engine + session
│   │
│   ├── models/                    # SQLAlchemy ORM Models
│   │   ├── __init__.py
│   │   ├── user.py               # User table
│   │   ├── car.py                # Car table
│   │   └── booking.py            # Booking table
│   │
│   ├── schemas/                   # Pydantic Request/Response Schemas
│   │   ├── __init__.py
│   │   ├── user.py               # UserRegister, UserLogin, UserResponse
│   │   ├── car.py                # CarCreate, CarUpdate, CarResponse
│   │   └── booking.py            # BookingCreate, BookingResponse
│   │
│   ├── routers/                   # API Route Handlers
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication endpoints
│   │   ├── cars.py               # Car CRUD + search/filter
│   │   └── bookings.py           # Booking management + dashboard
│   │
│   ├── utils/                     # Helper Functions
│   │   ├── __init__.py
│   │   ├── auth.py               # Password hashing, JWT tokens
│   │   └── imagekit.py           # Image upload to ImageKit CDN
│   │
│   └── middleware/                # Custom Middleware
│       ├── __init__.py
│       └── auth.py               # JWT verification + role enforcement
│
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── requirements.txt               # Python dependencies
├── manual_test.py                 # Integration test script
├── test_api.py                    # Unit tests (pytest)
├── pyproject.toml                 # Pytest configuration
├── alembic.ini                    # Alembic config (optional)
└── README.md                      # This file
```

---

## 🤝 Contributing

This backend is part of the **Velocity** team project:

- **Frontend**: Ahmad Mustafa - React.js UI/UX
- **Full-Stack**: Muneeb Zia - Integration & deployment
- **Backend**: Malik Saad Hayat - API & database

### **Development Workflow**
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with conventional commits: `git commit -m "feat: add new endpoint"`
4. Push and create Pull Request
5. Request review from team members

### **Code Style**
- Follow PEP 8 for Python code
- Use type hints for all functions
- Add docstrings to all endpoints
- Run `black` for formatting: `black app/`
- Run `mypy` for type checking: `mypy app/`

---

## 📝 API Versioning

Current version: **v1.0.0**

Future versions will be prefixed: `/api/v2/...`

---

## 📄 License

This project is part of an academic/portfolio project.

---

## 📧 Contact

**Malik Saad Hayat**  
Backend Engineer  
Email: [your.email@example.com]  
LinkedIn: [linkedin.com/in/yourprofile]  
GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **FastAPI** - Amazing async web framework
- **SQLAlchemy** - Powerful ORM with excellent async support
- **PostgreSQL** - Rock-solid relational database
- **ImageKit** - Reliable CDN service
- **Velocity Team** - Ahmad, Muneeb, and Saad

---

<div align="center">

**Built with ❤️ by Malik Saad Hayat**

⭐ Star this repo if you found it helpful!

</div>
