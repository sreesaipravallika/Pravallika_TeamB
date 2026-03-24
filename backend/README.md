# QuickServ Backend API

Node.js/Express backend with SQLite database for QuickServ application.

## Features

- User authentication (JWT)
- Role-based access (Customer, Provider, Admin)
- SQLite database (no separate DB server needed)
- RESTful API endpoints
- Password hashing with bcrypt

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register/customer` - Register customer
- `POST /api/auth/register/provider` - Register provider
- `POST /api/auth/register/admin` - Register admin (requires admin key)
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/me` - Get current user (authenticated)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/role/:role` - Get users by role (admin only)

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings` - Get user's bookings (authenticated)
- `GET /api/bookings/all` - Get all bookings (admin only)

### Statistics
- `GET /api/stats` - Get system statistics (admin only)

### Health
- `GET /api/health` - Health check

## Environment Variables

Create a `.env` file:
```
PORT=8080
JWT_SECRET=your_secret_key
ADMIN_SECRET_KEY=QUICKSERV_ADMIN_2024
```

## Database

SQLite database file: `quickserv.db`

Tables:
- `users` - User accounts
- `bookings` - Service bookings

## Admin Key

Default admin registration key: `QUICKSERV_ADMIN_2024`
