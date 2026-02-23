import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep logs for debugging in browser console while preserving user flow.
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="card max-w-lg text-center">
            <h1 className="text-xl font-semibold text-slate-800">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              Please refresh the page. If the issue continues, reset demo data from profile and try again.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;
