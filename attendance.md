# Attendance System APIs

## Overview
This document outlines the APIs and logic for the attendance system, including PTP (Permanent Time Password) verification and clock-in/out functionality.

## Authentication
- All APIs require authentication header: `username|||password|||ptp`
- Server verifies credentials and PTP for each request

## PTP (Permanent Time Password)

### PTP Characteristics
- 4-digit numeric code
- Unique for each user
- Generated and managed server-side

### PTP Verification API
- Endpoint: `POST /api/verify-ptp`
- Request Body: `{ ptp: string }`
- Response:
  - Success: `{ valid: true, newPtp: string }`
  - Failure: `{ valid: false, message: string }`

### PTP Verification Logic
1. Verify the provided PTP against the user's stored PTP
2. If valid:
   - Generate a new PTP
   - Update user's PTP in the database
   - Return new PTP to client
3. If invalid:
   - Return error message

### PTP Reset (Admin Only)
- Endpoint: `POST /api/admin/reset-ptp/:userId`
- Response: `{ newPtp: string }`

## Attendance Capture API

### Single Endpoint for Clock In/Out
- Endpoint: `POST /api/capture-attendance`
- No request body needed (uses authentication header)
- Response:
  - Success: `{ action: 'clock_in' | 'clock_out', timestamp: string }`
  - Failure: `{ error: string }`

### Attendance Capture Logic
1. Retrieve user's latest attendance record within the last 24 hours
2. If no record or last record has clock_out:
   - Create new attendance record with clock_in
   - Return 'clock_in' action
3. If last record has clock_in but no clock_out:
   - Update record with clock_out
   - Return 'clock_out' action
4. Implement a cooldown period (e.g., 1 minute) to prevent rapid consecutive clock in/out

## Get Current Status API
- Endpoint: `GET /api/attendance-status`
- Response: `{ status: 'checked_in' | 'checked_out', lastAction: string }`

## Database Schema

### Attendance Table
| Column    | Type      | Description                    |
|-----------|-----------|--------------------------------|
| id        | Integer   | Primary Key                    |
| user_id   | Integer   | Foreign Key to Users table     |
| clock_in  | Timestamp | Time of clock in               |
| clock_out | Timestamp | Time of clock out (nullable)   |

## Error Handling
- Return appropriate HTTP status codes (400 for client errors, 500 for server errors)
- Provide descriptive error messages in the response body

## Rate Limiting
- Implement rate limiting to prevent abuse (e.g., max 5 requests per minute per user)

## Logging
- Log all attendance actions with user ID, action type, and timestamp
- Store logs separately from the main attendance records for auditing purposes

## Real-time Updates
- After successful attendance capture, emit WebSocket event to update client in real-time

## Security Considerations
- Validate and sanitize all input data
- Ensure PTP is only valid for a single use
- Implement server-side checks to prevent time manipulation

## Future Enhancements
- Geolocation tracking for clock in/out
- Support for different shift types
- Integration with leave management system

Note: This API design is for a POC. Production implementation would require additional security measures and optimizations.
