# ApexBiz Enterprise Platform - Penetration Testing Report

## 1. Report Purpose

This penetration testing report documents a safe, non-destructive security review of the ApexBiz Enterprise Platform.

The purpose is to show that the project was reviewed from a cybersecurity perspective before presenting it as an internship or portfolio project.

## 2. Testing Scope

The test scope includes:

- Next.js frontend
- NestJS backend API
- PostgreSQL database access through Prisma
- Authentication system
- Role-based access control
- Product management
- POS sales
- Inventory management
- Wallet transactions
- Accounting reports
- Audit log system
- Email verification
- Two-factor OTP
- Refresh token rotation
- HTTPS deployment preparation

## 3. Testing Type

This was a safe application security review.

The testing included:

- Authentication testing
- Authorization testing
- Input validation testing
- Token security review
- Rate limiting review
- Security header review
- Audit logging review
- Database access review
- Deployment security review

No destructive testing was performed.

## 4. Authentication Testing

### Test Objective

Check whether unauthenticated users can access protected parts of the system.

### Checks Performed

- Tried accessing protected APIs without JWT token
- Tried accessing APIs after login
- Reviewed password storage approach
- Reviewed JWT authentication flow

### Result

The system uses username and password login, bcrypt password hashing, and JWT-based authentication.

Protected routes require valid authentication.

### Status

Passed

## 5. Password Security Testing

### Test Objective

Check whether passwords are stored securely.

### Checks Performed

- Reviewed backend authentication logic
- Verified bcrypt password hashing is used
- Confirmed plain-text passwords should not be stored

### Result

Passwords are protected using bcrypt hashing.

### Status

Passed

## 6. Access Control Testing

### Test Objective

Check whether different users can be restricted by role.

### Checks Performed

- Reviewed ADMIN, MANAGER, and CASHIER roles
- Reviewed role-based access control structure
- Reviewed protected backend route guards

### Result

The system includes role-based access control and protected route guards.

### Status

Passed

## 7. Rate Limiting Testing

### Test Objective

Check whether the backend has protection against repeated request abuse.

### Checks Performed

- Reviewed rate limiting middleware
- Checked stricter limit for authentication routes
- Checked 429 response behavior

### Result

Rate limiting is implemented to reduce brute-force login attempts and repeated API abuse.

### Status

Passed

## 8. Security Headers Testing

### Test Objective

Check whether basic security headers are added to backend responses.

### Checks Performed

Reviewed implementation of:

- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

### Result

Security headers are added by backend middleware.

### Status

Passed

## 9. Input Validation Testing

### Test Objective

Check whether invalid business inputs are blocked.

### Checks Performed

Tested or reviewed validation for:

- POS sale quantity cannot be zero
- POS sale quantity cannot be negative
- POS sale quantity cannot exceed available stock
- Inactive products cannot be sold
- Inventory stock out cannot exceed available stock
- Inventory adjustment cannot become negative

### Result

Frontend validation and backend business rules reduce invalid operations.

### Status

Passed

## 10. Token Security Testing

### Test Objective

Check whether token handling is safer than using only long-lived access tokens.

### Checks Performed

- Reviewed access token usage
- Reviewed refresh token database table
- Reviewed refresh token hashing
- Reviewed refresh token rotation
- Reviewed token revocation endpoints

### Result

Refresh token rotation is implemented. Refresh tokens are stored as hashes and old tokens are revoked after rotation.

### Status

Passed

## 11. Email Verification Testing

### Test Objective

Check whether the system supports email verification.

### Checks Performed

- Reviewed verification token generation
- Reviewed verification token hashing
- Reviewed verification token expiry
- Reviewed email verified status

### Result

Email verification is implemented with hashed tokens and expiry time.

### Status

Passed

## 12. Two-Factor OTP Testing

### Test Objective

Check whether the system supports an additional authentication factor.

### Checks Performed

- Reviewed OTP generation
- Reviewed OTP hashing
- Reviewed OTP expiry
- Reviewed OTP verification
- Reviewed disable 2FA endpoint

### Result

Two-factor OTP support is implemented. In production, OTP should be delivered by email or SMS.

### Status

Passed with production note

## 13. Audit Log Testing

### Test Objective

Check whether important backend actions are traceable.

### Checks Performed

Reviewed audit log fields:

- Method
- Path
- Entity type
- IP address
- User agent
- Status code
- Metadata
- Timestamp

### Result

Audit logging is implemented for important state-changing requests.

### Status

Passed

## 14. Blockchain-Style Hash Chain Testing

### Test Objective

Check whether audit log tampering can be detected.

### Checks Performed

- Reviewed previousHash field
- Reviewed currentHash field
- Reviewed hash chain verification logic

### Result

Audit logs include a blockchain-style hash chain. If old audit data is modified, verification should fail.

### Status

Passed

## 15. Database Security Testing

### Test Objective

Check whether the frontend directly exposes database access.

### Checks Performed

- Reviewed frontend/backend/database flow
- Reviewed Prisma ORM usage
- Reviewed environment variable usage

### Result

The frontend does not directly access PostgreSQL. Database access goes through the NestJS backend and Prisma ORM.

### Status

Passed

## 16. HTTPS Deployment Review

### Test Objective

Check whether the project is prepared for secure deployment.

### Checks Performed

- Reviewed HTTPS deployment guide
- Reviewed Nginx reverse proxy sample
- Reviewed .env.example files
- Reviewed production security checklist

### Result

The project includes HTTPS deployment preparation and production security guidance.

### Status

Passed

## 17. Summary of Findings

| Area | Status | Risk Level |
| --- | --- | --- |
| Password hashing | Passed | Low |
| JWT authentication | Passed | Low |
| Role-based access control | Passed | Medium |
| Rate limiting | Passed | Low |
| Security headers | Passed | Low |
| Input validation | Passed | Medium |
| Refresh token rotation | Passed | Low |
| Email verification | Passed | Low |
| Two-factor OTP | Passed with production note | Medium |
| Audit logging | Passed | Low |
| Audit hash chain | Passed | Low |
| Database access control | Passed | Low |
| HTTPS preparation | Passed | Medium |

## 18. Remaining Risks

The following are future improvements:

- Real email service is not connected yet
- Real SMS service is not connected yet
- OTP is returned in API response for development
- Production deployment is not completed yet
- Automated security scanning is not connected to CI/CD yet
- External penetration testing has not been performed

## 19. Recommendations

Recommended next improvements:

- Send verification emails through a real email provider
- Send OTP through email or SMS
- Add account lockout after repeated failed login attempts
- Add admin audit log dashboard
- Add automated OWASP ZAP scan
- Add CI/CD security checks
- Deploy backend and frontend using HTTPS
- Add monitoring and alerting

## 20. Interview Explanation

I can explain this report like this:

"I prepared a penetration testing style report for ApexBiz. I reviewed authentication, authorization, password hashing, JWT protection, refresh token rotation, rate limiting, security headers, input validation, audit logs, audit hash-chain tamper detection, database access, and HTTPS deployment readiness. This shows that I considered security risks and documented how the system handles them."
