import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ASSIGNMENT_STATUS,
  LOCAL_KEYS,
  ROLES,
  SEED_ASSIGNMENTS,
  SEED_DEPARTMENTS,
  SEED_NOTIFICATIONS,
  SEED_SUBMISSIONS,
  SEED_USERS,
  SUBMISSION_STATUS
} from "../utils/constants";

const DataContext = createContext(null);

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const readStorage = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const cosineSimilarityPercent = (textA, textB) => {
  const tokenize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const a = tokenize(textA);
  const b = tokenize(textB);
  if (!a.length || !b.length) return 0;

  const freq = (tokens) =>
    tokens.reduce((acc, token) => {
      acc[token] = (acc[token] || 0) + 1;
      return acc;
    }, {});

  const fa = freq(a);
  const fb = freq(b);
  const keys = new Set([...Object.keys(fa), ...Object.keys(fb)]);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  keys.forEach((k) => {
    const av = fa[k] || 0;
    const bv = fb[k] || 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  });
  const similarity = dot / (Math.sqrt(magA) * Math.sqrt(magB));
  return Number((Math.max(0, similarity) * 100).toFixed(2));
};

const aiSuggestion = (content, maxMarks) => {
  const tokens = content.toLowerCase();
  const keywords = ["analysis", "implementation", "result", "conclusion", "complexity", "testing"];
  const hits = keywords.reduce((sum, key) => (tokens.includes(key) ? sum + 1 : sum), 0);
  const scoreRatio = Math.min(1, 0.35 + hits * 0.1);
  const suggestedMarks = Math.round(maxMarks * scoreRatio);
  const suggestedFeedback =
    hits >= 4
      ? "Strong technical coverage. Refine clarity in the final summary."
      : "Basic coverage found. Add deeper analysis and validation to improve quality.";
  return { suggestedMarks, suggestedFeedback };
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState(() => readStorage(LOCAL_KEYS.USERS, SEED_USERS));
  const [assignments, setAssignments] = useState(() =>
    readStorage(LOCAL_KEYS.ASSIGNMENTS, SEED_ASSIGNMENTS)
  );
  const [submissions, setSubmissions] = useState(() =>
    readStorage(LOCAL_KEYS.SUBMISSIONS, SEED_SUBMISSIONS)
  );
  const [notifications, setNotifications] = useState(() =>
    readStorage(LOCAL_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState(() => readStorage(LOCAL_KEYS.AUDIT_LOGS, []));
  const [departments, setDepartments] = useState(() => readStorage("iawes_departments", SEED_DEPARTMENTS));

  useEffect(() => localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users)), [users]);
  useEffect(
    () => localStorage.setItem(LOCAL_KEYS.ASSIGNMENTS, JSON.stringify(assignments)),
    [assignments]
  );
  useEffect(
    () => localStorage.setItem(LOCAL_KEYS.SUBMISSIONS, JSON.stringify(submissions)),
    [submissions]
  );
  useEffect(
    () => localStorage.setItem(LOCAL_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),
    [notifications]
  );
  useEffect(() => localStorage.setItem(LOCAL_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs)), [auditLogs]);
  useEffect(() => localStorage.setItem("iawes_departments", JSON.stringify(departments)), [departments]);

  const addNotification = (userId, message) => {
    setNotifications((prev) => [
      {
        id: uid("n"),
        userId,
        message,
        readStatus: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const registerUser = (payload) => {
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error("Email already exists.");
    }
    const user = {
      id: uid("u"),
      ...payload,
      createdAt: new Date().toISOString()
    };
    setUsers((prev) => [...prev, user]);
    return user;
  };

  const updateProfile = (userId, changes) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...changes } : u)));
  };

  const upsertAssignment = (payload, actorId) => {
    if (payload.id) {
      setAssignments((prev) => prev.map((a) => (a.id === payload.id ? { ...a, ...payload } : a)));
      return payload.id;
    }
    const assignment = {
      ...payload,
      id: uid("a"),
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      status: payload.status || ASSIGNMENT_STATUS.DRAFT
    };
    setAssignments((prev) => [assignment, ...prev]);
    return assignment.id;
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== assignmentId));
  };

  const publishAssignment = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId ? { ...a, status: ASSIGNMENT_STATUS.PUBLISHED } : a
      )
    );
    users
      .filter((u) => u.role === ROLES.STUDENT)
      .forEach((student) =>
        addNotification(student.id, `Assignment ${assignment.title} has been published.`)
      );
  };

  const submitAssignment = ({ assignmentId, studentId, fileName, content, fileType, fileSize }) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) throw new Error("Assignment not found.");
    const studentSubmissions = submissions.filter(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );
    const versionNumber = studentSubmissions.length + 1;
    const submittedAt = new Date();
    const deadline = new Date(assignment.deadline);
    const isLate = submittedAt > deadline;
    const latePenalty = isLate ? Math.min(20, Math.round(assignment.maxMarks * 0.1)) : 0;

    const sameAssignment = submissions.filter((s) => s.assignmentId === assignmentId && s.contentText);
    let maxSimilarity = 0;
    sameAssignment.forEach((other) => {
      const sim = cosineSimilarityPercent(content || "", other.contentText || "");
      maxSimilarity = Math.max(maxSimilarity, sim);
    });

    const submission = {
      id: uid("s"),
      assignmentId,
      studentId,
      fileUrl: `uploads/${uid("file")}_${fileName}`,
      fileOriginalName: fileName,
      fileType: fileType || "application/octet-stream",
      fileSize: fileSize || 0,
      submittedAt: submittedAt.toISOString(),
      status: isLate ? SUBMISSION_STATUS.LATE : SUBMISSION_STATUS.SUBMITTED,
      totalMarks: null,
      feedbackText: "",
      gradedAt: null,
      similarityScore: Number(maxSimilarity.toFixed(2)),
      versionNumber,
      contentText: content,
      rubricScores: [],
      latePenaltyApplied: latePenalty
    };
    setSubmissions((prev) => [submission, ...prev]);
    return submission;
  };

  const gradeSubmission = ({ submissionId, graderId, rubricScores, feedbackText, approvedMarks }) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) throw new Error("Submission not found.");

    const assignment = assignments.find((a) => a.id === submission.assignmentId);
    const baseMarks = rubricScores.reduce((sum, row) => sum + Number(row.awardedMarks || 0), 0);
    const finalMarks = Math.max(
      0,
      Math.min(assignment?.maxMarks || baseMarks, Number(approvedMarks ?? baseMarks) - (submission.latePenaltyApplied || 0))
    );

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: SUBMISSION_STATUS.GRADED,
              totalMarks: finalMarks,
              feedbackText,
              gradedAt: new Date().toISOString(),
              rubricScores
            }
          : s
      )
    );

    setAuditLogs((prev) => [
      {
        id: uid("log"),
        submissionId,
        graderId,
        action: "GRADE_SUBMISSION",
        createdAt: new Date().toISOString(),
        payload: { rubricScores, feedbackText, approvedMarks: finalMarks }
      },
      ...prev
    ]);

    addNotification(submission.studentId, "Your submission has been graded.");
  };

  const getTeacherAnalytics = (teacherId) => {
    const ownAssignments = assignments.filter((a) => a.createdBy === teacherId);
    const ownSubmissions = submissions.filter((s) => ownAssignments.some((a) => a.id === s.assignmentId));
    const pendingCount = ownSubmissions.filter((s) => s.status !== SUBMISSION_STATUS.GRADED).length;
    const graded = ownSubmissions.filter((s) => s.status === SUBMISSION_STATUS.GRADED);
    const avgByAssignment = ownAssignments.map((a) => {
      const rows = graded.filter((s) => s.assignmentId === a.id);
      const avg =
        rows.length > 0 ? rows.reduce((sum, row) => sum + row.totalMarks, 0) / rows.length : 0;
      return { assignment: a.title, averageMarks: Number(avg.toFixed(2)) };
    });

    const groupedByStudent = {};
    graded.forEach((g) => {
      groupedByStudent[g.studentId] = groupedByStudent[g.studentId] || [];
      groupedByStudent[g.studentId].push(g.totalMarks);
    });
    const atRiskStudents = Object.entries(groupedByStudent)
      .map(([studentId, marks]) => ({
        studentId,
        avg: marks.reduce((sum, v) => sum + v, 0) / marks.length
      }))
      .filter((row) => row.avg < 40)
      .map((row) => ({
        student: users.find((u) => u.id === row.studentId)?.name || "Unknown",
        average: Number(row.avg.toFixed(2))
      }));

    return {
      totalAssignments: ownAssignments.length,
      pendingGrading: pendingCount,
      avgByAssignment,
      atRiskStudents
    };
  };

  const getStudentAnalytics = (studentId) => {
    const own = submissions
      .filter((s) => s.studentId === studentId && s.status === SUBMISSION_STATUS.GRADED)
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    const trend = own.map((s, idx) => ({
      attempt: idx + 1,
      marks: s.totalMarks
    }));
    const lateCount = submissions.filter((s) => s.studentId === studentId && s.status === SUBMISSION_STATUS.LATE).length;

    const strengths = own
      .filter((s) => s.totalMarks >= 70)
      .map((s) => assignments.find((a) => a.id === s.assignmentId)?.subject)
      .filter(Boolean);
    const weaknesses = own
      .filter((s) => s.totalMarks < 50)
      .map((s) => assignments.find((a) => a.id === s.assignmentId)?.subject)
      .filter(Boolean);

    return {
      trend,
      lateCount,
      strengths: [...new Set(strengths)],
      weaknesses: [...new Set(weaknesses)]
    };
  };

  const exportGradesCsv = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    const rows = submissions.filter((s) => s.assignmentId === assignmentId && s.status === SUBMISSION_STATUS.GRADED);
    const csvRows = [
      ["Student", "Version", "Status", "Marks", "Similarity", "Graded At"].join(","),
      ...rows.map((row) => {
        const student = users.find((u) => u.id === row.studentId)?.name || "Unknown";
        return [student, row.versionNumber, row.status, row.totalMarks, row.similarityScore, row.gradedAt].join(",");
      })
    ];
    return {
      filename: `${(assignment?.title || "grades").replace(/\s+/g, "_").toLowerCase()}.csv`,
      content: csvRows.join("\n")
    };
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, readStatus: true } : n))
    );
  };

  const runDeadlineReminderSweep = () => {
    const now = new Date();
    assignments.forEach((assignment) => {
      if (assignment.status !== ASSIGNMENT_STATUS.PUBLISHED) return;
      const deadline = new Date(assignment.deadline);
      const diffHours = (deadline - now) / (1000 * 60 * 60);
      if (diffHours > 0 && diffHours <= 24) {
        users
          .filter((u) => u.role === ROLES.STUDENT)
          .forEach((student) =>
            addNotification(student.id, `Reminder: ${assignment.title} deadline is within 24 hours.`)
          );
      }
    });
  };

  const addDepartment = (name) => {
    if (!name?.trim()) return;
    if (departments.includes(name.trim())) return;
    setDepartments((prev) => [...prev, name.trim()]);
  };

  const resetDemoData = () => {
    setUsers(SEED_USERS);
    setAssignments(SEED_ASSIGNMENTS);
    setSubmissions(SEED_SUBMISSIONS);
    setNotifications(SEED_NOTIFICATIONS);
    setAuditLogs([]);
    setDepartments(SEED_DEPARTMENTS);
  };

  const value = useMemo(
    () => ({
      users,
      assignments,
      submissions,
      notifications,
      auditLogs,
      departments,
      registerUser,
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
      resetDemoData
    }),
    [users, assignments, submissions, notifications, auditLogs, departments]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
