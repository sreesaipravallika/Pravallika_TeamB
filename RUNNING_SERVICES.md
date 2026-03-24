# 🚀 QuickServ - Running Services

All services are now running successfully!

## 📍 Access URLs

### 1. Frontend (React + Vite)
- **Local URL**: http://localhost:5173/
- **Network URL**: http://192.168.1.5:5173/
- **Status**: ✅ Running
- **Technology**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui

### 2. Backend API (Node.js + Express)
- **URL**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/health
- **Status**: ✅ Running
- **Technology**: Node.js, Express, JWT Authentication

### 3. Database
- **Type**: JSON File Database
- **Location**: `backend/database.json`
- **Status**: ✅ Running
- **Features**: Auto-saves, No installation required

---

## 🔌 API Endpoints

### Authentication
- `POST http://localhost:8080/api/auth/register/customer` - Register customer
- `POST http://localhost:8080/api/auth/register/provider` - Register provider
- `POST http://localhost:8080/api/auth/register/admin` - Register admin
- `POST http://localhost:8080/api/auth/login` - Login

### Users
- `GET http://localhost:8080/api/users/me` - Get current user
- `GET http://localhost:8080/api/users` - Get all users (admin)
- `GET http://localhost:8080/api/users/role/:role` - Get users by role (admin)

### Bookings
- `POST http://localhost:8080/api/bookings` - Create booking
- `GET http://localhost:8080/api/bookings` - Get user's bookings
- `GET http://localhost:8080/api/bookings/all` - Get all bookings (admin)

### Statistics
- `GET http://localhost:8080/api/stats` - Get system statistics (admin)

---

## 🔑 Admin Credentials

To register as admin, use this secret key:
```
QUICKSERV_ADMIN_2024
```

---

## 🛠️ How to Stop/Restart

### Stop Services
The services are running in background processes. They will stop when you close the IDE or manually stop them.

### Restart Services
If you need to restart:

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
npm start
```

---

## 📊 Database Structure

### Users Table
- id, name, email, password (hashed), role, phone, location
- business_name, service_category (for providers)
- created_at

### Bookings Table
- id, customer_id, provider_id, service_type, location
- date, time, description, status
- created_at

---

## ✅ Test the Setup

1. Open http://localhost:5173/ in your browser
2. Register a new customer account
3. Login and explore the dashboard
4. Try creating a booking

The frontend will automatically connect to the backend API!

---

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Admin registration requires secret key
- CORS enabled for frontend-backend communication

---

## 📝 Notes

- Database file: `backend/database.json` (auto-created)
- Environment variables: `backend/.env`
- All data persists between restarts
- No external database server required
