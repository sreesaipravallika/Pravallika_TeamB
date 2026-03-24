# 🚀 QuickServ - Complete Access Guide

## All Links, Endpoints, and Database Queries

---

## ✅ RUNNING SERVICES STATUS

All services are currently **RUNNING** and ready to use!

---

## 🌐 FRONTEND ACCESS

### Main Application (React + Vite)
- **Local URL**: http://localhost:5173/
- **Network URL**: http://192.168.1.5:5173/
- **Status**: ✅ Running
- **Technology**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui

### Available Pages:
1. **Home/Landing**: http://localhost:5173/
2. **Login**: http://localhost:5173/login
3. **Register**: http://localhost:5173/register
4. **Dashboard**: http://localhost:5173/dashboard (after login)
5. **Service Search**: http://localhost:5173/service-search (after login) ✨ NEW
6. **Provider Dashboard**: http://localhost:5173/provider-dashboard
7. **Admin Dashboard**: http://localhost:5173/admin-dashboard
8. **Service Brands**: http://localhost:5173/service-brands
9. **Provider Booking**: http://localhost:5173/provider-booking
10. **Simple Provider View**: http://localhost:5173/simple-provider-view

### Standalone Modules:
1. **Password Validation Demo**: Open `password-validation/index.html` in browser
2. **Color Scheme Demo**: Open `color-redesign/demo.html` in browser
3. **Service Search Feature**: Open `service-search/index.html` in browser

---

## 🔌 BACKEND API ACCESS

### Base URL
```
http://localhost:8080
```

### Health Check
```
GET http://localhost:8080/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "QuickServ API is running"
}
```

---

## 📡 API ENDPOINTS

### 1. Authentication Endpoints

#### Register Customer
```http
POST http://localhost:8080/api/auth/register/customer
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "Password123@",
  "location": "Mumbai"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
```

#### Register Provider
```http
POST http://localhost:8080/api/auth/register/provider
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "businessName": "Quick Services",
  "serviceCategory": "Plumbing",
  "location": "Delhi",
  "phone": "9876543210",
  "password": "Password123@"
}
```

#### Register Admin
```http
POST http://localhost:8080/api/auth/register/admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@quickserv.com",
  "password": "Admin123@",
  "adminKey": "QUICKSERV_ADMIN_2024"
}
```

#### Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123@"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
```

---

### 2. User Endpoints

#### Get Current User
```http
GET http://localhost:8080/api/users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "phone": "1234567890",
  "location": "Mumbai"
}
```

#### Get All Users (Admin Only)
```http
GET http://localhost:8080/api/users
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### Get Users by Role (Admin Only)
```http
GET http://localhost:8080/api/users/role/customer
Authorization: Bearer ADMIN_JWT_TOKEN
```

---

### 3. Booking Endpoints

#### Create Booking
```http
POST http://localhost:8080/api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "serviceType": "Plumbing",
  "location": "Mumbai, Maharashtra",
  "date": "2024-03-15",
  "time": "10:00 AM",
  "description": "Kitchen sink repair"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Booking created successfully"
}
```

#### Get User's Bookings
```http
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "service_type": "Plumbing",
    "location": "Mumbai, Maharashtra",
    "date": "2024-03-15",
    "time": "10:00 AM",
    "description": "Kitchen sink repair",
    "status": "pending",
    "created_at": "2024-03-12T10:30:00.000Z"
  }
]
```

#### Get All Bookings (Admin Only)
```http
GET http://localhost:8080/api/bookings/all
Authorization: Bearer ADMIN_JWT_TOKEN
```

---

### 4. Statistics Endpoints

#### Get System Statistics (Admin Only)
```http
GET http://localhost:8080/api/stats
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Response:**
```json
{
  "totalUsers": 10,
  "customers": 7,
  "providers": 2,
  "admins": 1,
  "totalBookings": 25,
  "pendingBookings": 5
}
```

---

## 💾 DATABASE ACCESS

### Database Type
**JSON File Database** (No SQL server required)

### Database Location
```
backend/database.json
```

### Current Database Content
```json
{
  "users": [
    {
      "id": 1,
      "name": "Sree Sai Pravallika.B",
      "email": "sreesaipravallika26@gmail.com",
      "password": "$2a$10$IzmAO.TtEowUH7ihdTvZU.A4rkJQcp5w93s0Rqd.mzbq6CmgxFkQ2",
      "role": "customer",
      "phone": "7989876487",
      "location": "Hyd",
      "business_name": null,
      "service_category": null,
      "created_at": "2026-03-12T14:08:37.518Z"
    }
  ],
  "bookings": [],
  "nextUserId": 2,
  "nextBookingId": 1
}
```

---

## 🔍 DATABASE QUERIES (JavaScript)

Since we're using a JSON file database, here are the equivalent "queries" in JavaScript:

### 1. Get All Users
```javascript
const db = require('./database.js');
const users = db.prepare('SELECT * FROM users').all();
console.log(users);
```

### 2. Get User by Email
```javascript
const user = db.prepare('SELECT * FROM users WHERE email = ?').get('john@example.com');
console.log(user);
```

### 3. Get Users by Role
```javascript
const customers = db.prepare('SELECT * FROM users WHERE role = ?').all('customer');
console.log(customers);
```

### 4. Count Users
```javascript
const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log(count.count);
```

### 5. Get All Bookings
```javascript
const bookings = db.prepare('SELECT * FROM bookings').all();
console.log(bookings);
```

### 6. Get Bookings by Customer
```javascript
const userBookings = db.prepare('SELECT * FROM bookings WHERE customer_id = ?').all(1);
console.log(userBookings);
```

### 7. Get Pending Bookings
```javascript
const pending = db.prepare("SELECT * FROM bookings WHERE status = 'pending'").all();
console.log(pending);
```

---

## 🧪 TESTING WITH CURL

### Test Health Endpoint
```bash
curl http://localhost:8080/api/health
```

### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "Test123@",
    "location": "Mumbai"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123@"
  }'
```

