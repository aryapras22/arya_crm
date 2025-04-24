Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('sales', 'manager'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
Leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  status ENUM('new', 'contacted', 'qualified', 'lost'),
  created_by INT REFERENCES Users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  speed VARCHAR(50),
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
Projects (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES Leads(id),
  sales_id INT REFERENCES Users(id),
  status ENUM('pending', 'approved', 'rejected'),
  notes TEXT,
  approved_by INT REFERENCES Users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
Customers (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES Projects(id),
  name VARCHAR(255),
  address TEXT,
  registration_date DATE
);
Customer_Services (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES Customers(id),
  product_id INT REFERENCES Products(id),
  start_date DATE,
  end_date DATE
);