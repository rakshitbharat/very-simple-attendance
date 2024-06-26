# Authentication System Requirements

## Overview
This document outlines the authentication system for our attendance tracking POC application. The system prioritizes simplicity for rapid development and testing.

## Authentication Method
- Simple authentication using username (email), password, and PTP (when available)
- No tokens, cookies, or sessions

## Credentials Storage
- Client-side: localStorage
- Server-side: Plain text in database (for POC only)

## User Table Structure
| Field    | Type    | Description                    |
|----------|---------|--------------------------------|
| id       | Integer | Unique identifier              |
| email    | String  | User's email (used as username)|
| password | String  | User's password (plain text)   |
| is_admin | Boolean | Admin status flag              |
| ptp      | String  | Permanent Time Password        |

## Authentication Flow

### Login Process
1. User enters email and password on login form
2. Credentials sent to server for verification
3. Server responds with success message and user details
4. Client stores credentials in localStorage

### API Authentication
- Every API call includes authentication header
- Header format: `username|||password` or `username|||password|||ptp` (if PTP available)
- No encoding applied to this string

### Server-side Verification
1. Server uses authentication header string directly
2. String split to extract username, password, and PTP (if present)
3. Credentials checked against database

## API Endpoints

### Login
- Endpoint: `POST /api/login`
- Request body: `{ email: string, password: string }`
- Response: User details (excluding password) on success

### Logout
- Client-side only: Clear localStorage
- No server-side logout required

## Error Handling
- Return appropriate error messages for invalid credentials
- Handle and display user-friendly messages for network errors

## Frontend Integration
- Use Redux for authentication state management
- Update global state on login/logout

## Protected Routes
- Implement HOC or hook to wrap protected routes
- Check for credentials in localStorage

## Authentication Persistence
- Persists while credentials remain in localStorage
- Survives page refreshes

## Admin Authentication
- `is_admin` field determines admin status
- Include admin status in user object returned on login

## PTP Integration
- After initial login, prompt for PTP if required
- Include verified PTP in subsequent API calls
- Store PTP with username and password in localStorage

## Real-time Considerations
- Establish WebSocket connection post-authentication
- Use same credential string for WebSocket authentication if needed

## Security Note
This authentication system is designed for POC purposes only. It lacks essential security measures and is not suitable for production environments without significant enhancements.

