# 🚀 Velocity - Complete Setup & Testing Guide

## 📋 Prerequisites

You have Docker Desktop running with PostgreSQL container `velocity-postgres`.

## 🗄️ Step 1: Database Setup

### Check if PostgreSQL Container is Running
```bash
docker ps
```

You should see `velocity-postgres` container running on port 5432.

### If Container is Not Running, Start It
```bash
docker start velocity-postgres
```

### Access PostgreSQL (Optional - to verify database)
```bash
docker exec -it velocity-postgres psql -U postgres -d velocity
```

Once inside PostgreSQL:
```sql
-- List all tables
\dt

-- View users table
SELECT * FROM users;

-- View cars table
SELECT * FROM cars;

-- View bookings table
SELECT * FROM bookings;

-- Exit
\q
```

---

## 🔧 Step 2: Install Frontend Package

```bash
cd c:\Users\DELL\Desktop\Web\Velocity\Frontend
npm install imagekitio-react
```

---

## 🎯 Step 3: Start Backend Server

Open a new terminal/command prompt:

```bash
cd c:\Users\DELL\Desktop\Web\Velocity\Backend

# Activate virtual environment (if you have one)
# Windows:
.\venv\Scripts\activate
# Or if using Python directly:

# Run the backend server
python -m uvicorn app.main:app --reload
```

**Backend will start on:** http://localhost:8000

**API Documentation:** http://localhost:8000/docs

You should see:
```
✅ Database tables created
✅ Velocity API is running!
📚 API Documentation: http://localhost:8000/docs
```

---

## 🎨 Step 4: Start Frontend Server

Open ANOTHER terminal/command prompt:

```bash
cd c:\Users\DELL\Desktop\Web\Velocity\Frontend

# Start the development server
npm run dev
```

**Frontend will start on:** http://localhost:5173

You should see:
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## ✅ Step 5: Test Complete Application

### Test 1: Homepage
1. Open browser: http://localhost:5173
2. You should see:
   - VELOCITY wordmark in navbar
   - Hero section with car image
   - Search form
   - Stats section
   - How It Works section
   - Featured Cars (may be empty if no cars in DB)

### Test 2: Register as Owner
1. Click "Sign Up" button in navbar
2. Should see logo image (logo.jpeg) instead of text
3. Fill the form:
   - Full Name: `John Doe`
   - Email: `owner@test.com`
   - Phone: `+1234567890`
   - Account Type: **Owner - I want to list my cars**
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Create Account"
5. Should auto-login and redirect to `/owner/dashboard`
6. Dashboard should show:
   - Total Cars: 0
   - Total Bookings: 0
   - Pending: 0
   - Monthly Revenue: $0.00

### Test 3: Add a Car (Owner)
1. Click "Add New Car" or go to `/owner/add-car`
2. Fill the form:
   - Brand: `Porsche`
   - Model: `911 Carrera`
   - Year: `2024`
   - Daily Price: `500`
   - Category: `Sports`
   - Fuel Type: `Petrol`
   - Seating Capacity: `2`
   - Location: `Los Angeles, CA`
   - Description: `Beautiful sports car in pristine condition`
   - Upload an image (< 5MB)
3. Click "Add Car"
4. Should redirect to `/owner/cars`
5. Your car should appear in the grid
6. **Check Backend Logs** - You should see ImageKit upload happening
7. **Check ImageKit Dashboard** - Image should be at `/velocity/cars/`

### Test 4: Manage Cars (Owner)
1. On `/owner/cars` page
2. Click "Edit Details" on your car
3. Change Daily Price to `550`
4. Click "Save Changes"
5. Modal closes, price updated
6. Click "Mark Unavailable"
7. Status badge changes to "Unavailable"
8. Click again to toggle back to "Available"

### Test 5: Register as Renter
1. **Logout** (click profile dropdown → Logout)
2. Click "Sign Up"
3. Fill form with:
   - Full Name: `Jane Smith`
   - Email: `renter@test.com`
   - Phone: `+1987654321`
   - Account Type: **Renter - I want to rent cars**
   - Password: `password123`
4. Click "Create Account"
5. Should redirect to `/cars` (Browse Cars page)

### Test 6: Browse & Book a Car (Renter)
1. Go to `/cars` (Browse Cars)
2. You should see the Porsche you added
3. Click on the car card
4. Should go to `/cars/{id}` (Car Details)
5. Select dates and click "Book Now"
6. Booking should be created with status "Pending"
7. Go to `/my-bookings` (My Bookings in navbar)
8. Your pending booking should appear

