# 🚀 QuickServ - Quick Start Guide

## ✅ All Services Running!

### 🌐 Access URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Login Page)** | http://localhost:5173 | ✅ Running |
| **Backend API** | http://localhost:8080 | ✅ Running |
| **H2 Database Console** | http://localhost:8082 | ✅ Running |

---

## 🎯 Step 1: Access the Application

**Click here**: http://localhost:5173

You should see the QuickServ login page.

---

## 👤 Step 2: Login with Test Account

### Option 1: Login as Provider (to see new features)
```
Email: john@plumbing.com
Password: password123
```

### Option 2: Login as Customer
```
Email: sreesaipravallika26@gmail.com
Password: password123
```

### Option 3: Login as Admin
```
Email: admin@quickserv.com
Password: password123
```

---

## 🆕 New Features to Test (Provider Account)

After logging in as provider, you'll see:

### 1. Availability Toggle (in header)
- Look for the toggle switch: 🟢 Available / 🔴 Unavailable
- Click to change your availability status
- Customers will see this when booking

### 2. Module Section (below stats)
Six quick access modules:
- 📋 **Manage Bookings** - Click to view all bookings
- ⚙️ **Service Settings** - Update your service details
- 📊 **Analytics** - View performance (coming soon)
- 💬 **Messages** - Customer chat (coming soon)
- ⭐ **Reviews** - Customer feedback (coming soon)
- 📅 **Schedule** - Manage calendar (coming soon)

### 3. Booking Management
- View all bookings in the list
- Confirm pending bookings
- Mark bookings as complete
- Cancel bookings if needed

---

## 🗄️ Step 3: Access H2 Database Console

**Click here**: http://localhost:8082

**Connection Settings:**
```
JDBC URL:  jdbc:h2:tcp://localhost:9092/~/quickserv
User Name: sa
Password:  (leave empty - just click Connect)
```

**Try these SQL queries:**
```sql
-- View all users
SELECT * FROM users;

-- View providers with availability
SELECT name, business_name, service_category, is_available 
FROM users 
WHERE role = 'provider';

-- View all bookings
SELECT * FROM bookings;

-- View bookings with customer names
SELECT b.*, u.name as customer_name 
FROM bookings b 
JOIN users u ON b.customer_id = u.id;
```

---

## 🧪 Testing the New Features

### Test 1: Provider Availability Toggle
1. Login as provider: john@plumbing.com / password123
2. Look at the header - you'll see: 🟢 Available
3. Click the toggle switch
4. Status changes to: 🔴 Unavailable
5. Open H2 Console and run:
   ```sql
   SELECT name, is_available FROM users WHERE role='provider';
   ```
6. You'll see the value changed in database!

### Test 2: Module Navigation
1. Stay logged in as provider
2. Scroll down to "Quick Access Modules" section
3. Hover over any module card - see the animation
4. Click "📋 Manage Bookings" - opens bookings modal
5. Click "⚙️ Service Settings" - opens settings modal

### Test 3: Booking Management
1. As provider, view the "Recent Bookings" section
2. If there are pending bookings, click "✅ Confirm"
3. Booking status changes to CONFIRMED
4. Click "🎉 Mark Complete" to complete the booking

---

## 📱 Responsive Design

Try resizing your browser window - everything adapts to:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

---

## 🔄 If Something Doesn't Work

### Frontend not loading?
1. Hard refresh: Ctrl+Shift+R or Ctrl+F5
2. Clear cache: Ctrl+Shift+Delete
3. Try incognito/private window
4. Check browser console (F12) for errors

### Backend not responding?
- Check: http://localhost:8080/api/health
- Should return: `{"status":"ok","message":"QuickServ API is running"}`

### H2 Console not connecting?
- Make sure JDBC URL is: `jdbc:h2:tcp://localhost:9092/~/quickserv`
- Username: `sa`
- Password: (empty)

---

## 🎨 What You'll See

### Provider Dashboard Layout:
```
┌─────────────────────────────────────────────────┐
│ Header: Logo | Welcome | 🟢 Available | Logout  │
├─────────────────────────────────────────────────┤
│ Hero Banner: Service Category Image             │
├─────────────────────────────────────────────────┤
│ Business Info Cards (4 cards)                   │
├─────────────────────────────────────────────────┤
│ Statistics (Total, Pending, Confirmed, Complete)│
├─────────────────────────────────────────────────┤
│ Quick Access Modules (6 module cards)           │
├─────────────────────────────────────────────────┤
│ Recent Bookings (with action buttons)           │
└─────────────────────────────────────────────────┘
```

---

## 🎉 You're All Set!

Your QuickServ application is running with:
- ✅ Modern React frontend
- ✅ Express.js backend with REST API
- ✅ H2 Database with JDBC support
- ✅ Provider availability management
- ✅ Quick access module section
- ✅ Real-time booking management
- ✅ Beautiful, responsive UI

**Start here**: http://localhost:5173

Enjoy! 🚀
