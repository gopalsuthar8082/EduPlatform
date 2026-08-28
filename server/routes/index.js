const express = require('express');
const router = express.Router();

// Import Route Handlers
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const courseRoutes = require('./courses');
const subjectRoutes = require('./subjects');
const chapterRoutes = require('./chapters');
const topicRoutes = require('./topics');
const materialRoutes = require('./materials');
const lectureRoutes = require('./lectures');
const questionRoutes = require('./questions');
const questionPaperRoutes = require('./questionPapers');
const quizRoutes = require('./quizzes');
const testRoutes = require('./tests');
const discussionRoutes = require('./discussions');
const pollRoutes = require('./polls');
const dashboardRoutes = require('./dashboard');
const analyticsRoutes = require('./analytics');
const announcementRoutes = require('./announcements');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    message: 'EduPlatform API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// Mount Resource API Routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/courses', courseRoutes);
router.use('/subjects', subjectRoutes);
router.use('/chapters', chapterRoutes);
router.use('/topics', topicRoutes);
router.use('/study-materials', materialRoutes);
router.use('/lectures', lectureRoutes);
router.use('/questions', questionRoutes);
router.use('/question-papers', questionPaperRoutes);
router.use('/quizzes', quizRoutes);
router.use('/tests', testRoutes);
router.use('/discussions', discussionRoutes);
router.use('/polls', pollRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/announcements', announcementRoutes);

// API Info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'EduPlatform REST API',
    version: '1.0.0',
    description: 'Digital Education & CBT Examination Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      dashboard: '/api/dashboard',
      analytics: '/api/analytics',
      courses: '/api/courses',
      subjects: '/api/subjects',
      chapters: '/api/chapters',
      topics: '/api/topics',
      studyMaterials: '/api/study-materials',
      lectures: '/api/lectures',
      questions: '/api/questions',
      questionPapers: '/api/question-papers',
      quizzes: '/api/quizzes',
      tests: '/api/tests',
      discussions: '/api/discussions',
      polls: '/api/polls',
      announcements: '/api/announcements'
    }
  });
});

module.exports = router;
