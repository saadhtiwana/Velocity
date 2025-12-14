<h1 align="center">Velocity</h1>

<p align="center">
  <strong>A Premium Car Rental Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#payment-integration">Payments</a>
</p>

---

## Preview

<p align="center">
  <img src="Frontend/public/images/hero-section.jpg" alt="Hero Section" width="100%"/>
</p>

<p align="center">
  <img src="Frontend/public/images/lower-hero.jpg" alt="How It Works" width="100%"/>
</p>

<p align="center">
  <img src="Frontend/public/images/404.jpg" alt="404 Page" width="100%"/>
</p>

---

## 📖 Overview

**Velocity** is a full-stack car rental platform that connects car owners with renters. Built with modern technologies, it offers a seamless experience for listing vehicles, booking cars, managing rentals, and real-time communication between parties.

The platform supports two user roles:
- **Car Owners**: List and manage their vehicles, handle booking requests, and communicate with potential renters
- **Renters**: Browse available cars, make bookings, track rental status, and chat with car owners

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with JWT tokens
- Role-based access control (Owner/Renter)
- Password hashing with bcrypt
- Protected routes for authenticated users

### 🚙 Car Management
- Full CRUD operations for car listings
- Multiple car categories: Sedan, SUV, Hatchback, Luxury, Sports, Van
- Fuel type options: Petrol, Diesel, Electric, Hybrid
- Image upload via ImageKit CDN
- Advanced filtering and search capabilities
- Location-based listings

### 📅 Booking System
- Date-based booking with pickup and return dates
- Automatic price calculation based on rental duration
- Booking status workflow: Pending → Confirmed/Rejected → Completed
- Owner approval/rejection system
- Renter booking history and management

### 💬 Real-Time Chat
- WebSocket-powered messaging between renters and owners
- Pre-booking inquiries (before making a reservation)
- Post-booking communication
- Message history persistence
- Unread message indicators

### 💳 Payment Integration
- **Stripe** integration for secure payment processing
- Support for credit/debit card payments
- Secure checkout flow

### 🎨 Modern UI/UX
- Premium Porsche-inspired design aesthetic
- Responsive layouts for all devices
- Smooth animations with Framer Motion
- Loading skeletons for better UX
- Custom loading screen with branding

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern, high-performance Python web framework |
| **SQLAlchemy** | SQL toolkit and ORM for database operations |
| **PostgreSQL** | Production-ready relational database |
| **Alembic** | Database migration management |
| **Pydantic** | Data validation using Python type annotations |
| **python-jose** | JWT token generation and validation |
| **Passlib + bcrypt** | Secure password hashing |
| **ImageKit** | Cloud-based image CDN and storage |
| **WebSockets** | Real-time bi-directional communication |
| **Stripe** | Payment processing integration |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI component library |
| **Vite** | Fast build tool and dev server |
| **React Router DOM v7** | Client-side routing |
| **TailwindCSS** | Utility-first CSS framework |
| **Framer Motion** | Production-ready animation library |
| **Axios** | HTTP client for API requests |
| **Lucide React** | Beautiful icon library |
| **date-fns** | Date utility library |

---

## 📁 Project Structure

