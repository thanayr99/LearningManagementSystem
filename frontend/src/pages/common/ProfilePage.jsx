import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, refreshCurrentUser, logout } = useAuth();
  const { updateProfile, resetDemoData } = useData();
  const [form, setForm] = useState({
    name: currentUser.name,
    department: currentUser.department,
    password: currentUser.password
  });

  const [saved, setSaved] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile(currentUser.id, form);
    refreshCurrentUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onResetDemoData = () => {
    const ok = window.confirm(
      "Reset all demo data to seed state? This clears created users, assignments, submissions, and logs you out."
    );
    if (!ok) return;
    resetDemoData();
    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <form onSubmit={onSubmit} className="card max-w-xl">
          <h1 className="text-xl font-semibold">My Profile</h1>
          {saved ? <p className="mt-3 rounded bg-emerald-50 p-2 text-sm text-emerald-700">Profile updated.</p> : null}
          <div className="mt-4">
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="mt-3">
            <label className="label">Department</label>
            <input className="input" value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))} />
          </div>
          <div className="mt-3">
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          </div>
          <button className="btn-primary mt-5" type="submit">
            Save Changes
          </button>
        </form>

        <section className="card h-fit">
          <h2 className="text-base font-semibold text-slate-800">Demo Controls</h2>
          <p className="mt-2 text-sm text-slate-600">
            Reset app data to seed state for clean demos. You will be logged out after reset.
          </p>
          <button
            type="button"
            onClick={onResetDemoData}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Reset Demo Data
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;


