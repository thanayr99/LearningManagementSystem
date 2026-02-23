import { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { ASSIGNMENT_STATUS } from "../../utils/constants";

const SubmitAssignmentPage = () => {
  const { currentUser } = useAuth();
  const { assignments, submitAssignment } = useData();
  const published = useMemo(
    () => assignments.filter((a) => a.status === ASSIGNMENT_STATUS.PUBLISHED),
    [assignments]
  );

  const [form, setForm] = useState({
    assignmentId: "",
    fileName: "",
    content: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const submission = submitAssignment({
        assignmentId: form.assignmentId,
        studentId: currentUser.id,
        fileName: form.fileName,
        content: form.content
      });
      const flagged = submission.similarityScore > 60 ? " Potential plagiarism flagged." : "";
      setMessage(
        `Submitted successfully (Version ${submission.versionNumber}, Similarity ${submission.similarityScore}%).${flagged}`
      );
      setForm({ assignmentId: "", fileName: "", content: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <form onSubmit={onSubmit} className="card max-w-2xl">
        <h1 className="text-xl font-semibold">Submit Assignment</h1>
        {error ? <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="mt-3 rounded bg-emerald-50 p-2 text-sm text-emerald-700">{message}</p> : null}
        <div className="mt-4">
          <label className="label">Assignment</label>
          <select
            className="input"
            required
            value={form.assignmentId}
            onChange={(e) => setForm((s) => ({ ...s, assignmentId: e.target.value }))}
          >
            <option value="">Select assignment</option>
            {published.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3">
          <label className="label">File Name</label>
          <input
            className="input"
            required
            placeholder="my-solution.pdf"
            value={form.fileName}
            onChange={(e) => setForm((s) => ({ ...s, fileName: e.target.value }))}
          />
        </div>
        <div className="mt-3">
          <label className="label">Extracted Text Content (for similarity check)</label>
          <textarea
            className="input min-h-36"
            required
            value={form.content}
            onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
          />
        </div>
        <button className="btn-primary mt-5">Submit / Resubmit</button>
      </form>
    </Layout>
  );
};

export default SubmitAssignmentPage;


