CREATE TYPE user_role AS ENUM ('sales', 'manager');
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'lost',
  'converted'
);
CREATE TYPE project_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'rejected'
);
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'suspended', 'cancelled');
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role user_role,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  status lead_status,
  created_by INTEGER REFERENCES Users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  speed VARCHAR(50),
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Projects (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES Leads(id),
  sales_id INTEGER REFERENCES Users(id),
  status project_status,
  notes TEXT,
  approved_by INTEGER REFERENCES Users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE Customers (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES Projects(id),
  name VARCHAR(255),
  address TEXT,
  registration_date DATE
);
CREATE TABLE Customer_Services (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES Customers(id),
  product_id INTEGER REFERENCES Products(id),
  start_date DATE,
  end_date DATE
);