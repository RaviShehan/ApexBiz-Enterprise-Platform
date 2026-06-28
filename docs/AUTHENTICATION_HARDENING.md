# ApexBiz Authentication Hardening

## Purpose

This document explains the production authentication hardening added to ApexBiz.

## Features Added

ApexBiz now includes:

- SMTP email service support
- password reset request endpoint
- password reset confirmation endpoint
- password reset token hashing
- password reset token expiry
- development-safe reset token response
- production-safe email-based reset flow

## Password Reset Flow

### 1. Request Password Reset

Endpoint:

POST /password-reset/request

Input:

- username or email

The backend checks whether the user exists.

For security, the response is always safe:

If the account exists, a password reset email has been sent.

This avoids revealing whether an account exists.

### 2. Token Generation

The backend generates a random reset token.

Only the hashed token is stored in the database.

The plain token is sent only through email.

### 3. Token Expiry

The reset token expires in 15 minutes.

Expired tokens cannot be used.

### 4. Confirm Password Reset

Endpoint:

POST /password-reset/confirm

Input:

- token
- newPassword

The backend hashes the new password using bcrypt and clears the reset token fields.

## Email Service

ApexBiz includes an EmailService using nodemailer.

In production, SMTP environment variables must be configured.

Required production email variables:

- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASSWORD
- EMAIL_FROM

In local development, if SMTP is not configured, the email content is logged for testing.

## Security Benefits

This design improves security because:

- reset tokens are random
- reset tokens are hashed before storage
- reset tokens expire
- account existence is not exposed
- new passwords are hashed using bcrypt
- production email configuration is required

## Current Limitation

Frontend password reset pages can be added next.

Current implementation provides the secure backend password reset API and production email service support.

## Architect Interview Explanation

I added real authentication hardening by creating an SMTP email service and password reset flow. The backend stores only hashed reset tokens, uses token expiry, avoids account enumeration, and hashes new passwords with bcrypt. This is closer to production authentication than a demo-only login system.
