/**
 * EduPlatform User Roles
 */
export const USER_ROLES = Object.freeze({
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  CONTENT_MANAGER: 'content_manager',
  INSTRUCTOR: 'instructor',
  QUESTION_MANAGER: 'question_manager',
  REVIEWER: 'reviewer',
  MODERATOR: 'moderator',
  STUDENT: 'student',
});

/**
 * Content Lifecycle Statuses
 */
export const CONTENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
});

/**
 * Question Types
 */
export const QUESTION_TYPES = Object.freeze({
  MCQ: 'mcq',
  MSQ: 'msq',
  NUMERICAL: 'numerical',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  SUBJECTIVE: 'subjective',
});

/**
 * Difficulty Levels
 */
export const DIFFICULTY_LEVELS = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
});

/**
 * Course Difficulty Levels
 */
export const COURSE_DIFFICULTY = Object.freeze({
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
});

/**
 * Study Material Types
 */
export const STUDY_MATERIAL_TYPES = Object.freeze({
  PDF: 'pdf',
  PPT: 'ppt',
  NOTES: 'notes',
  DOC: 'doc',
});

/**
 * Quiz Types
 */
export const QUIZ_TYPES = Object.freeze({
  PRACTICE: 'practice',
  GRADED: 'graded',
  TIMED: 'timed',
});

/**
 * Test Types
 */
export const TEST_TYPES = Object.freeze({
  FULL_MOCK: 'full_mock',
  SUBJECT_TEST: 'subject_test',
  CHAPTER_TEST: 'chapter_test',
  CUSTOM: 'custom',
});

/**
 * Test and Quiz Attempt Statuses
 */
export const ATTEMPT_STATUS = Object.freeze({
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
  AUTO_SUBMITTED: 'auto_submitted',
  ABANDONED: 'abandoned',
});

/**
 * Announcement Priority Levels
 */
export const ANNOUNCEMENT_PRIORITY = Object.freeze({
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
});

/**
 * Sidebar Navigation Items for Student Portal
 */
export const SIDEBAR_MENU_STUDENT = [
  {
    label: 'Dashboard',
    path: '/student/dashboard',
    icon: 'HiOutlineHome',
  },
  {
    label: 'My Courses',
    path: '/student/courses',
    icon: 'HiOutlineAcademicCap',
  },
  {
    label: 'Study Materials',
    path: '/student/materials',
    icon: 'HiOutlineBookOpen',
  },
  {
    label: 'Lectures',
    path: '/student/lectures',
    icon: 'HiOutlineVideoCamera',
  },
  {
    label: 'Quizzes',
    path: '/student/quizzes',
    icon: 'HiOutlineClipboardDocumentCheck',
  },
  {
    label: 'Question Bank',
    path: '/student/questions',
    icon: 'HiOutlineQuestionMarkCircle',
  },
  {
    label: 'Question Papers',
    path: '/student/question-papers',
    icon: 'HiOutlineDocumentText',
  },
  {
    label: 'Tests & Exams',
    path: '/student/tests',
    icon: 'HiOutlineClipboardDocumentList',
  },
  {
    label: 'Discussions',
    path: '/student/discussions',
    icon: 'HiOutlineChatBubbleLeftRight',
  },
  {
    label: 'Polls',
    path: '/student/polls',
    icon: 'HiOutlineChartBar',
  },
  {
    label: 'Profile',
    path: '/student/profile',
    icon: 'HiOutlineUser',
  },
  {
    label: 'Performance',
    path: '/student/performance',
    icon: 'HiOutlineChartPie',
  },
  {
    label: 'Leaderboard',
    path: '/student/leaderboard',
    icon: 'HiOutlineTrophy',
  },
];

/**
 * Sidebar Navigation Items for Admin Portal
 */
export const SIDEBAR_MENU_ADMIN = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'HiOutlineHome',
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: 'HiOutlineUsers',
  },
  {
    label: 'Courses',
    path: '/admin/courses',
    icon: 'HiOutlineAcademicCap',
  },
  {
    label: 'Subjects',
    path: '/admin/subjects',
    icon: 'HiOutlineBookmark',
  },
  {
    label: 'Materials',
    path: '/admin/materials',
    icon: 'HiOutlineBookOpen',
  },
  {
    label: 'Lectures',
    path: '/admin/lectures',
    icon: 'HiOutlineVideoCamera',
  },
  {
    label: 'Questions',
    path: '/admin/questions',
    icon: 'HiOutlineQuestionMarkCircle',
  },
  {
    label: 'Question Papers',
    path: '/admin/question-papers',
    icon: 'HiOutlineDocumentText',
  },
  {
    label: 'Quizzes',
    path: '/admin/quizzes',
    icon: 'HiOutlineClipboardDocumentCheck',
  },
  {
    label: 'Tests',
    path: '/admin/tests',
    icon: 'HiOutlineClipboardDocumentList',
  },
  {
    label: 'Discussions',
    path: '/admin/discussions',
    icon: 'HiOutlineChatBubbleLeftRight',
  },
  {
    label: 'Polls',
    path: '/admin/polls',
    icon: 'HiOutlineChartBar',
  },
  {
    label: 'Announcements',
    path: '/admin/announcements',
    icon: 'HiOutlineMegaphone',
  },
  {
    label: 'Roles & Permissions',
    path: '/admin/roles',
    icon: 'HiOutlineShieldCheck',
  },
];

/**
 * Sidebar Navigation Items for Instructor Portal
 */
export const SIDEBAR_MENU_INSTRUCTOR = [
  {
    label: 'Dashboard',
    path: '/instructor/dashboard',
    icon: 'HiOutlineHome',
  },
  {
    label: 'Courses',
    path: '/instructor/courses',
    icon: 'HiOutlineAcademicCap',
  },
  {
    label: 'Materials',
    path: '/instructor/materials',
    icon: 'HiOutlineBookOpen',
  },
  {
    label: 'Lectures',
    path: '/instructor/lectures',
    icon: 'HiOutlineVideoCamera',
  },
  {
    label: 'Question Bank',
    path: '/instructor/questions',
    icon: 'HiOutlineQuestionMarkCircle',
  },
  {
    label: 'Quizzes',
    path: '/instructor/quizzes',
    icon: 'HiOutlineClipboardDocumentCheck',
  },
  {
    label: 'Tests',
    path: '/instructor/tests',
    icon: 'HiOutlineClipboardDocumentList',
  },
  {
    label: 'Discussions',
    path: '/instructor/discussions',
    icon: 'HiOutlineChatBubbleLeftRight',
  },
  {
    label: 'Polls',
    path: '/instructor/polls',
    icon: 'HiOutlineChartBar',
  },
  {
    label: 'Announcements',
    path: '/instructor/announcements',
    icon: 'HiOutlineMegaphone',
  },
  {
    label: 'Analytics',
    path: '/instructor/analytics',
    icon: 'HiOutlineChartPie',
  },
];
