const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function findExisting(paths) {
  return paths.find((p) => fileExists(p));
}

test("core project folders exist", () => {
  assert.equal(fileExists("backend/apexbiz-api"), true);
  assert.equal(fileExists("frontend"), true);
  assert.equal(fileExists("ml-service"), true);
  assert.equal(fileExists("docs"), true);
  assert.equal(fileExists(".github/workflows/ci.yml"), true);
});

test("backend has Swagger API documentation setup", () => {
  assert.equal(fileExists("backend/apexbiz-api/src/main.ts"), true);

  const mainTs = readFile("backend/apexbiz-api/src/main.ts");

  assert.match(mainTs, /@nestjs\/swagger/);
  assert.match(mainTs, /DocumentBuilder/);
  assert.match(mainTs, /SwaggerModule\.setup\('api-docs'/);
});

test("backend package includes Swagger dependency", () => {
  const packageJson = JSON.parse(readFile("backend/apexbiz-api/package.json"));

  assert.ok(packageJson.dependencies["@nestjs/swagger"]);
  assert.ok(packageJson.dependencies["swagger-ui-express"]);
});

test("ML service exists and exposes business insights logic", () => {
  assert.equal(fileExists("ml-service/app.py"), true);

  const appPy = readFile("ml-service/app.py");

  assert.match(appPy, /FastAPI/);
  assert.match(appPy, /business-insights/);
});

test("frontend includes ML Insights dashboard component", () => {
  const mlDashboardPath = findExisting([
    "frontend/components/MlInsightsDashboard.tsx",
    "frontend/src/components/MlInsightsDashboard.tsx"
  ]);

  assert.ok(mlDashboardPath, "MlInsightsDashboard component was not found");

  const component = readFile(mlDashboardPath);

  assert.match(component, /ML Insights|Load ML Insights|Data Science/);
});

test("software architect documentation exists", () => {
  assert.equal(fileExists("docs/SYSTEM_ARCHITECTURE_DIAGRAMS.md"), true);
  assert.equal(fileExists("docs/SYSTEM_DESIGN.md"), true);
  assert.equal(fileExists("docs/SOFTWARE_ARCHITECT_PORTFOLIO.md"), true);
  assert.equal(fileExists("docs/SCALABILITY_PLAN.md"), true);
  assert.equal(fileExists("docs/OBSERVABILITY.md"), true);
  assert.equal(fileExists("docs/CACHING_STRATEGY.md"), true);
  assert.equal(fileExists("docs/BACKUP_AND_RECOVERY.md"), true);
  assert.equal(fileExists("docs/DATABASE_PERFORMANCE.md"), true);
  assert.equal(fileExists("docs/CLOUD_DEPLOYMENT_PLAN.md"), true);
});

test("architecture decision records exist", () => {
  assert.equal(fileExists("docs/adr/0001-use-nestjs-backend.md"), true);
  assert.equal(fileExists("docs/adr/0002-use-postgresql.md"), true);
  assert.equal(fileExists("docs/adr/0003-use-prisma-orm.md"), true);
  assert.equal(fileExists("docs/adr/0004-use-separate-ml-service.md"), true);
  assert.equal(fileExists("docs/adr/0005-use-jwt-authentication.md"), true);
  assert.equal(fileExists("docs/adr/0006-use-audit-hash-chain.md"), true);
});

test("security documentation exists", () => {
  assert.equal(fileExists("docs/OWASP_SECURITY_TESTING_REPORT.md"), true);
  assert.equal(fileExists("docs/PENETRATION_TESTING_REPORT.md"), true);
  assert.equal(fileExists("docs/PRODUCTION_SECURITY_CHECKLIST.md"), true);
});

test("event-driven architecture docs exist", () => {
  assert.equal(fileExists("docs/EVENT_DRIVEN_ARCHITECTURE.md"), true);
  assert.equal(fileExists("docs/events/pos.sale_created.json"), true);
  assert.equal(fileExists("docs/events/inventory.stock_changed.json"), true);
  assert.equal(fileExists("docs/events/audit.log_created.json"), true);
  assert.equal(fileExists("docs/events/ml.insights_requested.json"), true);
});
