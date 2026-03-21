# Smart Campus Management System

A monolithic academic project demonstrating a full-stack Spring Boot and React application. This starting structure contains the foundations for **Authentication, Authorization, Profile Management, Notifications, and Email Sending**. 

It is designed to be simple, clean, and extensible for a group project without using microservices.

## Tech Stack
- **Backend**: Java 21, Spring Boot 3.2, Spring Security (Google OAuth2 + JWT), Spring Data JPA, PostgreSQL.
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React (Icons).

---

## Prerequisites
1. **Java 21** installed.
2. **Node.js** v18+ and `npm` installed.
3. **PostgreSQL** installed and running on default port (`5432`).
4. A **Google Cloud Project** with an OAuth2 Client ID created.
5. An **SMTP Application Password** for sending emails (e.g. Gmail App Password).

---

## Setup Instructions

### 1. Database Setup
Create an empty PostgreSQL database named `smart_campus` (or whatever you prefer, just match the `.env` below).
```sql
CREATE DATABASE smart_campus;
```

### 2. Backend Setup
1. Open the `backend/` folder.
2. Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your actual database credentials, Google OAuth keys, and Mail configurations.
4. Run the application from your IDE (e.g., IntelliJ) using `SmartCampusApplication.java`, or via Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will run on `http://localhost:8080`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## Features & Flows

1. **Authentication (Google Login)**
   - Click "Continue with Google" on the frontend login page.
   - Redirects to Spring Security OAuth2. Local user is created in PostgreSQL if they don't exist.
   - Issues a stateless HttpOnly JWT cookie on successful login.

2. **Roles & Authorization**
   - New users get the `USER` role.
   - System administrators need the `ADMIN` role. 
   - *Manual override:* Go to PostgreSQL and manually set your user row's `role` to `'ADMIN'` so you can access the Admin Dashboard.
   - Admins can change other users' roles via the UI.

3. **Profile & Verification**
   - Users can edit their display names. 
   - Click "Verify my email" to send an SMTP email.
   - The email contains a link which hits the `/api/profile/verify` endpoint.

4. **Notifications**
   - Bell icon shows unread counters.
   - Notification table structure is built to easily hook into future modules (Booking, IT Tickets).
   - Use `NotificationService.createNotification(...)` anywhere in the backend to trigger one.

---

## Project Structure (Monolith)

```
.
├── backend/                  # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/smartcampus/
│       ├── auth/             # Login/Me endpoints
│       ├── common/           # Global exceptions, ApiResponse
│       ├── config/           # CORS, OAuth Configs
│       ├── mail/             # SMTP Mailer service
│       ├── notification/     # In-app notifications domain
│       ├── profile/          # Profile logic
│       ├── security/         # JWT Filters, Security rules, OAuth handlers
│       ├── user/             # User entity and Admin interactions
│       └── verification/     # Email validation tokens
│
├── frontend/                 # React Vite application
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── api/              # Axios instance and endpoints
│       ├── auth/             # Login wrappers and Context
│       ├── components/       # Reusable UI (Navbar, Bell)
│       ├── layouts/          # Main Structural wrapper
│       └── pages/            # View components (Home, Profile, Admin)
```

Enjoy building the rest of the modules!