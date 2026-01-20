# Internal Project Visibility System - Backend

A modular monolith backend built with NestJS, TypeScript, and PostgreSQL with Row-Level Security (RLS).

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- `jq` (for the test script)

### 2. Setup Environment
Create a `.env` file in the root (already provided in the scratch folder):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=visibility_system
JWT_SECRET=super-secret-key
JWT_EXPIRATION=3600s
PORT=3000
```

### 3. Run Database
```bash
docker-compose up -d
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Seed Database
This will create an admin user, test users, and initial projects.
```bash
npm run seed
```

### 6. Start Application
```bash
npm run start:dev
```

---

## 🧪 Testing the API

You can run the automated test script (requires Git Bash or WSL on Windows):
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🛠 API Endpoints

### Authentication
- `POST /auth/login`: Login and receive HttpOnly cookie.
- `POST /auth/logout`: Clear authentication cookie.
- `GET /auth/me`: Get current user profile.

### Projects
- `GET /projects`: List all active projects.
- `POST /projects`: Create a new project (Admin only).
- `PATCH /projects/:id/archive`: Archive a project (Admin only).

### Presence (Check-ins)
- `POST /check-ins`: Submit today's check-in.
- `GET /check-ins/today`: Get your check-in for today.
- `PATCH /check-ins/:id/outcome`: Submit/Update daily outcome.
- `GET /check-ins/history`: Get your check-in history.

### Dashboard
- `GET /dashboard/presence`: Get today's presence summary and list.
- `GET /dashboard/blockers`: Get a list of all current blockers.

---

## 🛡 Security & Multi-Tenancy
- **RLS**: Every table has Row-Level Security enabled.
- **Tenant Isolation**: Queries are automatically scoped to the user's `tenant_id` via a global interceptor.
- **JWT**: Stored in `HttpOnly` cookies to prevent XSS.
- **Validation**: Strict DTO validation using `class-validator`.

## ❓ Troubleshooting
- **Database Connection**: Ensure Docker is running and port 5432 is not occupied.
- **RLS Errors**: If you see "current_setting app.current_tenant not set", ensure the `RlsInterceptor` is active and you are authenticated.
- **Seed Script**: The seed script is idempotent; you can run it multiple times to reset/ensure base data exists.
