# 🚀 QuickServ Project - Complete Access Guide

## ✅ PROJECT STATUS: RUNNING

Both frontend and backend services are now running successfully!

---

## 🌐 Access URLs

### 🎨 Frontend (React + Vite)
- **Main URL**: http://localhost:5173/
- **Network URL**: http://10.142.198.186:5173/
- **Status**: ✅ Running
- **Port**: 5173

### 🔧 Backend (Node.js + Express)
- **API URL**: http://localhost:8080/
- **Status**: ✅ Running
- **Port**: 8080

### 🗄️ Database
- **Type**: JSON File Database
- **Location**: `backend/database.json`
- **Console**: http://localhost:8080/db-console

---

## 🔐 Login Credentials

### Customer Account
```
Email: customer@test.com
Password: Test@123
Role: customer
```

### Provider Account
```
Email: provider@test.com
Password: Test@123
Role: provider
```

### Admin Account
```
Email: admin@test.com
Password: Test@123
Role: admin
Admin Key: QUICKSERV_ADMIN_2024
```

---

## 📱 Available Pages & Features

### 🏠 Customer Pages (http://localhost:5173/)
1. **Login**: `/login`
2. **Register**: `/register`
3. **Dashboard**: `/dashboard`
   - Quick booking form
   - Service statistics
   - Find service providers section
4. **Service Search**: `/service-search`
   - Real-time search across 25+ providers
   - 10 service categories
   - Popular tags
5. **Simple Provider View**: `/simple-provider-view`
   - Search by city (Mumbai, Delhi, Bangalore, Pune, Chennai)
   - View timings and prices
   - 10 sample providers
6. **Service Brands**: `/service-brands`
7. **Provider Booking**: `/provider-booking`

### 👷 Provider Pages
1. **Provider Dashboard**: `/provider-dashboard`
   - View bookings
   - Manage services
   - Update availability

### 👨‍💼 Admin Pages
1. **Admin Dashboard**: `/admin-dashboard`
   - User management
   - System statistics
   - Database console access
2. **Database Console**: `/database-console`
   - SQL-like queries
   - Export to CSV
   - Statistics dashboard

---

## 🔌 API Endpoints

### Authentication
```
POST http://localhost:8080/api/auth/register/customer
POST http://localhost:8080/api/auth/register/provider
POST http://localhost:8080/api/auth/register/admin
POST http://localhost:8080/api/auth/login
GET  http://localhost:8080/api/users/me
```

### Booking Module
```
POST http://localhost:8080/api/booking/create
GET  http://localhost:8080/api/booking/customer/:id
GET  http://localhost:8080/api/booking/provider/:id
PUT  http://localhost:8080/api/booking/status/:bookingId
```

### Other Endpoints
```
GET  http://localhost:8080/api/health
GET  http://localhost:8080/db-console
GET  http://localhost:8080/api/bookings
POST http://localhost:8080/api/bookings
```

---

## 🧪 Test Scenarios

### Test 1: Customer Registration & Login
1. Go to http://localhost:5173/register
2. Fill in details and select "Customer"
3. Login with credentials
4. Access dashboard

### Test 2: Service Search
1. Login as customer
2. Click search bar on dashboard → redirects to `/service-search`
3. Search for "plumbing" or "cleaning"
4. View 25+ providers across categories

### Test 3: Simple Provider View
1. Login as customer
2. Go to "Find Service Providers" section
3. Click "Simple Provider View" card
4. Search for "Mumbai" or "Delhi"
5. View providers with timings and prices

### Test 4: Booking Creation
1. Login as customer
2. Fill booking form on dashboard
3. Submit booking
4. Check booking status

### Test 5: Database Console (Admin Only)
1. Login as admin
2. Click "Open Database Console" button
3. Run queries like:
   - `SELECT * FROM users`
   - `SELECT * FROM bookings WHERE status='PENDING'`
4. Export results to CSV

---

## 🎯 Quick Navigation Guide

### From Dashboard Search Bar:
- Click search bar → Redirects to Service Search page
- Search for any service → Real-time results

### From "Find Service Providers" Section:
- **Simple Provider View** → City-based provider search
- **Provider Booking** → Book specific providers
- **Service Brands** → Browse by brand

---

## 📊 Database Structure

### Users Table
```json
{
  "id": "unique_id",
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed_password",
  "phone": "1234567890",
  "role": "customer|provider|admin"
}
```

### Bookings Table
```json
{
  "booking_id": "unique_id",
  "customer_id": "user_id",
  "provider_id": "provider_id",
  "booking_date": "2024-01-01T10:00:00Z",
  "service_date": "2024-01-05",
  "status": "PENDING|CONFIRMED|COMPLETED|CANCELLED"
}
```

---

## 🛠️ Development Commands

### Start Frontend
```bash
npm run dev
```

### Start Backend
```bash
cd backend
npm start
```

### Stop Services
- Press `Ctrl + C` in respective terminals

---

## 🎨 Color Scheme

### Current Theme: Teal/Cyan Ocean
- Primary: Turquoise Teal (#14b8a6)
- Secondary: Cyan (#06b6d4)
- Accent: Emerald (#10b981)

### Alternative Theme Available
- See `color-redesign/` folder for Royal Blue + Emerald Green theme

---

## 📁 Project Structure

```
QuickServ/
├── backend/
│   ├── server.js          # Express server
│   ├── database.js        # Database operations
│   ├── database.json      # JSON database
│   ├── db-console.html    # Database console
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── ServiceSearch.tsx
│   │   ├── SimpleProviderView.tsx
│   │   ├── DatabaseConsole.tsx
│   │   └── ...
│   ├── App.tsx
│   └── index.css
├── service-search/        # Standalone search demo
├── password-validation/   # Standalone password demo
├── color-redesign/        # Alternative color scheme
└── package.json
```

---

## ✨ Key Features Implemented

✅ User Authentication (JWT)
✅ Role-based Access Control (Customer, Provider, Admin)
✅ Service Search (25+ providers, 10 categories)
✅ Simple Provider View (City-based search)
✅ Booking Module (PENDING → CONFIRMED → COMPLETED)
✅ Database Console (SQL-like queries, CSV export)
✅ GPS Location Feature
✅ Password Validation System
✅ Responsive Design
✅ Search Bar Navigation
✅ Modern UI with Smooth Animations

---

## 🔍 Testing Checklist

- [ ] Register new customer account
- [ ] Login with customer credentials
- [ ] Access dashboard
- [ ] Use search bar (redirects to service search)
- [ ] Search for services (plumbing, cleaning, etc.)
- [ ] Access Simple Provider View
- [ ] Search providers by city
- [ ] Create a booking
- [ ] Login as admin
- [ ] Access database console
- [ ] Run SQL queries
- [ ] Export data to CSV

---

## 📞 Support & Documentation

### Additional Guides:
- `BOOKING_MODULE_GUIDE.md` - Complete booking system guide
- `DATABASE_CONSOLE_GUIDE.md` - Database console usage
- `SERVICE_SEARCH_INTEGRATION.md` - Service search details
- `SEARCH_BAR_NAVIGATION.md` - Search navigation info
- `SIMPLE_PROVIDER_VIEW_GUIDE.md` - Provider view guide
- `LOGIN_INSTRUCTIONS.md` - Login credentials
- `COLOR_SCHEME_UPDATE.md` - Color theme info

---

## 🎉 Ready to Use!

Your QuickServ application is fully running and ready for testing!

**Start Here**: http://localhost:5173/

Happy Testing! 🚀
