# 📅 Booking Module - Complete Implementation

## ✅ Implementation Complete!

The booking module has been fully implemented with all requested features.

---

## 📊 Database Structure

### Bookings Table Fields

| Field | Type | Description |
|-------|------|-------------|
| `booking_id` | INT | Auto-increment primary key |
| `customer_id` | INT | Foreign key to users table |
| `provider_id` | INT | Foreign key to users table (nullable) |
| `booking_date` | DATE | Date when booking was created |
| `service_date` | DATE | Date when service is scheduled |
| `time` | VARCHAR | Service time |
| `service_type` | VARCHAR | Type of service |
| `location` | VARCHAR | Service location |
| `description` | TEXT | Additional details |
| `status` | ENUM | PENDING / CONFIRMED / COMPLETED / CANCELLED |
| `created_at` | TIMESTAMP | Auto-generated timestamp |

---

## 🔌 API Endpoints

### 1. Create Booking
**Endpoint**: `POST /api/booking/create`

**Authentication**: Required (Customer only)

**Request Body**:
```json
{
  "providerId": 2,
  "serviceType": "Plumber",
  "location": "Mumbai, Maharashtra",
  "bookingDate": "2026-03-23",
  "serviceDate": "2026-03-25",
  "time": "10:00 AM",
  "description": "Kitchen sink repair"
}
```

**Response**:
```json
{
  "booking_id": 1,
  "message": "Booking created successfully",
  "status": "PENDING"
}
```

**curl Example**:
```bash
curl -X POST http://localhost:8080/api/booking/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Plumber",
    "location": "Mumbai",
    "bookingDate": "2026-03-23",
    "serviceDate": "2026-03-25",
    "time": "10:00 AM",
    "description": "Fix leak"
  }'
```

---

### 2. Get Customer Bookings
**Endpoint**: `GET /api/booking/customer/:id`

**Authentication**: Required (Customer can view own, Admin can view any)

**Response**:
```json
{
  "count": 2,
  "bookings": [
    {
      "id": 1,
      "customer_id": 1,
      "provider_id": 2,
      "service_type": "Plumber",
      "location": "Mumbai",
      "booking_date": "2026-03-23",
      "service_date": "2026-03-25",
      "time": "10:00 AM",
      "status": "PENDING",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "1234567890",
      "provider_name": "Jane Smith",
      "provider_business_name": "Quick Plumbing",
      "provider_phone": "9876543210"
    }
  ]
}
```

**curl Example**:
```bash
curl http://localhost:8080/api/booking/customer/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Get Provider Bookings
**Endpoint**: `GET /api/booking/provider/:id`

**Authentication**: Required (Provider can view own, Admin can view any)

**Response**:
```json
{
  "count": 3,
  "bookings": [
    {
      "id": 1,
      "customer_id": 1,
      "provider_id": 2,
      "service_type": "Plumber",
      "location": "Mumbai",
      "booking_date": "2026-03-23",
      "service_date": "2026-03-25",
      "time": "10:00 AM",
      "status": "CONFIRMED",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "1234567890",
      "customer_location": "Mumbai"
    }
  ]
}
```

**curl Example**:
```bash
curl http://localhost:8080/api/booking/provider/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Update Booking Status
**Endpoint**: `PUT /api/booking/status/:bookingId`

**Authentication**: Required

**Permissions**:
- **Customers**: Can only CANCEL their own bookings
- **Providers**: Can CONFIRM or COMPLETE bookings assigned to them
- **Admins**: Can update any booking to any status

**Request Body**:
```json
{
  "status": "CONFIRMED"
}
```

**Valid Status Values**:
- `PENDING` - Initial status
- `CONFIRMED` - Provider confirmed
- `COMPLETED` - Service completed
- `CANCELLED` - Booking cancelled

**Response**:
```json
{
  "message": "Booking status updated successfully",
  "booking_id": 1,
  "new_status": "CONFIRMED"
}
```

**curl Examples**:
```bash
# Provider confirms booking
curl -X PUT http://localhost:8080/api/booking/status/1 \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'

# Customer cancels booking
curl -X PUT http://localhost:8080/api/booking/status/1 \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CANCELLED"}'

# Provider completes booking
curl -X PUT http://localhost:8080/api/booking/status/1 \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

---

## 🔄 Booking Flow

### Step 1: Customer Creates Booking
```
Customer → Clicks "Book" button
         → Selects date & time
         → Fills booking form
         → Submits
         → Status: PENDING
```

### Step 2: Provider Receives Notification
```
Provider → Views pending bookings
         → Reviews booking details
         → Decides to accept or reject
