import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const TeacherAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const { getTeacherAnalytics } = useData();
  const analytics = getTeacherAnalytics(currentUser.id);

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Assignments" value={analytics.totalAssignments} />
        <StatCard title="Pending Grading" value={analytics.pendingGrading} />
        <StatCard title="At-risk Students" value={analytics.atRiskStudents.length} />
      </div>

      <div className="card mt-4">
        <h2 className="section-title">Average Marks by Assignment</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.avgByAssignment}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="assignment" tick={{ fontSize: 12, fill: "#717b9a" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#717b9a" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="averageMarks" fill="#8f7cff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherAnalyticsPage;


