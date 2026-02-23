import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative overflow-hidden px-4 pb-10 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <div className="absolute -left-16 top-40 h-56 w-56 rounded-full bg-[#ffb703]/70 blur-2xl" />
        <div className="absolute right-8 top-16 h-44 w-44 rounded-[38%] bg-[#b18cff] blur-xl" />
        <div className="absolute bottom-10 right-0 h-48 w-48 rounded-[35%] bg-[#c7ffd6] blur-xl" />
        <div className="absolute bottom-16 left-1/3 h-20 w-20 rounded-full bg-[#ff66e0] blur-md" />

        <header className="relative z-10 mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">IAWES</h1>
            <p className="text-sm text-slate-300">Intelligent Academic Workflow & Evaluation System</p>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white hover:bg-white/10">
              Log In
            </Link>
            <Link to="/register" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Sign Up
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-violet-300">Academic Intelligence Platform</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Unlock the future
            <span className="mx-3 inline-block border-b-4 border-fuchsia-500 pb-1">of</span>
            education
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            One modern platform for assignment workflows, intelligent grading, analytics, and role-based collaboration.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" className="rounded-full bg-[#8f7cff] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7d6aef]">
              Enter Dashboard
            </Link>
            <a href="#features" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Explore Features
            </a>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full bg-[#090f2a]/90 p-2 text-xs text-slate-300">
          <span className="rounded-full bg-white/5 px-4 py-2">About Us</span>
          <span className="rounded-full bg-white/5 px-4 py-2">Features</span>
          <span className="rounded-full bg-white/5 px-4 py-2">Benefits</span>
          <span className="rounded-full bg-white/5 px-4 py-2">Testimonials</span>
          <span className="rounded-full bg-white/5 px-4 py-2">Pricing</span>
        </div>
      </section>

      <section id="features" className="relative bg-[#f8f8fc] px-4 py-12 sm:px-8 lg:px-12">
        <div className="absolute -right-8 top-8 h-32 w-32 rounded-3xl bg-cyan-300/80" />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-4xl font-medium leading-tight text-slate-800 sm:text-5xl">
              Discover
              <span className="ml-2 font-semibold text-slate-900">firsthand</span>
              <br />
              the transformative impact of
              <span className="ml-2 text-[#8f7cff]">IAWES</span>
            </h3>
            <p className="mt-5 max-w-xl text-slate-500">
              Real-time assignment lifecycle management, plagiarism signals, rubric-driven grading, and analytics that guide educators and students.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800">Teacher Control</p>
                <p className="mt-1 text-sm text-slate-500">Create, publish, assess, and export results instantly.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800">Student Clarity</p>
                <p className="mt-1 text-sm text-slate-500">Submission history, grades, trends, and feedback in one place.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Seed Login Preview</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>super@iawes.com / admin123</p>
                <p>teacher@iawes.com / teacher123</p>
                <p>student@iawes.com / student123</p>
                <p>ta@iawes.com / ta123</p>
              </div>
            </div>
            <div className="rounded-[28px] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Modules Included</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Authentication and role-based dashboards</li>
                <li>Assignments, rubric and grading workflow</li>
                <li>Submission versioning and CSV exports</li>
                <li>AI suggestion and analytics snapshots</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-4 py-14 sm:px-8 lg:px-12">
        <div className="absolute -left-12 bottom-8 h-40 w-40 rounded-full bg-green-500/30 blur-2xl" />
        <div className="absolute right-8 top-12 h-36 w-36 rounded-full bg-fuchsia-500/30 blur-2xl" />
        <div className="mx-auto max-w-6xl">
          <h3 className="text-center text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Benefits that elevate your
            <span className="mx-2 inline-block border-b-4 border-fuchsia-500 pb-1">teaching</span>
            experience
          </h3>
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-3">
            {[
              "Community Building",
              "Accessible",
              "Personalized Tracking",
              "Innovative",
              "Time-saving",
              "Automated",
              "Real-time",
              "Integrated Collaboration",
              "Data-driven",
              "Engaging",
              "Captivating",
              "Revolutionary"
            ].map((item, idx) => (
              <span
                key={item}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  idx % 4 === 0
                    ? "bg-white text-slate-900"
                    : idx % 4 === 1
                      ? "bg-[#1a8cff] text-white"
                      : idx % 4 === 2
                        ? "bg-[#32d74b] text-white"
                        : "bg-[#ff4fd8] text-white"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full bg-[#090f2a]/90 p-2 text-xs text-slate-300">
            <span className="rounded-full bg-white/5 px-4 py-2">About Us</span>
            <span className="rounded-full bg-white/5 px-4 py-2">Features</span>
            <span className="rounded-full bg-white/5 px-4 py-2">Benefits</span>
            <span className="rounded-full bg-white/5 px-4 py-2">Testimonials</span>
            <span className="rounded-full bg-white/5 px-4 py-2">Pricing</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


