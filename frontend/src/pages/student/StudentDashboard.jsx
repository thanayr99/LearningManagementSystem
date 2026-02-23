import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { SUBMISSION_STATUS } from "../../utils/constants";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();

  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);
  const graded = mySubmissions.filter((s) => s.status === SUBMISSION_STATUS.GRADED);
  const late = mySubmissions.filter((s) => s.status === SUBMISSION_STATUS.LATE).length;
  const avg =
    graded.length > 0
      ? (graded.reduce((sum, row) => sum + row.totalMarks, 0) / graded.length).toFixed(2)
      : "0.00";

  return (
    <Layout>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Published Assignments" value={assignments.length} />
        <StatCard title="My Submissions" value={mySubmissions.length} />
        <StatCard title="Average Marks" value={avg} helper={`Late submissions: ${late}`} />
      </section>
    </Layout>
  );
};

export default StudentDashboard;


