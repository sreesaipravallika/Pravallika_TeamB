# 🚀 QuickServ - Complete Access Guide
## All Services Running ✅

---

## 📊 SERVICES STATUS

| Service | Status | URL | Port |
|---------|--------|-----|------|
| Frontend (React) | ✅ Running | http://localhost:5173 | 5173 |
| Backend (Express) | ✅ Running | http://localhost:8080 | 8080 |
| Database (JSON) | ✅ Active | backend/database.json | - |

---

## 🌐 FRONTEND ACCESS

### Main Application
**URL**: http://localhost:5173

### All Available Pages

| Page | URL | Access | Description |
|------|-----|--------|-------------|
| Login | http://localhost:5173/login | Public | User login page |
| Register | http://localhost:5173/register | Public | New user registration |
| Dashboard | http://localhost:5173/dashboard | Customer | Main customer dashboard |
| **Service Search** | **http://localhost:5173/service-search** | **Customer** | **🆕 Real-time service search** |
| Service Brands | http://localhost:5173/service-brands | Customer | Browse service brands |
| Provider Booking | http://localhost:5173/provider-booking | Customer | Advanced booking system |
| Simple Provider View | http://localhost:5173/simple-provider-view | Customer | Simple provider listing |
| Provider Dashboard | http://localhost:5173/provider-dashboard | Provider | Provider management |
| Admin Dashboard | http://localhost:5173/admin-dashboard | Admin | Admin panel |

### 🆕 NEW: Service Search Feature
**Direct Link**: http://localhost:5173/service-search

**Features**:
- ✅ Real-time search across 25 service providers
- ✅ Case-insensitive partial matching
- ✅ Search by: provider name, service name, category, location
- ✅ Popular search tags for quick access
- ✅ Beautiful responsive design
- ✅ Integrated "Book Now" functionality

**How to Access**:
1. Login at http://localhost:5173/login
2. Go to Dashboard
3. Scroll to "🔍 Find Service Providers" section
4. Click "Service Search" card (third option)

**Try These Searches**:
- `plumber` → 3 results
- `electrician` → 3 results
- `tutor` → 4 results
- `AC repair` → 3 results
- `cleaning` → 3 results
- `mumbai` → 8 results (location search)
- `home` → 19 results (category search)

---

## 🔌 BACKEND API ACCESS

### Base URL
```
http://localhost:8080
```

### Health Check
```bash
GET http://localhost:8080/api/health
```

**Test with curl**:
```bash
curl http://localhost:8080/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "message": "QuickServ API is running"
}
```

---

## 📡 API ENDPOINTS

### 1️⃣ Authentication Endpoints

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

**curl command**:
```bash
curl -X POST http://localhost:8080/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"1234567890\",\"password\":\"Password123@\",\"location\":\"Mumbai\"}"
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

**Admin Secret Key**: `QUICKSERV_ADMIN_2024`

#### Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "sreesaipravallika26@gmail.com",
  "password": "your_password"
}
```

**curl command**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"sreesaipravallika26@gmail.com\",\"password\":\"your_password\"}"
```

---

### 2️⃣ User Endpoints

#### Get Current User
```http
GET http://localhost:8080/api/users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**curl command**:
```bash
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3️⃣ Booking Endpoints

#### Create Booking
```http
POST http://localhost:8080/api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "serviceType": "Plumbing",
  "location": "Mumbai, Maharashtra",
  "date": "2026-03-20",
  "time": "10:00 AM",
  "description": "Kitchen sink repair"
}
```

**curl command**:
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"serviceType\":\"Plumbing\",\"location\":\"Mumbai\",\"date\":\"2026-03-20\",\"time\":\"10:00 AM\",\"description\":\"Kitchen sink repair\"}"
```

#### Get User's Bookings
```http
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
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

### Database Statistics
- **Total Users**: 1
- **Customers**: 1
- **Providers**: 0
- **Admins**: 0
- **Total Bookings**: 0

### View Database
**Windows PowerShell**:
```powershell
Get-Content backend/database.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Windows CMD**:
```cmd
type backend\database.json
```

**Git Bash**:
```bash
cat backend/database.json
```

---

## 🔍 DATABASE QUERIES (JavaScript)

Since we're using a JSON file database, here are JavaScript queries:

### Get All Users
```javascript
const db = require('./database.js');
const users = db.prepare('SELECT * FROM users').all();
console.log(users);
```

### Get User by Email
```javascript
const user = db.prepare('SELECT * FROM users WHERE email = ?')
  .get('sreesaipravallika26@gmail.com');
console.log(user);
```

### Get Users by Role
```javascript
const customers = db.prepare('SELECT * FROM users WHERE role = ?')
  .all('customer');
console.log(customers);
```

