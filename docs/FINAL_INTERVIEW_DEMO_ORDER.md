# ApexBiz Final Interview Demo Order

## Purpose

This document gives the final demo order for presenting ApexBiz to an interviewer.

## Demo Preparation

Before the interview, make sure these services are running:

- Docker PostgreSQL database
- NestJS backend on http://localhost:3000
- Next.js frontend on http://localhost:3001
- Python ML service on http://localhost:8000

## Recommended Demo Order

### 1. GitHub Repository

Open the GitHub repository and show the README.

Explain:

- project purpose
- tech stack
- main features
- architecture documentation
- security features
- ML features
- CI/CD

### 2. Architecture Documentation

Open:

- docs/SYSTEM_ARCHITECTURE_DIAGRAMS.md
- docs/SYSTEM_DESIGN.md
- docs/adr/

Explain:

- frontend, backend, database, and ML service separation
- why NestJS was used
- why PostgreSQL was used
- why the ML service was separated
- why audit hash chain was added

### 3. CI/CD

Open GitHub Actions.

Show:

- backend build
- frontend build
- ML service check
- architecture smoke tests
- security file check

### 4. Swagger API Documentation

Open:

http://localhost:3000/api-docs

Explain:

- API contract
- authentication endpoints
- protected endpoints
- backend service boundaries

### 5. Frontend Dashboard

Open:

http://localhost:3001

Login and show:

- overview
- products
- POS sales
- inventory
- accounting

### 6. Security Demo

Open the Security tab.

Show:

- audit logs
- audit chain verification
- security dashboard

Explain:

- bcrypt password hashing
- JWT authentication
- RBAC
- refresh tokens
- OTP
- email verification
- rate limiting
- audit hash chain

### 7. ML Demo

Open ML Insights tab.

Click Load ML Insights.

Show:

- sales forecasting
- best-selling products
- slow-moving products
- low-stock risk prediction
- anomaly detection

### 8. Architect Explanation

Explain:

- modular monolith now
- future RabbitMQ/Kafka event-driven architecture
- Redis caching plan
- observability plan
- backup and recovery plan
- cloud deployment plan
- database performance plan

## Closing Statement

Final answer:

ApexBiz is not only a CRUD application. It is a modular enterprise platform with full-stack development, cybersecurity, audit integrity, ML integration, API documentation, CI/CD, system design documentation, architecture decision records, scalability planning, observability planning, and event-driven architecture preparation.
