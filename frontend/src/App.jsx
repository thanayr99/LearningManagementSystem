import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import LandingPage from "./pages/public/LandingPage";
import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import NotFoundPage from "./pages/common/NotFoundPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAssignmentsPage from "./pages/student/StudentAssignmentsPage";
import SubmitAssignmentPage from "./pages/student/SubmitAssignmentPage";
import StudentGradesPage from "./pages/student/StudentGradesPage";
import StudentAnalyticsPage from "./pages/student/StudentAnalyticsPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateAssignmentPage from "./pages/teacher/CreateAssignmentPage";
import TeacherSubmissionsPage from "./pages/teacher/TeacherSubmissionsPage";
import GradeSubmissionPage from "./pages/teacher/GradeSubmissionPage";
import TeacherAnalyticsPage from "./pages/teacher/TeacherAnalyticsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage";
import ProfilePage from "./pages/common/ProfilePage";
import { ROLES } from "./utils/constants";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useData } from "./context/DataContext";

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
  );
};

export default App;
