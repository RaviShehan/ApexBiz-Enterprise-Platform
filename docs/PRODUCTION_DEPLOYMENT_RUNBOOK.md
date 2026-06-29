# ApexBiz Production Deployment Runbook

## Purpose

This runbook gives a step-by-step process for deploying ApexBiz safely.

## 1. Pre-Deployment Checklist

Before deploying:

- GitHub working tree is clean.
- CI/CD pipeline is passing.
- Backend build passes.
- Frontend build passes.
- Production readiness tests pass.
- Prisma schema is valid.
- Production environment variables are configured.
- Database backup is available.
- Real .env files are not committed.

## 2. Local Verification

Run:

npm run test:all

Then:

cd backend/apexbiz-api
npm run build

Then:

cd ../../frontend
npm run build

## 3. Database Migration

Before applying migrations:

1. Backup production database.
2. Review migration SQL.
3. Apply migration during low-traffic time.
4. Verify application health.

Recommended Prisma command:

npx prisma migrate deploy

## 4. Docker Production Deployment

Copy:

.env.production.example

to:

.env.production

Update all secrets.

Run:

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

## 5. Post-Deployment Verification

Run:

powershell -ExecutionPolicy Bypass -File scripts/deploy/production-health-check.ps1

Verify:

- frontend loads
- backend health works
- readiness endpoint works
- metrics endpoint works
- Swagger opens
- ML service is reachable
- Redis health endpoint works
- RabbitMQ health endpoint works

## 6. Rollback Plan

If deployment fails:

1. Stop new containers.
2. Restore previous application version.
3. Restore database backup if migration caused data issue.
4. Verify health endpoints.
5. Verify audit chain integrity.
6. Check logs.

## 7. Monitoring After Deployment

Watch:

- API errors
- request latency
- database connection failures
- ML service failures
- Redis failures
- RabbitMQ failures
- repeated login failures
- audit chain verification failures

## Architect Interview Explanation

A production deployment needs a runbook because deployment must be repeatable and recoverable. I added a deployment runbook that covers pre-deployment checks, migration safety, Docker deployment, post-deployment health checks, rollback, and monitoring.
