# ApexBiz Multi-Tenant Design

## Purpose

ApexBiz is designed for businesses with multiple branches and roles.

## Current Multi-Tenant Concept

- businesses own branches
- businesses own products
- sales belong to businesses and branches
- inventory movements belong to products
- users have roles
- reports can be filtered by business

## Tenant Isolation

In production, every query should be scoped by businessId where needed.

This prevents one business from accessing another business's records.

## Future Improvements

- stronger business-level authorization
- tenant-aware guards
- tenant-specific audit logs
- tenant-specific report filtering
- tenant-specific dashboard summaries

## Architect Interview Explanation

ApexBiz supports a multi-tenant business structure where business data is separated by business and branch. In production, every sensitive query should be scoped by businessId and protected by tenant-aware authorization.