### Count Users
```javascript
const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log(`Total users: ${count.count}`);
```

### Get All Bookings
```javascript
const bookings = db.prepare('SELECT * FROM bookings').all();
console.log(bookings);
```

### Get Bookings by Customer
```javascript
const userBookings = db.prepare('SELECT * FROM bookings WHERE customer_id = ?')
  .all(1);
console.log(userBookings);
```

---

## 🧪 TESTING SCENARIOS

### Scenario 1: Test Service Search
1. Open: http://localhost:5173/login
2. Login with: `sreesaipravallika26@gmail.com`
3. Navigate to Dashboard
4. Click "Service Search" card
5. Try searches:
   - Type "plumber" → See 3 results
   - Type "elec" → See 3 results (partial match)
   - Type "mumbai" → See 8 results (location)
   - Click popular tags
   - Click "Book Now" on any service

### Scenario 2: Register New User
1. Open: http://localhost:5173/register
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: Test123@
   - Location: Mumbai
3. Click Register
4. Login with new credentials
5. Access Service Search

### Scenario 3: Create Booking via API
```bash
# 1. Login first
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"sreesaipravallika26@gmail.com\",\"password\":\"your_password\"}"

# 2. Copy the token from response

# 3. Create booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"serviceType\":\"Plumber\",\"location\":\"Mumbai\",\"date\":\"2026-03-20\",\"time\":\"10:00 AM\",\"description\":\"Fix leak\"}"
```

---

## 🎯 QUICK TEST COMMANDS

### Test Backend Health
```bash
curl http://localhost:8080/api/health
```

### Test Frontend
Open in browser:
```
http://localhost:5173
```

### View Database
```bash
cat backend/database.json
```

### Check Running Processes
```bash
# Check if ports are in use
netstat -ano | findstr :5173
netstat -ano | findstr :8080
```

---

## 📱 STANDALONE DEMOS

These work without login:

| Demo | File | Description |
|------|------|-------------|
| Password Validation | `password-validation/index.html` | Password strength checker |
| Color Scheme | `color-redesign/demo.html` | Color palette demo |
| Service Search | `service-search/index.html` | Standalone search demo |

**Access via Vite**:
- http://localhost:5173/password-validation/index.html
- http://localhost:5173/color-redesign/demo.html
- http://localhost:5173/service-search/index.html

---

## 🔐 EXISTING USER CREDENTIALS

### Customer Account
- **Email**: sreesaipravallika26@gmail.com
- **Password**: (your password)
- **Role**: customer
- **Location**: Hyd
- **Phone**: 7989876487

---

## 📚 DOCUMENTATION FILES

| File | Description |
|------|-------------|
| `ACCESS_LINKS_AND_QUERIES.md` | Complete API documentation |
| `SERVICE_SEARCH_INTEGRATION.md` | Service search integration guide |
| `SEARCH_FEATURE.md` | Service search feature guide |
| `SEARCH_VISUAL_GUIDE.md` | Visual demo guide |
| `LOGIN_INSTRUCTIONS.md` | Login setup guide |
| `RUNNING_SERVICES.md` | Services overview |
| `IMPLEMENTATION_COMPLETE.md` | Complete implementation summary |

---

## 🛠️ TROUBLESHOOTING

### Frontend Not Loading
```bash
# Check if Vite is running
# Should see output in terminal

# Restart if needed
npm run dev
```

### Backend Not Responding
```bash
# Check if Express is running
curl http://localhost:8080/api/health

# Restart if needed
cd backend
npm start
```

### Database Issues
```bash
# View database
cat backend/database.json

# Backup database
cp backend/database.json backend/database.backup.json

# Reset database (WARNING: Deletes all data)
echo '{"users":[],"bookings":[],"nextUserId":1,"nextBookingId":1}' > backend/database.json
```

### Port Already in Use
```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F

# Same for port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 🎉 SUMMARY

### ✅ What's Running:
1. **Frontend**: http://localhost:5173 (React + Vite)
2. **Backend**: http://localhost:8080 (Express + JWT)
3. **Database**: backend/database.json (JSON file)

### ✅ New Features:
1. **Service Search Page**: http://localhost:5173/service-search
   - 25 service providers
   - Real-time search
   - Beautiful UI
   - Integrated booking

### ✅ Current Data:
- 1 registered customer
- 0 bookings
- 0 providers
- 0 admins

### 🚀 Next Steps:
1. Login to test Service Search
2. Try different search queries
3. Book a service
4. Register more users
5. Create bookings via API

---

**Everything is ready! Start exploring your QuickServ platform! 🎊**

**Main Links**:
- Frontend: http://localhost:5173
- Service Search: http://localhost:5173/service-search
- Backend: http://localhost:8080
- Health Check: http://localhost:8080/api/health
