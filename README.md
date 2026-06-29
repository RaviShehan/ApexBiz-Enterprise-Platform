<!-- APEXBIZ_README_POLISH_START -->
# ApexBiz Enterprise Platform

## Enterprise Full-Stack + Cybersecurity + ML + Software Architecture Portfolio Project

ApexBiz Enterprise Platform is a full-stack enterprise business management system designed to demonstrate software engineering, backend architecture, cybersecurity, data science integration, and software architect-level thinking.

The project is designed for businesses with multiple branches, users, products, POS sales, inventory movements, wallets, accounting records, audit logs, security controls, and ML-based business insights.

## Architecture Summary

ApexBiz is designed as a modular enterprise platform with separated responsibilities:

- Frontend dashboard: Next.js, React, TypeScript, Tailwind CSS
- Backend API: NestJS, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- ML service: Python FastAPI
- Security: JWT, RBAC, bcrypt, rate limiting, security headers, 2FA OTP, email verification, refresh token rotation
- Audit integrity: blockchain-style audit hash chain
- API documentation: Swagger/OpenAPI
- CI/CD: GitHub Actions
- Architecture docs: system design, diagrams, ADRs, scalability, observability, caching, backup, cloud deployment, event-driven architecture

## Main Features

- User authentication
- Role-based access control
- Business and branch management
- Product management
- POS sales
- Inventory stock in, stock out, and adjustment
- Accounting reports
- Wallet and transaction logic
- Audit logging
- Security dashboard
- ML Insights dashboard
- Swagger API documentation
- Automated architecture smoke tests

## Cybersecurity Features

- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Rate limiting
- Security headers
- Email verification flow
- Two-factor OTP flow
- Refresh token rotation
- Audit logging
- Blockchain-style audit hash chain
- OWASP security testing report
- Penetration testing report
- Production security checklist

## Data Science / ML Features

The project includes a separate Python FastAPI ML service connected to the NestJS backend.

ML features include:

- Sales forecasting
- Best-selling product analysis
- Slow-moving product analysis
- Low-stock risk prediction
- Sales anomaly detection

## Software Architect Highlights

This project includes software architect-level additions:

- System architecture diagrams
- System design document
- Swagger API documentation
- Architecture Decision Records
- CI/CD GitHub Actions
- Scalability plan
- Caching strategy
- Observability plan
- Backup and recovery plan
- Database performance plan
- Cloud deployment plan
- Multi-tenant design
- Architecture trade-off documentation
- Event-driven architecture documentation
- Event contract examples for future RabbitMQ or Kafka integration
- Automated architecture smoke tests
- Final software architect interview guide

## Interview Demo Order

Recommended demo order:

1. Show README project summary.
2. Show system architecture diagrams.
3. Show Architecture Decision Records.
4. Show CI/CD GitHub Actions.
5. Open Swagger API docs at http://localhost:3000/api-docs.
6. Open frontend dashboard at http://localhost:3001.
7. Login as admin.
8. Show products, POS sales, inventory, and accounting.
9. Show Security tab and audit logs.
10. Show audit hash chain verification.
11. Show ML Insights tab.
12. Click Load ML Insights.
13. Explain scalability, observability, caching, backup, cloud deployment, and event-driven architecture.

## Important Documentation

- docs/SOFTWARE_ARCHITECT_INTERVIEW_GUIDE.md
- docs/SYSTEM_ARCHITECTURE_DIAGRAMS.md
- docs/SYSTEM_DESIGN.md
- docs/SOFTWARE_ARCHITECT_PORTFOLIO.md
- docs/SWAGGER_API_DOCUMENTATION.md
- docs/SCALABILITY_PLAN.md
- docs/CACHING_STRATEGY.md
- docs/OBSERVABILITY.md
- docs/BACKUP_AND_RECOVERY.md
- docs/DATABASE_PERFORMANCE.md
- docs/CLOUD_DEPLOYMENT_PLAN.md
- docs/EVENT_DRIVEN_ARCHITECTURE.md
- docs/OWASP_SECURITY_TESTING_REPORT.md
- docs/PENETRATION_TESTING_REPORT.md

