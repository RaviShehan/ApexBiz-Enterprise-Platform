# ADR 0001: Use NestJS for Backend API

## Status

Accepted

## Context

ApexBiz needs a backend that can support authentication, role-based access control, product management, POS sales, inventory, accounting, audit logging, refresh tokens, and ML service integration.

The backend must be modular, maintainable, and suitable for enterprise-style development.

## Decision

Use NestJS with TypeScript for the backend API.

## Reasons

- NestJS provides a structured architecture using modules, controllers, services, guards, and middleware.
- TypeScript improves code safety and maintainability.
- NestJS is suitable for large backend systems.
- It supports dependency injection, authentication guards, and clean separation of concerns.
- It makes the project easier to explain in a software architect interview.

## Consequences

Positive:

- Backend code is organized into feature modules.
- Security and business logic can be separated clearly.
- The system can grow without becoming messy.

Trade-off:

- NestJS has more structure than a simple Express app, so beginners need more time to understand it.

## Interview Explanation

I selected NestJS because ApexBiz is an enterprise-style platform. NestJS gives a modular architecture with controllers, services, modules, guards, and middleware. This makes the backend easier to maintain, test, and extend.
