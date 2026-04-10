-- QuickServ Database Schema for H2

-- Drop tables if they exist
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;

-- Create Users Table
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
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings Table
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

-- Insert sample admin user
INSERT INTO users (name, email, password, role, phone, location, is_available, created_at)
VALUES (
  'Admin User',
  'admin@quickserv.com',
  '$2a$10$IzmAO.TtEowUH7ihdTvZU.A4rkJQcp5w93s0Rqd.mzbq6CmgxFkQ2',
  'admin',
  '1234567890',
  'System',
  TRUE,
  CURRENT_TIMESTAMP
);

-- Insert sample customer
INSERT INTO users (name, email, password, role, phone, location, is_available, created_at)
VALUES (
  'Sree Sai Pravallika.B',
  'sreesaipravallika26@gmail.com',
  '$2a$10$IzmAO.TtEowUH7ihdTvZU.A4rkJQcp5w93s0Rqd.mzbq6CmgxFkQ2',
  'customer',
  '7989876487',
  'Hyd',
  TRUE,
  CURRENT_TIMESTAMP
);

-- Insert sample provider
INSERT INTO users (name, email, password, role, phone, location, business_name, service_category, is_available, created_at)
VALUES (
  'John Plumber',
  'john@plumbing.com',
  '$2a$10$IzmAO.TtEowUH7ihdTvZU.A4rkJQcp5w93s0Rqd.mzbq6CmgxFkQ2',
  'provider',
  '9876543210',
  'Hyd',
  'John Plumbing Services',
  'Plumbing',
  TRUE,
  CURRENT_TIMESTAMP
);

-- Verify data
SELECT 'Users Table' as Info;
SELECT * FROM users;

SELECT 'Bookings Table' as Info;
SELECT * FROM bookings;
