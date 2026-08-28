const {
  User,
  Course,
  Subject,
  Question,
  StudyMaterial,
  Lecture,
  Quiz,
  QuizAttempt,
  Test,
  TestAttempt,
  Discussion,
  Enrollment,
  StudentActivity,
  Announcement
} = require('../models');
const { CONTENT_STATUS, USER_ROLES, ATTEMPT_STATUS } = require('../config/constants');

/**
 * @desc    Get Student Dashboard Aggregated Metrics
 * @route   GET /api/dashboard/student
 * @access  Private (Student & All Authenticated Users)
 */
const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. User Study Streak & Profile Info
    const user = await User.findById(userId).select('name email avatar studyStreak badges');

    // 2. Enrolled Courses with Progress
    const enrollments = await Enrollment.find({ user: userId, status: 'active' })
      .populate({
        path: 'course',
        select: 'title slug thumbnail category difficulty duration instructor',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort({ lastAccessedAt: -1 })
      .limit(10);

    // 3. Recent Student Activity (Last 5)
    const recentActivities = await StudentActivity.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(5);

    // 4. Recent Quiz Scores (Last 5)
    const recentQuizAttempts = await QuizAttempt.find({
      user: userId,
      status: 'completed'
    })
      .populate('quiz', 'title duration passingMarks totalMarks')
      .sort({ completedAt: -1 })
      .limit(5);

    // 5. Recent Test Scores (Last 5)
    const recentTestAttempts = await TestAttempt.find({
      user: userId,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    })
      .populate('test', 'title type duration totalMarks')
      .sort({ completedAt: -1 })
      .limit(5);

    // 6. Aggregate Total Questions Attempted & Accuracy
    const allQuizAttempts = await QuizAttempt.find({ user: userId, status: 'completed' }).select(
      'answers score totalMarks accuracy'
    );
    const allTestAttempts = await TestAttempt.find({
      user: userId,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    }).select('answers score totalMarks accuracy');

    let totalQuizQuestionsAttempted = 0;
    let quizAccuracySum = 0;
    allQuizAttempts.forEach((a) => {
      totalQuizQuestionsAttempted += (a.answers || []).filter(
        (ans) => (ans.selectedOption && ans.selectedOption.length > 0) || ans.textAnswer
      ).length;
      quizAccuracySum += a.accuracy || 0;
    });

    let totalTestQuestionsAttempted = 0;
    let testAccuracySum = 0;
    allTestAttempts.forEach((a) => {
      totalTestQuestionsAttempted += (a.answers || []).filter(
        (ans) => (ans.selectedOption && ans.selectedOption.length > 0) || ans.textAnswer
      ).length;
      testAccuracySum += a.accuracy || 0;
    });

    const totalQuestionsAttempted = totalQuizQuestionsAttempted + totalTestQuestionsAttempted;
    const totalAttemptRecords = allQuizAttempts.length + allTestAttempts.length;
    const overallAccuracy =
      totalAttemptRecords > 0
        ? Math.round((quizAccuracySum + testAccuracySum) / totalAttemptRecords)
        : 0;

    // 7. Continue Learning Card (Last accessed course/lecture)
    let continueLearning = null;
    if (enrollments.length > 0 && enrollments[0].course) {
      continueLearning = {
        course: enrollments[0].course,
        progress: enrollments[0].overallProgress || 0,
        lastAccessedAt: enrollments[0].lastAccessedAt
      };
    }

    // 8. Upcoming Scheduled Quizzes & Tests
    const now = new Date();
    const upcomingTests = await Test.find({
      status: CONTENT_STATUS.PUBLISHED,
      scheduledAt: { $gte: now }
    })
      .select('title type scheduledAt duration totalMarks course')
      .populate('course', 'title')
      .sort({ scheduledAt: 1 })
      .limit(5);

    // 9. Subject-wise Strong & Weak Analysis
    const subjectStats = {};
    const testAttemptIds = allTestAttempts.map((t) => t._id);

    if (testAttemptIds.length > 0) {
      const detailedAttempts = await TestAttempt.find({ _id: { $in: testAttemptIds } })
        .populate({
          path: 'answers.question',
          select: 'subject',
          populate: { path: 'subject', select: 'name' }
        })
        .limit(20);

      detailedAttempts.forEach((att) => {
        att.answers.forEach((ans) => {
          if (ans.question && ans.question.subject) {
            const sName = ans.question.subject.name;
            if (!subjectStats[sName]) {
              subjectStats[sName] = { name: sName, correct: 0, total: 0, accuracy: 0 };
            }
            if ((ans.selectedOption && ans.selectedOption.length > 0) || ans.textAnswer) {
              subjectStats[sName].total++;
              if (ans.isCorrect) subjectStats[sName].correct++;
            }
          }
        });
      });
    }

    const calculatedSubjects = Object.values(subjectStats)
      .map((s) => {
        s.accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        return s;
      })
      .sort((a, b) => b.accuracy - a.accuracy);

    const strongSubjects = calculatedSubjects.slice(0, 3);
    const weakSubjects = calculatedSubjects.slice(-3).reverse();

    // 10. Announcements
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ],
      targetAudience: { $in: ['all', 'role'] }
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          streak: user.studyStreak || { current: 0, longest: 0 },
          badges: user.badges || []
        },
        metrics: {
          enrolledCoursesCount: enrollments.length,
          totalQuestionsAttempted,
          overallAccuracy,
          totalQuizzesTaken: allQuizAttempts.length,
          totalTestsTaken: allTestAttempts.length
        },
        continueLearning,
        enrolledCourses: enrollments,
        recentActivities,
        recentQuizAttempts,
        recentTestAttempts,
        upcomingEvents: upcomingTests,
        strongSubjects,
        weakSubjects,
        announcements
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Admin Dashboard Aggregated System Metrics
 * @route   GET /api/dashboard/admin
 * @access  Private (Superadmin, Admin)
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Total Users by Role
    const usersByRoleAgg = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const usersByRole = {};
    usersByRoleAgg.forEach((item) => {
      usersByRole[item._id] = item.count;
    });

    const totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);

    // 2. Courses Stats
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: CONTENT_STATUS.PUBLISHED });

    // 3. Questions, Materials, Lectures Stats
    const totalQuestions = await Question.countDocuments();
    const totalStudyMaterials = await StudyMaterial.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalTests = await Test.countDocuments();

    // 4. Recent Enrollments (Last 10)
    const recentEnrollments = await Enrollment.find()
      .populate('user', 'name email avatar')
      .populate('course', 'title category')
      .sort({ createdAt: -1 })
      .limit(10);

    // 5. User Registrations Trend (Last 30 days)
    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 6. Popular Courses by Enrollment
    const popularCourses = await Course.find({ status: CONTENT_STATUS.PUBLISHED })
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .select('title slug category enrollmentCount ratings thumbnail');

    // 7. Quiz & Test Activity in Last 7 Days
    const quizAttemptsLast7Days = await QuizAttempt.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    const testAttemptsLast7Days = await TestAttempt.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // 8. Discussion Posts Activity in Last 7 Days
    const discussionsLast7Days = await Discussion.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: usersByRole
        },
        content: {
          totalCourses,
          publishedCourses,
          totalQuestions,
          totalStudyMaterials,
          totalLectures,
          totalQuizzes,
          totalTests
        },
        activity7Days: {
          quizAttempts: quizAttemptsLast7Days,
          testAttempts: testAttemptsLast7Days,
          discussionPosts: discussionsLast7Days
        },
        popularCourses,
        recentEnrollments,
        registrationTrend
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Instructor Dashboard Specific to Instructor's Courses
 * @route   GET /api/dashboard/instructor
 * @access  Private (Superadmin, Admin, Instructor)
 */
