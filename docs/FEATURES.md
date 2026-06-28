# ApexBiz Enterprise Platform - Features

## 1. Authentication Features

- Username and password login
- Password hashing using bcrypt
- JWT token generation
- Protected API routes
- Current logged-in user endpoint
- Role-based access control

## 2. User Roles

The system supports different user roles.

### ADMIN

- Can manage business-level data
- Can access important system operations
- Can view reports and manage platform data

### MANAGER

- Can manage branch-level business operations
- Can handle products, inventory, and business records

### CASHIER

- Can handle POS sales
- Can create sales transactions
- Can support daily shop operations

## 3. Business Management

- Create business records
- Store business details
- Connect businesses with branches
- Connect businesses with wallets, products, sales, and accounting data

## 4. Branch Management

- Create business branches
- Store branch information
- Connect sales and inventory movements to branches

## 5. Wallet Features

- Create wallets
- Deposit money
- Withdraw money
- Transfer money between wallets
- Track wallet balances
- Store wallet transaction records

## 6. Double-Entry Ledger Features

- Create ledger accounts
- Store debit entries
- Store credit entries
- Create ledger transactions
- Support accounting correctness
- Connect financial transactions with ledger records

## 7. Product Features

- Create products
- Store product name
- Store SKU
- Store barcode
- Store cost price
- Store selling price
- Store stock quantity
- Store reorder level
- Update product details
- Set product as ACTIVE or INACTIVE
- Show low-stock warnings

## 8. POS Sales Features

- Create POS sales
- Select product
- Enter quantity
- Select payment method
- Calculate sale amount
- Reduce product stock after sale
- Store sale records
- Show POS sale table

## 9. POS Sales Validations

The frontend prevents invalid sales.

- Quantity cannot be zero
- Quantity cannot be negative
- Quantity cannot be more than available stock
- Inactive products cannot be sold

## 10. Inventory Features

- Stock In
- Stock Out
- Adjust Stock
- Store inventory movement history
- Store movement reference
- Store movement reason
- Show inventory movement table

## 11. Inventory Validations

The frontend prevents invalid inventory actions.

- Stock In quantity cannot be zero
- Stock Out quantity cannot be zero
- Stock Out quantity cannot be more than available stock
- Adjusted stock cannot be negative

## 12. Accounting Features

The system includes accounting report endpoints.

- Trial balance
- Income statement
- Balance sheet
- Wallet summary
- Ledger summary

## 13. Frontend Dashboard Features

- Login page
- Overview dashboard
- Products tab
- POS Sales tab
- Inventory tab
- Accounting tab
- Professional tables
- Status badges
- Low-stock badges
- Empty state messages
- Refresh button

## 14. Backend Features

- NestJS module structure
- Controllers for API routes
- Services for business logic
- Guards for protected routes
- Prisma ORM for database operations
- PostgreSQL database integration
- Error handling
- Business validations

## 15. Database Features

The database stores:

- Users
- Businesses
- Branches
- Wallets
- Wallet transactions
- Ledger accounts
- Ledger transactions
- Products
- POS sales
- POS sale items
- Inventory movements

## 16. DevOps and Tools

- Docker for local services
- Docker Compose for PostgreSQL and pgAdmin
- Git for version control
- GitHub for repository hosting
- VS Code for development

## 17. Why These Features Are Strong for Internship Interviews

This project is strong because it includes:

- Frontend development
- Backend API development
- Database design
- Authentication
- Authorization
- Business logic
- Financial logic
- Inventory logic
- POS sales logic
- Accounting reports
- GitHub version control
- Docker development environment

This proves that the project is not only a simple CRUD application.