```
Velocity/
├── Backend/                    # FastAPI Backend Application
│   ├── app/
│   │   ├── models/             # SQLAlchemy database models
│   │   │   ├── user.py         # User model (renter/owner)
│   │   │   ├── car.py          # Car listing model
│   │   │   ├── booking.py      # Booking model
│   │   │   └── message.py      # Chat message model
│   │   ├── routers/            # API route handlers
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── cars.py         # Car CRUD endpoints
│   │   │   ├── bookings.py     # Booking management
│   │   │   ├── messages.py     # Chat messaging
│   │   │   └── imagekit_auth.py# ImageKit authentication
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── utils/              # Helper utilities
│   │   ├── middleware/         # Custom middleware
│   │   ├── config.py           # Application configuration
│   │   ├── database.py         # Database connection setup
│   │   ├── main.py             # FastAPI application entry
│   │   └── websocket.py        # WebSocket handler
│   ├── alembic/                # Database migrations
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
├── Frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   ├── CarCard.jsx     # Car listing card
│   │   │   ├── ChatBox.jsx     # Real-time chat component
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Cars.jsx        # Car listings
│   │   │   ├── CarDetails.jsx  # Individual car page
│   │   │   ├── MyBookings.jsx  # Renter bookings
│   │   │   ├── About.jsx       # About page
│   │   │   ├── Login.jsx       # Authentication
│   │   │   ├── Register.jsx    # User registration
│   │   │   ├── NotFound.jsx    # 404 page
│   │   │   └── owner/          # Owner-specific pages
│   │   │       ├── OwnerDashboard.jsx
│   │   │       ├── AddCar.jsx
│   │   │       ├── ManageCars.jsx
│   │   │       ├── ManageBookings.jsx
│   │   │       └── Chats.jsx
│   │   ├── context/            # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Vite configuration
│
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/velocity
   SECRET_KEY=your-super-secret-key-here
   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-endpoint
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

5. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE velocity;
   ```

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Start the server**
   ```bash
   uvicorn app.main:app --reload
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-endpoint
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

---

## 📚 API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

#### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | List all cars |
| GET | `/api/cars/{id}` | Get car details |
| POST | `/api/cars` | Create new car (owner) |
| PUT | `/api/cars/{id}` | Update car (owner) |
| DELETE | `/api/cars/{id}` | Delete car (owner) |

#### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/{id}/status` | Update booking status |

#### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/{booking_id}` | Get chat messages |
| POST | `/api/messages` | Send message |

---

## 💳 Payment Integration

Velocity uses **Stripe** for secure payment processing. The integration includes:

- Secure tokenized card payments
- PCI-compliant checkout flow
- Support for major credit/debit cards (Visa, Mastercard, American Express)
- Real-time payment status updates
- Refund handling for cancelled bookings

### Setting Up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add keys to your environment variables:
   - `STRIPE_SECRET_KEY` (Backend)
   - `STRIPE_PUBLISHABLE_KEY` (Frontend)

---

## 🗄 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| password_hash | String | Bcrypt hashed password |
| full_name | String | User's full name |
| phone | String | Contact number |
| role | String | "renter" or "owner" |
| created_at | DateTime | Registration timestamp |

### Cars Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | Foreign key to users |
| brand | String | Car brand (Toyota, BMW, etc.) |
| model | String | Car model |
| year | Integer | Manufacturing year |
| daily_price | Float | Rental price per day |
| category | String | Sedan, SUV, Luxury, etc. |
| fuel_type | String | Petrol, Diesel, Electric, Hybrid |
| seating_capacity | Integer | Number of seats |
| location | String | Car location |
| description | Text | Car description |
| image_url | String | ImageKit CDN URL |
| status | String | "available" or "unavailable" |

### Bookings Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| car_id | UUID | Foreign key to cars |
| renter_id | UUID | Foreign key to users |
| pickup_date | DateTime | Start of rental |
| return_date | DateTime | End of rental |
| total_price | Float | Calculated total cost |
| status | String | pending/confirmed/rejected/completed |
| created_at | DateTime | Booking timestamp |

### Messages Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| booking_id | UUID | Foreign key to bookings (nullable) |
| car_id | UUID | Foreign key to cars (nullable) |
| sender_id | UUID | Foreign key to users |
| receiver_id | UUID | Foreign key to users |
| message_content | Text | Message text |
| timestamp | DateTime | Sent time |
| is_read | String | Read status |

---

## 🧪 Testing

### Backend Tests
```bash
cd Backend
pytest test_api.py -v
pytest test_integration.py -v
```

### API Health Check
```bash
curl http://localhost:8000/health
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt
- **CORS Configuration**: Configurable allowed origins
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **Input Validation**: Pydantic schema validation
- **Protected Routes**: Role-based access control

---

## 🚀 Deployment

### Backend (Production)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend (Build)
```bash
npm run build
```

The production build will be in the `dist` folder.

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
SECRET_KEY=your-jwt-secret-key
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_IMAGEKIT_PUBLIC_KEY=your-public-key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the Velocity Team
</p>
