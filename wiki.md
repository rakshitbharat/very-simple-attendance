# Attendance System Project Documentation

## Project Overview

This document outlines the structure and setup of a simple attendance system designed for a small group (around 10 people). The system is built using Next.js for the frontend and API routes, MySQL for the database, and Docker for containerization.

## Key Features

- User authentication (login with email and password)
- PTP (Permanent Time Password) for clock in/out
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

## API Routes

The system includes several API routes for handling various functionalities:

- Authentication
- Clock in/out management
- User management (admin only)
- Attendance reporting

## Security Considerations

- Password hashing
- JWT for session management
- Secure storage of environment variables

## Future Improvements

Potential areas for enhancement:

1. Advanced reporting features
2. Geolocation for clock in/out
3. Mobile app development
4. Integration with other HR systems
5. Enhanced security measures (2FA, audit logs)

## Troubleshooting

Common issues and their solutions:

1. Database connection problems
2. Docker networking issues
3. Next.js build errors

## Contribution Guidelines

Instructions for developers who wish to contribute to the project, including coding standards and pull request process.

## License

Information about the project's license and usage terms.

---

This document serves as a comprehensive guide for the Attendance System project. It should be regularly updated as the project evolves, and can be used as a reference for team discussions, onboarding new developers, and planning future improvements.
