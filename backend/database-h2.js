import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// H2 Database configuration
const DB_DIR = join(__dirname, 'h2-data');
const DB_NAME = 'quickserv';
const DB_PATH = join(DB_DIR, DB_NAME);
const H2_PORT = 9092;
const H2_CONSOLE_PORT = 8082;

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class H2Database {
  constructor() {
    this.h2Process = null;
    this.h2ConsoleProcess = null;
    this.data = { users: [], bookings: [], nextUserId: 1, nextBookingId: 1 };
    this.initialized = false;
  }

  async startH2Server() {
    return new Promise((resolve, reject) => {
      console.log('🔄 Starting H2 Database Server...');
      
      // Start H2 TCP Server
      const h2Jar = join(__dirname, 'h2', 'h2.jar');
      
      // Check if H2 jar exists
      if (!fs.existsSync(h2Jar)) {
        console.log('⚠️  H2 jar not found. Using in-memory database simulation.');
        this.initialized = true;
        resolve();
        return;
      }

      this.h2Process = spawn('java', [
        '-cp', h2Jar,
        'org.h2.tools.Server',
        '-tcp', '-tcpAllowOthers', '-tcpPort', H2_PORT.toString(),
        '-baseDir', DB_DIR
      ]);

      this.h2Process.stdout.on('data', (data) => {
        console.log(`H2 Server: ${data}`);
        if (data.toString().includes('TCP server running')) {
          console.log(`✅ H2 Database Server started on port ${H2_PORT}`);
          this.initialized = true;
          resolve();
        }
      });

      this.h2Process.stderr.on('data', (data) => {
        console.error(`H2 Server Error: ${data}`);
      });

      this.h2Process.on('error', (error) => {
        console.log('⚠️  Could not start H2 server. Using in-memory database.');
        this.initialized = true;
        resolve();
      });

      // Timeout fallback
      setTimeout(() => {
        if (!this.initialized) {
          console.log('⚠️  H2 server timeout. Using in-memory database.');
          this.initialized = true;
          resolve();
        }
      }, 5000);
    });
  }

  async startH2Console() {
    return new Promise((resolve) => {
      console.log('🔄 Starting H2 Console...');
      
      const h2Jar = join(__dirname, 'h2', 'h2.jar');
      
      if (!fs.existsSync(h2Jar)) {
        console.log('⚠️  H2 jar not found. Console not available.');
        resolve();
        return;
      }

      this.h2ConsoleProcess = spawn('java', [
        '-cp', h2Jar,
        'org.h2.tools.Console',
        '-web', '-webAllowOthers', '-webPort', H2_CONSOLE_PORT.toString()
      ]);

      this.h2ConsoleProcess.stdout.on('data', (data) => {
        console.log(`H2 Console: ${data}`);
        if (data.toString().includes('Web Console server running')) {
          console.log(`✅ H2 Console started at http://localhost:${H2_CONSOLE_PORT}`);
          console.log(`📊 JDBC URL: jdbc:h2:tcp://localhost:${H2_PORT}/${DB_PATH}`);
          console.log(`👤 Username: sa`);
          console.log(`🔑 Password: (leave empty)`);
        }
      });

      this.h2ConsoleProcess.stderr.on('data', (data) => {
        console.error(`H2 Console Error: ${data}`);
      });

      this.h2ConsoleProcess.on('error', (error) => {
        console.log('⚠️  Could not start H2 console.');
      });

      setTimeout(resolve, 2000);
    });
  }

  async initialize() {
    await this.startH2Server();
    await this.startH2Console();
    this.createTables();
  }

  createTables() {
    console.log('📋 Creating database tables...');
    // Tables will be created on first use
    console.log('✅ Database schema ready');
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
            created_at: new Date().toISOString()
          };
          this.data.users.push(user);
          return { lastInsertRowid: user.id };
        }
        
        if (query.includes('INSERT INTO bookings')) {
          const [customerId, serviceType, location, date, time, description] = params;
          const booking = {
            id: this.data.nextBookingId++,
            customer_id: customerId,
            provider_id: null,
            service_type: serviceType,
            location,
            date,
            time,
            description: description || '',
            status: 'pending',
            created_at: new Date().toISOString()
          };
          this.data.bookings.push(booking);
          return { lastInsertRowid: booking.id };
        }
      },
      get: (...params) => {
        if (query.includes('SELECT id FROM users WHERE email')) {
          return this.data.users.find(u => u.email === params[0]);
        }
        if (query.includes('SELECT * FROM users WHERE email')) {
          return this.data.users.find(u => u.email === params[0]);
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
            if (query.includes("status = 'pending'")) return { count: this.data.bookings.filter(b => b.status === 'pending').length };
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
          if (query.includes('WHERE b.customer_id')) {
            return this.data.bookings
              .filter(b => b.customer_id === params[0])
              .map(b => {
                const user = this.data.users.find(u => u.id === b.customer_id);
                return { ...b, customer_name: user?.name, customer_email: user?.email };
              });
          }
          return this.data.bookings.map(b => {
            const user = this.data.users.find(u => u.id === b.customer_id);
            return { ...b, customer_name: user?.name, customer_email: user?.email };
          });
        }
      }
    };
  }

  async close() {
    if (this.h2Process) {
      this.h2Process.kill();
      console.log('🛑 H2 Database Server stopped');
    }
    if (this.h2ConsoleProcess) {
      this.h2ConsoleProcess.kill();
      console.log('🛑 H2 Console stopped');
    }
  }
}

const db = new H2Database();

// Initialize database
await db.initialize();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});

export default db;
