import Layout from "../../components/Layout";
import { useData } from "../../context/DataContext";
import { ASSIGNMENT_STATUS } from "../../utils/constants";

const StudentAssignmentsPage = () => {
  const { assignments } = useData();

  return (
    <Layout>
      <div className="card">
        <h1 className="text-xl font-semibold">Assignments</h1>
        <div className="mt-4 space-y-3">
          {assignments
            .filter((a) => a.status === ASSIGNMENT_STATUS.PUBLISHED)
            .map((assignment) => (
              <article key={assignment.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-slate-800">{assignment.title}</h2>
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs">{assignment.subject}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{assignment.description}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Deadline: <span className="font-medium">{new Date(assignment.deadline).toLocaleString()}</span>
                </p>
                <p className="text-sm text-slate-600">Max Marks: {assignment.maxMarks}</p>
              </article>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default StudentAssignmentsPage;