### Test 7: Manage Bookings (Owner)
1. **Logout** from renter account
2. **Login** as owner (`owner@test.com`)
3. Go to `/owner/bookings` or click "Bookings" in navbar
4. You should see the pending booking from Jane
5. Booking shows:
   - Car: Porsche 911 Carrera
   - Renter: Jane Smith
   - Status: Pending
6. Click "Confirm Booking"
7. Status changes to "Confirmed"
8. Renter phone number now visible
9. Go to `/owner/dashboard`
10. Recent bookings table shows the confirmed booking
11. Stats updated:
    - Total Bookings: 1
    - Pending: 0
    - Monthly Revenue: (calculated amount)

### Test 8: View Confirmed Booking (Renter)
1. **Logout** from owner
2. **Login** as renter (`renter@test.com`)
3. Go to `/my-bookings`
4. Booking status is now "Confirmed"
5. Owner contact info is visible

---

## 🔍 Step 6: Verify Backend API

Open http://localhost:8000/docs in browser

Test endpoints directly:

### Test Authentication
1. Expand `POST /api/auth/register`
2. Click "Try it out"
3. Enter test data
4. Click "Execute"
5. Should return 201 with user ID

### Test Cars
1. `GET /api/cars` - Browse all cars
2. `GET /api/cars/featured` - Featured cars
3. `GET /api/cars/my-cars` - Owner's cars (needs auth token)

### Test Bookings
1. `GET /api/bookings/owner/dashboard` - Dashboard stats (needs auth)
2. `GET /api/bookings/my-car-bookings` - Owner's bookings (needs auth)

---

## 🧪 Step 7: Test Database Connection

### Check Backend Console
Backend terminal should show:
```
✅ Database tables created
INFO:     Application startup complete.
```

### Test Database Directly
```bash
docker exec -it velocity-postgres psql -U postgres -d velocity

-- View all users
SELECT id, email, full_name, role FROM users;

-- View all cars
SELECT id, brand, model, daily_price, status FROM cars;

-- View all bookings with details
SELECT 
    b.id, 
    c.brand || ' ' || c.model as car,
    u.full_name as renter,
    b.status,
    b.total_price
FROM bookings b
JOIN cars c ON b.car_id = c.id
JOIN users u ON b.renter_id = u.id;
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# Check database connection
docker ps | findstr postgres

# Check environment variables
cd Backend
type .env
```

### Frontend Won't Start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Reinstall dependencies
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
```bash
# Restart PostgreSQL container
docker restart velocity-postgres

# Wait 5 seconds, then restart backend
python -m uvicorn app.main:app --reload
```

### ImageKit Upload Fails
1. Check `.env` file has correct ImageKit keys
2. Check backend logs for error message
3. Verify ImageKit account is active
4. Try smaller image (< 2MB)

---

## 📊 Expected Results

After successful testing, you should have:

✅ Backend running on http://localhost:8000
✅ Frontend running on http://localhost:5173
✅ PostgreSQL container running
✅ 2 users in database (1 owner, 1 renter)
✅ 1 car listed by owner
✅ Car image uploaded to ImageKit
✅ 1 confirmed booking
✅ Owner dashboard showing correct stats
✅ All pages using logo image instead of text
✅ Protected routes working (redirects based on role)

---

## 🎉 Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Database connection successful
- [ ] Can register as Owner
- [ ] Can add a car with image
- [ ] Image uploads to ImageKit
- [ ] Can register as Renter
- [ ] Can book a car
- [ ] Owner can confirm booking
- [ ] Dashboard stats update correctly
- [ ] Login/Register pages show logo image
- [ ] All protected routes work
- [ ] Logout works
- [ ] Role-based navigation works

---

## 🔗 Quick Links

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **ImageKit Dashboard:** https://imagekit.io/dashboard

---

## 💡 Pro Tips

1. **Keep Both Terminals Open**: Backend and Frontend terminals should always be running
2. **Check Logs**: If something fails, check terminal logs for error messages
3. **Database State**: You can always check database state using `docker exec` commands
4. **Hot Reload**: Both backend (`--reload`) and frontend (Vite) auto-reload on code changes
5. **Clear Browser Cache**: If changes don't appear, hard refresh (Ctrl+Shift+R)