## Final Interview Explanation

Short explanation:

ApexBiz is a modular enterprise platform that demonstrates full-stack development, backend architecture, database design, cybersecurity, audit integrity, ML integration, API documentation, CI/CD, scalability planning, observability planning, and event-driven architecture thinking.

It is stronger than a normal CRUD project because it shows how a system can be designed, secured, documented, tested, and prepared for future production scaling.

<!-- APEXBIZ_README_POLISH_END -->

---

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

## Software Architect Highlights

ApexBiz is designed as a modular enterprise platform, not only a simple CRUD application.

Architecture-level features include:

- Modular NestJS backend architecture
- Next.js frontend dashboard
- PostgreSQL relational database design
- Prisma ORM database access layer
- Python FastAPI ML service
- Backend integration with ML service
- Cybersecurity features
- Blockchain-style audit hash chain
- Security audit dashboard
- ML Insights dashboard
- HTTPS deployment preparation
- OWASP security testing report
- Penetration testing report

## Data Science / ML Features

The project includes a separate Python FastAPI ML service for business intelligence.

ML features include:

- Sales forecasting
- Best-selling product analysis
- Slow-moving product analysis
- Low-stock risk prediction
- Sales anomaly detection

## Cybersecurity Features

Cybersecurity features include:

- Bcrypt password hashing
- JWT authentication
- Role-based access control
- Rate limiting
- Security headers
- Email verification
- Two-factor OTP
- Refresh token rotation
- Audit logging
- Blockchain-style audit hash chain
- Security audit dashboard

## Additional Architect Documentation

- docs/SOFTWARE_ARCHITECT_PORTFOLIO.md

## System Architecture Documentation

- docs/SYSTEM_ARCHITECTURE_DIAGRAMS.md
- docs/SYSTEM_DESIGN.md

## CI/CD Pipeline

This project includes a GitHub Actions CI pipeline.

The pipeline checks:

- Backend NestJS build
- Prisma client generation
- Frontend Next.js build
- Python ML service dependency installation
- Python ML service import check
- Secret environment file protection check

## Swagger API Documentation

The backend includes Swagger/OpenAPI documentation.

Run the backend and open:

http://localhost:3000/api-docs

Documentation file:

- docs/SWAGGER_API_DOCUMENTATION.md

## Architecture Decision Records

This project includes ADRs to explain key software architecture decisions.

- docs/adr/0001-use-nestjs-backend.md
- docs/adr/0002-use-postgresql.md
- docs/adr/0003-use-prisma-orm.md
- docs/adr/0004-use-separate-ml-service.md
- docs/adr/0005-use-jwt-authentication.md
- docs/adr/0006-use-audit-hash-chain.md

## Architecture Planning Documents

Additional software architect-level documentation:

- docs/SCALABILITY_PLAN.md
- docs/CACHING_STRATEGY.md
- docs/OBSERVABILITY.md
- docs/BACKUP_AND_RECOVERY.md
- docs/DATABASE_PERFORMANCE.md
- docs/CLOUD_DEPLOYMENT_PLAN.md
- docs/MULTI_TENANT_DESIGN.md
- docs/ARCHITECTURE_TRADEOFFS.md
- docs/NON_FUNCTIONAL_REQUIREMENTS.md

## Event-Driven Architecture

ApexBiz includes event-driven architecture documentation and event contract examples for future RabbitMQ or Kafka integration.

This shows how the system can evolve from a modular monolith into an asynchronous enterprise architecture.

Event-driven documents:

- docs/EVENT_DRIVEN_ARCHITECTURE.md
- docs/events/pos.sale_created.json
- docs/events/inventory.stock_changed.json
- docs/events/audit.log_created.json
- docs/events/ml.insights_requested.json

## Software Architect Interview Guide

Final interview preparation guide:

