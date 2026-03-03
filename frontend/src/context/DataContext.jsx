import { createContext, useContext, useEffect, useMemo, useState } from "react";
import httpClient from "../services/httpClient";
import { LOCAL_KEYS, ROLES } from "../utils/constants";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs] = useState([]);
  const [departments, setDepartments] = useState([]);

  const safe = async (fn, fallback = null) => {
    try {
      return await fn();
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
      }
      return fallback;
    }
  };

  const fetchAssignments = async () => {
    const { data } = await httpClient.get("/assignments");
    setAssignments(data || []);
    return data || [];
  };

  const fetchDepartments = async () => {
    const { data } = await httpClient.get("/users/departments");
    setDepartments((data || []).map((d) => d.name));
  };

  const fetchNotifications = async () => {
    const { data } = await httpClient.get("/users/notifications");
    setNotifications(data || []);
  };

  const fetchUsers = async () => {
    const { data } = await httpClient.get("/users");
    setUsers(data || []);
  };

  const fetchStudentSubmissions = async () => {
    const { data } = await httpClient.get("/submissions/student");
    setSubmissions(data || []);
  };

  const fetchTeacherSubmissions = async (assignmentRows) => {
    const mine = (assignmentRows || []).filter((a) => a.createdBy === currentUser?.id);
    const result = [];
    for (const row of mine) {
      const { data } = await httpClient.get(`/submissions/assignment/${row.id}`);
      result.push(...(data || []));
    }
    setSubmissions(result);
  };

  const loadAll = async () => {
    if (!isAuthenticated || !currentUser) {
      setUsers([]);
      setAssignments([]);
      setSubmissions([]);
      setNotifications([]);
      setDepartments([]);
      return;
    }
    await safe(async () => {
      const rows = await fetchAssignments();
      await Promise.all([fetchDepartments(), fetchNotifications()]);
      if (currentUser.role === ROLES.STUDENT) await fetchStudentSubmissions();
      if (currentUser.role === ROLES.TEACHER || currentUser.role === ROLES.TA) {
        await fetchTeacherSubmissions(rows);
      }
      if (currentUser.role === ROLES.SUPER_ADMIN) await fetchUsers();
    });
  };

  useEffect(() => {
    loadAll();
  }, [isAuthenticated, currentUser?.id, currentUser?.role]);

  const updateProfile = async (_userId, changes) => {
    await httpClient.put("/users/me", changes);
    await loadAll();
  };

  const upsertAssignment = async (payload) => {
    const body = {
      ...payload,
      deadline: payload.deadline,
      referenceFiles: payload.referenceFiles || [],
      rubric: payload.rubric || []
    };
    if (payload.id) {
      const { data } = await httpClient.put(`/assignments/${payload.id}`, body);
      await loadAll();
      return data.id;
    }
    const { data } = await httpClient.post("/assignments", body);
    await loadAll();
    return data.id;
  };

  const deleteAssignment = async (assignmentId) => {
    await httpClient.delete(`/assignments/${assignmentId}`);
    await loadAll();
  };

  const publishAssignment = async (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;
    await httpClient.put(`/assignments/${assignmentId}`, {
      ...assignment,
      status: "PUBLISHED",
      rubric: assignment.rubric || [],
      referenceFiles: assignment.referenceFiles || []
    });
    await loadAll();
  };

  const submitAssignment = async ({ assignmentId, file, content }) => {
    const form = new FormData();
    form.append("assignmentId", assignmentId);
    form.append("file", file);
    if (content) form.append("contentText", content);
    const { data } = await httpClient.post("/submissions", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    await loadAll();
    return data;
  };

  const gradeSubmission = async ({ submissionId, rubricScores, feedbackText, approvedMarks }) => {
    await httpClient.put(`/submissions/grade/${submissionId}`, {
      rubricScores,
      feedbackText,
      approvedMarks
    });
    await loadAll();
  };

  const getTeacherAnalytics = async () => {
    const { data } = await httpClient.get("/analytics/teacher");
    return data;
  };

  const getStudentAnalytics = async () => {
    const { data } = await httpClient.get("/analytics/student");
    return data;
  };

  const exportGradesCsv = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    const rows = submissions.filter((s) => s.assignmentId === assignmentId && s.status === "GRADED");
    const csvRows = [
      ["Student", "Version", "Status", "Marks", "Similarity", "Graded At"].join(","),
      ...rows.map((row) =>
        [
          row.studentName || "Unknown",
          row.versionNumber,
          row.status,
          row.totalMarks ?? "",
          row.similarityScore ?? "",
          row.gradedAt ?? ""
        ].join(",")
      )
    ];
    return {
      filename: `${(assignment?.title || "grades").replace(/\s+/g, "_").toLowerCase()}.csv`,
      content: csvRows.join("\n")
    };
  };

  const markNotificationRead = async (notificationId) => {
    await httpClient.put(`/users/notifications/${notificationId}/read`);
    await fetchNotifications();
  };

  const runDeadlineReminderSweep = () => {};

  const aiSuggestion = async (content, maxMarks) => {
    const { data } = await httpClient.post("/submissions/ai-suggest", { content, maxMarks });
    return data;
  };

  const addDepartment = async (name) => {
    if (!name?.trim()) return;
    await httpClient.post("/users/departments", { name: name.trim() });
    await fetchDepartments();
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_KEYS.CURRENT_USER);
    localStorage.removeItem(LOCAL_KEYS.TOKEN);
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      users,
      assignments,
      submissions,
      notifications,
      auditLogs,
      departments,
      updateProfile,
      upsertAssignment,
      deleteAssignment,
      publishAssignment,
      submitAssignment,
      gradeSubmission,
      getTeacherAnalytics,
      getStudentAnalytics,
      exportGradesCsv,
      markNotificationRead,
      runDeadlineReminderSweep,
      aiSuggestion,
      addDepartment,
      resetDemoData,
      refreshData: loadAll
    }),
    [users, assignments, submissions, notifications, auditLogs, departments, currentUser?.id]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
