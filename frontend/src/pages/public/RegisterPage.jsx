import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.STUDENT,
    department: "Computer Science"
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      register(form);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold text-slate-800">Register</h1>
        {error ? <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4">
          <label className="label">Name</label>
          <input className="input" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        </div>
        <div className="mt-3">
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        </div>
        <div className="mt-3">
          <label className="label">Password</label>
          <input className="input" type="password" required value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
        </div>
        <div className="mt-3">
          <label className="label">Role</label>
          <select className="input" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}>
            <option value={ROLES.STUDENT}>Student</option>
            <option value={ROLES.TEACHER}>Teacher</option>
            <option value={ROLES.TA}>TA</option>
          </select>
        </div>
        <div className="mt-3">
          <label className="label">Department</label>
          <input className="input" required value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))} />
        </div>
        <button type="submit" className="btn-primary mt-5 w-full">
          Create Account
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5e54d6] hover:underline">
            Login
          </Link>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          <Link to="/" className="hover:underline">
            Back to Home
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;


