export const ROLES = {
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  TEACHER: "ROLE_TEACHER",
  STUDENT: "ROLE_STUDENT",
  TA: "ROLE_TA"
};

export const ASSIGNMENT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED"
};

export const SUBMISSION_STATUS = {
  SUBMITTED: "SUBMITTED",
  LATE: "LATE",
  GRADED: "GRADED"
};

export const LOCAL_KEYS = {
  USERS: "iawes_users",
  ASSIGNMENTS: "iawes_assignments",
  SUBMISSIONS: "iawes_submissions",
  NOTIFICATIONS: "iawes_notifications",
  AUDIT_LOGS: "iawes_audit_logs",
  CURRENT_USER: "iawes_current_user"
};

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);

export const SEED_USERS = [
  {
    id: "u1",
    name: "System Admin",
    email: "super@iawes.com",
    password: "admin123",
    role: ROLES.SUPER_ADMIN,
    department: "Administration",
    createdAt: now.toISOString()
  },
  {
    id: "u2",
    name: "Dr. Sarah Lee",
    email: "teacher@iawes.com",
    password: "teacher123",
    role: ROLES.TEACHER,
    department: "Computer Science",
    createdAt: now.toISOString()
  },
  {
    id: "u3",
    name: "Ava Johnson",
    email: "student@iawes.com",
    password: "student123",
    role: ROLES.STUDENT,
    department: "Computer Science",
    createdAt: now.toISOString()
  },
  {
    id: "u4",
    name: "TA Mike",
    email: "ta@iawes.com",
    password: "ta123",
    role: ROLES.TA,
    department: "Computer Science",
    createdAt: now.toISOString()
  }
];

export const SEED_ASSIGNMENTS = [
  {
    id: "a1",
    title: "Data Structures Performance Study",
    description:
      "Analyze and compare AVL Trees, Red-Black Trees, and Hash Tables on lookup complexity.",
    subject: "Data Structures",
    deadline: nextWeek.toISOString(),
    maxMarks: 100,
    createdBy: "u2",
    createdAt: now.toISOString(),
    status: ASSIGNMENT_STATUS.PUBLISHED,
    rubric: [
      { id: "r1", criteriaName: "Problem Understanding", maxMarks: 25 },
      { id: "r2", criteriaName: "Implementation Quality", maxMarks: 45 },
      { id: "r3", criteriaName: "Report & Conclusion", maxMarks: 30 }
    ],
    referenceFiles: ["ds-guidelines.pdf"]
  },
  {
    id: "a2",
    title: "Operating Systems Lab Report",
    description: "Write a scheduler simulation and compare FCFS vs Round Robin.",
    subject: "Operating Systems",
    deadline: tomorrow.toISOString(),
    maxMarks: 50,
    createdBy: "u2",
    createdAt: now.toISOString(),
    status: ASSIGNMENT_STATUS.PUBLISHED,
    rubric: [
      { id: "r4", criteriaName: "Correctness", maxMarks: 20 },
      { id: "r5", criteriaName: "Complexity", maxMarks: 15 },
      { id: "r6", criteriaName: "Documentation", maxMarks: 15 }
    ],
    referenceFiles: ["os-template.docx"]
  }
];

export const SEED_SUBMISSIONS = [
  {
    id: "s1",
    assignmentId: "a1",
    studentId: "u3",
    fileUrl: "uploads/ava-ds-v1.pdf",
    fileOriginalName: "ava-ds-v1.pdf",
    fileType: "application/pdf",
    fileSize: 153442,
    submittedAt: now.toISOString(),
    status: SUBMISSION_STATUS.GRADED,
    totalMarks: 82,
    feedbackText: "Good understanding. Improve result analysis details.",
    gradedAt: now.toISOString(),
    similarityScore: 14,
    versionNumber: 1,
    rubricScores: [
      { rubricId: "r1", awardedMarks: 22 },
      { rubricId: "r2", awardedMarks: 36 },
      { rubricId: "r3", awardedMarks: 24 }
    ],
    latePenaltyApplied: 0
  }
];

export const SEED_NOTIFICATIONS = [
  {
    id: "n1",
    userId: "u3",
    message: "Assignment Data Structures Performance Study has been published.",
    readStatus: false,
    createdAt: now.toISOString()
  }
];

export const SEED_DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mathematics",
  "Mechanical"
];
