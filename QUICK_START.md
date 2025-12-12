# Quick Start Commands

## 1. Install Frontend Package
```bash
cd c:\Users\DELL\Desktop\Web\Velocity\Frontend
npm install imagekitio-react
```

## 2. Start Backend (Terminal 1)
```bash
cd c:\Users\DELL\Desktop\Web\Velocity\Backend
python -m uvicorn app.main:app --reload
```
**Runs on:** http://localhost:8000

## 3. Start Frontend (Terminal 2)
```bash
cd c:\Users\DELL\Desktop\Web\Velocity\Frontend
npm run dev
```
**Runs on:** http://localhost:5173

## 4. Check Database (Optional)
```bash
docker exec -it velocity-postgres psql -U postgres -d velocity
```

Inside PostgreSQL:
```sql
\dt                    -- List tables
SELECT * FROM users;   -- View users
\q                     -- Exit
```

## Testing URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Test Flow
1. Register as Owner at `/register`
2. Add a car at `/owner/add-car`
3. Register as Renter (logout first)
4. Book the car from `/cars`
5. Login as Owner and confirm booking at `/owner/bookings`

## Complete Guide
See `SETUP_AND_TEST_GUIDE.md` for detailed testing steps.
