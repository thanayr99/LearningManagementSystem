import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { ASSIGNMENT_STATUS } from "../../utils/constants";

const CreateAssignmentPage = () => {
  const { currentUser } = useAuth();
  const { assignments, upsertAssignment, deleteAssignment, publishAssignment } = useData();
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    deadline: "",
    maxMarks: 100,
    status: ASSIGNMENT_STATUS.DRAFT,
    rubric: [{ id: "new1", criteriaName: "", maxMarks: 0 }],
    referenceFiles: []
  });

  const [message, setMessage] = useState("");

  const addRubric = () => {
    setForm((s) => ({
      ...s,
      rubric: [...s.rubric, { id: `new${Date.now()}`, criteriaName: "", maxMarks: 0 }]
    }));
  };

  const updateRubric = (index, key, value) => {
    setForm((s) => ({
      ...s,
      rubric: s.rubric.map((r, i) => (i === index ? { ...r, [key]: value } : r))
    }));
  };

  const removeRubric = (index) => {
    setForm((s) => ({ ...s, rubric: s.rubric.filter((_, i) => i !== index) }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    upsertAssignment(
      {
        ...form,
        maxMarks: Number(form.maxMarks),
        deadline: new Date(form.deadline).toISOString(),
        rubric: form.rubric.map((r) => ({ ...r, maxMarks: Number(r.maxMarks) }))
      },
      currentUser.id
    );
    setMessage("Assignment saved.");
    setForm({
      title: "",
      description: "",
      subject: "",
      deadline: "",
      maxMarks: 100,
      status: ASSIGNMENT_STATUS.DRAFT,
      rubric: [{ id: "new1", criteriaName: "", maxMarks: 0 }],
      referenceFiles: []
    });
  };

  return (
    <Layout>
      <form className="card" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">Create Assignment</h1>
        {message ? <p className="mt-3 rounded bg-emerald-50 p-2 text-sm text-emerald-700">{message}</p> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Subject</label>
            <input className="input" required value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input className="input" type="datetime-local" required value={form.deadline} onChange={(e) => setForm((s) => ({ ...s, deadline: e.target.value }))} />
          </div>
          <div>
            <label className="label">Max Marks</label>
            <input className="input" type="number" min={1} required value={form.maxMarks} onChange={(e) => setForm((s) => ({ ...s, maxMarks: e.target.value }))} />
          </div>
        </div>
        <div className="mt-3">
          <label className="label">Description</label>
          <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
        </div>
        <div className="mt-3">
          <label className="label">Reference Files (comma separated)</label>
          <input
            className="input"
            value={form.referenceFiles.join(",")}
            onChange={(e) => setForm((s) => ({ ...s, referenceFiles: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))}
          />
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">Rubric Criteria</h2>
            <button type="button" className="btn-secondary" onClick={addRubric}>
              Add Criteria
            </button>
          </div>
          <div className="space-y-2">
            {form.rubric.map((row, idx) => (
              <div key={row.id} className="grid gap-2 md:grid-cols-3">
                <input className="input" placeholder="Criteria name" value={row.criteriaName} onChange={(e) => updateRubric(idx, "criteriaName", e.target.value)} />
                <input className="input" type="number" placeholder="Max marks" value={row.maxMarks} onChange={(e) => updateRubric(idx, "maxMarks", e.target.value)} />
                <button type="button" className="btn-secondary" onClick={() => removeRubric(idx)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary mt-5">Save Assignment</button>
      </form>

      <section className="card mt-4">
        <h2 className="text-lg font-semibold">My Assignments</h2>
        <div className="mt-3 space-y-2">
          {assignments
            .filter((a) => a.createdBy === currentUser.id)
            .map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 p-3">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-slate-400">{a.status}</p>
                </div>
                <div className="flex gap-2">
                  {a.status !== ASSIGNMENT_STATUS.PUBLISHED && (
                    <button className="btn-secondary" onClick={() => publishAssignment(a.id)}>
                      Publish
                    </button>
                  )}
                  <button className="btn-secondary" onClick={() => deleteAssignment(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </Layout>
  );
};

export default CreateAssignmentPage;


