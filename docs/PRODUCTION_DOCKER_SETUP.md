# ApexBiz Production Docker Setup

## Purpose

This document explains the production-style Docker setup for ApexBiz.

The Docker setup includes:

- Next.js frontend
- NestJS backend
- Python FastAPI ML service
- PostgreSQL database
- Redis cache
- RabbitMQ message broker
- Nginx reverse proxy

## Files Added

- backend/apexbiz-api/Dockerfile
- backend/apexbiz-api/.dockerignore
- frontend/Dockerfile
- frontend/.dockerignore
- ml-service/Dockerfile
- ml-service/.dockerignore
- docker-compose.prod.yml
- infra/nginx/nginx.prod.conf
- .env.production.example

## Production-Like Services

### PostgreSQL

Stores business, sales, inventory, accounting, audit, and user data.

### Redis

Prepared for future caching, rate limit storage, dashboard summaries, and ML insights cache.

### RabbitMQ

Prepared for future event-driven processing such as POS sale events, audit events, inventory events, and ML refresh events.

### Backend

Runs the NestJS API in production mode.

### Frontend

Runs the Next.js production build.

### ML Service

Runs the Python FastAPI ML service.

### Nginx

Acts as a reverse proxy.

Routes:

- / goes to frontend
- /api goes to backend
- /api-docs goes to Swagger docs
- /ml goes to ML service

## How To Validate Docker Compose

Run:

docker compose --env-file .env.production.example -f docker-compose.prod.yml config

## How To Start Production-Like Stack

Copy:

.env.production.example

to:

.env.production

Then replace all passwords and secrets.

Run:

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

## Important Security Note

Never commit real .env.production files to GitHub.

Only commit .env.production.example.

## Architect Interview Explanation

I added a production-style Docker setup so ApexBiz can run as multiple services: frontend, backend, ML service, PostgreSQL, Redis, RabbitMQ, and Nginx. This shows that the system is prepared for production-style deployment, service separation, caching, event-driven architecture, and reverse proxy routing.
