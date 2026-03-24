# ⚡ QuickServ - Quick Access Links

## 🚀 ALL SERVICES RUNNING!

---

## 🌐 FRONTEND

### Main Application
```
http://localhost:5173/
```

### Key Pages
- **Home**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register
- **Dashboard**: http://localhost:5173/dashboard

---

## 🔌 BACKEND API

### Base URL
```
http://localhost:8080
```

### Health Check
```
http://localhost:8080/api/health
```

### Key Endpoints
- **Register**: `POST /api/auth/register/customer`
- **Login**: `POST /api/auth/login`
- **Bookings**: `POST /api/bookings`
- **User Info**: `GET /api/users/me`

---

## 💾 DATABASE

### Location
```
backend/database.json
```

### Current Data
- **Users**: 1 customer
- **Bookings**: 0
- **Next User ID**: 2

---

## 🧪 QUICK TESTS

### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","password":"Test123@","location":"Mumbai"}'
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123@"}'
```

---

## 🎨 DEMOS

### Password Validation
```
Open: password-validation/index.html
```

### Color Scheme
```
Open: color-redesign/demo.html
```

---

## 🔑 CREDENTIALS

### Admin Key
```
QUICKSERV_ADMIN_2024
```

### Test Account (Already Registered)
```
Email: sreesaipravallika26@gmail.com
Password: [Your password]
```

---

## 📱 MOBILE ACCESS

```
http://192.168.1.5:5173/
```

---

**See `ACCESS_LINKS_AND_QUERIES.md` for complete documentation!**
