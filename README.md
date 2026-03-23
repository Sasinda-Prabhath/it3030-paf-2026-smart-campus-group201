# Smart Campus Management System

This is a group project for IT3030 PAF 2026.

## Tech Stack

- Backend: Spring Boot 3.x, Java 21, Maven, PostgreSQL
- Frontend: React 18, Vite, Tailwind CSS

## Project Structure

- backend/: Spring Boot application
- frontend/: React application

## Getting Started

### Prerequisites

- Java 21
- Maven
- Node.js 18+
- PostgreSQL

### PostgreSQL Setup

1. Install PostgreSQL on your machine.
2. Create a database named `smartcampus`.
3. Create a user with appropriate permissions.

### Environment Variables

1. Copy `backend/.env.example` to `backend/.env` and fill in your database credentials and other secrets.
2. Copy `frontend/.env.example` to `frontend/.env` and set the frontend URL.
3. Set the environment variables in your system or use a tool like direnv to load from the .env files.

Required backend environment variables:
- SPRING_DATASOURCE_URL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- FRONTEND_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI

### Prerequisites

- Java 21
- Maven
- Node.js 18+
- PostgreSQL

### PostgreSQL Setup

1. Install PostgreSQL on your machine.
2. Create a database named `smartcampus`.
3. Create a user with appropriate permissions.

### Environment Variables

1. Copy `backend/.env.example` to `backend/.env` and fill in your database credentials and other secrets.
2. Copy `frontend/.env.example` to `frontend/.env` and set the frontend URL.
3. Set the environment variables in your system or use a tool like direnv to load from the .env files.

Required backend environment variables:
- SPRING_DATASOURCE_URL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- FRONTEND_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI

### Backend

1. cd backend
2. mvn spring-boot:run

### Frontend

1. cd frontend
2. npm install
3. npm run dev