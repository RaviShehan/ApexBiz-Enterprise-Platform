# ApexBiz System Architecture Diagrams

This document contains architecture diagrams for the ApexBiz Enterprise Platform.

These diagrams are written using Mermaid so they can be viewed directly in GitHub.

---

## 1. High-Level System Architecture

```mermaid
flowchart LR
    User[User / Admin / Manager / Cashier] --> Frontend[Next.js Frontend Dashboard]

    Frontend --> Backend[NestJS Backend API]

    Backend --> DB[(PostgreSQL Database)]
    Backend --> Prisma[Prisma ORM]
    Prisma --> DB

    Backend --> ML[Python FastAPI ML Service]

    Backend --> Security[Security Layer]
    Security --> Auth[JWT Authentication]
    Security --> RBAC[Role-Based Access Control]
    Security --> RateLimit[Rate Limiting]
    Security --> Headers[Security Headers]

    Backend --> Audit[Audit Logging System]
    Audit --> HashChain[Blockchain-Style Audit Hash Chain]
    Audit --> DB

    ML --> Forecast[Sales Forecasting]
    ML --> ProductAI[Product Performance Analysis]
    ML --> Risk[Low-Stock Risk Prediction]
    ML --> Anomaly[Sales Anomaly Detection]
```

---

## 2. Frontend to Backend Request Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js Frontend
    participant API as NestJS Backend API
    participant Auth as JWT Guard / RBAC Guard
    participant Service as Backend Service
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL

    User->>UI: Click dashboard action
    UI->>API: Send REST API request with JWT token
    API->>Auth: Validate token and role
    Auth-->>API: Allow request
    API->>Service: Execute business logic
    Service->>Prisma: Query or update data
    Prisma->>DB: Execute SQL operation
    DB-->>Prisma: Return result
    Prisma-->>Service: Return data
    Service-->>API: Return response
    API-->>UI: Send JSON response
    UI-->>User: Display result
```

---

## 3. Authentication and Authorization Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Frontend
    participant AuthAPI as Auth Controller
    participant AuthService as Auth Service
    participant DB as PostgreSQL
    participant Guard as JWT + RBAC Guards

    User->>Frontend: Enter username and password
    Frontend->>AuthAPI: POST /auth/login
    AuthAPI->>AuthService: Validate credentials
    AuthService->>DB: Find user by username
    DB-->>AuthService: Return user record
    AuthService->>AuthService: Compare password using bcrypt
    AuthService-->>AuthAPI: Create JWT token
    AuthAPI-->>Frontend: Return access token
    Frontend->>Guard: Send token in future requests
    Guard->>Guard: Validate JWT and role
```

---

## 4. ML Service Integration Architecture

```mermaid
sequenceDiagram
    actor User
    participant UI as ML Insights Dashboard
    participant Backend as NestJS ML Insights Module
    participant DB as PostgreSQL
    participant ML as Python FastAPI ML Service

    User->>UI: Click Load ML Insights
    UI->>Backend: GET /ml-insights/business-insights
    Backend->>DB: Load products and sales data
    DB-->>Backend: Return business data
    Backend->>ML: Send products and sales data
    ML->>ML: Run forecasting and analysis
    ML-->>Backend: Return ML insights
    Backend-->>UI: Return insights as JSON
    UI-->>User: Display forecast, product analysis, stock risk, anomalies
```

---

## 5. Audit Hash Chain Architecture

```mermaid
flowchart TD
    A[User Action] --> B[Backend API]
    B --> C[Audit Middleware]
    C --> D[Create Audit Log Entry]

    D --> E[Get Previous Audit Log Hash]
    E --> F[Generate Current Hash]
    F --> G[Save previousHash and currentHash]

    G --> H[(PostgreSQL AuditLog Table)]

    H --> I[Verify Chain Endpoint]
    I --> J{Is every hash valid?}

    J -->|Yes| K[Audit Chain Valid]
    J -->|No| L[Tampering Detected]
```

---

## 6. Enterprise Business Flow

```mermaid
flowchart TD
    Product[Product Created] --> StockIn[Stock In]
    StockIn --> POS[POS Sale]
    POS --> StockReduce[Inventory Reduces]
    POS --> Ledger[Ledger Transaction Created]
    POS --> Wallet[Wallet / Financial Record Updated]
    POS --> Audit[Audit Log Created]
    Audit --> Hash[Audit Hash Chain Updated]
    POS --> ML[Sales Data Available for ML Insights]
```

---

## 7. Future Production Deployment Architecture

```mermaid
flowchart LR
    Browser[Browser] --> CDN[Vercel / CDN Frontend Hosting]
    CDN --> LB[Load Balancer / Reverse Proxy]

    LB --> API1[NestJS Backend Instance 1]
    LB --> API2[NestJS Backend Instance 2]

    API1 --> DB[(Managed PostgreSQL)]
    API2 --> DB

    API1 --> Redis[(Redis Cache)]
    API2 --> Redis

    API1 --> ML[FastAPI ML Service]
    API2 --> ML

    API1 --> Queue[RabbitMQ / Kafka]
    API2 --> Queue

    Queue --> Worker[Background Worker]

    API1 --> Logs[Centralized Logs]
    API2 --> Logs
    ML --> Logs
```

---

## 8. Architect Interview Explanation

ApexBiz is designed as a modular enterprise system.

The frontend, backend, database, security layer, audit system, and ML service are separated by responsibility.

This architecture supports:

- maintainability
- scalability
- security
- auditability
- future cloud deployment
- future caching
- future event-driven processing
- future microservice migration
