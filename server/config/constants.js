/**
 * EduPlatform System Constants
 */

const USER_ROLES = Object.freeze({
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  CONTENT_MANAGER: 'content_manager',
  INSTRUCTOR: 'instructor',
  QUESTION_MANAGER: 'question_manager',
  REVIEWER: 'reviewer',
  MODERATOR: 'moderator',
  STUDENT: 'student'
});

const CONTENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
});

const QUESTION_TYPES = Object.freeze({
  MCQ: 'mcq',
  MSQ: 'msq',
  NUMERICAL: 'numerical',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  SUBJECTIVE: 'subjective'
});

const DIFFICULTY_LEVELS = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
});

const COURSE_DIFFICULTY = Object.freeze({
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
});

const STUDY_MATERIAL_TYPES = Object.freeze({
  PDF: 'pdf',
  PPT: 'ppt',
  NOTES: 'notes',
  DOC: 'doc'
});

const QUIZ_TYPES = Object.freeze({
  PRACTICE: 'practice',
  GRADED: 'graded',
  TIMED: 'timed'
});

const SHOW_ANSWERS_OPTIONS = Object.freeze({
  AFTER_EACH: 'after_each',
  AFTER_SUBMIT: 'after_submit',
  NEVER: 'never'
});

const TEST_TYPES = Object.freeze({
  FULL_MOCK: 'full_mock',
  SUBJECT_TEST: 'subject_test',
  CHAPTER_TEST: 'chapter_test',
  CUSTOM: 'custom'
});

const ATTEMPT_STATUS = Object.freeze({
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
  AUTO_SUBMITTED: 'auto_submitted',
  ABANDONED: 'abandoned'
});

const DISCUSSION_STATUS = Object.freeze({
  ACTIVE: 'active',
  REPORTED: 'reported',
  HIDDEN: 'hidden',
  DELETED: 'deleted'
});

const ENROLLMENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped'
});

const BOOKMARK_TYPES = Object.freeze({
  QUESTION: 'question',
  STUDY_MATERIAL: 'study_material',
  LECTURE: 'lecture',
  DISCUSSION: 'discussion'
});

const ACTIVITY_TYPES = Object.freeze({
  COURSE_VIEW: 'course_view',
  LECTURE_WATCH: 'lecture_watch',
  QUIZ_ATTEMPT: 'quiz_attempt',
  TEST_ATTEMPT: 'test_attempt',
  MATERIAL_READ: 'material_read',
  QUESTION_PRACTICE: 'question_practice',
  DISCUSSION_POST: 'discussion_post'
});

const ANNOUNCEMENT_AUDIENCE = Object.freeze({
  ALL: 'all',
  COURSE: 'course',
  ROLE: 'role'
});

const ANNOUNCEMENT_PRIORITY = Object.freeze({
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
});

const ACTIONS = Object.freeze({
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  REVIEW: 'review',
  PUBLISH: 'publish',
  ARCHIVE: 'archive',
  MANAGE: 'manage'
});

const RESOURCES = Object.freeze({
  USERS: 'users',
  COURSES: 'courses',
  SUBJECTS: 'subjects',
  CHAPTERS: 'chapters',
  TOPICS: 'topics',
  STUDY_MATERIALS: 'study_materials',
  LECTURES: 'lectures',
  QUESTIONS: 'questions',
  QUESTION_PAPERS: 'question_papers',
  QUIZZES: 'quizzes',
  TESTS: 'tests',
  DISCUSSIONS: 'discussions',
  POLLS: 'polls',
  ENROLLMENTS: 'enrollments',
  ANNOUNCEMENTS: 'announcements',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
});

const PERMISSIONS = Object.freeze({
  [RESOURCES.USERS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.MANAGE],
  [RESOURCES.COURSES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH, ACTIONS.ARCHIVE],
  [RESOURCES.SUBJECTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.CHAPTERS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.TOPICS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.STUDY_MATERIALS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.REVIEW, ACTIONS.PUBLISH],
  [RESOURCES.LECTURES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.REVIEW, ACTIONS.PUBLISH],
  [RESOURCES.QUESTIONS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.REVIEW, ACTIONS.PUBLISH],
  [RESOURCES.QUESTION_PAPERS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
  [RESOURCES.QUIZZES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
  [RESOURCES.TESTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
  [RESOURCES.DISCUSSIONS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.MANAGE],
  [RESOURCES.POLLS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.ENROLLMENTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.ANNOUNCEMENTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.ANALYTICS]: [ACTIONS.READ],
  [RESOURCES.SETTINGS]: [ACTIONS.READ, ACTIONS.UPDATE]
});

module.exports = {
  USER_ROLES,
  CONTENT_STATUS,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  COURSE_DIFFICULTY,
  STUDY_MATERIAL_TYPES,
  QUIZ_TYPES,
  SHOW_ANSWERS_OPTIONS,
  TEST_TYPES,
  ATTEMPT_STATUS,
  DISCUSSION_STATUS,
  ENROLLMENT_STATUS,
  BOOKMARK_TYPES,
  ACTIVITY_TYPES,
  ANNOUNCEMENT_AUDIENCE,
  ANNOUNCEMENT_PRIORITY,
  ACTIONS,
  RESOURCES,
  PERMISSIONS
};
