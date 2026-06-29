# ApexBiz Cloud Deployment Readiness

## Purpose

This document explains how ApexBiz can be deployed as a production-ready cloud system.

## Deployment Components

ApexBiz production deployment contains:

- Next.js frontend
- NestJS backend API
- PostgreSQL database
- Python FastAPI ML service
- Redis cache
- RabbitMQ event bus
- Nginx reverse proxy
- HTTPS domain
- production environment variables
- monitoring endpoints
- database backup and restore scripts

## Recommended Low-Cost Deployment Options

### Option 1: Simple Cloud Deployment

- Frontend: Vercel
- Backend: Render, Railway, or VPS
- Database: Neon, Supabase, Railway PostgreSQL, or managed PostgreSQL
- ML Service: Render, Railway, or VPS
- Redis: Upstash, Railway, or VPS Redis
- RabbitMQ: CloudAMQP, Railway, or VPS RabbitMQ

### Option 2: VPS Deployment

Run the full Docker production stack on a VPS using:

docker-compose.prod.yml

This includes:

- frontend
- backend
- ML service
- PostgreSQL
- Redis
- RabbitMQ
- Nginx

## Required Production Environment Variables

Backend:

- NODE_ENV=production
- DATABASE_URL
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- ML_SERVICE_URL
- FRONTEND_URL
- REDIS_URL
- RABBITMQ_URL
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASSWORD
- EMAIL_FROM

Frontend:

- NEXT_PUBLIC_API_URL

Docker compose:

- POSTGRES_PASSWORD
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- RABBITMQ_DEFAULT_USER
- RABBITMQ_DEFAULT_PASS
- FRONTEND_URL
- NEXT_PUBLIC_API_URL

## Deployment Safety Rules

Before production deployment:

1. Never commit real .env files.
2. Use strong JWT and refresh token secrets.
3. Use managed PostgreSQL or protected PostgreSQL.
4. Enable HTTPS.
5. Run Prisma migrations carefully.
6. Verify database backup works.
7. Verify restore process works.
8. Run production readiness tests.
9. Run backend build.
10. Run frontend build.
11. Run ML service import check.
12. Run production health checks after deployment.

## Production Verification Command

Run:

powershell -ExecutionPolicy Bypass -File scripts/deploy/production-health-check.ps1

For a real domain:

powershell -ExecutionPolicy Bypass -File scripts/deploy/production-health-check.ps1 -FrontendUrl "https://app.example.com" -BackendUrl "https://api.example.com" -MlServiceUrl "https://ml.example.com"

## Architect Interview Explanation

I prepared ApexBiz for cloud deployment by adding Docker production setup, production environment validation, Redis, RabbitMQ, observability endpoints, backup scripts, deployment documentation, and a production health-check script. This shows that the system is moving from a portfolio project toward a deployable production architecture.
