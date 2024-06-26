# Attendance System Project Documentation

## Project Overview

This document outlines the structure and setup of a simple attendance system designed for a small group (around 10 people). The system is built using Next.js for the frontend and API routes, MySQL for the database, and Docker for containerization.

## Key Features

- User authentication (login with email and password)
- Enhanced PTP (Permanent Time Password) system for clock in/out
- Clock in/out functionality
- Basic admin panel for user management and attendance reporting
- Dockerized setup for easy deployment and development

## Technology Stack

- Frontend: Next.js (React framework)
- Backend: Next.js API routes
- Database: MySQL
- Containerization: Docker and Docker Compose
- Node.js version: 20 (LTS)

## Project Structure

The project follows a standard Next.js structure with additional directories for components and utilities. Key directories and files include:

- `/pages`: Next.js pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and database connection
- `/styles`: Global styles
- `Dockerfile`: Instructions for building the Docker image
- `docker-compose.yml`: Docker Compose configuration
- `init.sql`: Initial database schema

## Database Schema

The database consists of two main tables:

1. Users Table: Stores user information including credentials and admin status
2. Attendance Table: Records clock in/out times for users

## Admin Panel Features

The admin panel is a crucial component of the Attendance System, providing administrators with tools to manage users and view attendance data. Key features include:

1. User Management (CRUD Operations):
   - Create new users
   - Read/View existing user details
   - Update user information
   - Delete users from the system

2. Password Management:
   - Set and update user passwords
   - Passwords are stored in plain text for simplicity
   - No password hashing is implemented

3. User Listing:
   - View a list of all users in the system
   - Filter and search capabilities

4. Attendance Reporting:
   - View attendance records for all users
   - Filter attendance by date range or specific user
   - Basic statistics (e.g., total hours worked)

5. System Settings:
   - Configure basic system parameters
   - Manage admin accounts

6. PTP Management:
   - Initiate PTP reset for any user
   - View newly generated PTPs for communication to users
   - Cannot manually set or modify PTPs

## Enhanced PTP (Permanent Time Password) System

The PTP system has been refined to improve security, usability, and admin control.

### PTP Characteristics

1. Format:
   - 4-digit numeric code
   - Unique for each user
   - Generated and managed server-side

2. Storage:
   - Stored securely in the server database
   - Temporarily stored in the user's device/browser after validation

### PTP Validation and Storage Process

1. Initial Page Load:
   When a user accesses the clock in/out page:

   a. Check Local Storage:
      - The app checks if a PTP exists in the device's local storage

   b. Server Validation:
      - API call made to validate stored PTP (if exists) or request a new one
      - Endpoint: `/api/validate-ptp`
      - Request Header: Includes user email and password

   c. Server Response:
      - If valid PTP exists: Returns `{ valid: true, ptp: "1234" }`
      - If no valid PTP: Returns `{ valid: false, newPtp: "5678" }`

   d. Client-side Action:
      - If valid: Store returned PTP in local storage
      - If invalid: Prompt user to enter the new PTP provided by the server

2. PTP Entry:
   - User enters the 4-digit PTP provided by the admin
   - PTP is validated against the server-provided PTP
   - Upon successful validation, PTP is stored in local storage

### Cross-Device Compatibility

- The server always returns the current valid PTP during the validation process
- Users can use their PTP on any device or browser
- Ensures consistency across multiple devices for the same user

### Admin Panel PTP Management

1. PTP Reset Process:
   - Admin clicks "Reset PTP" for a user
   - Server generates a new random PTP
   - New PTP is displayed to the admin for communication to the user
   - User's current PTP is immediately invalidated

2. Admin Self-Management:
   - Admins cannot change their own PTP directly
   - A separate admin or a super-admin role is required to reset an admin's PTP

## Authentication Process

The authentication process includes three components for API calls:

1. API Header Format:

2. Components:
- Email: User's unique email address
- Password: User's password (stored in plain text)
- PTP: User's Permanent Time Password

3. Server-side Validation:
- The server checks all three components (email, password, and PTP) against the database for each API call
- All three must match for the authentication to be successful

## API Endpoints

1. PTP Validation and Retrieval:
- Endpoint: `/api/validate-ptp`
- Method: POST
- Headers: Email, Password
- Response: 
  - Valid PTP: `{ valid: true, ptp: "1234" }`
  - New PTP: `{ valid: false, newPtp: "5678" }`

2. Admin PTP Reset:
- Endpoint: `/api/admin/reset-user-ptp`
- Method: POST
- Headers: Admin credentials
- Body: `{ userId: "user_id" }`
- Response: `{ success: true, newPtp: "9876" }`

3. Clock In/Out:
- Endpoints: `/api/clock-in` and `/api/clock-out`
- Method: POST
- Headers: Email, Password, PTP
- Additional validation occurs before processing clock in/out

4. User Management (Admin only):
- Various endpoints for CRUD operations on users

5. Attendance Reporting (Admin only):
- Endpoint for retrieving attendance data

## Mobile Application Considerations

1. Credential Storage:
- The mobile app should securely store the user's email, password, and PTP
- All three should be included in the header for relevant API calls

2. User Interface:
- Implement a 4-digit PIN-style input for PTP entry
- Provide clear instructions for users to enter their PTP

3. PTP Handling:
- Implement logic to handle PTP validation and storage process
- Clear PTP from local storage on logout or app closure

## Security Considerations

1. Enhanced Security:
- The addition of server-generated PTP provides an extra layer of security
- Helps prevent unauthorized clock in/out attempts

2. Transmission Security:
- Implement HTTPS to encrypt data in transit

3. Brute Force Prevention:
- Implement a limit on PTP entry attempts
- Consider implementing a cooldown period after failed attempts

4. Audit Logging:
- Log all PTP reset actions with timestamps and admin identification

## Setup Instructions

1. Project Initialization:
- Create a new Next.js project
- Set up the project structure as described
- Install additional dependencies (mysql2, bcryptjs, jsonwebtoken)

2. Docker Configuration:
- Create a Dockerfile for the Next.js application
- Create a docker-compose.yml file to orchestrate the app and MySQL
- Prepare an init.sql file for database initialization

3. Development Environment:
- Instructions for running the project locally without Docker
- Steps to start the development server

4. Production Deployment:
- Steps to build the Next.js application for production
- Instructions for starting the production server

5. Docker Deployment:
- Commands to build and run the Docker containers

## Implementation Notes

- Update the `users` table in the database to include a PTP field
- Modify API route middleware to check for valid email, password, and PTP in the request header
- Update the admin panel to include PTP management features
- Implement server-side PTP generation and validation logic
- Adjust the mobile application to handle PTP storage and validation process
- Ensure all communication is done over HTTPS

## Future Enhancements

- Implement a system for regular PTP rotation to enhance security
- Consider moving to a token-based authentication system for more robust security
- Explore options for encrypting the PTP in the database and during transmission
- Implement biometric authentication as an alternative to PTP
- Consider implementing a time-based one-time password (TOTP) system
- Develop a secure method for users to request PTP resets

## Troubleshooting

Common issues and their solutions:

1. Database connection problems
2. Docker networking issues
3. Next.js build errors
4. PTP synchronization issues across devices

## Contribution Guidelines

Instructions for developers who wish to contribute to the project, including coding standards and pull request process.

## License

Information about the project's license and usage terms.

---

This document serves as a comprehensive guide for the Attendance System project. It should be regularly updated as the project evolves, and can be used as a reference for team discussions, onboarding new developers, and planning future improvements.
