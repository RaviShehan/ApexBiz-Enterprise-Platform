# ApexBiz Event-Driven Architecture

## Purpose

This document explains how ApexBiz can evolve from a modular enterprise platform into an event-driven architecture using RabbitMQ or Kafka.

## Why Event-Driven Architecture Is Useful

In the current system, many actions happen directly in the backend request flow.

For example, when a POS sale is created, the system may need to:

- save the sale
- reduce inventory
- create accounting records
- create audit logs
- update dashboard summaries
- update ML insight data
- send notifications in the future

In a larger production system, some of these tasks can be handled asynchronously using events.

## Recommended Message Broker

RabbitMQ is recommended for the next production version because:

- it is easier to start with than Kafka
- it works well for business events
- it supports queues and routing
- it is suitable for background jobs
- it can be used for audit, notifications, reports, and ML update events

Kafka can be considered later if ApexBiz needs high-volume event streaming.

## Main Business Events

Recommended ApexBiz events:

- product.created
- product.updated
- inventory.stock_in
- inventory.stock_out
- pos.sale_created
- ledger.transaction_created
- audit.log_created
- user.login_success
- user.login_failed
- ml.insights_requested

## POS Sale Event Flow

1. Cashier creates a POS sale.
2. Backend saves the sale in PostgreSQL.
3. Backend publishes pos.sale_created event.
4. Inventory worker consumes the event and updates stock if separated in future.
5. Accounting worker consumes the event and creates ledger entries if separated in future.
6. Audit worker consumes the event and stores audit records if separated in future.
7. ML worker consumes the event and updates future analytics datasets.

## Mermaid Diagram

`mermaid
flowchart TD
    A[POS Sale Created] --> B[NestJS Backend]
    B --> C[(PostgreSQL Transaction)]
    B --> D[RabbitMQ Event Broker]
    D --> E[Inventory Worker]
    D --> F[Accounting Worker]
    D --> G[Audit Worker]
    D --> H[ML Insights Worker]
    E --> I[(Inventory Tables)]
    F --> J[(Ledger Tables)]
    G --> K[(Audit Logs)]
    H --> L[(Analytics Dataset / Cache)]
`",
",


For production reliability, ApexBiz can use the Outbox Pattern.

### Outbox Pattern

Instead of publishing an event directly only in memory, the backend first saves the business transaction and event record into the database.

Then a background worker reads unsent events from the outbox table and publishes them to RabbitMQ.

This prevents losing events if the backend crashes after saving data but before publishing the event.

## Recommended Future Outbox Table

Fields:

- id
- eventType
- aggregateType
- aggregateId
- payload
- status
- createdAt
- publishedAt
- retryCount

## Architect Interview Explanation

I designed ApexBiz so it can evolve into an event-driven architecture. In the future, important business actions such as POS sale creation, inventory movement, ledger transaction creation, audit logging, and ML updates can publish domain events. RabbitMQ can process background tasks asynchronously, and the outbox pattern can improve reliability by ensuring events are not lost.
