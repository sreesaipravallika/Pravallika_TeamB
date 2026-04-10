import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_FILE = join(__dirname, 'database.json');

// Initialize database file
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], bookings: [], nextUserId: 1, nextBookingId: 1 }, null, 2));
}

class JSONDatabase {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
      return { users: [], bookings: [], nextUserId: 1, nextBookingId: 1 };
    }
  }

  save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
  }

  prepare(query) {
    return {
      run: (...params) => {
        if (query.includes('INSERT INTO users')) {
          const [name, email, password, role, phone, location, businessName, serviceCategory] = params;
          const user = {
            id: this.data.nextUserId++,
            name,
            email,
            password,
            role,
            phone: phone || null,
            location: location || null,
            business_name: businessName || null,
            service_category: serviceCategory || null,
            is_available: true,
            is_blocked: false,
            created_at: new Date().toISOString()
          };
          this.data.users.push(user);
          this.save();
          return { lastInsertRowid: user.id };
        }
        
        if (query.includes('INSERT INTO bookings')) {
          const [customerId, providerId, serviceType, location, bookingDate, serviceDate, time, description, status] = params;
          const booking = {
            id: this.data.nextBookingId++,
            customer_id: customerId,
            provider_id: providerId,
            service_type: serviceType,
            location,
            booking_date: bookingDate,
            service_date: serviceDate,
            time,
            description: description || '',
            status: status || 'PENDING',
            created_at: new Date().toISOString()
          };
          this.data.bookings.push(booking);
          this.save();
          return { lastInsertRowid: booking.id };
        }

        if (query.includes('UPDATE bookings SET status')) {
          const [status, id] = params;
          const booking = this.data.bookings.find(b => b.id === id);
          if (booking) {
            booking.status = status;
            this.save();
          }
          return;
        }
      },
      get: (...params) => {
        if (query.includes('SELECT id FROM users WHERE email')) {
          return this.data.users.find(u => u.email === params[0]);
        }
        if (query.includes('SELECT * FROM users WHERE email')) {
          return this.data.users.find(u => u.email === params[0]);
        }
        if (query.includes('SELECT * FROM bookings WHERE id')) {
          return this.data.bookings.find(b => b.id === params[0]);
        }
        if (query.includes('SELECT id, name, email, role')) {
          return this.data.users.find(u => u.id === params[0]);
        }
        if (query.includes('COUNT')) {
          if (query.includes("role = 'customer'")) return { count: this.data.users.filter(u => u.role === 'customer').length };
          if (query.includes("role = 'provider'")) return { count: this.data.users.filter(u => u.role === 'provider').length };
          if (query.includes("role = 'admin'")) return { count: this.data.users.filter(u => u.role === 'admin').length };
          if (query.includes('FROM users')) return { count: this.data.users.length };
          if (query.includes('FROM bookings')) {
            if (query.includes("status = 'pending'") || query.includes("status = 'PENDING'")) {
              return { count: this.data.bookings.filter(b => b.status === 'pending' || b.status === 'PENDING').length };
            }
            return { count: this.data.bookings.length };
          }
        }
      },
      all: (...params) => {
        if (query.includes('FROM users WHERE role')) {
          return this.data.users.filter(u => u.role === params[0]);
        }
        if (query.includes('FROM users')) {
          return this.data.users;
        }
        if (query.includes('FROM bookings')) {
          let bookings = this.data.bookings;
          
          // Filter by customer_id
          if (query.includes('WHERE b.customer_id')) {
            bookings = bookings.filter(b => b.customer_id === params[0]);
          }
          
          // Filter by provider_id
          if (query.includes('WHERE b.provider_id')) {
            bookings = bookings.filter(b => b.provider_id === params[0]);
          }
          
          // Add user information
          return bookings.map(b => {
            const customer = this.data.users.find(u => u.id === b.customer_id);
            const provider = b.provider_id ? this.data.users.find(u => u.id === b.provider_id) : null;
            
            return {
              ...b,
              customer_name: customer?.name,
              customer_email: customer?.email,
              customer_phone: customer?.phone,
              customer_location: customer?.location,
              provider_name: provider?.name,
              provider_business_name: provider?.business_name,
              provider_phone: provider?.phone
            };
          });
        }
      }
    };
  }
}

const db = new JSONDatabase();
console.log('✅ JSON Database initialized successfully');

export default db;
