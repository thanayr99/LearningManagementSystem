import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { ROLES } from "./utils/constants";
import { useAuth } from "./context/AuthContext";
import { useData } from "./context/DataContext";

const LoginPage = lazy(() => import("./pages/public/LoginPage"));
const RegisterPage = lazy(() => import("./pages/public/RegisterPage"));
const LandingPage = lazy(() => import("./pages/public/LandingPage"));
const UnauthorizedPage = lazy(() => import("./pages/common/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("./pages/common/NotFoundPage"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentAssignmentsPage = lazy(() => import("./pages/student/StudentAssignmentsPage"));
const SubmitAssignmentPage = lazy(() => import("./pages/student/SubmitAssignmentPage"));
const StudentGradesPage = lazy(() => import("./pages/student/StudentGradesPage"));
const StudentAnalyticsPage = lazy(() => import("./pages/student/StudentAnalyticsPage"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const CreateAssignmentPage = lazy(() => import("./pages/teacher/CreateAssignmentPage"));
const TeacherSubmissionsPage = lazy(() => import("./pages/teacher/TeacherSubmissionsPage"));
const GradeSubmissionPage = lazy(() => import("./pages/teacher/GradeSubmissionPage"));
const TeacherAnalyticsPage = lazy(() => import("./pages/teacher/TeacherAnalyticsPage"));
const ManageUsersPage = lazy(() => import("./pages/admin/ManageUsersPage"));
const ManageDepartmentsPage = lazy(() => import("./pages/admin/ManageDepartmentsPage"));
const ProfilePage = lazy(() => import("./pages/common/ProfilePage"));

const HomeRedirect = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === ROLES.SUPER_ADMIN) return <Navigate to="/admin/users" replace />;
  if (currentUser.role === ROLES.STUDENT) return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/teacher/dashboard" replace />;
};

const App = () => {
  const { runDeadlineReminderSweep } = useData();

  useEffect(() => {
    runDeadlineReminderSweep();
  }, []);

  return (
    <AppErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<HomeRedirect />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
            <Route path="/student/submit" element={<SubmitAssignmentPage />} />
            <Route path="/student/grades" element={<StudentGradesPage />} />
            <Route path="/student/analytics" element={<StudentAnalyticsPage />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.TA]} />}
          >
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/create-assignment" element={<CreateAssignmentPage />} />
            <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
            <Route path="/teacher/grade" element={<GradeSubmissionPage />} />
            <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}
          >
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/departments" element={<ManageDepartmentsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  );
};

export default App;
