# ApexBiz Caching Strategy

## Purpose

This document explains where caching can be added to improve performance and reduce database load.

## Recommended Cache Technology

Redis is recommended for production caching.

## What Can Be Cached

### 1. Dashboard Summary

- total products
- total sales
- low-stock count
- accounting summary

### 2. Product Lists

- cache frequently viewed product lists
- invalidate cache when products are created, updated, or deleted

### 3. Accounting Reports

- cache trial balance
- cache income statement
- cache balance sheet

### 4. ML Insights

- cache ML forecast results
- cache anomaly detection result
- refresh after new POS sales or inventory changes

## Cache Invalidation

Cache should be invalidated when:

- product is updated
- stock is changed
- POS sale is created
- accounting records change
- business data changes

## Architect Interview Explanation

I would add Redis caching for dashboard summaries, accounting reports, product lists, and ML insights. This improves performance by reducing repeated database and ML service calls. Cache invalidation would happen after product, inventory, sales, or accounting updates.
