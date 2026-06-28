# ADR 0006: Use Blockchain-Style Audit Hash Chain

## Status

Accepted

## Context

ApexBiz handles important business actions such as login, product changes, inventory changes, POS sales, financial records, and security-related activity.

The system needs audit logs. It is also useful to detect if old audit records are changed.

## Decision

Use a blockchain-style audit hash chain for audit logs.

## Reasons

- Each audit log stores previousHash and currentHash.
- The current hash is generated from the audit log data and previous hash.
- If an old record changes, the hash chain verification can fail.
- This improves audit integrity.
- It demonstrates security architecture thinking.

## Consequences

Positive:

- Audit logs become tamper-evident.
- Interviewers can see security and architecture thinking.
- The system can verify audit log integrity.

Trade-off:

- This is not a full public blockchain. It is a blockchain-style internal hash chain for tamper detection.

## Interview Explanation

I added a blockchain-style audit hash chain to make audit logs tamper-evident. Each log stores the previous hash and current hash. If someone changes an old audit log, the chain verification can detect inconsistency.
