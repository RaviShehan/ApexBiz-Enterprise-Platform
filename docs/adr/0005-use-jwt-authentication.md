# ADR 0005: Use JWT Authentication with RBAC

## Status

Accepted

## Context

ApexBiz has different user roles such as admin, manager, and cashier.

The system needs protected APIs and role-based access control.

## Decision

Use JWT authentication with role-based access control.

## Reasons

- JWT works well for frontend-backend API systems.
- Tokens can be sent in the Authorization header.
- Backend guards can verify the token before allowing access.
- RBAC can restrict actions based on user role.
- This approach is common in modern web applications.

## Consequences

Positive:

- Protected APIs are easier to secure.
- User roles can control access to sensitive actions.
- Frontend and backend remain separated.

Trade-off:

- Token expiry, refresh tokens, and secure storage must be handled carefully.

## Interview Explanation

I used JWT authentication because the frontend and backend are separate. The frontend sends the JWT token with protected API requests, and the backend validates the token and checks the user role using guards.
