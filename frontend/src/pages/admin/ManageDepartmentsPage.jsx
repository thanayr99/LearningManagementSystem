import { useState } from "react";
import Layout from "../../components/Layout";
import { useData } from "../../context/DataContext";

const ManageDepartmentsPage = () => {
  const { departments, addDepartment } = useData();
  const [name, setName] = useState("");

  const onAdd = (e) => {
    e.preventDefault();
    addDepartment(name);
    setName("");
  };

  return (
    <Layout>
      <div className="card max-w-2xl">
        <h1 className="text-xl font-semibold">Manage Departments</h1>
        <form className="mt-4 flex gap-2" onSubmit={onAdd}>
          <input className="input" placeholder="Add department" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn-primary">Add</button>
        </form>
        <ul className="mt-4 space-y-2">
          {departments.map((dept) => (
            <li key={dept} className="rounded border border-slate-200 px-3 py-2 text-sm">
              {dept}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ManageDepartmentsPage;


