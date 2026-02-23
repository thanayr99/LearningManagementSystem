# Intelligent Academic Workflow & Evaluation System (Frontend)

Frontend-only implementation of a role-based Online Assignment Submission and Intelligent Grading System using React + Vite + Tailwind.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- Context API
- Recharts

## Implemented Features
- Role-based authentication (mock/local seed users)
- Role-based protected routes and sidebar menus
- Public pages: Login, Register
- Student pages:
  - Dashboard
  - View assignments
  - Submit/resubmit assignment with version tracking
  - Grades and submission history
  - Analytics (trend, strengths, weaknesses, late count)
- Teacher/TA pages:
  - Dashboard
  - Create/manage assignments (rubric + references)
  - View submissions
  - Grade submissions rubric-wise
  - AI grading assistant simulation (keyword-based suggestions)
  - CSV export for graded submissions
  - Teacher analytics dashboard
- Super admin pages:
  - Manage users
  - Manage departments
- Notifications:
  - Assignment publish alerts
  - Deadline reminder sweep (within 24h)
  - Grading completion alerts
- Plagiarism simulation:
  - Cosine similarity on submitted text content
  - Flag behavior via high similarity display
- Audit logging for grading actions

## Seed Login Credentials
- Super Admin: `super@iawes.com` / `admin123`
- Teacher: `teacher@iawes.com` / `teacher123`
- Student: `student@iawes.com` / `student123`
- TA: `ta@iawes.com` / `ta123`

## Run Locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this project to GitHub.
2. In Vercel, import the repository.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

`vercel.json` is already included with SPA rewrite so React Router routes work on refresh.

## Project Structure
```
src/
  components/
  context/
  pages/
    admin/
    common/
    public/
    student/
    teacher/
  services/
  utils/
```

## Notes
- This is intentionally frontend-only and uses `localStorage` as a mock data layer.
- Data persists in browser storage until manually cleared.
- Backend integration can be added by replacing context actions with API calls.
