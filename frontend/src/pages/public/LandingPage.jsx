import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden p-6 lg:p-10">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-200 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-100 blur-3xl" />

      <header className="relative z-10 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#5e54d6]">IAWES</h1>
          <p className="muted text-sm">Intelligent Academic Workflow & Evaluation System</p>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Register
          </Link>
        </div>
      </header>

      <main className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <p className="text-sm uppercase tracking-widest text-[#6e63db]">Academic Workflow Platform</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight text-slate-800 lg:text-5xl">
            Assignment Submission and Intelligent Grading, End-to-End
          </h2>
          <p className="muted mt-4 max-w-2xl">
            Role-based dashboards for Super Admin, Teacher, TA, and Student with submissions,
            rubric-based grading, AI-assisted feedback suggestions, plagiarism signals, and analytics.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Enter Dashboard
            </Link>
            <Link to="/register" className="btn-secondary">
              Create Account
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold">Seed Logins</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>super@iawes.com / admin123</p>
              <p>teacher@iawes.com / teacher123</p>
              <p>student@iawes.com / student123</p>
              <p>ta@iawes.com / ta123</p>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Core Modules</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Role-based Access & Auth Flow</li>
              <li>Assignments, Rubrics, Submissions, Versioning</li>
              <li>AI Suggestion + Grading Workflow</li>
              <li>Analytics, CSV Export, Notifications</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;