- docs/SOFTWARE_ARCHITECT_INTERVIEW_GUIDE.md


## Final Interview Q&A Bank

- docs/FINAL_INTERVIEW_QA_BANK.md


## Production Environment Validation

The backend includes production environment validation.

It checks required production variables such as:

- DATABASE_URL
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- ML_SERVICE_URL
- FRONTEND_URL

In production, the backend fails safely if required environment variables are missing, weak, invalid, or unsafe.

Documentation:

- docs/PRODUCTION_ENVIRONMENT.md


## Production Docker Setup

ApexBiz includes a production-style Docker setup with:

- Next.js frontend container
- NestJS backend container
- Python FastAPI ML service container
- PostgreSQL database
- Redis cache
- RabbitMQ message broker
- Nginx reverse proxy

Docker documentation:

- docs/PRODUCTION_DOCKER_SETUP.md

Production compose file:

- docker-compose.prod.yml


## Database Production Readiness

ApexBiz includes production database readiness improvements:

- Prisma production indexes
- PostgreSQL backup script
- PostgreSQL restore script
- database production guide
- migration readiness documentation

Database documentation:

- docs/DATABASE_PRODUCTION_READINESS.md
- scripts/db/README.md


## Authentication Hardening

ApexBiz includes production-style authentication hardening:

- SMTP email service support
- forgot password request API
- password reset confirmation API
- hashed password reset tokens
- password reset token expiry
- safe response to prevent account enumeration

Documentation:

- docs/AUTHENTICATION_HARDENING.md


## Strong Multi-Tenant Security

ApexBiz includes a tenant security foundation for production multi-tenant access control.

Current safe rule:

- ADMIN can access platform-level data.
- Non-admin users are denied by default until a full BusinessMembership model is implemented.

This is fail-closed security. It is safer than accidentally allowing cross-business data access.

Documentation:

- docs/MULTI_TENANT_SECURITY_IMPLEMENTATION.md


## Production Readiness Testing

ApexBiz includes production readiness tests.

Run:

npm run test:production-readiness

Run all tests:

npm run test:all

Testing documentation:

- docs/PRODUCTION_READINESS_TESTING.md


## Observability Implementation

ApexBiz includes production-style observability features:

- request ID generation
- x-request-id response header
- structured JSON request logs
- request duration tracking
- liveness health endpoint
- readiness health endpoint
- database readiness check
- ML service readiness check
- Prometheus-style metrics endpoint

Observability endpoints:

- GET /health
- GET /health/liveness
- GET /health/readiness
- GET /metrics

Documentation:

- docs/OBSERVABILITY_IMPLEMENTATION.md


## Redis Caching Implementation

ApexBiz includes Redis caching support for production performance.

Redis caching features:

- Redis cache service
- JSON get/set helpers
- TTL support
- cache health endpoint
- delete by key
- delete by pattern
- REDIS_URL production validation

Cache endpoint:

- GET /cache/health

Documentation:

- docs/REDIS_CACHING_IMPLEMENTATION.md


## RabbitMQ Event Bus Implementation

ApexBiz includes RabbitMQ event bus support for production event-driven architecture.

RabbitMQ features:

- RabbitMQ event bus service
- durable topic exchange
- JSON event publishing
- event helper methods
- event bus health endpoint
- demo event publishing endpoint
- RABBITMQ_URL production validation

Event bus endpoints:

- GET /event-bus/health
- POST /event-bus/demo-event

Documentation:

- docs/RABBITMQ_EVENT_BUS_IMPLEMENTATION.md


## Cloud Deployment Readiness

ApexBiz includes cloud deployment readiness documentation and production verification scripts.

Deployment files:

- docker-compose.prod.yml
- .env.production.example
- scripts/deploy/production-health-check.ps1
- docs/CLOUD_DEPLOYMENT_READINESS.md
- docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md

Production verification command:

powershell -ExecutionPolicy Bypass -File scripts/deploy/production-health-check.ps1
