# ApexBiz Cloud Deployment Plan

## Purpose

This document explains how ApexBiz can be deployed in a cloud production environment.

## Deployment Components

### Frontend

- deploy Next.js frontend to Vercel, Netlify, or Docker hosting
- configure NEXT_PUBLIC_API_URL

### Backend

- deploy NestJS backend to Render, Railway, AWS, Azure, or VPS
- configure environment variables
- run Prisma migrations

### Database

- use managed PostgreSQL
- enable backups
- restrict public access

### ML Service

- deploy FastAPI ML service as a separate container
- configure backend ML_SERVICE_URL

### Reverse Proxy

- use Nginx as reverse proxy
- enable HTTPS
- route frontend, backend, and ML service

## Environment Variables

Production secrets should not be committed to GitHub.

Use environment variables for:

- DATABASE_URL
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- ML_SERVICE_URL
- NEXT_PUBLIC_API_URL

## Architect Interview Explanation

For production, I would deploy frontend, backend, PostgreSQL, and ML service separately. The backend would use environment variables, managed PostgreSQL, HTTPS reverse proxy, and secure deployment practices. This makes the system more maintainable and scalable.
