# ApexBiz Enterprise Platform - Architecture

## 1. Architecture Style

ApexBiz uses a layered full-stack architecture.

The system is divided into:

- Frontend layer
- Backend API layer
- Business logic layer
- Database access layer
- PostgreSQL database layer
- Docker development infrastructure

## 2. High-Level Flow

The user interacts with the Next.js frontend.

The frontend sends HTTP requests to the NestJS backend API.

The backend validates the request, checks authentication and role permissions, runs business logic, and stores or reads data using Prisma ORM.

Prisma communicates with the PostgreSQL database.

## 3. Architecture Diagram

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

## 4. Frontend Layer

The frontend is built using:

- Next.js
- React
- TypeScript
- Tailwind CSS

Frontend responsibilities:

- Login page
- Enterprise dashboard
- Product forms
- Product update form
- POS sale form
- Inventory action form
- Tables for products, sales, and inventory movements
- Accounting report display
- API helper to call backend endpoints

## 5. Backend Layer

The backend is built using:

- NestJS
- TypeScript
- Prisma ORM
- JWT authentication
- Bcrypt password hashing

Backend responsibilities:

- Expose REST API endpoints
- Authenticate users
- Authorize users using roles
- Validate business operations
- Handle wallet transactions
- Handle double-entry ledger entries
- Handle product management
- Handle POS sales
- Handle inventory movements
- Generate accounting reports

## 6. Database Layer

The database is PostgreSQL.

Important data areas:

- Users
- Businesses
- Branches
- Wallets
- Ledger accounts
- Ledger transactions
- Products
- POS sales
- POS sale items
- Inventory movements

## 7. Security Architecture

Security features include:

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Role-based access control
- Backend validation before database updates
- Frontend validation for better user experience

## 8. Business Logic Architecture

Important business rules:

- Users must log in before accessing protected data
- Only authorized roles can access certain APIs
- Product stock cannot become invalid
- POS sales cannot sell inactive products
- POS sales cannot sell more than available stock
- Wallet transactions update wallet balances
- Financial transactions create ledger records
- Accounting reports are generated from stored financial data

## 9. Development Infrastructure

Docker is used for local services.

Docker Compose runs:

- PostgreSQL database
- pgAdmin database management tool

VS Code is used for development.

Git and GitHub are used for version control.

## 10. Why This Architecture Is Good

This architecture is good because:

- Frontend and backend are separated
- Backend business logic is organized into modules
- Database access is handled through Prisma ORM
- Authentication and role checks are centralized
- The system can grow into a larger enterprise platform
- It is easy to explain in an internship interview

## 11. Interview Explanation

In an interview, I can explain the architecture like this:

"ApexBiz follows a layered full-stack architecture. The frontend is built with Next.js and React, while the backend is built with NestJS. The backend exposes REST APIs and handles authentication, role-based access control, wallet logic, ledger logic, POS sales, inventory management, and accounting reports. Prisma ORM connects the backend to a PostgreSQL database. Docker is used to run the local database and pgAdmin."
