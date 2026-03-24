# 🔐 Login Instructions - QuickServ

## ✅ Issue Fixed!

The login issue has been resolved. The backend was storing data incorrectly, but it's now fixed.

---

## 🚀 How to Login

### Step 1: Register a New Account

Since the database was reset, you need to create a new account first.

1. Open your browser and go to: **http://localhost:5173/**
2. Click on **"Register here"** link
3. Fill in the registration form:

#### For Customer Account:
- **Full Name**: Your Name
- **Email**: your@email.com
- **Phone**: 1234567890
- **Password**: password123 (or any password 6+ characters)
- **Confirm Password**: password123
- **Location**: Hyderabad (or your city)

4. Click **"Register →"**
5. You'll be automatically logged in and redirected to the dashboard

---

### Step 2: Login (After Registration)

1. Go to: **http://localhost:5173/login**
2. Enter your credentials:
   - **Email**: the email you registered with
   - **Password**: the password you used

3. Click **"Login →"**
4. You'll be redirected to your dashboard

---

## 🎭 Different User Roles

### Customer (Regular User)
- Can book services
- View bookings
- Access customer dashboard
- **Dashboard**: http://localhost:5173/dashboard

### Provider (Service Provider)
- Can offer services
- Manage bookings
- Access provider dashboard
- **Dashboard**: http://localhost:5173/provider-dashboard

### Admin (Administrator)
- Full system access
- View all users
- Manage system
- **Dashboard**: http://localhost:5173/admin-dashboard
- **Admin Key Required**: `QUICKSERV_ADMIN_2024`

---

## 🔧 Quick Test Accounts

You can create these test accounts:

### Test Customer
```
Name: Test Customer
Email: customer@test.com
Phone: 9876543210
Password: test123
Location: Mumbai
```

### Test Provider
```
Name: Test Provider
Email: provider@test.com
Business Name: Quick Services
Service Category: Plumbing
Location: Delhi
Phone: 9876543211
Password: test123
```

### Test Admin
```
Name: Test Admin
Email: admin@test.com
Password: admin123
Admin Key: QUICKSERV_ADMIN_2024
```

---

## ❌ Troubleshooting

### "Invalid email or password"
- Make sure you registered first
- Check that email and password are correct
- Passwords are case-sensitive

### "Unable to connect to server"
- Check if backend is running: http://localhost:8080/api/health
- Should show: `{"status":"ok","message":"QuickServ API is running"}`
- If not running, restart backend: `cd backend && npm start`

### "Email already registered"
- This email is already in use
- Try logging in instead of registering
- Or use a different email

---

## 📊 Check Backend Status

Visit: **http://localhost:8080/api/health**

Should return:
```json
{
  "status": "ok",
  "message": "QuickServ API is running"
}
```

---

## 🎯 Current Running Services

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:8080
- **Database**: backend/database.json (auto-saves)

---

## 💡 Tips

1. **Remember your credentials** - They're stored in the database
2. **Use strong passwords** - At least 6 characters
3. **Different roles** - Register as customer, provider, or admin based on your needs
4. **GPS Location** - When booking, you can use "Use Current Location" button
5. **Bookings** - After login, click "My Bookings" to see your booking history

---

## 🆘 Still Having Issues?

1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check browser console for errors (F12)
4. Restart both frontend and backend servers
5. Delete `backend/database.json` to start fresh

---

**Ready to go! Register your account and start booking services! 🚀**
