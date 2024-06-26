# PTP (Permanent Time Password) System

## Overview
The PTP (Permanent Time Password) is a crucial component of our attendance system, providing an additional layer of verification for user actions.

## PTP Characteristics
- 4-digit numeric code
- Unique for each user
- Remains valid until explicitly reset or changed

## PTP Lifecycle

### Initial Generation
- Generated when a new user is created
- Provided to the user through a secure channel (e.g., email or admin communication)

### Storage
- Stored in the user's record in the database
- Stored on the client-side (e.g., localStorage) after successful verification

### Verification Process
1. User enters PTP during initial login or when required
2. System compares entered PTP with the one stored in the database
3. If match:
   - PTP is considered valid
   - Client stores PTP locally for future API calls
4. If mismatch:
   - User is prompted to re-enter PTP
   - After multiple failures, user may need to request a PTP reset

### Usage in API Calls
- Included in the authentication header: `username|||password|||ptp`
- Server verifies PTP along with username and password for each API call

## PTP Validation API
- Endpoint: `POST /api/validate-ptp`
- Request Body: `{ ptp: string }`
- Response:
  - Success: `{ valid: true, ptp: string }`
  - Failure: `{ valid: false, message: string }`

## PTP Reset Process

### User-Initiated Reset
- Users cannot reset their own PTP
- Must request reset from an admin

### Admin-Initiated Reset
- Endpoint: `POST /api/admin/reset-ptp/:userId`
- Generates a new PTP for the specified user
- Returns new PTP to admin for communication to user

## Security Considerations
- PTP is not a one-time password; it remains valid until changed
- PTP adds an extra verification layer but doesn't replace proper authentication
- Implement rate limiting on PTP validation attempts to prevent brute force attacks

## Client-Side Handling
- Store PTP locally after successful validation
- Include stored PTP in all subsequent API calls
- Clear stored PTP on logout or when server indicates it's invalid

## Server-Side Handling
- Validate PTP along with username and password for each authenticated request
- Return clear error messages if PTP is invalid, prompting client to re-validate

## Use Cases for PTP Re-entry
1. First-time login on a new device
2. After a logout (when local storage is cleared)
3. When server indicates the current PTP is invalid
4. After an admin-initiated PTP reset

## PTP in Multi-Device Scenarios
- PTP remains the same across all devices for a user
- Successful login on a new device should store PTP locally on that device

Note: While called "Permanent", the PTP can be changed through the reset process. It's permanent in the sense that it doesn't change automatically after use, unlike typical one-time passwords.
