# ApexBiz Enterprise Platform - Interview Guide

## 1. Project Summary

ApexBiz Enterprise Platform is a full-stack enterprise business management system built for companies that manage branches, users, wallets, accounting records, products, POS sales, and inventory.

The project is designed to show real software engineering skills such as authentication, role-based access control, backend API development, database design, financial ledger logic, POS transactions, inventory tracking, frontend dashboard development, and cloud/deployment preparation.

## 2. Main Problem Solved

Many small and medium businesses manage sales, stock, cash, and accounting separately. This can cause:

- Stock mistakes
- Missing sales records
- Poor financial visibility
- Manual accounting errors
- No proper role control for staff
- No clear audit trail

ApexBiz solves this by combining business operations into one system.

## 3. Main Users

The system supports different staff roles:

- ADMIN: Can manage business-level operations
- MANAGER: Can manage branch-level business activities
- CASHIER: Can create POS sales and handle daily transactions

## 4. Main Features

### Authentication and Security

- Username and password login
- Password hashing
- JWT authentication
- Protected backend APIs
- Role-based access control

### Business and Branch Management

- Create businesses
- Create branches
- Link users, wallets, products, and transactions to business records

### Wallet System

- Create business wallets
- Deposit money
- Withdraw money
- Transfer money
- Track wallet balances

### Double-Entry Ledger

- Every financial transaction creates accounting entries
- Debit and credit records are stored
- The ledger helps maintain accounting correctness

### Product Management

- Create products
- Update product name, price, stock, reorder level, and status
- Show active and inactive product states
- Show low-stock warnings

### POS Sales

- Create POS sales
- Select product and quantity
- Validate available stock
- Prevent selling inactive products
- Show sales records in a professional table

### Inventory Management

- Stock in
- Stock out
- Stock adjustment
- Prevent invalid stock movements
- Show inventory movement history

### Accounting Reports

- Trial balance
- Income statement
- Balance sheet
- Wallet summary
- Ledger summary

## 5. Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- Prisma ORM
- JWT authentication
- Bcrypt password hashing

### Database

- PostgreSQL
- Prisma schema and migrations

### DevOps / Tools

- Docker
- Docker Compose
- pgAdmin
- Git
- GitHub
- VS Code

## 6. System Architecture

The project follows a layered full-stack architecture.

Frontend:

- Next.js dashboard
- Login page
- Forms for products, sales, and inventory
- Tables for business data
- API helper to call backend endpoints

Backend:

- NestJS modules
- Controllers for API routes
- Services for business logic
- Guards for authentication and role checking
- Prisma service for database access

Database:

- PostgreSQL stores users, businesses, branches, wallets, ledger accounts, ledger transactions, products, POS sales, and inventory movements

## 7. Important Backend Modules

- AuthModule
- BusinessesModule
- BranchesModule
- WalletsModule
- LedgerModule
- TransactionsModule
- ProductsModule
- PosSalesModule
- InventoryModule
- AccountingModule
- DatabaseModule
- PrismaModule

## 8. Important API Areas

- /auth/login
- /auth/me
- /businesses
- /branches
- /wallets
- /ledger/accounts
- /ledger/transactions
- /transactions
- /products
- /pos-sales
- /inventory/stock-in
- /inventory/stock-out
- /inventory/adjust
- /accounting/trial-balance
- /accounting/income-statement
- /accounting/balance-sheet
- /accounting/wallet-summary
- /accounting/ledger-summary

## 9. What I Learned

From this project, I learned how to:

- Build a full-stack system from scratch
- Design backend APIs using NestJS
- Use PostgreSQL with Prisma ORM
- Implement JWT authentication
- Implement role-based access control
- Create frontend dashboards with Next.js
- Connect frontend forms to backend APIs
- Validate business rules in both frontend and backend
- Track business transactions using ledger logic
- Use Git and GitHub for version control
- Use Docker for database and development services

## 10. How I Can Explain This in an Interview

I can explain this project as:

"ApexBiz is a full-stack enterprise business management platform. I built it using Next.js for the frontend, NestJS for the backend, PostgreSQL for the database, and Prisma as the ORM. The system supports authentication, role-based access control, wallet transactions, double-entry ledger accounting, product management, POS sales, inventory tracking, and accounting reports. I also added frontend validation, professional dashboards, and GitHub version control."

## 11. Best Demo Flow

During the interview, I can show:

1. Login page
2. Dashboard overview
3. Products tab
4. Create product
5. Update product
6. POS sale creation
7. POS sales table
8. Inventory stock in / stock out / adjustment
9. Inventory movement table
10. Accounting reports
11. Backend API endpoints
12. PostgreSQL database tables
13. GitHub repository commits

## 12. Strong Points to Mention

- This is not only a frontend project
- This is not only a CRUD project
- It includes real backend business logic
- It includes financial transaction handling
- It includes double-entry ledger logic
- It includes inventory validation
- It includes role-based access control
- It uses a professional full-stack architecture
- It is suitable for real business systems
