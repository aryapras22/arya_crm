# PT Smart CRM - Installation and Usage Guide

## HEROKU DEPLOYEMENT LINK
http://crm.aryaprasetya.me/

## System Requirements
- PHP 8.1 or higher
- Composer & Laravel
- Node.js and npm
- PostgreSQL database

## Installation
### Step 1: Clone the Repository
```bash
git clone https://github.com/aryapras22/arya_crm.git
cd arya_crm
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Install JavaScript Dependencies
```bash
npm install
```

### Step 4: Configure Environment Variables
```bash
cp .env.example .env
php artisan key:generate
```

## Database Setup
### Step 1: Create Database
Create a PostgreSQL database named `crm_database` or whatever you've defined in your .env file.
```sql
CREATE DATABASE crm_database;
```

### Step 2: Run Migrations
Run the database migrations to create all necessary tables:
```bash
php artisan migrate
```

## Seeding the Database
The application includes several seeders to populate the database with test data. These seeders will create users, leads, products, projects, customers, and customer services.
To populate the entire database with test data, run:

```bash
php artisan db:seed
```
This will run all seeders in the following order :
1. `UserSeeder` - Creates manager and sales user accounts
2. `LeadSeeder` - Generates lead data
3. `ProductSeeder` - Creates available products/services
4. `ProjectSeeder` - Creates projects based on leads
5. `CustomerSeeder` - Updates customer statuses
6. `CustomerServiceSeeder` - Attaches services to customers


### Seeded Data Overview
After seeding, your database will have:

#### Users
- **Manager Account**: 
  - Email: manager@ptsmart.com
  - Password: password
  - Role: manager
- **Sales Account**: 
  - Email: sales@ptsmart.com
  - Password: password
  - Role: sales
- **Random Users**: 8 additional random users with various roles

#### Products
- Basic Internet (10 Mbps) - $29.99
- Standard Internet (50 Mbps) - $49.99
- Premium Internet (100 Mbps) - $69.99
- Ultra Internet (300 Mbps) - $89.99
- Business Internet (500 Mbps) - $119.99
- Legacy Package (5 Mbps) - $19.99 (inactive)
- 4 additional random products

#### Projects
Projects are distributed as follows:
- 25% in "draft" status
- 35% in "pending_approval" status
- 25% in "approved" status (with corresponding customers)
- 15% in "rejected" status

#### Customers
- Created automatically for approved projects
- Status distribution: 
  - 70% active
  - 15% inactive
  - 10% suspended
  - 5% cancelled

#### Customer Services
- Each customer has 1-3 service subscriptions
- 70% of services are ongoing (no end date)
- 30% have a one-year contract period

## Running the Application

### Step 2: Start the Server
```bash
composer run dev
```
This will start the application on `http://localhost:8000`.

### Step 3: Login
Access the application in your browser and log in using one of the seeded accounts:
- Manager: manager@ptsmart.com / password
- Sales: sales@ptsmart.com / password

## User Roles and Access
### Manager Role
Managers have full access to the application, including:
- Viewing all leads, projects, and customers
- Approving or rejecting projects
- Accessing manager dashboard analytics

### Sales Role
Sales users have limited access:
- Creating projects from qualified leads
- Viewing only their own projects
- Seeing a personalized dashboard with their performance metrics

## Core Features
### Dashboard
- Key performance indicators based on user role
- Recent leads and projects
- Quick action links

### Leads Management
1. Navigate to the Leads section
2. Create new leads with contact information
3. Update lead status (new, contacted, qualified, etc.)
4. Assign leads to sales representatives

### Projects
1. Create projects from qualified leads
2. Submit projects for approval
3. Track project status (draft, pending approval, approved, rejected)
4. View project details and associated customer information

### Customers
1. View customer profiles (created automatically when projects are approved)
2. Update customer information and status
3. Add or remove services for each customer
4. View customer service history

### Products and Services
1. Browse available products
2. Add products to customer accounts
3. Set start and end dates for services
4. Track active and inactive products


### Timespent working on this project
1. Thursday 18.00-24.00
2. Friday 19.00-24.00
3. Saturday 09.00-14.00
