# ApexBiz Non-Functional Requirements

## Purpose

Non-functional requirements explain the quality goals of the system.

## Security

- password hashing
- JWT authentication
- RBAC
- rate limiting
- security headers
- audit logging
- refresh token rotation
- OTP and email verification demo flows

## Performance

- indexed database queries
- pagination for large lists
- caching for reports and dashboard summaries

## Scalability

- separate frontend, backend, database, and ML service
- backend can run multiple instances
- ML service can scale independently

## Availability

- health checks
- deployment rollback
- database backup and recovery

## Maintainability

- modular NestJS backend
- separate frontend components
- Prisma schema management
- documentation
- ADRs

## Observability

- health endpoints
- audit logs
- future metrics and monitoring

## Architect Interview Explanation

ApexBiz is designed with non-functional requirements such as security, performance, scalability, availability, maintainability, and observability. These are important because enterprise systems must be reliable, secure, and easy to evolve.
