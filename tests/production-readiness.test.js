const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("production environment validation is strict", () => {
  assert.equal(fileExists("backend/apexbiz-api/src/config/env.validation.ts"), true);

  const content = readFile("backend/apexbiz-api/src/config/env.validation.ts");

  assert.match(content, /validateEnvironment/);
  assert.match(content, /DATABASE_URL/);
  assert.match(content, /JWT_SECRET/);
  assert.match(content, /REFRESH_TOKEN_SECRET/);
  assert.match(content, /FRONTEND_URL/);
  assert.match(content, /EMAIL_HOST/);
  assert.match(content, /DATABASE_URL\.includes\('localhost'\)/);
  assert.match(content, /weak demo value/);
});

test("password reset stores only hashed reset tokens", () => {
  assert.equal(fileExists("backend/apexbiz-api/src/password-reset/password-reset.service.ts"), true);

  const service = readFile("backend/apexbiz-api/src/password-reset/password-reset.service.ts");

  assert.match(service, /randomBytes\(32\)/);
  assert.match(service, /sha256/);
  assert.match(service, /passwordResetTokenHash/);
  assert.match(service, /passwordResetTokenExpiresAt/);
  assert.match(service, /15 \* 60 \* 1000/);
  assert.match(service, /bcrypt\.hash/);
});

test("password reset avoids account enumeration", () => {
  const service = readFile("backend/apexbiz-api/src/password-reset/password-reset.service.ts");

  assert.match(service, /If the account exists, a password reset email has been sent/);
});

test("tenant security fails closed for non-admin users", () => {
  assert.equal(fileExists("backend/apexbiz-api/src/tenant-security/tenant-security.service.ts"), true);

  const service = readFile("backend/apexbiz-api/src/tenant-security/tenant-security.service.ts");

  assert.match(service, /denyUntilMembershipIsConfigured/);
  assert.match(service, /Access denied by default/);
  assert.match(service, /role === 'ADMIN'/);
  assert.match(service, /assertUserCanAccessBusiness/);
  assert.match(service, /assertUserCanAccessBranch/);
  assert.match(service, /assertUserCanAccessProduct/);
  assert.match(service, /assertUserCanAccessPosSale/);
});

test("production docker stack includes required services", () => {
  assert.equal(fileExists("docker-compose.prod.yml"), true);

  const compose = readFile("docker-compose.prod.yml");

  assert.match(compose, /postgres:/);
  assert.match(compose, /redis:/);
  assert.match(compose, /rabbitmq:/);
  assert.match(compose, /ml-service:/);
  assert.match(compose, /backend:/);
  assert.match(compose, /frontend:/);
  assert.match(compose, /nginx:/);
});

test("database backup and restore scripts exist", () => {
  assert.equal(fileExists("scripts/db/backup-postgres.ps1"), true);
  assert.equal(fileExists("scripts/db/restore-postgres.ps1"), true);

  const backupScript = readFile("scripts/db/backup-postgres.ps1");
  const restoreScript = readFile("scripts/db/restore-postgres.ps1");

  assert.match(backupScript, /pg_dump/);
  assert.match(restoreScript, /psql/);
});

test("event contracts exist for future RabbitMQ or Kafka integration", () => {
  assert.equal(fileExists("docs/events/pos.sale_created.json"), true);
  assert.equal(fileExists("docs/events/inventory.stock_changed.json"), true);
  assert.equal(fileExists("docs/events/audit.log_created.json"), true);
  assert.equal(fileExists("docs/events/ml.insights_requested.json"), true);
});

test("Swagger API docs are configured", () => {
  const main = readFile("backend/apexbiz-api/src/main.ts");

  assert.match(main, /SwaggerModule\.setup\('api-docs'/);
  assert.match(main, /DocumentBuilder/);
  assert.match(main, /addBearerAuth/);
});


test("observability implementation exists", () => {
  assert.equal(fileExists("backend/apexbiz-api/src/observability/metrics-registry.ts"), true);
  assert.equal(fileExists("backend/apexbiz-api/src/observability/production-observability.middleware.ts"), true);
  assert.equal(fileExists("backend/apexbiz-api/src/observability/observability.controller.ts"), true);
  assert.equal(fileExists("backend/apexbiz-api/src/observability/observability.module.ts"), true);
  assert.equal(fileExists("docs/OBSERVABILITY_IMPLEMENTATION.md"), true);

  const main = readFile("backend/apexbiz-api/src/main.ts");
  assert.match(main, /app\.use\(productionObservabilityMiddleware\)/);

  const appModule = readFile("backend/apexbiz-api/src/app.module.ts");
  assert.match(appModule, /ObservabilityModule/);

  const controller = readFile("backend/apexbiz-api/src/observability/observability.controller.ts");
  assert.match(controller, /health\/liveness/);
  assert.match(controller, /health\/readiness/);
  assert.match(controller, /metrics/);
  assert.match(controller, /checkDatabase/);
  assert.match(controller, /checkMlService/);

  const middleware = readFile("backend/apexbiz-api/src/observability/production-observability.middleware.ts");
  assert.match(middleware, /x-request-id/);
  assert.match(middleware, /durationMs/);
});
