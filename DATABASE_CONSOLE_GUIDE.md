# 🗄️ QuickServ Database Console Guide

## ✅ Database Console is Now Running!

### 📊 Access the Console

**URL**: http://localhost:8080/db-console

The console is now open in your browser!

---

## 🎯 Features

### 1. **Connection Information**
- Database Type: JSON File Database
- Database File: backend/database.json
- Backend URL: http://localhost:8080
- Status: Real-time connection status

### 2. **Quick Queries** (One-Click)
- 📋 View All Users
- 👤 View Customers
- 🏢 View Providers
- 📅 View All Bookings
- 🔢 Count Users
- 🔢 Count Bookings
- 📊 Show Statistics
- 📄 View Raw JSON

### 3. **SQL Query Editor**
Write and execute custom SQL-like queries:

```sql
SELECT * FROM users
SELECT * FROM users WHERE role = 'customer'
SELECT * FROM bookings
SELECT COUNT(*) as total FROM users
```

### 4. **Database Statistics**
Real-time dashboard showing:
- Total Users
- Total Bookings
- Total Customers
- Total Providers

### 5. **Export Results**
- Export query results to CSV
- Download data for analysis

---

## 📝 Sample Queries

### View All Users
```sql
SELECT * FROM users
```

### View Customers Only
```sql
SELECT * FROM users WHERE role = 'customer'
```

### View Providers Only
```sql
SELECT * FROM users WHERE role = 'provider'
```

### View All Bookings
```sql
SELECT * FROM bookings
```

### Count Total Users
```sql
SELECT COUNT(*) as total FROM users
```

### Count Pending Bookings
```sql
SELECT * FROM bookings WHERE status = 'pending'
```

---

## 🎨 Console Features

### Interactive UI
- Beautiful gradient design
- Responsive layout
- Real-time query execution
- Color-coded status messages

### Data Display
- Tabular format for query results
- Scrollable results area
- Hover effects on rows
- Sticky table headers

### Quick Actions
- One-click query templates
- Clear query button
- Export to CSV
- View raw JSON data

---

## 🔧 How to Use

### Method 1: Quick Queries
1. Click any button in the "Quick Queries" panel
2. Query auto-fills in the editor
3. Results appear automatically

### Method 2: Custom Queries
1. Type your SQL query in the editor
2. Click "▶️ Execute Query"
3. View results in the table below

### Method 3: View Statistics
1. Statistics load automatically on page load
2. Click "Show Statistics" to refresh
3. View counts in the dashboard cards

---

## 📊 Current Database Content

### Users Table
```json
{
  "id": 1,
  "name": "Sree Sai Pravallika.B",
  "email": "sreesaipravallika26@gmail.com",
  "role": "customer",
  "phone": "7989876487",
  "location": "Hyd"
}
```

### Bookings Table
Currently empty - no bookings yet

---

## 🚀 Quick Start

1. **Open Console**: http://localhost:8080/db-console
2. **Click "View All Users"** to see registered users
3. **Try custom queries** in the SQL editor
4. **Export results** to CSV if needed

---

## 🔗 All Access Links

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React application |
| Backend API | http://localhost:8080 | Express API server |
| Database Console | http://localhost:8080/db-console | Web-based DB console |
| Health Check | http://localhost:8080/api/health | API status |
| Service Search | http://localhost:5173/service-search | Search feature |

---

## 💡 Tips

### Tip 1: Quick Statistics
Click "Show Statistics" to see a quick overview of your database

### Tip 2: Export Data
After running a query, click "📥 Export Results" to download as CSV

### Tip 3: View Raw Data
Click "View Raw JSON" to see the complete database structure

### Tip 4: Multiple Queries
You can run multiple queries one after another - results update each time

---

## 🎯 Common Tasks

### Task 1: Check Total Users
1. Click "Count Users" quick query
2. See total in results table

### Task 2: View Customer List
1. Click "View Customers" quick query
2. See all customer details in table

### Task 3: Export User List
1. Click "View All Users"
2. Click "Export Results"
3. CSV file downloads automatically

### Task 4: Check Database Status
- Green dot (🟢) = Connected
- Red dot (🔴) = Disconnected

---

## 🔍 Query Syntax

The console supports SQL-like queries:

### SELECT Queries
```sql
SELECT * FROM users
SELECT * FROM bookings
```

### WHERE Clauses
```sql
SELECT * FROM users WHERE role = 'customer'
SELECT * FROM bookings WHERE status = 'pending'
```

### COUNT Queries
```sql
SELECT COUNT(*) as total FROM users
SELECT COUNT(*) as total FROM bookings
```

---

## 🎨 Console Interface

### Header Section
- Title and description
- Connection information panel

### Left Panel
- Quick query buttons
- One-click access to common queries

### Right Panel
- Real-time statistics
- Dashboard cards with counts

### Bottom Panel
- SQL query editor
- Execute and clear buttons
- Results table
- Status messages

---

## 📱 Responsive Design

The console works on:
- Desktop computers
- Tablets
- Mobile devices (responsive layout)

---

## 🛠️ Troubleshooting

### Console Not Loading
1. Check backend is running: http://localhost:8080/api/health
2. Restart backend: `cd backend && npm start`
3. Refresh browser

### No Data Showing
1. Click "Show Statistics" to refresh
2. Check database file exists: `backend/database.json`
3. Try "View Raw JSON" to see actual data

### Query Not Working
1. Check SQL syntax
2. Use single quotes for strings: `'customer'` not `"customer"`
3. Try a quick query first to test

---

## 🎉 Summary

You now have a fully functional database console similar to H2 Console!

**Features**:
✅ Web-based interface
✅ SQL-like query support
✅ Real-time statistics
✅ Export to CSV
✅ Quick query templates
✅ Beautiful UI
✅ No Java required!

**Access**: http://localhost:8080/db-console

---

**Enjoy managing your QuickServ database! 🚀**
