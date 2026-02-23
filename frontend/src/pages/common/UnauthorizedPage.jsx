import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div className="flex min-h-screen items-center justify-center p-4">
    <div className="card max-w-md text-center">
      <h1 className="text-2xl font-semibold text-red-600">Unauthorized</h1>
      <p className="mt-2 text-slate-600">You do not have permission to access this page.</p>
      <Link to="/" className="btn-primary mt-4 inline-block">
        Go Home
      </Link>
    </div>
  </div>
);

export default UnauthorizedPage;


