# ApexBiz Enterprise Platform - Security Test Cases

## 1. Authentication Test Cases

| Test Case | Expected Result |
| --- | --- |
| Login with valid username and password | Login succeeds |
| Login with wrong password | Login fails |
| Access protected API without token | Request is rejected |
| Access protected API with valid token | Request succeeds |

## 2. Access Control Test Cases

| Test Case | Expected Result |
| --- | --- |
| ADMIN accesses admin-level function | Access allowed |
| CASHIER accesses restricted function | Access denied |
| Request without JWT token | Access denied |
| Request with invalid JWT token | Access denied |

## 3. Rate Limiting Test Cases

| Test Case | Expected Result |
| --- | --- |
| Send normal number of requests | Requests succeed |
| Send too many requests quickly | API returns 429 |
| Send repeated auth requests | Auth route limit is stricter |

## 4. Security Header Test Cases

| Test Case | Expected Result |
| --- | --- |
| Call backend API | Security headers are present |
| Check X-Frame-Options | Value is DENY |
| Check X-Content-Type-Options | Value is nosniff |
| Check Referrer-Policy | Value is no-referrer |

## 5. Product Validation Test Cases

| Test Case | Expected Result |
| --- | --- |
| Create valid product | Product is created |
| Update valid product | Product is updated |
| Set invalid selling price | Error is shown |
| Set invalid stock quantity | Error is shown |

## 6. POS Sales Test Cases

| Test Case | Expected Result |
| --- | --- |
| Sell valid quantity | Sale is created |
| Sell zero quantity | Error is shown |
| Sell negative quantity | Error is shown |
| Sell more than available stock | Error is shown |
| Sell inactive product | Error is shown |

## 7. Inventory Test Cases

| Test Case | Expected Result |
| --- | --- |
| Stock in valid quantity | Inventory is updated |
| Stock out valid quantity | Inventory is updated |
| Stock out more than available stock | Error is shown |
| Adjust stock to negative value | Error is shown |

## 8. Email Verification Test Cases

| Test Case | Expected Result |
| --- | --- |
| Request email verification | Token is generated |
| Verify using valid token | Email becomes verified |
| Verify using invalid token | Request fails |
| Verify using expired token | Request fails |

## 9. Two-Factor OTP Test Cases

| Test Case | Expected Result |
| --- | --- |
| Request OTP | OTP is generated |
| Verify correct OTP | OTP verification succeeds |
| Verify wrong OTP | Request fails |
| Verify expired OTP | Request fails |
| Disable 2FA | 2FA is disabled |

## 10. Refresh Token Test Cases

| Test Case | Expected Result |
| --- | --- |
| Create refresh token | Refresh token is created |
| Rotate valid refresh token | New access and refresh tokens are returned |
| Reuse old refresh token | Request fails |
| Revoke refresh token | Token becomes invalid |
| Revoke all tokens | All active tokens are revoked |

## 11. Audit Log Test Cases

| Test Case | Expected Result |
| --- | --- |
| Perform POST request | Audit log is created |
| Perform PATCH request | Audit log is created |
| Perform DELETE request | Audit log is created |
| View audit logs | Logs are returned |
| Verify audit hash chain | Valid chain message is returned |

## 12. HTTPS Deployment Test Cases

| Test Case | Expected Result |
| --- | --- |
| Use production API URL with HTTPS | Frontend calls secure API |
| Use Nginx reverse proxy | Requests are forwarded to backend/frontend |
| Use strong JWT secret | Tokens are safer |
| Keep .env files out of GitHub | Secrets are not exposed |

## 13. Interview Explanation

I can say:

"I created security test cases for authentication, access control, rate limiting, security headers, product validation, POS validation, inventory validation, email verification, two-factor OTP, refresh token rotation, audit logs, and HTTPS deployment preparation. These test cases help prove that the project was checked from a cybersecurity perspective."
