# ApexBiz System Design Document

## 1. System Overview

ApexBiz Enterprise Platform is a full-stack enterprise business management system.

It is designed for businesses that need:

- product management
- inventory management
- POS sales
- accounting reports
- wallets and transactions
- role-based access control
- audit logging
- cybersecurity controls
- ML-based business insights

The system is designed using a modular architecture so that each major feature is isolated into its own backend module.

---

## 2. Main Components

### Frontend

Technology:

- Next.js
- React
- TypeScript
- Tailwind CSS

Responsibilities:

- display dashboard UI
- handle login
- call backend APIs
- show products, sales, inventory, accounting, security, and ML insights
- provide validation before sending forms

### Backend

Technology:

- NestJS
- TypeScript

Responsibilities:

- expose REST APIs
- handle authentication
- enforce authorization
- execute business logic
- validate requests
- connect to PostgreSQL using Prisma
- connect to Python ML service
- create audit logs

### Database

Technology:

- PostgreSQL
- Prisma ORM

Responsibilities:

- store users
- store business data
- store products and inventory
- store POS sales
- store accounting and ledger records
- store audit logs
- store refresh tokens

### ML Service

Technology:

- Python
- FastAPI

Responsibilities:

- sales forecasting
- product performance analysis
- slow-moving product detection
- low-stock risk prediction
- sales anomaly detection

### Security Layer

Responsibilities:

- password hashing
- JWT authentication
- role-based authorization
- rate limiting
- security headers
- email verification
- two-factor OTP
- refresh token rotation
- audit logging
- audit hash chain verification

---

## 3. Architecture Style

The current architecture is a modular monolith backend with a separate ML service.

This is suitable for the current stage because:

- it is easier to develop and understand
- related business logic stays together
- deployment is simpler than many microservices
- the ML service is separated because Python is better for analytics and ML work

In the future, high-load parts can be separated into services.

Possible future services:

- Auth Service
- Inventory Service
- POS Service
- Accounting Service
- Audit Service
- ML Insights Service

---

## 4. Main Data Flow

### Login Flow

1. User enters username and password.
2. Frontend sends login request to backend.
3. Backend checks user in PostgreSQL.
4. Backend verifies password using bcrypt.
5. Backend returns JWT token.
6. Frontend uses JWT token for protected requests.

### POS Sale Flow

1. User creates a POS sale from frontend.
2. Backend validates the sale.
3. Backend checks product availability.
4. Backend reduces stock.
5. Backend records POS sale and sale items.
6. Backend creates ledger/accounting records.
7. Backend creates audit log.
8. Audit hash chain is updated.
9. Frontend displays updated data.

### ML Insights Flow

1. User opens ML Insights dashboard.
2. Frontend calls backend ML endpoint.
3. Backend loads product and sales data from PostgreSQL.
4. Backend sends data to Python ML service.
5. ML service analyzes data.
6. Backend returns insights to frontend.
7. Frontend displays forecast and risk results.

---

## 5. Important Design Decisions

### Why Next.js?

Next.js gives a modern React-based frontend with routing, components, and production-ready build support.

### Why NestJS?

NestJS provides a structured backend architecture with modules, controllers, services, guards, middleware, and dependency injection.

### Why PostgreSQL?

PostgreSQL is suitable for enterprise systems because it supports relational data, transactions, indexes, and strong consistency.

### Why Prisma?

Prisma gives type-safe database access and makes schema management easier.

### Why separate Python ML service?

Python is stronger for data science and ML work. Separating ML from the backend keeps responsibilities clean.

### Why blockchain-style audit hash chain?

The hash chain helps detect tampering in audit logs. If an old audit entry changes, the chain verification can fail.

---

## 6. Non-Functional Requirements

### Security

The system protects user access using authentication, authorization, password hashing, rate limiting, token rotation, and audit logs.

### Scalability

The frontend, backend, database, and ML service can be scaled separately in future deployment.

### Maintainability

The backend is modular, and each feature is separated into its own module.

### Observability

Health checks, audit logs, security logs, and future monitoring can help detect system problems.

### Reliability

Database transactions and validation help prevent invalid business operations.

### Extensibility

New modules such as reporting, notifications, caching, and message queues can be added later.

---

## 7. Current Limitations

This is an internship/portfolio-level architecture, not a full production enterprise system yet.

Current limitations:

- email verification uses demo token flow
- OTP uses demo OTP flow
- cloud deployment is documented but not fully deployed
- ML logic is lightweight and rule/statistics-based
- automated tests can be expanded
- Redis caching is not yet added
- RabbitMQ/Kafka event queue is not yet added

---

## 8. Future Improvements

Recommended future improvements:

- CI/CD pipeline
- Swagger API documentation
- automated unit and integration tests
- Redis caching
- RabbitMQ or Kafka event queue
- production email service
- production SMS/OTP provider
- managed PostgreSQL deployment
- centralized logging
- Prometheus/Grafana monitoring
- stronger tenant isolation
- database indexing and query optimization
- backup and recovery automation
