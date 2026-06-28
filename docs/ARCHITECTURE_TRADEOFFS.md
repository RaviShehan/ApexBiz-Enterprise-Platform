# ApexBiz Architecture Trade-Offs

## Purpose

This document explains important trade-offs in the ApexBiz architecture.

## 1. Modular Monolith vs Microservices

Decision: Use modular monolith backend now.

Reason:

- easier to develop
- easier to test locally
- easier for internship portfolio demonstration
- still organized by modules

Trade-off:

- not independently deployable like microservices

Future:

- split high-load modules into services later

## 2. PostgreSQL vs NoSQL

Decision: Use PostgreSQL.

Reason:

- business data is relational
- accounting and inventory need consistency

Trade-off:

- schema design and migrations are required

## 3. Separate ML Service vs ML Inside Backend

Decision: Use separate Python FastAPI ML service.

Reason:

- Python is better for analytics and ML
- ML service can scale separately

Trade-off:

- one extra service must be started

## 4. JWT Auth vs Server Sessions

Decision: Use JWT authentication.

Reason:

- works well with separate frontend and backend
- stateless backend scaling is easier

Trade-off:

- token expiry and refresh token security must be handled carefully

## Architect Interview Explanation

I made architecture trade-offs based on project stage and maintainability. ApexBiz uses a modular monolith for simplicity, PostgreSQL for consistency, a separate Python ML service for analytics, and JWT for stateless API authentication.
