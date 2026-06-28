# ApexBiz Enterprise Platform - OWASP Security Testing Report

## 1. Report Purpose

This report explains the OWASP-style security review done for the ApexBiz Enterprise Platform.

The goal is to show that the project was reviewed for common web application security risks such as authentication weaknesses, access control issues, insecure tokens, missing security headers, input validation problems, and weak logging.

## 2. Project Scope

The security review covers:

- Next.js frontend
- NestJS backend API
- PostgreSQL database
- Prisma ORM
- Authentication system
- Role-based access control
- Rate limiting
- Security headers
- Email verification
- Two-factor OTP
- Refresh token rotation
- Audit logging
- Blockchain-style audit hash chain

## 3. OWASP Areas Covered

The project was reviewed against important OWASP security areas:

- Broken Access Control
- Cryptographic Failures
- Injection
- Insecure Design
- Security Misconfiguration
- Identification and Authentication Failures
- Software and Data Integrity Failures
- Security Logging and Monitoring Failures

## 4. Authentication Security

Implemented controls:

- Username and password login
- Bcrypt password hashing
- JWT authentication
- Protected backend routes
- Refresh token rotation
- Two-factor OTP support
- Email verification support

Result:

Passwords are not stored as plain text. Protected routes require valid authentication.

## 5. Access Control Security

Implemented controls:

- JWT guard
- Role-based access control
- Roles: ADMIN, MANAGER, CASHIER

Result:

Protected APIs require a valid token. User access can be restricted using roles.

## 6. Rate Limiting

Implemented controls:

- General API rate limit
- Stricter authentication route rate limit
- 429 response for too many requests

Result:

Rate limiting helps reduce brute-force login attempts and API abuse.

## 7. Security Headers

Implemented controls:

- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

Result:

Security headers reduce risks such as clickjacking, content sniffing, and unnecessary browser permission exposure.

## 8. Input Validation

Implemented controls:

- POS sale quantity validation
- Inventory quantity validation
- Product update validation
- Prevention of negative stock
- Prevention of selling inactive products
- Prevention of selling more than available stock

Result:

Invalid business operations are blocked before they damage data.

## 9. Refresh Token Security

Implemented controls:

- Secure random refresh tokens
- Refresh tokens stored as hashes
- Old refresh token revoked after rotation
- Refresh token expiry time
- Revoke refresh token endpoint
- Revoke all refresh tokens endpoint

Result:

Refresh token rotation reduces risk if a refresh token is stolen.

## 10. Email Verification

Implemented controls:

- Secure random verification token
- Verification token stored as hash
- Token expiry time
- Email verified status

Result:

Only hashed verification tokens are stored in the database.

## 11. Two-Factor OTP

Implemented controls:

- Six-digit OTP generation
- OTP stored as hash
- OTP expiry time
- Last verified timestamp
- Disable 2FA endpoint

Result:

The system supports an additional verification step after login.

Note:

For development, the OTP is returned in the API response. In production, it should be sent by email or SMS.

## 12. Audit Logging

Implemented controls:

Audit logs record:

- Request method
- Request path
- Entity type
- IP address
- User agent
- Status code
- Timestamp
- Metadata

Result:

Important backend actions can be traced for investigation and accountability.

## 13. Blockchain-Style Audit Hash Chain

Implemented controls:

Each audit log stores:

- previousHash
- currentHash

Result:

If someone changes an old audit record, the hash chain verification should fail. This improves tamper detection.

## 14. Database Security

Implemented controls:

- Frontend does not directly access PostgreSQL
- Backend accesses database through Prisma ORM
- Environment variables are used for sensitive configuration
- Real .env files are not committed to GitHub

Result:

Database access is controlled through backend APIs.

## 15. Deployment Security Preparation

Implemented controls:

- HTTPS deployment guide
- Nginx HTTPS reverse proxy sample
- Production security checklist
- .env.example files
- Security headers
- Rate limiting

Result:

The project includes production security preparation.

## 16. Summary Table

| Security Area | Status | Notes |
| --- | --- | --- |
| Password hashing | Passed | bcrypt is used |
| JWT authentication | Passed | Protected APIs use tokens |
| Role-based access control | Passed | ADMIN, MANAGER, CASHIER roles |
| Rate limiting | Passed | API abuse protection added |
| Security headers | Passed | Basic headers added |
| Input validation | Passed | Business rules protected |
| Refresh token rotation | Passed | Hashed refresh tokens |
| Email verification | Passed | Hashed verification tokens |
| Two-factor OTP | Passed | Hashed OTP and expiry |
| Audit logs | Passed | Important actions tracked |
| Audit hash chain | Passed | Tamper detection added |
| HTTPS preparation | Passed | Deployment guide added |

## 17. Limitations

The following are not fully production-ready yet:

- Real email sending service is not connected
- Real SMS service is not connected
- OTP is returned in API response for development demo
- Automated OWASP ZAP scan is not included
- Production cloud deployment is not completed
- External penetration testing was not performed

## 18. Future Improvements

Future improvements:

- Add real email service
- Add real SMS OTP service
- Add account lockout after failed login attempts
- Add admin audit log dashboard
- Add automated OWASP ZAP scan
- Add CI/CD security checks
- Deploy using HTTPS
- Add monitoring and alerting

## 19. Interview Explanation

I can say:

"I prepared an OWASP-style security testing report for ApexBiz. I reviewed authentication, access control, rate limiting, security headers, input validation, refresh token rotation, email verification, two-factor OTP, audit logging, and audit hash-chain tamper detection. This shows that I considered security from both application and deployment perspectives."
