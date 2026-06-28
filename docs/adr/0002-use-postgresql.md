# ADR 0002: Use PostgreSQL Database

## Status

Accepted

## Context

ApexBiz manages structured business data such as users, businesses, branches, products, inventory movements, POS sales, wallets, ledger records, audit logs, and refresh tokens.

The system needs data consistency and relational integrity.

## Decision

Use PostgreSQL as the main database.

## Reasons

- PostgreSQL supports relational data very well.
- It supports transactions and strong consistency.
- It is suitable for financial, accounting, inventory, and enterprise systems.
- It supports indexing for performance improvements.
- It is widely used in production systems.

## Consequences

Positive:

- Data can be modeled using relationships.
- Business rules can be supported with structured tables.
- Accounting, inventory, and sales data can be stored consistently.

Trade-off:

- PostgreSQL requires schema design and migrations, unlike some NoSQL databases.

## Interview Explanation

I used PostgreSQL because ApexBiz has relational business data. Users, products, sales, inventory movements, ledger records, and audit logs are connected. PostgreSQL gives strong consistency, transactions, and reliable data modeling.
