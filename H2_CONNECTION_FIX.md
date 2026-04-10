# ✅ H2 Database - CORRECT Connection Settings

## 🔌 Use This JDBC URL

Open: **http://localhost:8082**

Then use these EXACT settings:

```
Saved Settings:   Generic H2 (Server)
Driver Class:     org.h2.Driver
JDBC URL:         jdbc:h2:tcp://localhost:9092/quickserv
User Name:        sa
Password:         (leave empty)
```

## ⚠️ Important: The JDBC URL Changed

Use: `jdbc:h2:tcp://localhost:9092/quickserv`

NOT: `jdbc:h2:tcp://localhost:9092/./h2-data/quickserv`

---

## 🎯 Step-by-Step Connection

1. Open http://localhost:8082 in your browser
2. You'll see the H2 Console login page
3. In the "JDBC URL" field, enter: `jdbc:h2:tcp://localhost:9092/quickserv`
4. User Name: `sa`
5. Password: (leave empty)
6. Click "Connect"

---

## ✅ Once Connected

Run this to verify:
```sql
SELECT * FROM users;
```

You should see 3 users in the database!

---

## 🔍 Sample Queries

### View all tables
```sql
SHOW TABLES;
```

### View users
```sql
SELECT * FROM users;
```

### View bookings
```sql
SELECT * FROM bookings;
```

### Count users by role
```sql
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

---

## 💡 If Still Getting Error

Try this alternative JDBC URL:
```
jdbc:h2:tcp://localhost:9092/C:/Users/Sree Sai Pravallika/OneDrive/Desktop/23R21A05AC/QuickServ_Pravallika-260326/backend/h2-data/quickserv
```

Or the simplest one:
```
jdbc:h2:tcp://localhost:9092/~/quickserv
```

---

## 🚀 All Services

- Frontend: http://localhost:5173
- Backend: http://localhost:8080  
- H2 Console: http://localhost:8082
- H2 Server: tcp://localhost:9092

---

Ready to use! 🎉
