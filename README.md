# ApexBiz Enterprise Platform

ApexBiz Enterprise Platform is a full-stack enterprise business management system built for companies that manage branches, users, products, POS sales, inventory, wallets, accounting records, and financial reports.

This project was developed as an interview-ready software engineering portfolio project using modern full-stack technologies.

## Project Purpose

Many businesses manage sales, stock, wallets, and accounting separately. This can lead to stock errors, missing records, manual accounting mistakes, and weak business visibility.

ApexBiz solves this by bringing business operations into one connected platform.

## Main Features

- Username and password authentication
- Password hashing with bcrypt
- JWT-based login
- Role-based access control
- Business and branch management
- Wallet deposit, withdrawal, and transfer
- Double-entry ledger logic
- Product management
- Product update form
- POS sales
- Inventory stock in, stock out, and adjustment
- Accounting reports
- Professional frontend dashboard
- PostgreSQL database
- Docker-based local development environment

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication
- Bcrypt

### Database

- PostgreSQL
- pgAdmin

### Tools

- Docker
- Docker Compose
- Git
- GitHub
- VS Code

## System Architecture

```text
User
 |
 v
Next.js Frontend
 |
 v
NestJS Backend API
 |
 v
Service Layer / Business Logic
 |
 v
Prisma ORM
 |
 v
PostgreSQL Database
```

## Main Modules

- Auth Module
- Businesses Module
- Branches Module
- Wallets Module
- Ledger Module
- Transactions Module
- Products Module
- POS Sales Module
- Inventory Module
- Accounting Module
- Database Module
- Prisma Module

## Frontend Sections

- Login page
- Overview dashboard
- Products tab
- POS Sales tab
- Inventory tab
- Accounting tab

## Important API Areas

- `/auth/login`
- `/auth/me`
- `/businesses`
- `/branches`
- `/wallets`
- `/ledger/accounts`
- `/ledger/transactions`
- `/transactions`
- `/products`
- `/pos-sales`
- `/inventory/stock-in`
- `/inventory/stock-out`
- `/inventory/adjust`
- `/accounting/trial-balance`
- `/accounting/income-statement`
- `/accounting/balance-sheet`
- `/accounting/wallet-summary`
- `/accounting/ledger-summary`

## How to Run the Project

### 1. Start Docker Services

```bash
docker compose -f infra/docker-compose.yml up -d
```

### 2. Start Backend

```bash
cd backend/apexbiz-api
npm run start:dev
```

Backend runs on:

```text
http://localhost:3000
```

Database health check:

```text
http://localhost:3000/database/health
```

### 3. Start Frontend

```bash
cd frontend
npm run dev -- -p 3001
```

Frontend runs on:

```text
http://localhost:3001
```

## Interview Demo Flow

1. Show login page
2. Login as admin
3. Show dashboard overview
4. Create a product
5. Update product stock or price
6. Create a POS sale
7. Show POS sales table
8. Perform stock in, stock out, or stock adjustment
9. Show inventory movement table
10. Show accounting reports
11. Explain backend API structure
12. Show PostgreSQL database tables
13. Show GitHub commit history

## Why This Project Is Strong

This is not only a simple CRUD application.

It includes:

- Real backend architecture
- Authentication and authorization
- Business logic
- Financial transaction logic
- Double-entry ledger concept
- Inventory validation
- POS sales validation
- Accounting report endpoints
- Professional frontend dashboard
- Database design
- Docker development setup
- GitHub version control

## Documentation

Detailed documentation is available in the `docs` folder:

- `INTERVIEW_GUIDE.md`
- `ARCHITECTURE.md`
- `RUN_PROJECT.md`
- `DEMO_SCRIPT.md`
- `FEATURES.md`

## Author

Developed as a full-stack software engineering portfolio project.

## Security Documentation

- docs/OWASP_SECURITY_TESTING_REPORT.md
- docs/SECURITY_TEST_CASES.md

- docs/PENETRATION_TESTING_REPORT.md
- docs/PENTEST_CHECKLIST.md
