# ✅ H2 Database Ready - Connection Guide

## 🎉 Database Created Successfully!

The H2 database has been initialized with tables and sample data.

---

## 🌐 Connect to H2 Console

### Step 1: Open H2 Console
**URL**: http://localhost:8082

### Step 2: Use These Connection Settings

```
Saved Settings:   Generic H2 (Server)
Driver Class:     org.h2.Driver
JDBC URL:         jdbc:h2:tcp://localhost:9092/./h2-data/quickserv
User Name:        sa
Password:         (leave empty - just click Connect)
```

### Step 3: Click "Connect"

You should now be connected to the database!

---

## ✅ Database Already Contains

The database has been initialized with:

### Tables Created:
- ✅ `users` table (with columns: id, name, email, password, role, phone, location, business_name, service_category, created_at)
- ✅ `bookings` table (with columns: id, customer_id, provider_id, service_type, location, booking_date, service_date, time, description, status, created_at)

### Sample Data Inserted:
- ✅ Admin user: admin@quickserv.com
- ✅ Customer: sreesaipravallika26@gmail.com
- ✅ Provider: john@plumbing.com

---

## 🔍 Try These Queries

Once connected, try running these SQL queries:

### View All Users
```sql
SELECT * FROM users;
```

### View All Bookings
```sql
SELECT * FROM bookings;
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### View Table Structure
```sql
SHOW COLUMNS FROM users;
```

### Insert New Customer
```sql
INSERT INTO users (name, email, password, role, phone, location)
VALUES ('Test User', 'test@example.com', 'password123', 'customer', '9999999999', 'Mumbai');
```

### Create a Booking
```sql
INSERT INTO bookings (customer_id, service_type, location, booking_date, service_date, time, description, status)
VALUES (1, 'Plumbing', 'Hyderabad', '2026-04-04', '2026-04-10', '10:00 AM', 'Fix kitchen sink', 'PENDING');
```

### View Bookings with Customer Names
```sql
SELECT 
  b.id,
  b.service_type,
  b.location,
  b.service_date,
  b.time,
  b.status,
  u.name as customer_name,
  u.email as customer_email
FROM bookings b
JOIN users u ON b.customer_id = u.id;
```

---

## 🚀 All Services Running

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend API | http://localhost:8080 | ✅ Running |
| H2 Console | http://localhost:8082 | ✅ Running |
| H2 TCP Server | tcp://localhost:9092 | ✅ Running |

---

## 💡 Tips

1. **Write any SQL query** - H2 supports standard SQL
2. **Auto-complete** - Press Ctrl+Space for suggestions
3. **Export results** - Click the export button after running queries
4. **Multiple queries** - Separate with semicolons
5. **Transaction control** - Use COMMIT and ROLLBACK

---

## 🔐 Sample Login Credentials

All users have password: `password123`

- **Admin**: admin@quickserv.com
- **Customer**: sreesaipravallika26@gmail.com  
- **Provider**: john@plumbing.com

---

## ❓ Troubleshooting

### If connection fails:
1. Make sure H2 server is running (check terminal)
2. Use the exact JDBC URL: `jdbc:h2:tcp://localhost:9092/./h2-data/quickserv`
3. Username is `sa` (lowercase)
4. Password is empty (just leave it blank)

### If you see "database not found":
The database has already been created at `backend/h2-data/quickserv.mv.db`

---

## 🎯 Next Steps

1. ✅ Open http://localhost:8082
2. ✅ Connect using the settings above
3. ✅ Run `SELECT * FROM users;` to see sample data
4. ✅ Start writing your own SQL queries!

Enjoy your H2 database with full JDBC support! 🚀
