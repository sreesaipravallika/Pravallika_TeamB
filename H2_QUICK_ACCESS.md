# 🚀 H2 Database - Quick Access Guide

## ✅ H2 Database is Running!

### 🌐 Access H2 Web Console

**URL**: http://localhost:8082

### 🔌 JDBC Connection Settings

When you open the H2 console, use these settings:

```
Saved Settings:   Generic H2 (Server)
Driver Class:     org.h2.Driver
JDBC URL:         jdbc:h2:tcp://localhost:9092/./h2-data/quickserv
User Name:        sa
Password:         (leave empty)
```

Click **"Connect"** to access the database!

---

## 📋 Initialize Database (First Time Only)

After connecting, run this SQL to create tables:

```sql
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  location VARCHAR(255),
  business_name VARCHAR(255),
  service_category VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  provider_id INT,
  service_type VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  booking_date VARCHAR(50) NOT NULL,
  service_date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (name, email, password, role, phone, location)
VALUES ('Sree Sai Pravallika.B', 'sreesaipravallika26@gmail.com', 
        '$2a$10$IzmAO.TtEowUH7ihdTvZU.A4rkJQcp5w93s0Rqd.mzbq6CmgxFkQ2', 
        'customer', '7989876487', 'Hyd');
```

Or copy from: `backend/init-h2-database.sql`

---

## 🔍 Sample Queries to Try

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
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

### Bookings with Customer Details
```sql
SELECT 
  b.id,
  b.service_type,
  b.location,
  b.service_date,
  b.time,
  b.status,
  u.name as customer_name,
  u.email as customer_email,
  u.phone as customer_phone
FROM bookings b
JOIN users u ON b.customer_id = u.id
ORDER BY b.created_at DESC;
```

### Insert New Customer
```sql
INSERT INTO users (name, email, password, role, phone, location)
VALUES ('John Doe', 'john@example.com', 'hashed_password', 'customer', '1234567890', 'Mumbai');
```

### Update Booking Status
```sql
UPDATE bookings SET status = 'CONFIRMED' WHERE id = 1;
```

---

## 🌐 All Running Services

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend API | http://localhost:8080 | ✅ Running |
| H2 Console | http://localhost:8082 | ✅ Running |
| H2 TCP Server | tcp://localhost:9092 | ✅ Running |
| Custom DB Console | http://localhost:8080/db-console | ✅ Running |

---

## 📁 Important Files

- **H2 Setup Guide**: `backend/H2_DATABASE_SETUP.md`
- **Init SQL Script**: `backend/init-h2-database.sql`
- **Start H2 Server**: `backend/start-h2-server.bat`
- **Database Files**: `backend/h2-data/quickserv.mv.db`

---

## 💡 Tips

1. **H2 Console** is the official JDBC interface where you can write and execute any SQL queries
2. **Keep H2 server running** in the background while developing
3. **Backup**: Copy `backend/h2-data` folder to backup your database
4. **Reset**: Delete `backend/h2-data` folder and run init script to start fresh

---

## 🛑 Stop Services

- **H2 Server**: Press Ctrl+C in the H2 terminal
- **Backend**: Press Ctrl+C in the backend terminal
- **Frontend**: Press Ctrl+C in the frontend terminal

---

## ❓ Need Help?

See detailed documentation: `backend/H2_DATABASE_SETUP.md`
