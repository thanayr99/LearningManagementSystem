import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const ProfilePage = () => {
  const { currentUser, refreshCurrentUser } = useAuth();
  const { updateProfile } = useData();
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

  return (
    <Layout>
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
    </Layout>
  );
};

export default ProfilePage;


