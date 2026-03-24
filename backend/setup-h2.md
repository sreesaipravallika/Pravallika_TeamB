# H2 Database Setup Guide

## Option 1: Download H2 Database (Recommended)

### Step 1: Download H2
1. Go to: https://www.h2database.com/html/download.html
2. Download the "Platform-Independent Zip"
3. Extract the zip file
4. Copy `h2/bin/h2*.jar` to `backend/h2/h2.jar`

### Step 2: Start H2 Server
```bash
cd backend
java -cp h2/h2.jar org.h2.tools.Server -tcp -tcpAllowOthers -tcpPort 9092 -web -webAllowOthers -webPort 8082
```

### Step 3: Access H2 Console
Open browser: http://localhost:8082

**Connection Settings**:
- Driver Class: `org.h2.Driver`
- JDBC URL: `jdbc:h2:tcp://localhost:9092/./h2-data/quickserv`
- User Name: `sa`
- Password: (leave empty)

### Step 4: Create Tables
Run this SQL in H2 Console:

```sql
-- Users Table
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

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  provider_id INT,
  service_type VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Insert existing user
INSERT INTO users (name, email, password, role, phone, location, created_at)
VALUES (
  'Sree Sai Pravallika.B',
  'sreesaipravallika26@gmail.com',
  '$2a$10$IzmAO.TtEowUH7ihdTvZU.A4rkJQcp5w93s0Rqd.mzbq6CmgxFkQ2',
  'customer',
  '7989876487',
  'Hyd',
  CURRENT_TIMESTAMP
);
```

---

## Option 2: Use SQLite with Web Console (Easier)

I'll create a web-based database console for you that works with SQLite.

This is easier and doesn't require Java installation.

---

## Which option do you prefer?

1. **H2 Database** (requires Java, more features, industry-standard)
2. **SQLite with Web Console** (no Java needed, simpler, works immediately)

Let me know and I'll set it up for you!
