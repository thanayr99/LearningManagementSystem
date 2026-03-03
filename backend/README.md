# IAWES Backend (Spring Boot + MySQL)

Production-style backend for the Intelligent Academic Workflow & Evaluation System.

## Stack
- Spring Boot 3.5.x
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL
- Maven

## Modules
- Auth (`/api/auth/register`, `/api/auth/login`)
- Users/Profile/Departments/Notifications
- Assignments + Rubric criteria
- Submissions (multipart upload, resubmission versioning, grading)
- Basic plagiarism detection (cosine similarity with text/PDF extraction)
- AI grading suggestion endpoint
- Teacher/Student analytics
- Grade audit logging
- Deadline reminders (hourly scheduler)

## Run
1. Create MySQL database/user (or use defaults in `application.yml`).
2. Set env vars if needed:
   - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`
3. Start backend:
```bash
cd backend
mvn spring-boot:run
```

Default port: `8080`

## Seed Accounts
- `super@iawes.com / admin123`
- `teacher@iawes.com / teacher123`
- `student@iawes.com / student123`
- `ta@iawes.com / ta123`

## Frontend Integration
Frontend already has API base env support.

In `frontend/.env`:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Then run frontend:
```bash
cd frontend
npm run dev
```

## Notes
- File uploads are stored in local `uploads/`.
- JPA schema is managed with `ddl-auto=update` for rapid development.
- For strict production migration flow, add Flyway/Liquibase in next step.
