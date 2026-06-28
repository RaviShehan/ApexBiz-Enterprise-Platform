# ApexBiz Swagger API Documentation

## Purpose

ApexBiz includes Swagger/OpenAPI documentation for the backend REST API.

This helps developers, testers, architects, and interviewers understand the API contract clearly.

## Swagger URL

When the backend is running, open:

http://localhost:3000/api-docs

## What Swagger Shows

Swagger documents:

- API endpoints
- HTTP methods
- authentication requirement
- JWT bearer token support
- backend feature areas
- API contract structure

## Main API Areas

The API documentation covers:

- Authentication
- Businesses
- Branches
- Wallets
- Products
- POS Sales
- Inventory
- Accounting
- Audit Logs
- Security Features
- Refresh Token Rotation
- ML Insights

## Why Swagger Is Important

Swagger is important in software architecture because it defines the API contract.

It helps:

- frontend developers understand backend APIs
- backend developers test endpoints
- QA engineers verify API behavior
- architects explain service boundaries
- interviewers see production-level API documentation

## How to Use

1. Start Docker database.
2. Start backend.
3. Open http://localhost:3000/api-docs.
4. Login using /auth/login.
5. Copy the JWT token.
6. Click Authorize.
7. Enter the JWT token.
8. Test protected endpoints.

## Architect Interview Explanation

I added Swagger/OpenAPI documentation so the backend API has a clear contract. This makes the system easier to test, easier to integrate with the frontend, and easier for future developers to understand.

API documentation is important in production systems because frontend teams, backend teams, QA teams, and external systems need a reliable API reference.
