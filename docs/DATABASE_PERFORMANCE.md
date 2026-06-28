# ApexBiz Database Performance Plan

## Purpose

This document explains how PostgreSQL performance can be improved as data grows.

## Recommended Indexes

Indexes should be added for frequently searched and joined columns.

Recommended indexes:

- User.username
- User.email
- Product.businessId
- Product.name
- PosSale.businessId
- PosSale.branchId
- PosSale.createdAt
- InventoryMovement.productId
- InventoryMovement.createdAt
- AuditLog.createdAt
- AuditLog.userId
- RefreshToken.tokenHash

## Query Optimization

- avoid loading unnecessary fields
- paginate large lists
- filter by businessId or branchId
- use createdAt filters for reports
- avoid repeated queries inside loops

## Reporting Performance

Accounting and sales reports can become expensive.

Future improvements:

- cached report summaries
- read replicas
- materialized views
- background report generation

## Architect Interview Explanation

I would improve database performance using indexes, pagination, query filtering, cached summaries, and read replicas for reporting. Since ApexBiz stores relational business data, PostgreSQL performance planning is important.
