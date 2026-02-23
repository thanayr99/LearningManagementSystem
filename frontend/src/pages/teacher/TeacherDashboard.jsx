import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const { getTeacherAnalytics } = useData();
  const analytics = getTeacherAnalytics(currentUser.id);

  return (
    <Layout>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Assignments" value={analytics.totalAssignments} />
        <StatCard title="Pending Grading" value={analytics.pendingGrading} />
        <StatCard title="At-risk Students" value={analytics.atRiskStudents.length} />
      </section>
    </Layout>
  );
};

export default TeacherDashboard;