```

### Step 3: Provider Confirms
```
Provider → Clicks "Confirm"
         → PUT /api/booking/status/:id
         → Status: PENDING → CONFIRMED
```

### Step 4: Service Completion
```
Provider → Completes service
         → Updates status
         → Status: CONFIRMED → COMPLETED
```

### Alternative: Cancellation
```
Customer → Cancels booking
         → PUT /api/booking/status/:id
         → Status: PENDING → CANCELLED
```

---

## 🎯 Status Workflow

```
PENDING
   ↓
   ├─→ CONFIRMED (by Provider)
   │      ↓
   │   COMPLETED (by Provider)
   │
   └─→ CANCELLED (by Customer or Admin)
```

---

## 🔐 Permission Matrix

| Action | Customer | Provider | Admin |
|--------|----------|----------|-------|
| Create Booking | ✅ Own | ❌ | ✅ |
| View Own Bookings | ✅ | ✅ | ✅ All |
| Confirm Booking | ❌ | ✅ Assigned | ✅ |
| Complete Booking | ❌ | ✅ Assigned | ✅ |
| Cancel Booking | ✅ Own | ❌ | ✅ |

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Booking Flow
```bash
# 1. Customer creates booking
curl -X POST http://localhost:8080/api/booking/create \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": 2,
    "serviceType": "Plumber",
    "location": "Mumbai",
    "bookingDate": "2026-03-23",
    "serviceDate": "2026-03-25",
    "time": "10:00 AM"
  }'

# 2. Provider views bookings
curl http://localhost:8080/api/booking/provider/2 \
  -H "Authorization: Bearer PROVIDER_TOKEN"

# 3. Provider confirms
curl -X PUT http://localhost:8080/api/booking/status/1 \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'

# 4. Provider completes
curl -X PUT http://localhost:8080/api/booking/status/1 \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

### Scenario 2: Customer Cancellation
```bash
# 1. Customer creates booking
# (same as above)

# 2. Customer cancels
curl -X PUT http://localhost:8080/api/booking/status/1 \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CANCELLED"}'
```

---

## 📱 Frontend Integration

### Create Booking Form
```typescript
const createBooking = async (bookingData) => {
  const response = await fetch('http://localhost:8080/api/booking/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      providerId: bookingData.providerId,
      serviceType: bookingData.serviceType,
      location: bookingData.location,
      bookingDate: new Date().toISOString().split('T')[0],
      serviceDate: bookingData.serviceDate,
      time: bookingData.time,
      description: bookingData.description
    })
  });
  
  return await response.json();
};
```

### View Bookings
```typescript
const getCustomerBookings = async (customerId) => {
  const response = await fetch(
    `http://localhost:8080/api/booking/customer/${customerId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
};
```

### Update Status
```typescript
const updateBookingStatus = async (bookingId, status) => {
  const response = await fetch(
    `http://localhost:8080/api/booking/status/${bookingId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    }
  );
  
  return await response.json();
};
```

---

## 🗄️ Database Console Queries

You can test bookings in the Database Console:

**URL**: http://localhost:8080/db-console

**Sample Queries**:
```sql
-- View all bookings
SELECT * FROM bookings

-- View pending bookings
SELECT * FROM bookings WHERE status = 'PENDING'

-- View confirmed bookings
SELECT * FROM bookings WHERE status = 'CONFIRMED'

-- Count bookings by status
SELECT COUNT(*) as total FROM bookings WHERE status = 'PENDING'
```

---

## ✅ Features Implemented

1. ✅ Complete booking table structure
2. ✅ POST /api/booking/create endpoint
3. ✅ GET /api/booking/customer/:id endpoint
4. ✅ GET /api/booking/provider/:id endpoint
5. ✅ PUT /api/booking/status/:bookingId endpoint
6. ✅ Status workflow (PENDING → CONFIRMED → COMPLETED)
7. ✅ Cancellation support
8. ✅ Role-based permissions
9. ✅ Backward compatibility with existing endpoints
10. ✅ Comprehensive error handling

---

## 🚀 Quick Start

### 1. Backend is Running
```
URL: http://localhost:8080
Status: ✅ Running
```

### 2. Test Health
```bash
curl http://localhost:8080/api/health
```

### 3. Create a Booking
```bash
# First login to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your_password"}'

# Then create booking
curl -X POST http://localhost:8080/api/booking/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Plumber",
    "location": "Mumbai",
    "bookingDate": "2026-03-23",
    "serviceDate": "2026-03-25",
    "time": "10:00 AM"
  }'
```

---

**Booking Module is complete and ready to use! 🎉**
