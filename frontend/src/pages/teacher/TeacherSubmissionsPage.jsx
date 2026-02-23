import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const TeacherSubmissionsPage = () => {
  const { currentUser } = useAuth();
  const { assignments, submissions, users, exportGradesCsv } = useData();
  const [selectedAssignment, setSelectedAssignment] = useState("");

  const ownAssignments = assignments.filter((a) => a.createdBy === currentUser.id);
  const list = submissions.filter((s) => {
    const owned = ownAssignments.some((a) => a.id === s.assignmentId);
    const filterOk = selectedAssignment ? s.assignmentId === selectedAssignment : true;
    return owned && filterOk;
  });

  const onExport = () => {
    if (!selectedAssignment) return;
    const { filename, content } = exportGradesCsv(selectedAssignment);
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="card">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="section-title">Submissions</h1>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <select
              className="input w-full sm:w-72"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              <option value="">All assignments</option>
              {ownAssignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <button className="btn-primary" onClick={onExport} disabled={!selectedAssignment}>
              Export CSV
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[820px] text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-2">Student</th>
                <th className="py-2">Assignment</th>
                <th className="py-2">Version</th>
                <th className="py-2">Status</th>
                <th className="py-2">Similarity</th>
                <th className="py-2">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2">{users.find((u) => u.id === row.studentId)?.name || "-"}</td>
                  <td className="py-2">{assignments.find((a) => a.id === row.assignmentId)?.title || "-"}</td>
                  <td className="py-2">
                    <span className="chip">v{row.versionNumber}</span>
                  </td>
                  <td className="py-2">
                    <span className="chip">{row.status}</span>
                  </td>
                  <td className={`py-2 ${row.similarityScore > 60 ? "font-semibold text-red-600" : ""}`}>
                    {row.similarityScore}%
                  </td>
                  <td className="py-2">{new Date(row.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherSubmissionsPage;


