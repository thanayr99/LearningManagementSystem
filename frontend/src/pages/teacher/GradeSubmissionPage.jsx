import { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { SUBMISSION_STATUS } from "../../utils/constants";

const GradeSubmissionPage = () => {
  const { currentUser } = useAuth();
  const { assignments, submissions, users, gradeSubmission, aiSuggestion } = useData();

  const pending = useMemo(
    () =>
      submissions.filter((s) => {
        const assignment = assignments.find((a) => a.id === s.assignmentId);
        return assignment?.createdBy === currentUser.id && s.status !== SUBMISSION_STATUS.GRADED;
      }),
    [assignments, submissions, currentUser.id]
  );

  const [selectedId, setSelectedId] = useState("");
  const selectedSubmission = pending.find((p) => p.id === selectedId);
  const selectedAssignment = assignments.find((a) => a.id === selectedSubmission?.assignmentId);

  const [feedbackText, setFeedbackText] = useState("");
  const [approvedMarks, setApprovedMarks] = useState("");
  const [rubricScores, setRubricScores] = useState([]);
  const [suggestion, setSuggestion] = useState(null);

  const onSelect = (id) => {
    setSelectedId(id);
    const submission = pending.find((p) => p.id === id);
    const assignment = assignments.find((a) => a.id === submission?.assignmentId);
    setRubricScores(
      (assignment?.rubric || []).map((r) => ({ rubricId: r.id, awardedMarks: 0, criteriaName: r.criteriaName }))
    );
    setFeedbackText("");
    setApprovedMarks("");
    setSuggestion(null);
  };

  const updateScore = (rubricId, val) => {
    setRubricScores((prev) => prev.map((r) => (r.rubricId === rubricId ? { ...r, awardedMarks: Number(val) } : r)));
  };

  const getBase = () => rubricScores.reduce((sum, r) => sum + Number(r.awardedMarks || 0), 0);

  const runAi = () => {
    if (!selectedSubmission || !selectedAssignment) return;
    const result = aiSuggestion(selectedSubmission.contentText || "", selectedAssignment.maxMarks);
    setSuggestion(result);
    setApprovedMarks(result.suggestedMarks);
    setFeedbackText(result.suggestedFeedback);
  };

  const onGrade = () => {
    if (!selectedSubmission) return;
    gradeSubmission({
      submissionId: selectedSubmission.id,
      graderId: currentUser.id,
      rubricScores,
      feedbackText,
      approvedMarks: Number(approvedMarks || getBase())
    });
    setSelectedId("");
    setFeedbackText("");
    setApprovedMarks("");
    setRubricScores([]);
    setSuggestion(null);
  };

  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <h1 className="text-lg font-semibold">Pending Submissions</h1>
          <div className="mt-3 space-y-2">
            {pending.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`w-full rounded-lg border p-3 text-left ${
                  selectedId === p.id ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:bg-white"
                }`}
              >
                <p className="font-medium">
                  {users.find((u) => u.id === p.studentId)?.name} - {assignments.find((a) => a.id === p.assignmentId)?.title}
                </p>
                <p className="text-xs text-slate-400">
                  Similarity: {p.similarityScore}% | Version: {p.versionNumber}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold">Grade Submission</h2>
          {!selectedSubmission ? (
            <p className="mt-3 text-sm text-slate-400">Select a submission.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {(selectedAssignment?.rubric || []).map((r) => (
                <div key={r.id} className="grid grid-cols-3 items-center gap-2">
                  <p className="text-sm">{r.criteriaName}</p>
                  <p className="text-xs text-slate-400">/ {r.maxMarks}</p>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={r.maxMarks}
                    value={rubricScores.find((x) => x.rubricId === r.id)?.awardedMarks ?? 0}
                    onChange={(e) => updateScore(r.id, e.target.value)}
                  />
                </div>
              ))}
              <div>
                <label className="label">Approved Marks (after AI/manual review)</label>
                <input className="input" type="number" value={approvedMarks} onChange={(e) => setApprovedMarks(e.target.value)} />
              </div>
              <div>
                <label className="label">Feedback</label>
                <textarea className="input min-h-24" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary" onClick={runAi}>
                  AI Suggestion
                </button>
                <button type="button" className="btn-primary" onClick={onGrade}>
                  Finalize Grade
                </button>
              </div>
              {suggestion ? (
                <p className="rounded bg-white p-2 text-sm text-slate-700">
                  AI suggested {suggestion.suggestedMarks} marks and feedback text.
                </p>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default GradeSubmissionPage;


