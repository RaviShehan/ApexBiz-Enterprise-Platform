# ADR 0003: Use Prisma ORM

## Status

Accepted

## Context

The backend needs to communicate with PostgreSQL safely and maintainably.

Writing raw SQL everywhere can become harder to maintain as the system grows.

## Decision

Use Prisma ORM as the database access layer.

## Reasons

- Prisma provides type-safe database access.
- Prisma schema clearly defines database models.
- Prisma migrations help manage database changes.
- It works well with TypeScript and NestJS.
- It reduces repetitive database code.

## Consequences

Positive:

- Database access becomes easier to maintain.
- TypeScript can detect many database-related mistakes.
- Schema changes are easier to track.

Trade-off:

- Developers must understand Prisma schema and migration workflow.

## Interview Explanation

I used Prisma because it gives type-safe database access and clear schema management. It helps the backend communicate with PostgreSQL in a maintainable way.
