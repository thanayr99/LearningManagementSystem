import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const StudentGradesPage = () => {
  const { currentUser } = useAuth();
  const { submissions, assignments } = useData();
  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  return (
    <Layout>
      <div className="card">
        <h1 className="section-title">My Grades & Submission History</h1>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-2">Assignment</th>
                <th className="py-2">Version</th>
                <th className="py-2">Status</th>
                <th className="py-2">Marks</th>
                <th className="py-2">Similarity</th>
                <th className="py-2">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {mySubmissions.map((s) => (
                <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2">{assignments.find((a) => a.id === s.assignmentId)?.title || "-"}</td>
                  <td className="py-2">
                    <span className="chip">v{s.versionNumber}</span>
                  </td>
                  <td className="py-2">
                    <span className="chip">{s.status}</span>
                  </td>
                  <td className="py-2">{s.totalMarks ?? "-"}</td>
                  <td className="py-2">{s.similarityScore}%</td>
                  <td className="py-2">{s.feedbackText || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default StudentGradesPage;


