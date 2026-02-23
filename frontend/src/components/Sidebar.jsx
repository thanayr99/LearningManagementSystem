import { NavLink } from "react-router-dom";
import { ROLES } from "../utils/constants";

const roleMenus = {
  [ROLES.STUDENT]: [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/assignments", label: "Assignments" },
    { to: "/student/submit", label: "Submit Assignment" },
    { to: "/student/grades", label: "Grades" },
    { to: "/student/analytics", label: "Analytics" }
  ],
  [ROLES.TEACHER]: [
    { to: "/teacher/dashboard", label: "Dashboard" },
    { to: "/teacher/create-assignment", label: "Create Assignment" },
    { to: "/teacher/submissions", label: "View Submissions" },
    { to: "/teacher/grade", label: "Grade Submissions" },
    { to: "/teacher/analytics", label: "Analytics" }
  ],
  [ROLES.TA]: [
    { to: "/teacher/dashboard", label: "TA Dashboard" },
    { to: "/teacher/submissions", label: "View Submissions" },
    { to: "/teacher/grade", label: "Assist Grading" }
  ],
  [ROLES.SUPER_ADMIN]: [
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/departments", label: "Manage Departments" }
  ]
};

const Sidebar = ({ role }) => {
  const links = roleMenus[role] || [];
  return (
    <aside className="w-full border-r border-slate-200 bg-white lg:h-screen lg:w-64">
      <div className="border-b border-slate-200 px-5 py-5">
        <h1 className="text-lg font-semibold text-[#5e54d6]">IAWES</h1>
        <p className="text-xs text-slate-500">Academic Workflow Platform</p>
      </div>
      <nav className="p-3">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                isActive
                  ? "bg-[#ece9ff] text-[#2f2b66]"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="inline-block h-2 w-2 rounded-full bg-current opacity-60" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


