import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const routeByRole = {
  [ROLES.STUDENT]: "/student/dashboard",
  [ROLES.TEACHER]: "/teacher/dashboard",
  [ROLES.TA]: "/teacher/dashboard",
  [ROLES.SUPER_ADMIN]: "/admin/users"
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = login(form.email, form.password);
      navigate(routeByRole[user.role] || "/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold text-slate-800">Login</h1>
        <p className="muted mt-1 text-sm">Access your academic workflow dashboard</p>
        {error ? <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4">
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        </div>
        <div className="mt-3">
          <label className="label">Password</label>
          <input className="input" type="password" required value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
        </div>
        <button type="submit" className="btn-primary mt-5 w-full">
          Sign In
        </button>
        <p className="mt-4 text-sm text-slate-600">
          No account?{" "}
          <Link to="/register" className="text-[#5e54d6] hover:underline">
            Register
          </Link>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          <Link to="/" className="hover:underline">
            Back to Home
          </Link>
        </p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold">Seed logins</p>
          <p>super@iawes.com / admin123</p>
          <p>teacher@iawes.com / teacher123</p>
          <p>student@iawes.com / student123</p>
          <p>ta@iawes.com / ta123</p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;


