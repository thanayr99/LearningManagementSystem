import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const StudentAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const { getStudentAnalytics } = useData();
  const analytics = getStudentAnalytics(currentUser.id);

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Late Submissions" value={analytics.lateCount} />
        <StatCard title="Strength Areas" value={analytics.strengths.join(", ") || "N/A"} />
        <StatCard title="Weak Areas" value={analytics.weaknesses.join(", ") || "N/A"} />
      </div>
      <div className="card mt-4">
        <h2 className="section-title">Performance Trend</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.trend}>
              <XAxis dataKey="attempt" stroke="#98a0ba" tickLine={false} axisLine={false} />
              <YAxis stroke="#98a0ba" tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="marks" stroke="#8f7cff" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default StudentAnalyticsPage;


