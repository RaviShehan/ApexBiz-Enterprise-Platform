# ApexBiz Production Environment

## Purpose

This document explains the production environment validation used in ApexBiz.

Production systems must not start with missing database URLs, weak secrets, invalid ports, or unsafe configuration.

## Required Environment Variables

ApexBiz backend requires these environment variables:

- NODE_ENV
- PORT
- DATABASE_URL
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- REDIS_URL
- CORS_ORIGIN

## Validation File

The validation logic is implemented in:

backend/apexbiz-api/src/config/env.validation.ts

## Environment Example File

The backend environment example is stored in:

backend/apexbiz-api/.env.example

## What Is Validated

The backend validates:

- NODE_ENV must be development, test, or production
- PORT must be a valid TCP port
- DATABASE_URL must exist
- JWT_SECRET must exist
- REFRESH_TOKEN_SECRET must exist
- JWT_SECRET must be strong in production
- REFRESH_TOKEN_SECRET must be strong in production
- JWT_SECRET and REFRESH_TOKEN_SECRET must be different
- REDIS_URL can be provided for Redis integration
- CORS_ORIGIN can be provided for frontend access control

## Why This Matters

Environment validation improves production safety.

It prevents:

- starting the backend without a database connection
- deploying with missing JWT secrets
- deploying with missing refresh token secrets
- using weak production secrets
- running with invalid server ports
- silent production misconfiguration

## Interview Explanation

I added production environment validation so the backend has a clear startup configuration contract. The system validates important environment variables such as DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET, PORT, and NODE_ENV. In production, the access token and refresh token secrets must be strong and different. This helps the backend fail fast instead of running with unsafe configuration.
