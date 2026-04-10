# H2 Database Setup with JDBC

## ✅ Installation Complete!

H2 Database has been downloaded and configured in the `backend/h2` directory.

---

## 🚀 Quick Start

### Step 1: Start H2 Server

Double-click: `start-h2-server.bat`

Or run in terminal:
```bash
cd backend
start-h2-server.bat
```

This will start:
- **H2 TCP Server** on port `9092`
- **H2 Web Console** on port `8082`

### Step 2: Access H2 Console

The console will automatically open at: **http://localhost:8082**

Or manually open: `start-h2-console.bat`

---

## 🔌 JDBC Connection Details

Use these settings to connect to the H2 database:

```
Driver Class:  org.h2.Driver
JDBC URL:      jdbc:h2:tcp://localhost:9092/./h2-data/quickserv
User Name:     sa
Password:      (leave empty)
```

### Connection String for Applications:
```
jdbc:h2:tcp://localhost:9092/./h2-data/quickserv;AUTO_SERVER=TRUE
```

---

## 📋 Initialize Database

### Option 1: Using H2 Console (Recommended)

1. Open H2 Console: http://localhost:8082
2. Connect using the JDBC settings above
3. Copy and paste the contents of `init-h2-database.sql`
4. Click "Run" to execute

### Option 2: Using Command Line

```bash
cd backend
java -cp h2/bin/h2*.jar org.h2.tools.RunScript -url jdbc:h2:tcp://localhost:9092/./h2-data/quickserv -user sa -script init-h2-database.sql
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Bookings Table
```sql
CREATE TABLE bookings (
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
```

---

## 🔍 Sample Queries

### View All Users
```sql
SELECT * FROM users;
```

### View All Bookings with Customer Names
```sql
SELECT 
  b.*,
  u.name as customer_name,
  u.email as customer_email,
  u.phone as customer_phone
FROM bookings b
JOIN users u ON b.customer_id = u.id
ORDER BY b.created_at DESC;
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### View Pending Bookings
```sql
SELECT * FROM bookings 
WHERE status = 'PENDING'
ORDER BY created_at DESC;
```

### Insert New Customer
```sql
INSERT INTO users (name, email, password, role, phone, location)
VALUES ('Jane Doe', 'jane@example.com', 'hashed_password', 'customer', '1234567890', 'Mumbai');
```

### Update Booking Status
```sql
UPDATE bookings 
SET status = 'CONFIRMED' 
WHERE id = 1;
```

### Delete Booking
```sql
DELETE FROM bookings WHERE id = 1;
```

---

## 🔧 Connecting from Node.js

### Install JDBC Package
```bash
npm install jdbc h2-server
```

### Connection Code
```javascript
import JDBC from 'jdbc';
import jinst from 'jdbc/lib/jinst.js';

// Initialize JVM
if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./h2/bin/h2-2.2.224.jar']);
}

const config = {
  url: 'jdbc:h2:tcp://localhost:9092/./h2-data/quickserv',
  drivername: 'org.h2.Driver',
  user: 'sa',
  password: ''
};

const jdbc = new JDBC(config);

// Connect and query
jdbc.initialize((err) => {
  if (err) {
    console.error(err);
    return;
  }
  
  jdbc.reserve((err, connObj) => {
    if (err) {
      console.error(err);
      return;
    }
    
    const conn = connObj.conn;
    conn.createStatement((err, statement) => {
      if (err) {
        console.error(err);
        return;
      }
      
      statement.executeQuery('SELECT * FROM users', (err, resultset) => {
        if (err) {
          console.error(err);
        } else {
          resultset.toObjArray((err, results) => {
            console.log(results);
            jdbc.release(connObj, (err) => {});
          });
        }
      });
    });
  });
});
```

---

## 🌐 Access URLs

- **H2 Web Console**: http://localhost:8082
- **Backend API**: http://localhost:8080
- **Frontend**: http://localhost:5173
- **Custom DB Console**: http://localhost:8080/db-console

---

## 📁 File Locations

- **H2 JAR**: `backend/h2/bin/h2-2.2.224.jar`
- **Database Files**: `backend/h2-data/quickserv.mv.db`
- **Init Script**: `backend/init-h2-database.sql`
- **Start Scripts**: 
  - `backend/start-h2-server.bat`
  - `backend/start-h2-console.bat`

---

## 🛑 Stop H2 Server

Press `Ctrl+C` in the terminal where H2 server is running, or close the command window.

---

## 💡 Tips

1. **Always start H2 server before running the backend**
2. **Keep H2 server running** while developing
3. **Use H2 Console** for direct database queries and testing
4. **Backup database**: Copy `h2-data/quickserv.mv.db` file
5. **Reset database**: Delete `h2-data` folder and run init script again

---

## 🔐 Default Credentials

### Database
- Username: `sa`
- Password: (empty)

### Sample Users (password: `password123`)
- Admin: `admin@quickserv.com`
- Customer: `sreesaipravallika26@gmail.com`
- Provider: `john@plumbing.com`

---

## ❓ Troubleshooting

### Port Already in Use
If port 9092 or 8082 is already in use, edit the batch files and change the port numbers.

### Java Not Found
Make sure Java is installed and in your PATH:
```bash
java -version
```

### Connection Refused
Make sure H2 server is running before connecting.

---

## 📚 Additional Resources

- H2 Documentation: https://www.h2database.com/html/main.html
- H2 Tutorial: https://www.h2database.com/html/tutorial.html
- SQL Reference: https://www.h2database.com/html/grammar.html
