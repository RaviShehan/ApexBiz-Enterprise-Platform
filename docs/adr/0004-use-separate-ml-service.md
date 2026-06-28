# ADR 0004: Use Separate Python FastAPI ML Service

## Status

Accepted

## Context

ApexBiz needs data science features such as sales forecasting, best-selling product analysis, slow-moving product detection, low-stock risk prediction, and anomaly detection.

The main backend is written in NestJS, but Python is stronger for data science and ML work.

## Decision

Create a separate Python FastAPI ML service and connect it to the NestJS backend.

## Reasons

- Python is better suited for data science and ML logic.
- FastAPI is lightweight and suitable for ML APIs.
- The ML service can be scaled separately in the future.
- The backend remains focused on business logic and security.
- This separation improves architecture clarity.

## Consequences

Positive:

- ML logic is separated from business logic.
- The system demonstrates service-oriented thinking.
- Future ML improvements can be added without rewriting the backend.

Trade-off:

- Running the full project requires one extra service.

## Interview Explanation

I separated the ML service because Python is better for analytics and ML work. The NestJS backend handles business logic and security, while the FastAPI service handles forecasting and analysis. This separation makes the system easier to scale and maintain.
