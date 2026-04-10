import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// AUTH ROUTES
// ============================================

// Register Customer
app.post('/api/auth/register/customer', async (req, res) => {
  try {
    const { name, email, phone, password, location } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user - FIXED: role is 4th parameter, phone is 5th
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email, hashedPassword, 'customer', phone, location);

    const user = { id: result.lastInsertRowid, name, email, role: 'customer' };
    const token = generateToken(user);

    res.status(201).json({ token, ...user });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Register Provider
app.post('/api/auth/register/provider', async (req, res) => {
  try {
    const { name, email, businessName, serviceCategory, location, phone, password } = req.body;

    // Validation
    if (!name || !email || !businessName || !serviceCategory || !location || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user - FIXED: correct parameter order
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, location, business_name, service_category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, hashedPassword, 'provider', phone, location, businessName, serviceCategory);

    const user = { id: result.lastInsertRowid, name, email, role: 'provider' };
    const token = generateToken(user);

    res.status(201).json({ token, ...user });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Register Admin
app.post('/api/auth/register/admin', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    // Validation
    if (!name || !email || !password || !adminKey) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify admin key
    if (adminKey !== ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    // Check if email exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user - FIXED: correct parameter order
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run(name, email, hashedPassword, 'admin');

    const user = { id: result.lastInsertRowid, name, email, role: 'admin' };
    const token = generateToken(user);

    res.status(201).json({ token, ...user });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ============================================
// USER ROUTES
// ============================================

// Get current user
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, phone, location, business_name, service_category FROM users WHERE id = ?')
    .get(req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const users = db.prepare('SELECT id, name, email, role, phone, location, business_name, service_category, created_at FROM users')
    .all();
  
  res.json(users);
});

// Get users by role (admin only)
app.get('/api/users/role/:role', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { role } = req.params;
  const users = db.prepare('SELECT id, name, email, role, phone, location, business_name, service_category, created_at FROM users WHERE role = ?')
    .all(role);
  
  res.json(users);
});

// ============================================
// BOOKING ROUTES
// ============================================

// Create booking (POST /api/booking/create)
app.post('/api/booking/create', authenticateToken, (req, res) => {
  try {
    const { providerId, serviceType, location, bookingDate, serviceDate, time, description } = req.body;

    // Validation
    if (!serviceType || !location || !bookingDate || !serviceDate || !time) {
      return res.status(400).json({ message: 'Required fields: serviceType, location, bookingDate, serviceDate, time' });
    }

    // Only customers can create bookings
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create bookings' });
    }

    const result = db.prepare(`
      INSERT INTO bookings (customer_id, provider_id, service_type, location, booking_date, service_date, time, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id, 
      providerId || null, 
      serviceType, 
      location, 
      bookingDate,
      serviceDate,
      time, 
      description || '', 
      'PENDING'
    );

    res.status(201).json({
      booking_id: result.lastInsertRowid,
      message: 'Booking created successfully',
      status: 'PENDING'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get bookings by customer ID (GET /api/booking/customer/:id)
app.get('/api/booking/customer/:id', authenticateToken, (req, res) => {
  try {
    const customerId = parseInt(req.params.id);

    // Customers can only view their own bookings, admins can view any
    if (req.user.role === 'customer' && req.user.id !== customerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = db.prepare(`
      SELECT 
        b.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        p.name as provider_name,
        p.business_name as provider_business_name,
        p.phone as provider_phone
      FROM bookings b
      JOIN users c ON b.customer_id = c.id
      LEFT JOIN users p ON b.provider_id = p.id
      WHERE b.customer_id = ?
      ORDER BY b.created_at DESC
    `).all(customerId);

    res.json({
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get bookings by provider ID (GET /api/booking/provider/:id)
app.get('/api/booking/provider/:id', authenticateToken, (req, res) => {
  try {
    const providerId = parseInt(req.params.id);

    // Providers can only view their own bookings, admins can view any
    if (req.user.role === 'provider' && req.user.id !== providerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = db.prepare(`
      SELECT 
        b.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.location as customer_location,
        p.name as provider_name,
        p.business_name as provider_business_name
      FROM bookings b
      JOIN users c ON b.customer_id = c.id
      LEFT JOIN users p ON b.provider_id = p.id
      WHERE b.provider_id = ?
      ORDER BY b.created_at DESC
    `).all(providerId);

    res.json({
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Update booking status (PUT /api/booking/status/:bookingId)
app.put('/api/booking/status/:bookingId', authenticateToken, (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: PENDING, CONFIRMED, COMPLETED, CANCELLED' 
      });
    }

    // Get booking to check permissions
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Permission check
    // - Customers can cancel their own bookings
    // - Providers can confirm/complete bookings assigned to them
    // - Admins can update any booking
    if (req.user.role === 'customer') {
      if (booking.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (status !== 'CANCELLED') {
        return res.status(403).json({ message: 'Customers can only cancel bookings' });
      }
    } else if (req.user.role === 'provider') {
      if (booking.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (!['CONFIRMED', 'COMPLETED'].includes(status)) {
        return res.status(403).json({ message: 'Providers can only confirm or complete bookings' });
      }
    }

    // Update status
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, bookingId);

    res.json({
      message: 'Booking status updated successfully',
      booking_id: bookingId,
      new_status: status
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Get all bookings (for backward compatibility)
app.get('/api/bookings', authenticateToken, (req, res) => {
  try {
    let bookings;

    if (req.user.role === 'customer') {
      // Customers see their own bookings
      bookings = db.prepare(`
        SELECT b.*, u.name as customer_name, u.email as customer_email
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        WHERE b.customer_id = ?
        ORDER BY b.created_at DESC
      `).all(req.user.id);
    } else if (req.user.role === 'provider') {
      // Providers see bookings assigned to them
      bookings = db.prepare(`
        SELECT b.*, u.name as customer_name, u.email as customer_email
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        WHERE b.provider_id = ?
        ORDER BY b.created_at DESC
      `).all(req.user.id);
    } else {
      // Admins see all bookings
      bookings = db.prepare(`
        SELECT b.*, u.name as customer_name, u.email as customer_email
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        ORDER BY b.created_at DESC
      `).all();
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Create booking (legacy endpoint for backward compatibility)
app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const { serviceType, location, date, time, description, providerId } = req.body;

    if (!serviceType || !location || !date || !time) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const bookingDate = new Date().toISOString().split('T')[0];
    const serviceDate = date;

    const result = db.prepare(`
      INSERT INTO bookings (customer_id, provider_id, service_type, location, booking_date, service_date, time, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, providerId || null, serviceType, location, bookingDate, serviceDate, time, description || '', 'PENDING');

    res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get all bookings (admin only)
app.get('/api/bookings/all', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const bookings = db.prepare(`
    SELECT b.*, u.name as customer_name, u.email as customer_email
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    ORDER BY b.created_at DESC
  `).all();

  res.json(bookings);
});

// ============================================
// STATISTICS ROUTES
// ============================================

// Get statistics (admin only)
app.get('/api/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const stats = {
    totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    customers: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count,
    providers: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'provider'").get().count,
    admins: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get().count,
    totalBookings: db.prepare('SELECT COUNT(*) as count FROM bookings').get().count,
    pendingBookings: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get().count
  };

  res.json(stats);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickServ API is running' });
});

// Database Console
app.get('/db-console', (req, res) => {
  res.sendFile(join(__dirname, 'db-console.html'));
});

// Execute SQL-like query (for console)
app.post('/api/database/query', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const trimmedQuery = query.trim().toLowerCase();
    
    // Parse and execute query
    if (trimmedQuery.startsWith('select')) {
      let results = [];
      
      if (trimmedQuery.includes('from users')) {
        results = db.data.users;
        
        // Apply WHERE filters
        if (trimmedQuery.includes("where role = 'customer'") || trimmedQuery.includes('where role = "customer"')) {
          results = results.filter(u => u.role === 'customer');
        } else if (trimmedQuery.includes("where role = 'provider'") || trimmedQuery.includes('where role = "provider"')) {
          results = results.filter(u => u.role === 'provider');
        } else if (trimmedQuery.includes("where role = 'admin'") || trimmedQuery.includes('where role = "admin"')) {
          results = results.filter(u => u.role === 'admin');
        }
        
        // Handle COUNT
        if (trimmedQuery.includes('count(*)')) {
          results = [{ total: results.length }];
        }
      } else if (trimmedQuery.includes('from bookings')) {
        results = db.data.bookings;
        
        // Apply WHERE filters
        if (trimmedQuery.includes("where status = 'pending'") || trimmedQuery.includes('where status = "pending"')) {
          results = results.filter(b => b.status === 'PENDING' || b.status === 'pending');
        } else if (trimmedQuery.includes("where status = 'confirmed'") || trimmedQuery.includes('where status = "confirmed"')) {
          results = results.filter(b => b.status === 'CONFIRMED' || b.status === 'confirmed');
        }
        
        // Handle JOIN with users
        if (trimmedQuery.includes('join users')) {
          results = results.map(b => {
            const customer = db.data.users.find(u => u.id === b.customer_id);
            const provider = b.provider_id ? db.data.users.find(u => u.id === b.provider_id) : null;
            return {
              ...b,
              customer_name: customer?.name,
              customer_email: customer?.email,
              provider_name: provider?.name
            };
          });
        }
        
        // Handle COUNT
        if (trimmedQuery.includes('count(*)')) {
          results = [{ total: results.length }];
        }
      }
      
      res.json({ success: true, results, rowCount: results.length });
    } else if (trimmedQuery.startsWith('insert')) {
      res.json({ success: false, error: 'INSERT queries are not supported in console. Use the API endpoints instead.' });
    } else if (trimmedQuery.startsWith('update')) {
      res.json({ success: false, error: 'UPDATE queries are not supported in console. Use the API endpoints instead.' });
    } else if (trimmedQuery.startsWith('delete')) {
      res.json({ success: false, error: 'DELETE queries are not supported in console. Use the API endpoints instead.' });
    } else {
      res.json({ success: false, error: 'Unsupported query type. Only SELECT queries are supported.' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get database schema
app.get('/api/database/schema', (req, res) => {
  try {
    const schema = {
      users: [
        { name: 'id', type: 'INTEGER', pk: true, notnull: true },
        { name: 'name', type: 'TEXT', pk: false, notnull: true },
        { name: 'email', type: 'TEXT', pk: false, notnull: true },
        { name: 'password', type: 'TEXT', pk: false, notnull: true },
        { name: 'role', type: 'TEXT', pk: false, notnull: true },
        { name: 'phone', type: 'TEXT', pk: false, notnull: false },
        { name: 'location', type: 'TEXT', pk: false, notnull: false },
        { name: 'business_name', type: 'TEXT', pk: false, notnull: false },
        { name: 'service_category', type: 'TEXT', pk: false, notnull: false },
        { name: 'created_at', type: 'DATETIME', pk: false, notnull: false }
      ],
      bookings: [
        { name: 'id', type: 'INTEGER', pk: true, notnull: true },
        { name: 'customer_id', type: 'INTEGER', pk: false, notnull: true },
        { name: 'provider_id', type: 'INTEGER', pk: false, notnull: false },
        { name: 'service_type', type: 'TEXT', pk: false, notnull: true },
        { name: 'location', type: 'TEXT', pk: false, notnull: true },
        { name: 'booking_date', type: 'TEXT', pk: false, notnull: true },
        { name: 'service_date', type: 'TEXT', pk: false, notnull: true },
        { name: 'time', type: 'TEXT', pk: false, notnull: true },
        { name: 'description', type: 'TEXT', pk: false, notnull: false },
        { name: 'status', type: 'TEXT', pk: false, notnull: false },
        { name: 'created_at', type: 'DATETIME', pk: false, notnull: false }
      ]
    };
    
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table data
app.get('/api/database/table/:tableName', (req, res) => {
  try {
    const { tableName } = req.params;
    if (tableName === 'users') {
      res.json(db.data.users);
    } else if (tableName === 'bookings') {
      res.json(db.data.bookings);
    } else {
      res.status(404).json({ error: 'Table not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle provider availability
app.put('/api/provider/availability', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can update availability' });
    }

    const { isAvailable } = req.body;
    const user = db.data.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.is_available = isAvailable;
    db.save();

    res.json({
      message: 'Availability updated successfully',
      is_available: user.is_available
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
});

// Get available providers by service category
app.get('/api/providers/available/:category', (req, res) => {
  try {
    const { category } = req.params;
    const providers = db.data.users.filter(
      u => u.role === 'provider' && 
      u.service_category === category &&
      u.is_available === true
    );
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:userId', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userId = parseInt(req.params.userId);
    const userIndex = db.data.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deletedUser = db.data.users[userIndex];
    db.data.users.splice(userIndex, 1);
    
    // Also delete related bookings
    db.data.bookings = db.data.bookings.filter(
      b => b.customer_id !== userId && b.provider_id !== userId
    );
    
    db.save();

    res.json({
      message: 'User deleted successfully',
      deletedUser: { id: deletedUser.id, name: deletedUser.name, email: deletedUser.email }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Admin: Block/Unblock provider
app.put('/api/admin/providers/:providerId/block', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const providerId = parseInt(req.params.providerId);
    const { isBlocked } = req.body;
    
    const provider = db.data.users.find(u => u.id === providerId && u.role === 'provider');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.is_blocked = isBlocked;
    if (isBlocked) {
      provider.is_available = false; // Block also makes unavailable
    }
    
    db.save();

    res.json({
      message: `Provider ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      provider: { id: provider.id, name: provider.name, is_blocked: provider.is_blocked }
    });
  } catch (error) {
    console.error('Error blocking provider:', error);
    res.status(500).json({ message: 'Failed to update provider status' });
  }
});

// Admin: Get system statistics
app.get('/api/admin/statistics', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = db.data.users;
    const bookings = db.data.bookings;

    const stats = {
      users: {
        total: users.length,
        customers: users.filter(u => u.role === 'customer').length,
        providers: users.filter(u => u.role === 'provider').length,
        admins: users.filter(u => u.role === 'admin').length,
        blockedProviders: users.filter(u => u.role === 'provider' && u.is_blocked).length
      },
      bookings: {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED').length
      },
      activity: {
        newUsersToday: users.filter(u => {
          const today = new Date().toISOString().split('T')[0];
          return u.created_at && u.created_at.startsWith(today);
        }).length,
        newBookingsToday: bookings.filter(b => {
          const today = new Date().toISOString().split('T')[0];
          return b.created_at && b.created_at.startsWith(today);
        }).length
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Failed to get statistics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 QuickServ Backend Server Running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💾 Database: JSON File (database.json)`);
  console.log(`🗄️  Database Console: http://localhost:${PORT}/db-console`);
  console.log(`\n✅ Available endpoints:`);
  console.log(`   POST /api/auth/register/customer`);
  console.log(`   POST /api/auth/register/provider`);
  console.log(`   POST /api/auth/register/admin`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/users/me`);
  console.log(`   GET  /api/bookings`);
  console.log(`   POST /api/bookings`);
  console.log(`\n📅 Booking Module Endpoints:`);
  console.log(`   POST /api/booking/create`);
  console.log(`   GET  /api/booking/customer/:id`);
  console.log(`   GET  /api/booking/provider/:id`);
  console.log(`   PUT  /api/booking/status/:bookingId`);
  console.log(`\n🔧 Other Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /db-console (Database Console)\n`);
});
