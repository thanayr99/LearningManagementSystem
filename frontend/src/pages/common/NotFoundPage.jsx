import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center p-4">
    <div className="card max-w-md text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link to="/" className="btn-primary mt-4 inline-block">
        Back
      </Link>
    </div>
  </div>
);

export default NotFoundPage;