### Test Protected Endpoint
```bash
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 TESTING WITH POSTMAN

### Import Collection

Create a new Postman collection with these requests:

1. **Health Check**
   - Method: GET
   - URL: `http://localhost:8080/api/health`

2. **Register Customer**
   - Method: POST
   - URL: `http://localhost:8080/api/auth/register/customer`
   - Body (JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "1234567890",
     "password": "Test123@",
     "location": "Mumbai"
   }
   ```

3. **Login**
   - Method: POST
   - URL: `http://localhost:8080/api/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "Test123@"
   }
   ```
   - Save the `token` from response

4. **Get Current User**
   - Method: GET
   - URL: `http://localhost:8080/api/users/me`
   - Headers: `Authorization: Bearer {{token}}`

5. **Create Booking**
   - Method: POST
   - URL: `http://localhost:8080/api/bookings`
   - Headers: `Authorization: Bearer {{token}}`
   - Body (JSON):
   ```json
   {
     "serviceType": "Plumbing",
     "location": "Mumbai",
     "date": "2024-03-15",
     "time": "10:00 AM",
     "description": "Sink repair"
   }
   ```

---

## 📊 DATABASE SCHEMA

### Users Table
```javascript
{
  id: INTEGER (auto-increment),
  name: STRING (required),
  email: STRING (unique, required),
  password: STRING (hashed, required),
  role: STRING (customer/provider/admin),
  phone: STRING,
  location: STRING,
  business_name: STRING (providers only),
  service_category: STRING (providers only),
  created_at: DATETIME
}
```

### Bookings Table
```javascript
{
  id: INTEGER (auto-increment),
  customer_id: INTEGER (foreign key),
  provider_id: INTEGER (foreign key, nullable),
  service_type: STRING (required),
  location: STRING (required),
  date: STRING (required),
  time: STRING (required),
  description: STRING,
  status: STRING (pending/confirmed/completed/cancelled),
  created_at: DATETIME
}
```

---

## 🔐 AUTHENTICATION

### JWT Token Structure
```javascript
{
  id: 1,
  email: "user@example.com",
  role: "customer",
  iat: 1234567890,
  exp: 1234567890
}
```

### Token Expiry
- **Duration**: 7 days
- **Storage**: localStorage (key: `qs_token`)

### Admin Secret Key
```
QUICKSERV_ADMIN_2024
```

---

## 🎯 QUICK TEST SCENARIOS

### Scenario 1: Register and Login
1. Open: http://localhost:5173/register
2. Fill form with test data
3. Click "Register"
4. Redirected to login
5. Login with same credentials
6. Access dashboard

### Scenario 2: Create Booking
1. Login to dashboard
2. Click on a service
3. Fill booking form
4. Use GPS location or manual entry
5. Submit booking
6. View in "My Bookings"

### Scenario 3: Admin Access
1. Register with admin key: `QUICKSERV_ADMIN_2024`
2. Login as admin
3. Access admin dashboard
4. View all users and bookings

---

## 📱 MOBILE TESTING

### Network Access
Your app is accessible on local network at:
```
http://192.168.1.5:5173/
```

Test on mobile devices connected to same WiFi.

---

## 🛠️ TROUBLESHOOTING

### Backend Not Responding
```bash
# Check if running
curl http://localhost:8080/api/health

# Restart if needed
cd backend
npm start
```

### Frontend Not Loading
```bash
# Check if running
# Should see Vite dev server

# Restart if needed
npm run dev
```

### Database Issues
```bash
# View database
cat backend/database.json

# Reset database (delete all data)
echo '{"users":[],"bookings":[],"nextUserId":1,"nextBookingId":1}' > backend/database.json
```

---

## 📚 ADDITIONAL RESOURCES

### Documentation Files
- `LOGIN_INSTRUCTIONS.md` - Login setup guide
- `RUNNING_SERVICES.md` - Services overview
- `COLOR_SCHEME_UPDATE.md` - Color scheme details
- `password-validation/README.md` - Password validation docs
- `color-redesign/README.md` - Color redesign docs
- `service-search/README.md` - Service search technical docs
- `SEARCH_FEATURE.md` - Service search complete guide
- `SEARCH_VISUAL_GUIDE.md` - Service search visual demo guide
- `SERVICE_SEARCH_INTEGRATION.md` - React integration guide ✨ NEW

### Demo Files
- `password-validation/index.html` - Password validation demo
- `color-redesign/demo.html` - Color scheme demo
- `service-search/index.html` - Service search demo (25 providers)

### React Pages
- `src/pages/ServiceSearch.tsx` - Service search React component ✨ NEW

---

## 🎉 SUMMARY

### ✅ Frontend
- **URL**: http://localhost:5173/
- **Status**: Running
- **Features**: Full React app with all pages

### ✅ Backend
- **URL**: http://localhost:8080
- **Status**: Running
- **Endpoints**: 10+ API endpoints

### ✅ Database
- **Type**: JSON File
- **Location**: backend/database.json
- **Status**: Active
- **Current Users**: 1 customer

---

## 🚀 NEXT STEPS

1. ✅ Services are running
2. ✅ Test the frontend: http://localhost:5173/
3. ✅ Test the API: http://localhost:8080/api/health
4. ✅ Register a new user
5. ✅ Create a booking
6. ✅ Explore all features

---

**Everything is ready! Start testing your QuickServ platform! 🎊**