const getInstructorDashboard = async (req, res, next) => {
  try {
    const instructorId = req.user._id;

    // 1. Courses taught by this instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === CONTENT_STATUS.PUBLISHED).length;

    // 2. Total Students Enrolled
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('user', 'name email avatar')
      .populate('course', 'title');

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
    const completionRate =
      totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // 3. Quizzes & Tests under instructor's courses
    const quizzes = await Quiz.find({ course: { $in: courseIds } }).select('_id');
    const quizIds = quizzes.map((q) => q._id);

    const tests = await Test.find({ course: { $in: courseIds } }).select('_id');
    const testIds = tests.map((t) => t._id);

    // 4. Recent Quiz Attempts for instructor's quizzes
    const recentQuizAttempts = await QuizAttempt.find({ quiz: { $in: quizIds } })
      .populate('user', 'name avatar')
      .populate('quiz', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Recent Test Attempts for instructor's tests
    const recentTestAttempts = await TestAttempt.find({ test: { $in: testIds } })
      .populate('user', 'name avatar')
      .populate('test', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Unanswered Discussions in instructor's courses
    const unansweredDiscussions = await Discussion.find({
      course: { $in: courseIds },
      isAnswered: false
    })
      .populate('author', 'name avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        courses: {
          total: totalCourses,
          published: publishedCourses,
          list: courses
        },
        students: {
          totalEnrollments,
          completionRate,
          recentEnrollments: enrollments.slice(0, 5)
        },
        recentQuizAttempts,
        recentTestAttempts,
        unansweredDiscussions
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStudentDashboard,
  getAdminDashboard,
  getInstructorDashboard
};
