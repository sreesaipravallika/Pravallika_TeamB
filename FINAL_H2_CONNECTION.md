# ✅ H2 Database - WORKING Connection!

## 🎯 CORRECT Connection Settings

### Open H2 Console
**URL**: http://localhost:8082

### Use These EXACT Settings:

```
Saved Settings:   Generic H2 (Server)
Driver Class:     org.h2.Driver
JDBC URL:         jdbc:h2:tcp://localhost:9092/~/quickserv
User Name:        sa
Password:         (leave blank - just click Connect)
```

## ⚠️ IMPORTANT: Use This JDBC URL

```
jdbc:h2:tcp://localhost:9092/~/quickserv
```

The `~/` means it will use your home directory, avoiding path issues with spaces.

---

## 📋 Step-by-Step

1. Open http://localhost:8082
2. In "JDBC URL" field, paste: `jdbc:h2:tcp://localhost:9092/~/quickserv`
3. User Name: `sa`
4. Password: (leave empty)
5. Click "Connect" button

---

## ✅ Verify Connection

Once connected, run:

```sql
SELECT * FROM users;
```

You should see 3 users:
- Admin user
- Sree Sai Pravallika.B (customer)
- John Plumber (provider)

---

## 🔍 Try These Queries

### View all tables
```sql
SHOW TABLES;
```

### View table structure
```sql
SHOW COLUMNS FROM users;
SHOW COLUMNS FROM bookings;
```

### Count users by role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### View all bookings
```sql
SELECT * FROM bookings;
```

### Insert a new customer
```sql
INSERT INTO users (name, email, password, role, phone, location)
VALUES ('New Customer', 'customer@test.com', 'hash123', 'customer', '9876543210', 'Mumbai');
```

### Create a booking
```sql
INSERT INTO bookings (customer_id, service_type, location, booking_date, service_date, time, description, status)
VALUES (1, 'Plumbing', 'Hyderabad', '2026-04-04', '2026-04-10', '10:00 AM', 'Fix sink', 'PENDING');
```

### Join query - Bookings with customer details
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

### Update booking status
```sql
UPDATE bookings 
SET status = 'CONFIRMED' 
WHERE id = 1;
```

### Delete a booking
```sql
DELETE FROM bookings WHERE id = 1;
```

---

## 🚀 All Running Services

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Running |
| **Backend API** | http://localhost:8080 | ✅ Running |
| **H2 Console** | http://localhost:8082 | ✅ Running |
| **H2 TCP Server** | tcp://localhost:9092 | ✅ Running |

---

## 💾 Database Location

The database file is stored at:
```
C:\Users\Sree Sai Pravallika\quickserv.mv.db
```

This is in your home directory (that's what `~/` means).

---

## 🔐 Sample Login Credentials

All users have password: `password123`

- **Admin**: admin@quickserv.com
- **Customer**: sreesaipravallika26@gmail.com
- **Provider**: john@plumbing.com

---

## 💡 Pro Tips

1. **Auto-complete**: Press `Ctrl+Space` for SQL suggestions
2. **Run query**: Press `Ctrl+Enter` or click "Run"
3. **Multiple queries**: Separate with semicolons (`;`)
4. **Export results**: Click export button after running queries
5. **History**: Use up/down arrows to navigate query history

---

## ❓ Still Having Issues?

If you still can't connect, try these alternative JDBC URLs one by one:

1. `jdbc:h2:tcp://localhost:9092/~/quickserv` (recommended)
2. `jdbc:h2:tcp://127.0.0.1:9092/~/quickserv`
3. `jdbc:h2:tcp://192.168.1.2:9092/~/quickserv`

---

## 🎉 You're All Set!

Now you have:
- ✅ Full H2 Database with JDBC
- ✅ Web-based SQL console
- ✅ Write and execute any SQL queries
- ✅ Tables with sample data ready to use

**Start querying**: http://localhost:8082

Enjoy! 🚀
