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
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setForm((s) => ({ ...s, fileName: "" }));
      return;
    }
    setSelectedFile(file);
    setForm((s) => ({ ...s, fileName: file.name }));

    // Auto-fill content for plain text files to improve similarity check quality.
    if (file.type.startsWith("text/")) {
      try {
        const text = await file.text();
        setForm((s) => ({ ...s, content: text.slice(0, 10000) }));
      } catch {
        // Keep manual content entry if reading fails.
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!selectedFile) {
      setError("Please choose a file to upload.");
      return;
    }
    try {
      const submission = submitAssignment({
        assignmentId: form.assignmentId,
        studentId: currentUser.id,
        fileName: form.fileName,
        content: form.content,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      });
      const flagged = submission.similarityScore > 60 ? " Potential plagiarism flagged." : "";
      setMessage(
        `Submitted successfully (Version ${submission.versionNumber}, Similarity ${submission.similarityScore}%).${flagged}`
      );
      setForm({ assignmentId: "", fileName: "", content: "" });
      setSelectedFile(null);
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
          <label className="label">Upload File</label>
          <input
            className="input"
            type="file"
            accept=".pdf,.txt,.doc,.docx,.md"
            onChange={onFileChange}
            required
          />
          {selectedFile ? (
            <p className="mt-2 text-xs text-slate-500">
              Selected: {selectedFile.name} ({Math.ceil(selectedFile.size / 1024)} KB)
            </p>
          ) : null}
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
          <label className="label">Extracted Text Content (optional, used for similarity check)</label>
          <textarea
            className="input min-h-36"
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


