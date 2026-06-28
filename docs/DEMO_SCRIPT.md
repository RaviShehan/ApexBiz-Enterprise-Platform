# ApexBiz Enterprise Platform - Interview Demo Script

## 1. Opening Explanation

This is ApexBiz Enterprise Platform.

It is a full-stack enterprise business management system built using Next.js, NestJS, PostgreSQL, Prisma, Docker, and TypeScript.

The system helps a business manage:

- Users
- Branches
- Products
- POS sales
- Inventory
- Wallet transactions
- Double-entry ledger records
- Accounting reports

## 2. Login Demo

First, I open the frontend:

http://localhost:3001

Then I log in using an admin account.

The system uses:

- Username and password authentication
- Password hashing
- JWT tokens
- Protected API routes

After login, the dashboard loads business data from the backend.

## 3. Dashboard Overview Demo

In the Overview section, I can show summary information about the system.

This proves that the frontend is connected to the backend API and database.

## 4. Products Demo

Next, I open the Products tab.

Here, I can:

- Create a new product
- Update product name
- Update price
- Update stock quantity
- Update reorder level
- Set product status as ACTIVE or INACTIVE

The product table also shows:

- Product name
- SKU
- Price
- Stock
- Reorder level
- Low stock status
- Product status badge

This shows product management and inventory preparation.

## 5. POS Sales Demo

Next, I open the POS Sales tab.

Here, I can create a POS sale by selecting:

- Product
- Quantity
- Payment method

The frontend validates:

- Quantity cannot be zero
- Quantity cannot be negative
- Quantity cannot be higher than available stock
- Inactive products cannot be sold

After creating a sale, the sale appears in the POS sales table.

This proves sales transaction handling.

## 6. Inventory Demo

Next, I open the Inventory tab.

Here, I can perform:

- Stock In
- Stock Out
- Stock Adjustment

The frontend validates:

- Stock quantity cannot be zero for stock in and stock out
- Stock out cannot be more than available stock
- Adjusted stock cannot be negative

The inventory movement table shows:

- Movement type
- Product
- Quantity
- Reference
- Reason

This proves inventory tracking and business validation.

## 7. Accounting Demo

Next, I open the Accounting tab.

Here, I can show accounting reports such as:

- Trial balance
- Income statement
- Balance sheet
- Wallet summary
- Ledger summary

This proves that the project is not only a normal CRUD project. It includes business and financial logic.

## 8. Backend API Demo

I can also show backend API endpoints.

Examples:

- /auth/login
- /auth/me
- /products
- /pos-sales
- /inventory/stock-in
- /inventory/stock-out
- /inventory/adjust
- /accounting/trial-balance
- /accounting/income-statement
- /accounting/balance-sheet

The backend is built with NestJS modules, controllers, services, guards, and Prisma ORM.

## 9. Database Demo

I can open pgAdmin:

http://localhost:5050

Then I can show PostgreSQL tables such as:

- users
- businesses
- branches
- products
- pos sales
- inventory movements
- wallets
- ledger accounts
- ledger transactions

This proves that data is stored in a real database.

## 10. GitHub Demo

I can open the GitHub repository and show commits.

This proves that I developed the project step by step using Git and GitHub.

## 11. Final Interview Explanation

I can explain the project like this:

ApexBiz is a full-stack enterprise platform built using Next.js, NestJS, PostgreSQL, Prisma, Docker, and TypeScript. It includes authentication, role-based access control, product management, POS sales, inventory tracking, wallet transactions, double-entry ledger logic, and accounting reports. I built both the frontend and backend, connected them using APIs, added validations, and stored data in PostgreSQL.

## 12. Strong Closing Statement

This project helped me learn real-world full-stack development, backend architecture, database design, business logic, frontend dashboards, validation, and GitHub version control. It is suitable to demonstrate my readiness for a software engineering internship.
