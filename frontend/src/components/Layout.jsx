import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationRead, submissions } = useData();
  const myNotifications = notifications.filter((n) => n.userId === currentUser?.id).slice(0, 5);
  const trend = submissions
    .filter((s) => s.studentId === currentUser?.id && s.totalMarks != null)
    .slice(0, 6)
    .map((s, idx) => ({ idx: idx + 1, marks: s.totalMarks }));

  return (
    <div className="app-shell min-h-screen lg:flex">
      <Sidebar role={currentUser.role} />
      <main className="flex-1 p-4 lg:p-7">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-sm">
              <input className="input" placeholder="Search here" />
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="chip">Light</span>
              <span className="chip">Alerts</span>
              <Link to="/profile" className="btn-secondary">
                Profile
              </Link>
              <button onClick={logout} className="btn-primary">
                Logout
              </button>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-400">Project / Academic Workflow / Dashboard</p>
            <h2 className="title-xl mt-1">{currentUser.name}</h2>
            <p className="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              {currentUser.role}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-slate-200 pt-3">
            <button className="text-sm text-slate-500">Overview</button>
            <button className="border-b-2 border-[#5e54d6] pb-1 text-sm font-semibold text-[#2b2759]">Boards</button>
            <button className="text-sm text-slate-500">Timeline</button>
            <button className="text-sm text-slate-500">Activities</button>
            <button className="text-sm text-slate-500">Files</button>
            <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
              <span>Filter</span>
              <span>Sort</span>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div>{children}</div>
          <aside className="space-y-4">
            <section className="rounded-2xl bg-gradient-to-r from-[#8f7cff] to-[#8b6df8] p-5 text-white shadow-sm">
              <p className="mb-1 text-sm text-white/80">Unlock more information</p>
              <h3 className="mb-3 text-lg font-semibold">Upgrade to Pro Insights</h3>
              <button className="rounded-xl bg-[#1d1849] px-4 py-2 text-sm font-medium text-white hover:bg-[#161238]">
                Upgrade Now
              </button>
            </section>

            {trend.length > 0 && (
              <section className="card">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Performance Activity</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend}>
                      <XAxis dataKey="idx" stroke="#8f95ad" tickLine={false} axisLine={false} />
                      <YAxis stroke="#8f95ad" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line dataKey="marks" type="monotone" stroke="#8f7cff" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {myNotifications.length > 0 && (
              <section className="card">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Recent Notifications</h3>
                <div className="space-y-2">
                  {myNotifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full rounded-xl border p-3 text-left text-sm ${
                        n.readStatus ? "border-slate-200 bg-white" : "border-violet-300 bg-violet-50"
                      }`}
                    >
                      <p className="text-slate-800">{n.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="card">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Today Schedule</h3>
              <div className="space-y-3">
                <div className="panel-soft">
                  <p className="font-medium text-slate-800">Rubric Review Session</p>
                  <p className="text-xs text-slate-500">08:00 - 09:00</p>
                </div>
                <div className="panel-soft">
                  <p className="font-medium text-slate-800">Submission QA Check</p>
                  <p className="text-xs text-slate-500">10:00 - 11:00</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Layout;


