import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import { useData } from "../../context/DataContext";

const TeacherDashboard = () => {
  const { getTeacherAnalytics } = useData();
  const [analytics, setAnalytics] = useState({
    totalAssignments: 0,
    pendingGrading: 0,
    atRiskStudents: []
  });

  useEffect(() => {
    const load = async () => {
      const data = await getTeacherAnalytics();
      setAnalytics(data || { totalAssignments: 0, pendingGrading: 0, atRiskStudents: [] });
    };
    load();
  }, []);

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


